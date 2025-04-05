const express = require('express');
const multer = require('multer');
const Place = require('../models/Place');
const router = express.Router();
const path = require('path');

// Налаштування multer для завантаження фото
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /places
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { title, coordinate, descr, categories } = req.body;
    const newPlace = new Place({
      title,
      coordinate,
      descr,
      categories: JSON.parse(categories), // фронт надсилає як JSON-строку
      photo: req.file ? req.file.filename : null,
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при збереженні місця' });
  }
});

module.exports = router;