const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { getPlaceById } = require("../controllers/placeController");

const multer = require("multer");
const Place = require("../models/Place");
const Review = require("../models/Review");
const Favorite = require("../models/Favorite");

const sharp = require("sharp");

const { uploadImage, deleteImageByUrl } = require("../services/imageStorage");

const {
  verifyToken,
  requireNotBlocked,
  requireAdmin,
} = require("../middleware/auth.js");

// =====================================================
// НАЛАШТУВАННЯ MULTER
// =====================================================

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

// =====================================================
// ДОПОМІЖНІ ФУНКЦІЇ
// =====================================================

// Перетворення значення з FormData на масив
const parseArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

// Перевірка та формування даних місця
const getPlaceDataFromRequest = (body) => {
  const categoryIds = parseArray(body.categoryIds);

  const title = body.title?.trim();
  const descr = body.descr?.trim();
  const region = body.region?.trim();
  const city = body.city?.trim();
  const coordinate = body.coordinate?.trim();

  if (!title || !descr || !region || !city || !coordinate) {
    const error = new Error("Заповніть усі обов'язкові поля");
    error.status = 400;
    throw error;
  }

  if (categoryIds.length === 0) {
    const error = new Error("Оберіть хоча б одну категорію");
    error.status = 400;
    throw error;
  }

  if (
    !categoryIds.every((id) => typeof id === "string" && id.trim().length > 0)
  ) {
    const error = new Error("Некоректні категорії");
    error.status = 400;
    throw error;
  }

  return {
    title,
    descr,
    categoryIds,
    location: {
      region,
      city,
      coordinate,
    },
  };
};

// Перевірка кількості фотографій
const validateImageCount = (existingUrls, newFiles) => {
  const total = existingUrls.length + (newFiles?.length || 0);

  if (total === 0) {
    const error = new Error("Додайте хоча б одну фотографію");
    error.status = 400;
    throw error;
  }

  if (total > 10) {
    const error = new Error("Максимальна кількість фотографій — 10");
    error.status = 400;
    throw error;
  }
};

// Завантаження нових фотографій у R2
const uploadNewImages = async (files) => {
  const uploadedUrls = [];

  try {
    for (const file of files || []) {
      const processedImage = await sharp(file.buffer)
        .rotate()
        .resize(650, 400, {
          fit: "cover",
          position: sharp.strategy.entropy,
        })
        .jpeg({ quality: 60 })
        .toBuffer();

      const result = await uploadImage(processedImage);

      uploadedUrls.push(result.url);
    }

    return uploadedUrls;
  } catch (error) {
    await Promise.allSettled(uploadedUrls.map((url) => deleteImageByUrl(url)));

    throw error;
  }
};

// Видалення фотографій, які більше ніде не використовуються
const deleteUnusedImages = async (urls, placeId) => {
  const uniqueUrls = [...new Set(urls)].filter(Boolean);

  for (const url of uniqueUrls) {
    try {
      const usedByAnotherPlace = await Place.exists({
        _id: { $ne: placeId },
        $or: [{ imgUrls: url }, { "pendingChanges.imgUrls": url }],
      });

      if (!usedByAnotherPlace) {
        await deleteImageByUrl(url);
      }
    } catch (error) {
      console.error(`Не вдалося видалити зображення ${url}:`, error);
    }
  }
};

// Перевірка ObjectId
const isValidId = (id) => mongoose.isValidObjectId(id);

// =====================================================
// 1. СТВОРЕННЯ МІСЦЯ

