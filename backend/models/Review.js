const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    placeId: { type: String, required: true },
    author: { type: String, required: true},
    content: { type: String, required: true},
    rating: { type: Number, default: 0},
  });

module.exports = mongoose.model('Review', reviewSchema);