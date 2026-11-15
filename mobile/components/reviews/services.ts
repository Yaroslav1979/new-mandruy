import axios from "axios";
import { API_URL } from "../../constants/api";
import { Review } from "./reviewItem/typesReviews";

export const getReviewsByPlaceId = async (
  placeId: string,
): Promise<Review[]> => {
  const { data } = await axios.get<Review[]>(
    `${API_URL}/api/places/${placeId}/reviews`,
  );

  return data;
};

export const postReview = async (
  placeId: string,
  reviewData: {
    content: string;
    rating: number;
  },
  token: string,
) => {
  const { data } = await axios.post(
    `${API_URL}/api/places/${placeId}/reviews`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

// Редагування відгуку
export const updateReview = async (
  placeId: string,
  reviewId: string,
  reviewData: {
    content: string;
    rating: number;
  },
  token: string,
) => {
  const { data } = await axios.patch(
    `${API_URL}/api/places/${placeId}/reviews/${reviewId}`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

// Видалення відгуку
export const deleteReview = async (
  placeId: string,
  reviewId: string,
  token: string,
) => {
  const { data } = await axios.delete(
    `${API_URL}/api/places/${placeId}/reviews/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
