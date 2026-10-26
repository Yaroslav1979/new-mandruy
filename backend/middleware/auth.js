// const jwt = require('jsonwebtoken');

// module.exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res.status(401).json({ message: 'Немає токена' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.user = decoded; // додаємо id в req.user
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Недійсний токен' });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

module.exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Немає токена" });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select(
      "_id name email role isBlocked",
    );

    if (!user) {
      return res.status(401).json({
        message: "Користувача не знайдено",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    };

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Недійсний або прострочений токен",
      });
    }

    console.error("Помилка перевірки токена:", err);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
};

module.exports.requireNotBlocked = (req, res, next) => {
  if (req.user?.isBlocked && req.user?.role !== "admin") {
    return res.status(403).json({
      message:
        "Ваш обліковий запис заблоковано. Ви не можете додавати нові місця, оцінювати та писати відгуки",
    });
  }

  return next();
};

module.exports.requireAdmin = (req, res, next) => {
  if (req.user?.isBlocked) {
    return res.status(403).json({
      message: "Ваш обліковий запис заблоковано",
    });
  }

  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Доступ заборонено",
    });
  }

  return next();
};
