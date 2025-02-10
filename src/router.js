import { createRouter, createWebHistory } from 'vue-router';

// Імпортуємо компоненти для маршрутів
import HomePage from './pages/HomePage.vue';
import AboutApartment from './pages/AboutApartment.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/apartment',
    name: 'apartment',
    component: AboutApartment,
  },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

export default router;
