import { loginUser, registerUser } from '../../services/auth.service';
import axios from '../../utils/axios'; // 👈 для запиту до /me

const initialState = {
  user: null,
  token: localStorage.getItem('token') || '',
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters: {
    isLoggedIn(state) {
      return Boolean(state.token);
    },
    user: (state) => state.user,
  },
  mutations: {
    setUserData(state, userData) {
      state.user = userData;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.user = null;
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, payload) {
      const { data } = await loginUser(payload);
      const { user, token } = data;

      commit('setUserData', user);
      commit('setToken', token);
    },

    async registration({ commit }, payload) {
      const { data } = await registerUser(payload);
      const { user, token } = data;

      commit('setUserData', user);
      commit('setToken', token);
    },

    logout({ commit }) {
      commit('logout');
    },

    async fetchUser({ commit, state }) {
      if (!state.token) return;

      try {
        const { data } = await axios.get('/users/me'); // 👈 твій ендпоїнт
        commit('setUserData', data.user);
      } catch (error) {
        console.error('Помилка отримання користувача:', error);
        commit('logout');
      }
    },
  },
};

