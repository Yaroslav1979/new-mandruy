import { createStore } from 'vuex';
import authModule from  './modules/auth';
import createPersistedState from 'vuex-persistedstate'

const dataState = createPersistedState( {
    path: ['auth.token']
})

const store = createStore({  // Використовуємо createStore
    modules: {
        auth: authModule,
    },
    plagins: [dataState],
});

export default store