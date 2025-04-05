import { createApp } from 'vue';
import App from './App.vue';
import './assets/scss/index.scss';
import router from './router';
import Notifications from '@kyvg/vue3-notification';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(Notifications);
app.use(store); // Реєструємо store

app.mount('#app');


