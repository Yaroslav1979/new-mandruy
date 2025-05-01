const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'myPlacesDatabase',
    });
    console.log('✅ Підключено до MongoDB Atlas');
  } catch (err) {
    console.error('❌ Помилка підключення до MongoDB Atlas:', err);
    process.exit(1);
  }
};

module.exports = connectToMongo;