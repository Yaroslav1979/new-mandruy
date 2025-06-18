const express = require("express");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const router = express.Router();

const nodemailer = require('nodemailer'); 

// Встановіть конфігурацію для nodemailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth.js');
// const path = require("path");

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Доступ заборонено' });
  }
}

//-----------------------------------------------------------------

router.get('/admin', verifyToken, requireAdmin, (req, res) => {
  res.json({ message: 'Це адмінська зона' });
});
//------------------------------------------------------------------

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Валідація
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Усі поля обовʼязкові' });

    const duplicate = await User.findOne({ email });
    if (duplicate)
      return res.status(409).json({ message: 'Користувач уже існує' });

    // 2. Створення користувача
    const user = await User.create({ name, email, password });

    // 3. Генерація коду підтвердження
    const rawCode = crypto.randomBytes(3).toString('base64')
      .replace(/[^A-Za-z0-9]/g, '')
      .substring(0, 3);

    user.emailConfirmToken = crypto.createHash('sha256').update(rawCode).digest('hex');
    user.emailConfirmExpires = Date.now() + 15 * 60 * 1000; // 15 хвилин
    await user.save();

    // 4. Параметри листа
    const mailOptions = {
      from: `"Мандруй" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Код підтвердження e‑mail',
      html: `
        <p>Ваш код підтвердження: <b style="font-size:20px">${rawCode}</b></p>
        <p>Діє 15 хвилин.</p>
      `,
    };

    // 5. Надсилання листа
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Помилка при відправці коду:', error);
        return res.status(500).json({ message: 'Не вдалося надіслати код підтвердження' });
      } else {
        console.log('✅ Код підтвердження відправлено: ' + info.response);
        return res.status(201).json({
          message: 'Код підтвердження надіслано на email',
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      }
    });
  } catch (err) {
    console.error('❌ Помилка реєстрації:', err);
    res.status(500).json({ message: 'Помилка під час реєстрації' });
  }
});

//------------------------------------------------

router.post('/confirm-email', async (req, res) => {
  const { email, code } = req.body;              // code = 3 символи

  const tokenHash = crypto.createHash('sha256').update(code).digest('hex');

  const user = await User.findOne({
    email,
    emailConfirmToken: tokenHash,
    emailConfirmExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: 'Невірний або прострочений код' });

  user.isEmailConfirmed   = true;
  user.emailConfirmToken  = undefined;
  user.emailConfirmExpires = undefined;
  await user.save();

  const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.json({
    message: 'Email підтверджено',
    token:   jwtToken,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
    }
  });
});


//----------------------------------------------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Невірний email або пароль" });
    }

    // Перевірка підтвердження email
    if (!user.isEmailConfirmed) {
      return res.status(401).json({ message: "Підтвердіть e‑mail, перш ніж увійти" });
    }

    // const bcrypt = require("bcrypt");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Невірний email або пароль" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
//-------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Завжди відповідаємо однаково
    if (!user) {
      return res.status(200).json({ message: 'Якщо email існує, лист надіслано' });
    }

    // Генеруємо код (rawToken)
    const rawToken = Math.floor(1000 + Math.random() * 9000).toString();
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 година
    await user.save();

    // Формуємо лист
    const mailOptions = {
      from: `"Мандруй" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Код для відновлення пароля',
      html: `
        <p>Ваш код для відновлення пароля: <b>${rawToken}</b></p>
        <p>Цей код дійсний протягом 1 години.</p>
      `,
    };

    // Надсилаємо лист
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Перевірте пошту — код надіслано' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера при відновленні пароля' });
  }
});

//-------------------------------------------------------
router.post('/reset-password/:token', async (req, res) => {
  try {
    const rawToken = req.params.token.trim();
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Код недійсний або протермінований' });
    }

    // Зберігаємо новий пароль
    user.password = req.body.password; // bcrypt hash через pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Пароль успішно змінено' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера при зміні пароля' });
  }
});
//-------------------------------------------------------------


router.patch('/change-name', verifyToken, async (req, res) => {
  const { name: newName } = req.body;

  try {
    const user = await User.findById(req.user.id); // req.user.id з middleware
    if (!user)
      return res.status(404).json({ message: 'Користувача не знайдено' });

     const existingName = await User.findOne({ name: newName });
    if (existingName)
      return res.status(409).json({ message: 'Такe ім`я вже використовується' });

    user.name = newName;
    user.isNameConfirmed = false;
    await user.save();

    res.json({
      message: 'Ім`я змінено',
      user: {
        id: user._id,        
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Щось пішло не так' });
  }
});
//---------------------------------------------------------------------

router.patch('/change-password', verifyToken, async (req, res) => {
  const { password, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'Користувача не знайдено' });

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res.status(400).json({ message: 'Неправильний поточний пароль' });

    user.password = newPassword; // bcrypt автоматично захешує через pre-save hook
    await user.save();

    res.json({ message: 'Пароль успішно змінено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Отримати поточного користувача
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'Користувача не знайдено' });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


module.exports = router;
