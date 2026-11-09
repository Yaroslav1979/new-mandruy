import { createRouter, createWebHistory } from "vue-router";

// Імпортуємо компоненти для маршрутів
import HomePage from "./pages/HomePage.vue";
import PlacePage from "./pages/PlacePage.vue";
import MapPage from "./pages/MapPage.vue";
import SearchPlacePage from "./pages/SearchPlacePage.vue";
import ContactPage from "./pages/ContactPage.vue";
import ErrorPage from "./pages/ErrorPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegistrationPage from "./pages/RegistrationPage.vue";
import RecoveryPasswordPage from "./pages/RecoveryPasswordPage.vue";
import ConfirmEmailPage from "./pages/ConfirmEmailPage.vue";
import AdminPage from "./pages/AdminPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/search",
    name: "SearchPlacePage",
    component: SearchPlacePage,
  },
  {
    path: "/map",
    name: "MapPage",
    component: MapPage,
  },
  {
    path: "/place/:id",
    name: "PlacePage",
    component: PlacePage,
    props: true,
  },
  {
    path: "/contact",
    name: "ContactPage",
    component: ContactPage,
  },
  {
    path: "/registration",
    name: "registration-page",
    component: RegistrationPage,
  },
  {
    path: "/login",
    name: "login-page",
    component: LoginPage,
  },
  {
    path: "/reset-password/:token",
    name: "recovery-password-page",
    component: RecoveryPasswordPage,
    props: true,
  },
  {
    path: "/confirm-email",
    name: "confirm-email-page",
    component: ConfirmEmailPage,
    props: true,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminPage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error-page",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Якщо переходимо на сторінку реєстрації або логіну
  if (["registration-page", "login-page"].includes(to.name)) {
    localStorage.setItem("preRegistrationRoute", from.fullPath);
  }

  next();
});

export default router;
