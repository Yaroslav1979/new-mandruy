const express = require("express");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

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

// const path = require("path");

//-----------------------------------------------------------------

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

//Підтвердження пошти
// router.get('/confirm-email/:token', async (req, res) => {
//   const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

//   const user = await User.findOne({
//     emailConfirmToken: tokenHash,
//     emailConfirmExpires: { $gt: Date.now() },
//   });

//   if (!user) return res.status(400).json({ message: 'Токен недійсний або протермінований' });

//   user.isEmailConfirmed = true;
//   user.emailConfirmToken = undefined;
//   user.emailConfirmExpires = undefined;
//   await user.save();

//   // можна одразу видати JWT
//   const jwtToken = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
//   res.json({ message: 'Email підтверджено', token: jwtToken });
// });

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
    user: { id: user._id, name: user.name, email: user.email }
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

    const bcrypt = require("bcrypt");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Невірний email або пароль" });
    }

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
//-------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(200).json({ message: 'Якщо email існує, лист надіслано' });

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 год
  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Відновлення пароля',
    html: `<p>Натисніть <a href="${resetURL}">посилання</a>, щоб встановити новий пароль.</p>`,
  });

  res.json({ message: 'Перевірте пошту для подальших інструкцій' });
});
//-------------------------------------------------------
router.post('/reset-password/:token', async (req, res) => {
  const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Токен недійсний або протермінований' });

  user.password = req.body.password; // bcrypt pre‑save hook
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Пароль змінено. Увійдіть з новим паролем.' });
});


module.exports = router;
