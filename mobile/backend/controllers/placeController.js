const mongoose = require('mongoose');
const Place = require('../models/Place'); // Переконайся, що шлях до моделі правильний

const getPlaceById = async (req, res) => {
  try {
    const placeId = req.params._id;
    // Перевірка та перетворення ID на ObjectId
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ error: 'Невалідний ID місця' });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ error: 'Місце не знайдено' });
    }

    res.json(place);
  } catch (error) {
    console.error("Помилка запиту місця по id:", error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

module.exports = { getPlaceById };