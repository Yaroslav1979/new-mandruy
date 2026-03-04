🌍 Travel Places Platform

Full-stack проєкт для пошуку та перегляду туристичних місць в Україні.

Проєкт складається з:

🌐 Web frontend — Vue.js

🔐 Backend API — Node.js + Express + MongoDB Atlas

📱 Mobile app — Expo (React Native)

📁 Структура проєкту
root/
│
├── frontend/ → Vue.js SPA
├── backend/ → Express API + MongoDB
└── mobile/ → Expo React Native app

⚙️ Технології
Frontend

Vue.js

Vue Router

Axios

Backend

Node.js

Express

MongoDB Atlas

Mongoose

CORS

Mobile

Expo

React Native

TypeScript

🔧 Вимоги

Перед запуском переконайтесь, що встановлено:

Node.js >= 18

npm або yarn

MongoDB Atlas (або локальна MongoDB)

Android Studio (для Android емулятора)

Xcode (для iOS, лише macOS)

🚀 Встановлення
1️⃣ Клонування репозиторію
git clone <URL-репозиторію>
cd <назва-папки>

🗄 Backend (API)
Встановлення залежностей
cd backend
npm install

Налаштування .env

Створи файл .env у папці backend:

MONGO_URI=your_mongodb_connection_string
PORT=3000

Запуск сервера
npm run start

Сервер буде доступний:

http://localhost:3000

🌐 Frontend (Vue)
Встановлення
cd frontend
npm install

Запуск
npm run serve

За замовчуванням:

http://localhost:8080

📱 Mobile (Expo)
Встановлення
cd mobile
npm install

Налаштування API_URL

У файлі:

mobile/constants/api.ts

вкажіть IP вашого комп’ютера:

export const API_URL = "http://192.168.x.x:3000";

⚠️ Не використовуйте localhost, якщо запускаєте на фізичному пристрої.

▶️ Запуск
npx expo start

📲 Android Emulator

Встановити Android Studio

Запустити емулятор

У терміналі натиснути:

a

🍎 iOS Simulator (тільки macOS)

Встановити Xcode

У терміналі натиснути:

i

📱 Запуск на фізичному пристрої

Встановити Expo Go

Запустити npx expo start

Відсканувати QR-код

📦 API Ендпоінти (основні)
GET /api/places/approved
POST /api/places
POST /api/auth/login
POST /api/auth/register

🧩 Основний функціонал

Перегляд місць

Фільтрація за категорією

Фільтрація за областю

Сортування

Адаптивний mobile layout (1 / 2 колонки)

Пагінація ("Показати ще")

🛠 Режим розробки

Запускати backend, frontend і mobile окремо.

Рекомендується використовувати три термінали.

🔐 Змінні середовища

Файл .env не додається в репозиторій.

Переконайтесь, що .env доданий у .gitignore.

📌 Production

Для production:

зібрати Vue через npm run build

розгорнути backend на VPS / Render / Railway

для mobile — використовувати eas build

👤 Автор

Ярослав Ковтонюк

📝 License

MIT