router.post(
  "/",
  verifyToken,
  requireNotBlocked,
  upload.array("images", 10),
  async (req, res) => {
    let uploadedUrls = [];

    try {
      const data = getPlaceDataFromRequest(req.body);

      validateImageCount([], req.files);

      uploadedUrls = await uploadNewImages(req.files);

      const place = new Place({
        ...data,
        imgUrls: uploadedUrls,
        isApproved: false,
        createdBy: req.user.id,
      });

      await place.save();

      return res.status(201).json({
        message:
          "Успішно! Очікуйте на публікацію місця після підтверджененя адміністратором",
        place,
      });
    } catch (error) {
      await Promise.allSettled(
        uploadedUrls.map((url) => deleteImageByUrl(url)),
      );

      console.error("Помилка додавання місця:", error);

      return res.status(error.status || 500).json({
        message: error.message || "Не вдалося додати місце",
      });
    }
  },
);

// =====================================================
// 2. ОТРИМАННЯ НЕОПУБЛІКОВАНИХ МІСЦЬ

router.get("/", async (req, res) => {
  try {
    const places = await Place.find({
      isApproved: false,
    }).sort({
      createdAt: -1,
    });

    return res.json(places);
  } catch (error) {
    console.error("Помилка отримання неопублікованих місць:", error);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

// =====================================================
// 3. ОТРИМАННЯ ОПУБЛІКОВАНИХ МІСЦЬ

router.get("/approved", async (req, res) => {
  try {
    const places = await Place.find({
      isApproved: true,
    }).sort({
      createdAt: -1,
    });

    return res.json(places);
  } catch (error) {
    console.error("Помилка отримання опублікованих місць:", error);

    return res.status(500).json({
      message: "Помилка при отриманні місць",
    });
  }
});

// =====================================================
// 4. СТВОРЕННЯ ВІДГУКУ

router.post(
  "/:placeId/reviews",
  verifyToken,
  requireNotBlocked,
  async (req, res) => {
    try {
      const { placeId } = req.params;
      const { content, rating } = req.body;

      if (!isValidId(placeId)) {
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

      const place = await Place.findOne({
        _id: placeId,
        isApproved: true,
      });

      if (!place) {
        return res.status(404).json({
          message: "Опубліковане місце не знайдено",
        });
      }

      const review = await Review.create({
        placeId,
        userId: req.user.id,
        author: req.user.name,
        content: content.trim(),
        rating: numericRating,
      });

      const reviews = await Review.find({ placeId });

      place.rating =
        reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

      await place.save();

      return res.status(201).json(review);
    } catch (error) {
      console.error("Помилка створення відгуку:", error);

      return res.status(500).json({
        message: "Помилка при створенні відгуку",
      });
    }
  },
);

// =====================================================
// 5. ОТРИМАННЯ ВІДГУКІВ

router.get("/:placeId/reviews", async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!isValidId(placeId)) {
      return res.status(400).json({
        message: "Некоректний ID місця",
      });
    }

    const reviews = await Review.find({ placeId })
      .populate("userId", "name")
      .sort({ _id: -1 });

    return res.json(reviews);
  } catch (error) {
    console.error("Помилка отримання відгуків:", error);

    return res.status(500).json({
      message: "Помилка сервера",
    });
  }
});

// =====================================================
// 6. ВИДАЛЕННЯ ВІДГУКУ АДМІНІСТРАТОРОМ

router.delete(
  "/:placeId/reviews/:reviewId",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { placeId, reviewId } = req.params;

      if (!isValidId(placeId) || !isValidId(reviewId)) {
        return res.status(400).json({
          message: "Некоректний ID місця або відгуку",
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

      const [remainingReviews, place] = await Promise.all([
        Review.find({ placeId }),
        Place.findById(placeId),
      ]);

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
    } catch (error) {
      console.error("Помилка видалення відгуку:", error);

      return res.status(500).json({
        message: "Помилка видалення відгуку",
      });
    }
  },
);

// =====================================================
// 7. МОЇ МІСЦЯ

router.get("/my", verifyToken, async (req, res) => {
  try {
    const places = await Place.find({
      createdBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.json(places);
  } catch (error) {
    console.error("Помилка отримання моїх місць:", error);

    return res.status(500).json({
      message: "Помилка при отриманні моїх місць",
    });
  }
});

// =====================================================
// 8. ОБРАНІ МІСЦЯ

router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: req.user.id,
    })
      .populate({
        path: "placeId",
        match: { isApproved: true },
      })
      .sort({
        createdAt: -1,
      });

    const places = favorites
      .map((favorite) => favorite.placeId)
      .filter(Boolean);

    return res.json(places);
  } catch (error) {
    console.error("Помилка отримання обраних місць:", error);

    return res.status(500).json({
      message: "Помилка при отриманні обраних місць",
    });
  }
});

