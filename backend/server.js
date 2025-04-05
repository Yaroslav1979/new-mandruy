const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const placesRoutes = require('./routes/places');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/places', placesRoutes);

mongoose
  .connect('mongodb://localhost:27017/tourism', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Підключено до MongoDB');
    app.listen(PORT, () => {
      console.log(`Сервер працює на http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));