import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./reviewsAvatar";
import Rating from "../../star-rating";

interface Props {
  author: string;
  rating: number;
}

const ReviewsHeading: React.FC<Props> = ({ author, rating }) => {
  return (
    <View style={styles.container}>
      <Avatar />
      <View style={styles.content}>
        <Text style={styles.author}>{author}</Text>
        <Rating rating={rating} mode="display" />
      </View>
    </View>
  );
};

export default ReviewsHeading;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginLeft: 12,
  },
  author: {
    fontWeight: "bold",
  },
});