// =====================================================
// 9. ДОДАВАННЯ В ОБРАНЕ

router.post(
  "/:placeId/favorite",
  verifyToken,
  requireNotBlocked,
  async (req, res) => {
    try {
      const { placeId } = req.params;

      if (!isValidId(placeId)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      const place = await Place.findOne({
        _id: placeId,
        isApproved: true,
      });

      if (!place) {
        return res.status(404).json({
          message: "Місце не знайдено або воно не опубліковане",
        });
      }

      await Favorite.findOneAndUpdate(
        {
          userId: req.user.id,
          placeId,
        },
        {
          $setOnInsert: {
            userId: req.user.id,
            placeId,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      return res.json({
        message: "Місце додано в обране",
        isFavorite: true,
      });
    } catch (error) {
      console.error("Помилка додавання в обране:", error);

      return res.status(500).json({
        message: "Не вдалося додати місце в обране",
      });
    }
  },
);

// =====================================================
// 10. ВИДАЛЕННЯ З ОБРАНОГО

router.delete(
  "/:placeId/favorite",
  verifyToken,
  requireNotBlocked,
  async (req, res) => {
    try {
      const { placeId } = req.params;

      if (!isValidId(placeId)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      await Favorite.findOneAndDelete({
        userId: req.user.id,
        placeId,
      });

      return res.json({
        message: "Місце видалено з обраного",
        isFavorite: false,
      });
    } catch (error) {
      console.error("Помилка видалення з обраного:", error);

      return res.status(500).json({
        message: "Не вдалося видалити місце з обраного",
      });
    }
  },
);

// =====================================================
// 11. РЕДАГУВАННЯ ВЛАСНОГО НЕОПУБЛІКОВАНОГО МІСЦЯ

router.patch(
  "/:id/edit",
  verifyToken,
  requireNotBlocked,
  upload.array("images", 10),
  async (req, res) => {
    let uploadedUrls = [];

    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      const place = await Place.findById(id);

      if (!place) {
        return res.status(404).json({
          message: "Місце не знайдено",
        });
      }

      if (place.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Немає прав на редагування цього місця",
        });
      }

      if (place.isApproved) {
        return res.status(400).json({
          message:
            "Опубліковане місце потрібно редагувати через повторну модерацію",
        });
      }

      const data = getPlaceDataFromRequest(req.body);

      const existingImgUrls = [
        ...new Set(parseArray(req.body.existingImgUrls)),
      ];

      const allowedUrls = place.imgUrls || [];

      const invalidUrls = existingImgUrls.some(
        (url) => !allowedUrls.includes(url),
      );

      if (invalidUrls) {
        return res.status(400).json({
          message: "Передано некоректні фотографії",
        });
      }

      validateImageCount(existingImgUrls, req.files);

      uploadedUrls = await uploadNewImages(req.files);

      const newImgUrls = [...existingImgUrls, ...uploadedUrls];

      const oldImgUrls = [...place.imgUrls];

      place.title = data.title;
      place.descr = data.descr;
      place.categoryIds = data.categoryIds;
      place.location = data.location;
      place.imgUrls = newImgUrls;

      await place.save();

      const removedUrls = oldImgUrls.filter((url) => !newImgUrls.includes(url));

      await deleteUnusedImages(removedUrls, place._id);

      return res.json({
        message: "Місце успішно оновлено",
        place,
      });
    } catch (error) {
      await Promise.allSettled(
        uploadedUrls.map((url) => deleteImageByUrl(url)),
      );

      console.error("Помилка редагування місця:", error);

      return res.status(error.status || 500).json({
        message: error.message || "Помилка редагування місця",
      });
    }
  },
);

// =====================================================
// 12. ПОДАННЯ АБО ПОВТОРНЕ ПОДАННЯ ЗМІН

router.post(
  "/:id/submit-changes",
  verifyToken,
  requireNotBlocked,
  upload.array("images", 10),
  async (req, res) => {
    let uploadedUrls = [];

    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      const place = await Place.findById(id);

      if (!place) {
        return res.status(404).json({
          message: "Місце не знайдено",
        });
      }

      if (place.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Немає прав на редагування цього місця",
        });
      }

      if (!place.isApproved) {
        return res.status(400).json({
          message:
            "Це місце ще не опубліковане. Використайте звичайне редагування",
        });
      }

      const data = getPlaceDataFromRequest(req.body);

      const existingImgUrls = [
        ...new Set(parseArray(req.body.existingImgUrls)),
      ];

      const currentProposalImages =
        place.pendingChanges?.imgUrls || place.imgUrls;

      const allowedUrls = [
        ...new Set([...(place.imgUrls || []), ...currentProposalImages]),
      ];

      const invalidUrls = existingImgUrls.some(
        (url) => !allowedUrls.includes(url),
      );

      if (invalidUrls) {
        return res.status(400).json({
          message: "Передано некоректні фотографії",
        });
      }

      validateImageCount(existingImgUrls, req.files);

      uploadedUrls = await uploadNewImages(req.files);

      const newImgUrls = [...existingImgUrls, ...uploadedUrls];

      const previousProposalImages = [...(place.pendingChanges?.imgUrls || [])];

      place.pendingChanges = {
        title: data.title,
        descr: data.descr,
        categoryIds: data.categoryIds,
        location: data.location,
        imgUrls: newImgUrls,
        submittedAt: new Date(),
      };

      await place.save();

      const removedUrls = previousProposalImages.filter(
        (url) => !newImgUrls.includes(url) && !place.imgUrls.includes(url),
      );

      await deleteUnusedImages(removedUrls, place._id);

      return res.json({
        message: "Зміни надіслано на модерацію",
        place,
      });
    } catch (error) {
      await Promise.allSettled(
        uploadedUrls.map((url) => deleteImageByUrl(url)),
      );

      console.error("Помилка подання змін:", error);

      return res.status(error.status || 500).json({
        message: error.message || "Помилка подання змін",
      });
    }
  },
);

