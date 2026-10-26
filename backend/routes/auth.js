const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const mongoose = require("mongoose");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const {
  verifyToken,
  requireNotBlocked,
  requireAdmin,
} = require("../middleware/auth.js");

//---------------------------------------------------------------------
// Налаштування nodemailer

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//---------------------------------------------------------------------
// Перевірка адміністративного доступу

router.get("/admin", verifyToken, requireAdmin, (req, res) => {
  return res.json({
    message: "Це адмінська зона",
  });
});

//---------------------------------------------------------------------
// Блокування та розблокування користувача

router.patch(
  "/admin/users/:userId/block",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { blocked } = req.body;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
          message: "Некоректний ID користувача",
        });
      }

      if (typeof blocked !== "boolean") {
        return res.status(400).json({
          message: "Потрібно передати blocked: true або false",
        });
      }

      if (req.user.id === userId) {
        return res.status(400).json({
          message:
            "Не можна блокувати або розблоковувати власний обліковий запис",
        });
      }

      const targetUser = await User.findById(userId);

      if (!targetUser) {
        return res.status(404).json({
          message: "Користувача не знайдено",
        });
      }

      if (targetUser.role === "admin") {
        return res.status(403).json({
          message: "Не можна змінювати статус блокування іншого адміністратора",
        });
      }

      targetUser.isBlocked = blocked;
      await targetUser.save();

      return res.json({
        message: blocked
          ? "Користувача заблоковано"
          : "Користувача розблоковано",
        user: {
          id: targetUser._id,
          name: targetUser.name,
          isBlocked: targetUser.isBlocked,
        },
      });
    } catch (err) {
      console.error("Помилка блокування користувача:", err);

      return res.status(500).json({
        message: "Помилка сервера",
      });
    }
  },
);

//---------------------------------------------------------------------
// Реєстрація

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Усі поля обовʼязкові",
      });
    }

    const duplicate = await User.findOne({ email });

    if (duplicate) {
      return res.status(409).json({
        message: "Користувач уже існує",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const rawCode = crypto
      .randomBytes(3)
      .toString("base64")
      .replace(/[^A-Za-z0-9]/g, "")
      .substring(0, 3);

    user.emailConfirmToken = crypto
      .createHash("sha256")
      .update(rawCode)
      .digest("hex");

    user.emailConfirmExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: `"Мандруй" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: "Код підтвердження e‑mail",
      html: `
        <p>Ваш код підтвердження: <b style="font-size:20px">${rawCode}</b></p>
        <p>Діє 15 хвилин.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Помилка при відправці коду:", error);

        return res.status(500).json({
          message: "Не вдалося надіслати код підтвердження",
        });
      }

      console.log("✅ Код підтвердження відправлено: " + info.response);

      return res.status(201).json({
        message: "Код підтвердження надіслано на email",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.error("❌ Помилка реєстрації:", err);

    return res.status(500).json({
      message: "Помилка під час реєстрації",
    });
  }
});

//---------------------------------------------------------------------
// Підтвердження email

router.post("/confirm-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (typeof email !== "string" || typeof code !== "string" || !code) {
      return res.status(400).json({
        message: "Вкажіть email і код підтвердження",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email,
      emailConfirmToken: tokenHash,
      emailConfirmExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Невірний або прострочений код",
      });
    }

    user.isEmailConfirmed = true;
    user.emailConfirmToken = undefined;
    user.emailConfirmExpires = undefined;
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Email підтверджено",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Помилка підтвердження email:", err);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

//---------------------------------------------------------------------
// Вхід

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Невірний email або пароль",
      });
    }

    if (!user.isEmailConfirmed) {
      return res.status(401).json({
        message: "Підтвердіть e‑mail, перш ніж увійти",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Невірний email або пароль",
      });
    }

    // Перевірка блокування після успішної перевірки пароля
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Ваш обліковий запис заблоковано",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.json({
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

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

//---------------------------------------------------------------------
// Запит на відновлення пароля

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(200).json({
        message: "Якщо email існує, лист надіслано",
      });
    }

    const rawToken = Math.floor(1000 + Math.random() * 9000).toString();

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: `"Мандруй" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: "Код для відновлення пароля",
      html: `
        <p>Ваш код для відновлення пароля: <b>${rawToken}</b></p>
        <p>Цей код дійсний протягом 1 години.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "Перевірте пошту — код надіслано",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Помилка сервера при відновленні пароля",
    });
  }
});

//---------------------------------------------------------------------
// Встановлення нового пароля через код відновлення

router.post("/reset-password/:token", async (req, res) => {
  try {
    const rawToken = req.params.token.trim();

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Код недійсний або протермінований",
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      message: "Пароль успішно змінено",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Помилка сервера при зміні пароля",
    });
  }
});

//---------------------------------------------------------------------
// Зміна імені — лише для незаблокованого користувача

router.patch(
  "/change-name",
  verifyToken,
  requireNotBlocked,
  async (req, res) => {
    const { name: newName } = req.body;

    try {
      if (typeof newName !== "string" || !newName.trim()) {
        return res.status(400).json({
          message: "Вкажіть коректне ім'я",
        });
      }

      const normalizedName = newName.trim();

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "Користувача не знайдено",
        });
      }

      // Не вважаємо власне поточне ім'я зайнятим іншим користувачем
      const existingName = await User.findOne({
        name: normalizedName,
        _id: { $ne: user._id },
      });

      if (existingName) {
        return res.status(409).json({
          message: "Таке ім'я вже використовується",
        });
      }

      user.name = normalizedName;
      user.isNameConfirmed = false;
      await user.save();

      return res.json({
        message: "Ім'я змінено",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Щось пішло не так",
      });
    }
  },
);

//---------------------------------------------------------------------
// Зміна пароля — лише для незаблокованого користувача

router.patch(
  "/change-password",
  verifyToken,
  requireNotBlocked,
  async (req, res) => {
    const { password, newPassword } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "Користувача не знайдено",
        });
      }

      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        return res.status(400).json({
          message: "Неправильний поточний пароль",
        });
      }

      if (typeof newPassword !== "string" || !newPassword) {
        return res.status(400).json({
          message: "Вкажіть новий пароль",
        });
      }

      user.password = newPassword;
      await user.save();

      return res.json({
        message: "Пароль успішно змінено",
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: "Помилка сервера",
      });
    }
  },
);

//---------------------------------------------------------------------
// Отримання поточного користувача
// Маршрут доступний і заблокованому користувачу

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

//---------------------------------------------------------------------
// Список заблокованих користувачів — тільки адміністратор

router.get("/admin/users", verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ isBlocked: true })
      .select("_id name email isBlocked")
      .sort({ name: 1 });

    return res.json(users);
  } catch (err) {
    console.error("Помилка отримання заблокованих користувачів:", err);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

//---------------------------------------------------------------------

module.exports = router;
