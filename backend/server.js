const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Для парсингу JSON тіла запитів
app.use(express.json());

// Роут для отримання всіх місць
app.get('/api/places', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'places_data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Не вдалося отримати дані.' });
        }
        res.json(JSON.parse(data));
    });
});

// Роут для додавання нового місця
app.post('/api/places', (req, res) => {
    const newPlace = req.body; // Отримуємо нове місце з тіла запиту
    fs.readFile(path.join(__dirname, 'data', 'places_data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Не вдалося прочитати дані.' });
        }
        const places = JSON.parse(data);
        places.push(newPlace);
        fs.writeFile(path.join(__dirname, 'data', 'places_data.json'), JSON.stringify(places, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Не вдалося зберегти дані.' });
            }
            res.status(201).json(newPlace);
        });
    });
});

// Налаштування сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});