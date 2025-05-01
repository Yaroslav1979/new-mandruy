import axios from 'axios';

export const getReviewsByPlaceId = (placeId) => {
  return axios.get(`http://localhost:3000/api/places/${placeId}/reviews`);
};

export const postReview = ({ placeId, author, content, rating }) => {
    console.log(placeId);
  return axios.post(`http://localhost:3000/api/places/${placeId}/reviews`, {
    author,
    content,
    rating
  });
};