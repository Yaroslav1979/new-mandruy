import {
  loginUser,
  registerUser,
  confirmEmail,
  requestPasswordReset,
  resetPassword,
  changeName,
  changePassword,
} from "../../services/auth.service";
import axios from "../../utils/axios";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || "",
};

export default {
  namespaced: true,
  state: { ...initialState },

  getters: {
    isLoggedIn: (s) => Boolean(s.token),
    user: (s) => s.user,
  },

  mutations: {
    setUserData(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token");
    },
  },

  actions: {
    async login({ commit }, payload) {
      const { data } = await loginUser(payload);
      commit("setUserData", data.user);
      commit("setToken", data.token);
    },

    async registration({ commit }, payload) {
      try {
        const { data } = await registerUser(payload);

        if (data.user) commit("setUserData", data.user);
        if (data.token) commit("setToken", data.token);

        return data; // <-- щоб компонент міг знати, що все добре
      } catch (error) {
        //  Проброс помилки
        console.error("Помилка реєстрації:", error);
        throw error;
      }
    },

    /** 🔹  ПІДТВЕРДЖЕННЯ EMAIL  🔹 */
    async confirmEmail({ commit }, payload) {
      const { data } = await confirmEmail(payload);
      // очікуємо { user, token } від бекенда
      commit("setUserData", data.user);
      commit("setToken", data.token);
    },

    logout({ commit }) {
      commit("logout");
    },

    async fetchUser({ commit, state }) {
      if (!state.token) return;
      try {
        const { data } = await axios.get("/users/me");
        commit("setUserData", data.user);
      } catch (e) {
        console.error("Помилка отримання користувача:", e);
        commit("logout");
      }
    },

    async requestPasswordReset(_, payload) {
      try {
        const { data } = await requestPasswordReset(payload);
        return data;
      } catch (error) {
        console.error("Помилка при запиті відновлення пароля:", error);
        throw error;
      }
    },

    async resetPassword(_, payload) {
      try {
        const { data } = await resetPassword(payload);
        return data;
      } catch (error) {
        console.error("Помилка при скиданні пароля:", error);
        throw error;
      }
    },

    changeName: async ({ commit }, payload) => {
      try {
        const { data } = await changeName(payload);
        commit("setUserData", data.user);
        return data;
      } catch (error) {
        console.error("Помилка при зміні імені:", error);
        throw error;
      }
    },

    changePassword: async (_, payload) => {
      try {
        const { data } = await changePassword(payload);
        return data;
      } catch (error) {
        console.error("Помилка при зміні пароля:", error);
        throw error;
      }
    },
  },
};