// =====================================================
// 13. СПИСОК ЗМІН НА МОДЕРАЦІЇ — АДМІНІСТРАТОР

router.get("/pending-changes", verifyToken, requireAdmin, async (req, res) => {
  try {
    const places = await Place.find({
      "pendingChanges.submittedAt": { $exists: true },
    }).sort({
      "pendingChanges.submittedAt": -1,
    });

    return res.json(places);
  } catch (error) {
    console.error("Помилка отримання змін на модерацію:", error);

    return res.status(500).json({
      message: "Помилка отримання змін на модерацію",
    });
  }
});

// =====================================================
// 14. ЗАТВЕРДЖЕННЯ ЗАПРОПОНОВАНИХ ЗМІН

router.patch(
  "/:id/approve-changes",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      const place = await Place.findById(id);

      if (!place) {
        return res.status(404).json({
          message: "Місце не знайдено",
        });
      }

      if (!place.pendingChanges?.submittedAt) {
        return res.status(400).json({
          message: "Для цього місця немає змін на модерації",
        });
      }

      const oldImgUrls = [...place.imgUrls];
      const changes = place.pendingChanges;

      place.title = changes.title;
      place.descr = changes.descr;
      place.categoryIds = changes.categoryIds;
      place.location = changes.location;
      place.imgUrls = changes.imgUrls;

      place.pendingChanges = undefined;

      await place.save();

      const removedUrls = oldImgUrls.filter(
        (url) => !place.imgUrls.includes(url),
      );

      await deleteUnusedImages(removedUrls, place._id);

      return res.json({
        message: "Зміни успішно затверджено",
        place,
      });
    } catch (error) {
      console.error("Помилка затвердження змін:", error);

      return res.status(500).json({
        message: "Помилка затвердження змін",
      });
    }
  },
);

