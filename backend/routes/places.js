const express = require('express');
const router = express.Router();
const multer = require('multer');
const Place = require('../models/Place');
const path = require('path');
const fs = require('fs');

// Створюємо папку uploads, якщо її немає
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Налаштування завантаження фото
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { files: 10 } });
//---------------------------------------------------------------------
// Додавання місця
router.post('/', upload.array('images', 10), async (req, res) => {
  console.log('req.body:', req.body);
console.log('req.files:', req.files);
  try {
    const { title, descr, coordinate, region, city, categoryIds } = req.body;

    // Якщо файли не завантажено
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Не надіслано жодного зображення' });
    }

    const imgUrls = req.files.map(file => '/uploads/' + file.filename);

    const newPlace = new Place({
      title,
      descr,
      location: {
        region,
        city,
        coordinate,
      },
      imgUrls,
      categoryIds: Array.isArray(categoryIds)
        ? categoryIds
        : JSON.parse(categoryIds) // якщо надходить як рядок
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    console.error('❌ Помилка при створенні місця:', err);
    res.status(500).json({ error: 'Помилка при створенні місця' });
  }
});
//--------------------------------------------------------------------
// GET /api/places — отримати всі місця
router.get("/", async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    console.error("❌ Помилка при отриманні місць:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
//---------------------------------------------------------------------

module.exports = router;