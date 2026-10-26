const express = require("express");
const router = express.Router();
const { getPlaceById } = require("../controllers/placeController");
const multer = require("multer");
const Place = require("../models/Place");
const Review = require("../models/Review");
const sharp = require("sharp");
const mongoose = require("mongoose");

const { uploadImage, deleteImageByUrl } = require("../services/imageStorage");

const {
  verifyToken,
  requireNotBlocked,
  requireAdmin,
} = require("../middleware/auth.js");

// Налаштування завантаження фото
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

router.post(
  "/",
  verifyToken,
  requireNotBlocked,
  upload.array("images", 10),
  async (req, res) => {
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

      await Promise.allSettled(
        uploadedUrls.map((url) => deleteImageByUrl(url)),
      );

      return res.status(500).json({
        message: "Не вдалося додати місце",
      });
    }
  },
);

//---------------------------------------------------------------------
// GET /api/places — отримати місця, які очікують підтвердження

router.get("/", async (req, res) => {
  try {
    const places = await Place.find({ isApproved: false }).sort({
      createdAt: -1,
    });

    return res.json(places);
  } catch (err) {
    console.error("❌ Помилка при отриманні місць:", err);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

//---------------------------------------------------------------------
// GET /api/places/approved — отримати підтверджені місця

router.get("/approved", async (req, res) => {
  try {
    const approvedPlaces = await Place.find({
      isApproved: true,
    }).sort({
      createdAt: -1,
    });

    return res.json(approvedPlaces);
  } catch (err) {
    console.error("Помилка при отриманні підтверджених місць:", err);

    return res.status(500).json({
      message: "Помилка при отриманні місць",
    });
  }
});

//---------------------------------------------------------------------
// Створення відгуку

router.post(
  "/:placeId/reviews",
  verifyToken,
  requireNotBlocked,
  async (req, res) => {
    try {
      const { placeId } = req.params;
      const { content, rating } = req.body;

      if (!mongoose.isValidObjectId(placeId)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      if (
        typeof content !== "string" ||
        !content.trim() ||
        content.trim().length > 1000
      ) {
        return res.status(400).json({
          message: "Відгук має містити від 1 до 1000 символів",
        });
      }

      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          message: "Оцінка має бути цілим числом від 1 до 5",
        });
      }

      const place = await Place.findById(placeId);

      if (!place) {
        return res.status(404).json({
          message: "Місце не знайдено",
        });
      }

      const review = await Review.create({
        placeId,
        userId: req.user.id,
        author: req.user.name,
        content: content.trim(),
        rating: numericRating,
      });

      const allReviews = await Review.find({ placeId });

      place.rating = allReviews.length
        ? allReviews.reduce((sum, item) => sum + item.rating, 0) /
          allReviews.length
        : 0;

      await place.save();

      return res.status(201).json(review);
    } catch (err) {
      console.error("Помилка створення відгуку:", err);

      return res.status(500).json({
        message: "Помилка при створенні відгуку",
      });
    }
  },
);

//---------------------------------------------------------------------
// Отримання відгуків за ID місця

router.get("/:placeId/reviews", async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).json({
        message: "Некоректний ID місця",
      });
    }

    const reviews = await Review.find({ placeId })
      .populate("userId", "name")
      .sort({ _id: -1 });

    return res.json(reviews);
  } catch (err) {
    console.error("Помилка отримання відгуків:", err);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

//---------------------------------------------------------------------
// Видалення відгуку адміністратором

router.delete(
  "/:placeId/reviews/:reviewId",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { placeId, reviewId } = req.params;

      if (!mongoose.isValidObjectId(placeId)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      if (!mongoose.isValidObjectId(reviewId)) {
        return res.status(400).json({
          message: "Некоректний ID відгуку",
        });
      }

      const review = await Review.findOneAndDelete({
        _id: reviewId,
        placeId,
      });

      if (!review) {
        return res.status(404).json({
          message: "Відгук не знайдено",
        });
      }

      const remainingReviews = await Review.find({ placeId });
      const place = await Place.findById(placeId);

      if (place) {
        place.rating = remainingReviews.length
          ? remainingReviews.reduce((sum, item) => sum + item.rating, 0) /
            remainingReviews.length
          : 0;

        await place.save();
      }

      return res.json({
        message: "Відгук видалено",
        rating: place ? place.rating : 0,
      });
    } catch (err) {
      console.error("Помилка видалення відгуку:", err);

      return res.status(500).json({
        message: "Помилка видалення відгуку",
      });
    }
  },
);

//---------------------------------------------------------------------
// Отримання місця за ID

router.get("/:_id", getPlaceById);

//---------------------------------------------------------------------
// Оновлення місця — тільки адміністратор

router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const placeId = req.params.id;

    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).json({
        message: "Некоректний ID місця",
      });
    }

    const updated = await Place.findByIdAndUpdate(placeId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Місце не знайдено",
      });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Помилка при оновленні місця:", err);

    return res.status(500).json({
      message: "Помилка при оновленні місця",
    });
  }
});

//---------------------------------------------------------------------
// Видалення місця — тільки адміністратор

router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const placeId = req.params.id;

    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).json({
        message: "Некоректний ID місця",
      });
    }

    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({
        message: "Місце не знайдено",
      });
    }

    return res.json({
      message: "Місце успішно видалено",
    });
  } catch (err) {
    console.error("❌ Помилка при видаленні місця:", err);

    return res.status(500).json({
      message: "Помилка при видаленні місця",
    });
  }
});

//---------------------------------------------------------------------

module.exports = router;
