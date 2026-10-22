const express = require("express");
const router = express.Router();
const { getPlaceById } = require("../controllers/placeController");
const multer = require("multer");
const Place = require("../models/Place");
const Review = require("../models/Review");
const path = require("path");
const fs = require("fs");

//для обрізування фото:
const sharp = require("sharp");

const { uploadImage, deleteImageByUrl } = require("../services/imageStorage");

// Створюємо папку uploads, якщо її немає
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Налаштування завантаження фото
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// const upload = multer({ storage, limits: { files: 10 } });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Дозволено завантажувати лише зображення"));
    }

    cb(null, true);
  },
});

//---------------------------------------------------------------------
// Додавання місця

router.post("/", upload.array("images", 10), async (req, res) => {
  const uploadedUrls = [];

  try {
    const { title, descr, region, city, coordinate, categoryIds } = req.body;

    const imgUrls = [];

    for (const file of req.files || []) {
      const resizedBuffer = await sharp(file.buffer)
        .rotate()
        .resize(650, 400, {
          fit: "cover",
          position: sharp.strategy.entropy,
        })
        .jpeg({ quality: 60 })
        .toBuffer();

      const uploaded = await uploadImage(resizedBuffer);

      imgUrls.push(uploaded.url);
      uploadedUrls.push(uploaded.url);
    }

    const parsedCategoryIds = Array.isArray(categoryIds)
      ? categoryIds
      : JSON.parse(categoryIds || "[]");

    const place = new Place({
      title,
      descr,
      location: {
        region,
        city,
        coordinate,
      },
      imgUrls,
      categoryIds: parsedCategoryIds,
      isApproved: false,
    });

    await place.save();

    return res.status(201).json({
      message: "Місце успішно додано",
      place,
    });
  } catch (error) {
    console.error("Помилка додавання місця:", error);

    await Promise.allSettled(uploadedUrls.map((url) => deleteImageByUrl(url)));

    return res.status(500).json({
      message: "Не вдалося додати місце",
    });
  }
});

//--------------------------------------------------------------------
// GET /api/places — отримати всі місця
router.get("/", async (req, res) => {
  try {
    const places = await Place.find({ isApproved: false }).sort({
      createdAt: -1,
    });
    res.json(places);
  } catch (err) {
    console.error("❌ Помилка при отриманні місць:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});
//--------------------------------------------------------------------

router.get("/approved", async (req, res) => {
  try {
    const approvedPlaces = await Place.find({ isApproved: true }).sort({
      createdAt: -1,
    });
    res.json(approvedPlaces);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні місць" });
  }
});

//---------------------------------------------------------------------

// створення відгуку по id:
router.post("/:placeId/reviews", async (req, res) => {
  try {
    const { author, content, rating } = req.body;
    const { placeId } = req.params;
    console.log(req.params.placeId); // Перевірка, чи правильно передається placeId
    console.log(req.body);
    console.log("Place ID:", placeId); // Лог для перевірки перед додаванням відгуку

    // Перевіряємо чи місце існує
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Місце не знайдено" });
    }

    const review = new Review({ author, content, rating, placeId });
    await review.save();
    // підрахунок середнього по відгуках рейтингу
    const allReviews = await Review.find({ placeId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    place.rating = avgRating;
    await place.save();

    res.status(201).json(review);
  } catch (err) {
    console.error("Error while saving review:", err); // Лог для детальної помилки
    res.status(400).json({ message: "Помилка при створенні відгуку" });
  }
});
//-----------------------------------------------------------

// отримання відгуку по id:

router.get("/:placeId/reviews", async (req, res) => {
  try {
    const { placeId } = req.params;
    const reviews = await Review.find({ placeId }).sort({ _id: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});
//------------------------------------------------------

// Отримання місця за id
router.get("/:_id", getPlaceById);

//------------------------------------------------------

router.patch("/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const updated = await Place.findByIdAndUpdate(placeId, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Помилка при оновленні місця" });
  }
});
//----------------------------------------------

router.delete("/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const deletedPlace = await Place.findByIdAndDelete(placeId);
    if (!deletedPlace) {
      return res.status(404).json({ message: "Місце не знайдено" });
    }
    res.json({ message: "Місце успішно видалено" });
  } catch (err) {
    console.error("❌ Помилка при видаленні місця:", err);
    res.status(500).json({ message: "Помилка при видаленні місця" });
  }
});

//---------------------------------------------------------------------

module.exports = router;
