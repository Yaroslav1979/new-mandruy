// import axios from 'axios';

// export const getReviewsByPlaceId = (placeId) => {
//   return axios.get(`http://localhost:3000/api/places/${placeId}/reviews`);
// };

// export const postReview = ({ placeId, author, content, rating }) => {
//     console.log(placeId);
//   return axios.post(`http://localhost:3000/api/places/${placeId}/reviews`, {
//     author,
//     content,
//     rating
//   });
// };

import axios from "axios";

export const API_URL = "http://localhost:3000/api";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getReviewsByPlaceId = (placeId) =>
  axios.get(`${API_URL}/places/${placeId}/reviews`);

export const postReview = ({ placeId, content, rating, token }) =>
  axios.post(
    `${API_URL}/places/${placeId}/reviews`,
    { content, rating },
    { headers: authHeaders(token) },
  );

export const deleteReview = (placeId, reviewId, token) =>
  axios.delete(`${API_URL}/places/${placeId}/reviews/${reviewId}`, {
    headers: authHeaders(token),
  });

export const getCurrentUser = (token) =>
  axios.get(`${API_URL}/auth/me`, {
    headers: authHeaders(token),
  });

export const setUserBlocked = (userId, blocked, token) =>
  axios.patch(
    `${API_URL}/auth/admin/users/${userId}/block`,
    { blocked },
    { headers: authHeaders(token) },
  );

export const getBlockedUsers = (token) =>
  axios.get(`${API_URL}/auth/admin/users`, {
    headers: authHeaders(token),
  });
