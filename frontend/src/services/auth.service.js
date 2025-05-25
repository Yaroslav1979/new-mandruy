import axios  from "../utils/axios";

export const loginUser = (payload) => {
    return axios.post('/users/login', payload)
};

export const registerUser = (payload) => {
    return axios.post('/users/register', payload)
};
export const confirmEmail = (payload) =>
  axios.post('/auth/confirm-email', payload);

export const requestPasswordReset = (payload) =>
  axios.post('/auth/forgot-password', payload);

export const resetPassword = ({ token, password }) =>
  axios.post(`/auth/reset-password/${token}`, { password });

export const changeName = (payload) =>
  axios.patch('/users/change-name', payload);

export const changePassword = (payload) =>
  axios.patch('/users/change-password', payload);