const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

// const path = require("path");

//-----------------------------------------------------------------

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email вже використовується" });
    }

    // Хешування пароля - зроблено в моделі    

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

    res.status(201).json({
      message: "Реєстрація успішна",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Цей email вже зареєстрований" });
    }

    console.error(err);
    res.status(500).json({ message: "Щось пішло не так, спробуйте ще раз" });
  }
});
//----------------------------------------------------------

router.post("/login", async (req, res) => {
 
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Невірний email або пароль" });
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
//--------------------------------------------------------------
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Немає токена" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secretKey");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Недійсний токен" });
  }
});


module.exports = router;
