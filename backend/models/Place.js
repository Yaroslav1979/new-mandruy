const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  descr: { type: String, required: true },
  imgUrls: {
    type: [String],
    validate: [val => val.length <= 10, '{PATH} перевищує 10 зображень'],
  },
  categoryIds: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  location: {
    region: { type: String, required: true },
    city: { type: String, required: true },
    coordinate: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Place', placeSchema);