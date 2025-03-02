import { createStore } from 'vuex';
import {loginUser, registerUser} from  '../services/auth.service'

const initialState = {
     user: null,
        token: '',
}

const store = createStore({  // Використовуємо createStore
    state: { ...initialState }, 
    mutations: {
        setUserDadta(state, userData) {
            state.user = userData;
        },
        setToken(state, token) {
            state.token = token;
        },
    },
    actions: {
        async login({ commit }, payload) {
          const {data} = await loginUser(payload)
          const {user, token} = data

          commit('setUserData', user)
          commit('setToken', token)
        },
         async registration({ commit }, payload) {
          const {data} = await registerUser(payload)
          const {user, token} = data

          commit('setUserData', user)
          commit('setToken', token)
        }
    }
});

export default store