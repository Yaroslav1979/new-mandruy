import {loginUser, registerUser} from  '../../services/auth.service'

const initialState = {
    user: null,
    token: '',
}

export default {
    namespaced: true,
    state: { ...initialState },
    getters: {
        isLoggedIn(state) {
            return Boolean(state.token)
        }
    },
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
    },
}