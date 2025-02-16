import { createRouter, createWebHistory } from 'vue-router';

// Імпортуємо компоненти для маршрутів
import HomePage from './pages/HomePage.vue';
import AboutApartment from './pages/AboutApartment.vue';
import ErrorPage from './pages/ErrorPage.vue';
import LoginPage from './pages/LoginPage'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/apartments/:id',
    name: 'apartment',
    component: AboutApartment,
  },
  {
  path: '/login',
  name: 'login-page',
  component: LoginPage,
},
  {
    path: '/:pathMatch(.*)*', // Новий формат для Vue 3
    name: 'error-page',
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