// =====================================================
// 15. ВІДХИЛЕННЯ ЗАПРОПОНОВАНИХ ЗМІН

router.delete(
  "/:id/reject-changes",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({
          message: "Некоректний ID місця",
        });
      }

      const place = await Place.findById(id);

      if (!place) {
        return res.status(404).json({
          message: "Місце не знайдено",
        });
      }

      if (!place.pendingChanges?.submittedAt) {
        return res.status(400).json({
          message: "Для цього місця немає змін на модерації",
        });
      }

      const pendingImgUrls = [...(place.pendingChanges.imgUrls || [])];

      const publishedImgUrls = [...place.imgUrls];

      place.pendingChanges = undefined;

      await place.save();

      const removedUrls = pendingImgUrls.filter(
        (url) => !publishedImgUrls.includes(url),
      );

      await deleteUnusedImages(removedUrls, place._id);

      return res.json({
        message: "Запропоновані зміни відхилено",
      });
    } catch (error) {
      console.error("Помилка відхилення змін:", error);

      return res.status(500).json({
        message: "Помилка відхилення змін",
      });
    }
  },
);

// =====================================================
// 16. ПУБЛІКАЦІЯ НОВОГО МІСЦЯ — АДМІНІСТРАТОР

router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Некоректний ID місця",
      });
    }

    if (typeof req.body.isApproved !== "boolean") {
      return res.status(400).json({
        message: "Некоректне значення статусу публікації",
      });
    }

    const updated = await Place.findByIdAndUpdate(
      id,
      {
        $set: {
          isApproved: req.body.isApproved,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Місце не знайдено",
      });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Помилка при оновленні місця:", error);

    return res.status(500).json({
      message: "Помилка при оновленні місця",
    });
  }
});

// =====================================================
// 17. ВИДАЛЕННЯ МІСЦЯ АВТОРОМ АБО АДМІНІСТРАТОРОМ

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "Некоректний ID місця",
      });
    }

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        message: "Місце не знайдено",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = place.createdBy.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Немає прав на видалення цього місця",
      });
    }

    const imageUrls = [
      ...(place.imgUrls || []),
      ...(place.pendingChanges?.imgUrls || []),
    ];

    // Видаляємо саме місце
    await Place.findByIdAndDelete(id);

    // Видаляємо пов'язані записи
    const cleanupResults = await Promise.allSettled([
      Favorite.deleteMany({ placeId: id }),
      Review.deleteMany({ placeId: id }),
    ]);

    cleanupResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Помилка видалення пов'язаних записів:", result.reason);
      }
    });

    // Очищення фотографій — окрема операція
    try {
      await deleteUnusedImages(imageUrls, id);
    } catch (imageError) {
      console.error(
        "Місце видалено, але виникла помилка очищення фотографій:",
        imageError,
      );
    }

    return res.status(200).json({
      message: "Місце успішно видалено",
    });
  } catch (error) {
    console.error("Помилка видалення місця:", error);

    return res.status(500).json({
      message: "Помилка видалення місця",
    });
  }
});

// =====================================================
// 18. ОТРИМАННЯ МІСЦЯ ЗА ID (останній маршрут, щоб не перекривати інші)

router.get("/:_id", getPlaceById);

// =====================================================

module.exports = router;
