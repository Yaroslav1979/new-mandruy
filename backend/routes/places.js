const express = require('express');
const router = express.Router();
const { getPlaceById } = require('../controllers/placeController'); 
const multer = require('multer');
const Place = require('../models/Place');
const Review = require('../models/Review');
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
//---------------------------------------------------------------
//для обрізування фото: 
const sharp = require('sharp');
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

    // const imgUrls = req.files.map(file => '/uploads/' + file.filename);
    const imgUrls = [];

    for (const file of req.files) {
      const inputPath = file.path; // абсолютний шлях
      const outputFilename = 'resized-' + file.filename;
      const outputPath = path.join(uploadsDir, outputFilename);

      // Масштабуємо фото
      await sharp(inputPath)
        .resize(650, 400, {
          fit: sharp.fit.cover, // заповнити розмір, обрізаючи зайве
          position: sharp.strategy.entropy}) // обрізати з неінформативної частини
        .jpeg({ quality: 60 }) // новий розмір фото - 60% МB від оригіналу
        .toFile(outputPath);

      // Додаємо до масиву відносний шлях (для клієнта)
      imgUrls.push('/uploads/' + outputFilename);

      // За бажанням — можеш видалити оригінальний файл:
      fs.unlinkSync(inputPath);
    }

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

// створення відгуку по id:
router.post('/:placeId/reviews', async (req, res) => {
  try {
    const { author, content, rating } = req.body;
    const { placeId } = req.params;
    console.log(req.params.placeId);  // Перевірка, чи правильно передається placeId
    console.log(req.body);
    console.log('Place ID:', placeId); // Лог для перевірки перед додаванням відгуку

    // Перевіряємо чи місце існує
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Місце не знайдено' });
    }

    const review = new Review({ author, content, rating, placeId });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Error while saving review:', err); // Лог для детальної помилки
    res.status(400).json({ message: 'Помилка при створенні відгуку' });
  }
});
//-----------------------------------------------------------

// отримання відгуку по id:

router.get('/:placeId/reviews', async (req, res) => {
  try {
    const { placeId } = req.params;
    const reviews = await Review.find({ placeId }).sort({ _id: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});
//------------------------------------------------------
// Отримання місця за id
router.get('/:_id', getPlaceById);
module.exports = router;