import { createRouter, createWebHistory } from 'vue-router';

// Імпортуємо компоненти для маршрутів
import HomePage from './pages/HomePage.vue';
import AboutPlace from './pages/AboutPlace.vue';
import ErrorPage from './pages/ErrorPage.vue';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '//:id',
    name: 'place',
    component: AboutPlace,
  },
  {
  path: '/login',
  name: 'login-page',
  component: LoginPage,
},
{
  path: '/registration',
  name: 'registration-page',
  component: RegistrationPage,
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
