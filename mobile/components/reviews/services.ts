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

export const postReview = async (reviewData: {
  author: string;
  content: string;
  rating: number;
  placeId: string;
}) => {
  // Важливо: переносимо placeId в URL, як того очікує бекенд
  return await axios.post(
    `${API_URL}/api/places/${reviewData.placeId}/reviews`,
    {
      author: reviewData.author,
      content: reviewData.content,
      rating: reviewData.rating,
    },
  );
};
