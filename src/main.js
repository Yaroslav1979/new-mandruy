import { createApp } from 'vue';
import App from './App.vue';
import './assets/scss/index.scss'
import router from './router';

const app = createApp(App);

// Підключаємо роутер до додатку
app.use(router);

app.mount('#app');

