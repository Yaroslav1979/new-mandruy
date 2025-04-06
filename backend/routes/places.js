const express = require('express');
const router = express.Router();
const multer = require('multer');
const Place = require('../models/Place');
const path = require('path');

// Налаштування завантаження фото
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage, limits: { files: 10 } });

// Додавання місця
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { title, descr, coordinate, region, city, categoryIds } = req.body;

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
      categoryIds: JSON.parse(categoryIds), // якщо приходить як JSON string
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при створенні місця' });
  }
});

module.exports = router;