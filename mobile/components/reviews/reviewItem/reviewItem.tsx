import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import ReviewsHeading from "./reviewsHeading";
import { Review } from "./typesReviews";
import { useAuth } from "@/context/AuthContext";
import { deleteReview } from "../services";

interface Props {
  review: Review;
  placeId: string;
  onEdit: (review: Review) => void;
  onDeleted: () => void;
}

const ReviewItem: React.FC<Props> = ({
  review,
  placeId,
  onEdit,
  onDeleted,
}) => {
  const { user, token } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const reviewUserId =
    typeof review.userId === "string" ? review.userId : review.userId?._id;

  const isOwner = !!user?._id && !!reviewUserId && user._id === reviewUserId;
  const isAdmin = user?.role === "admin";
  const handleDelete = () => {
    Alert.alert("Видалення відгуку", "Ви дійсно хочете видалити свій відгук?", [
      {
        text: "Скасувати",
        style: "cancel",
      },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          if (!review._id || !token || deleting) return;

          setDeleting(true);

          try {
            await deleteReview(placeId, review._id, token);

            Alert.alert("Успішно", "Відгук видалено.");

            onDeleted();
          } catch (error: any) {
            console.log(
              "Помилка видалення відгуку:",
              error.response?.status,
              error.response?.data || error.message,
            );

            Alert.alert(
              "Помилка",
              error.response?.data?.message || "Не вдалося видалити відгук.",
            );
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ReviewsHeading rating={review.rating} author={review.author} />

      <Text style={styles.content} numberOfLines={5}>
        {review.content}
      </Text>

      {(isOwner || isAdmin) && (
        <View style={styles.actions}>
          {/* Редагувати може тільки автор відгуку */}
          {isOwner && (
            <TouchableOpacity
              onPress={() => onEdit(review)}
              style={styles.editButton}
            >
              <Text style={styles.editText}>Редагувати</Text>
            </TouchableOpacity>
          )}

          {/* Видаляти може автор або адміністратор */}
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.editButton}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="red" />
            ) : (
              <Text style={styles.deleteText}>Видалити</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    fontFamily: "Ukrainian-Regular",
    marginTop: 20,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 18,
  },
  editButton: {
    paddingVertical: 6,
  },
  editText: {
    fontFamily: "Ukrainian-Medium",
    color: "blue",
  },
  deleteButton: {
    paddingVertical: 6,
  },
  deleteText: {
    fontFamily: "Ukrainian-Medium",
    color: "red",
  },
});
