const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailConfirmed: { type: Boolean, default: false },
  emailConfirmToken: String, // SHA‑256 хеш
  emailConfirmExpires: Date,
  resetPasswordToken: String,
resetPasswordExpires: Date,
});

// Хешування пароля перед збереженням в базі
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Метод для перевірки пароля
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;