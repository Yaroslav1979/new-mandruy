require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToMongo = require("./db");
const placesRoutes = require("./routes/places"); // імпорт маршрутів
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Використання маршрутів
app.use("/api/places", placesRoutes);
app.use("/api/users", authRoutes);
app.use("/api/auth", authRoutes);

const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Запуск сервера після підключення до MongoDB
connectToMongo()
  .then(() => {
    app.listen(3000, "0.0.0.0", () => {
      console.log("🚀 Сервер запущено на http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ Помилка підключення до MongoDB:", err);
  });
