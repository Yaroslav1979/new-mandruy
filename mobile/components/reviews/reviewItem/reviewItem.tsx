import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReviewsHeading from "./reviewsHeading";
import { Review } from "./typesReviews";

interface Props {
  review: Review;
}

const ReviewItem: React.FC<Props> = ({ review }) => {
  return (
    <View style={styles.container}>
      <ReviewsHeading rating={review.rating} author={review.author} />
      <Text style={styles.content} numberOfLines={5}>
        {review.content}
      </Text>
    </View>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 2,
  },
  content: {
    marginTop: 20,
    lineHeight: 20,
  },
});
