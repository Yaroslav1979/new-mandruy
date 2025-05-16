import { createStore } from 'vuex';
import authModule from  './modules/auth';
import createPersistedState from 'vuex-persistedstate'

const dataState = createPersistedState( {
    paths: ['auth.token']
})

const store = createStore({  // Використовуємо createStore
    modules: {
        auth: authModule,
    },
    plugins: [dataState],
});

export default store