// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//     placeId: { type: String, required: true },
//     author: { type: String, required: true},
//     content: { type: String, required: true},
//     rating: { type: Number, default: 0},
//   });

// module.exports = mongoose.model('Review', reviewSchema);

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  rating: {
    type: Number,
    default: 0,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
