import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import ReviewItem from "./reviewItem/reviewItem";
import AddReviewForm from "./addReviewForm";
import Rating from "../star-rating";
import { Review } from "./reviewItem/typesReviews";

interface Props {
  reviews: Review[];
  placeId: string;
  onReviewAdded: () => void;
  isAuthenticated: boolean;
  totalRating: number;
}

const ReviewsAll: React.FC<Props> = ({
  reviews,
  placeId,
  onReviewAdded,
  isAuthenticated,
  totalRating,
}) => {
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [limit, setLimit] = useState<number>(2);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Відгук, який зараз редагується
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const currentReviews = localReviews.slice(0, limit);

  const toggleReviews = (): void => {
    setLimit(limit === localReviews.length ? 2 : localReviews.length);
  };

  // Відкриття форми нового відгуку
  const handleOpenNewReview = () => {
    setEditingReview(null);
    setShowModal(true);
  };

  // Відкриття форми редагування
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowModal(true);
  };

  // Закриття форми
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
  };

  // Після створення або редагування
  const handleSaved = () => {
    handleCloseModal();
    onReviewAdded();
  };

  // Після видалення
  const handleDeleted = () => {
    onReviewAdded();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Відгуки</Text>

      <Text style={styles.txt}>Кількість: {localReviews.length}</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.txt}>Рейтинг: </Text>
        <Rating rating={Number(totalRating)} mode="display" />
      </View>

      {isAuthenticated ? (
        <TouchableOpacity onPress={handleOpenNewReview}>
          <Text style={styles.button}>Залишити відгук</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.registrationText}>
          Зареєструйтесь щоб залишити відгук
        </Text>
      )}

      <Modal
        visible={showModal}
        transparent={false}
        animationType="fade"
        onRequestClose={handleCloseModal}
        supportedOrientations={["portrait", "landscape"]}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <AddReviewForm
                  key={editingReview?._id || "new-review"}
                  placeId={placeId}
                  review={editingReview}
                  onAdded={handleSaved}
                  onClose={handleCloseModal}
                  isAuthenticated={isAuthenticated}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {currentReviews.map((review, index) => (
        <ReviewItem
          key={review._id || index.toString()}
          review={review}
          placeId={placeId}
          onEdit={handleEditReview}
          onDeleted={handleDeleted}
        />
      ))}

      {localReviews.length > 2 && (
        <TouchableOpacity onPress={toggleReviews}>
          <Text style={styles.showMore}>
            {limit >= localReviews.length ? "Згорнути" : "Читати більше..."}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReviewsAll;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Ukrainian-Bold",
    fontSize: 20,
    fontWeight: "bold",
  },
  txt: {
    fontFamily: "Ukrainian-Medium",
  },
  button: {
    fontFamily: "Ukrainian-Medium",
    marginVertical: 12,
    fontSize: 16,
    color: "blue",
  },
  registrationText: {
    marginVertical: 10,
    fontFamily: "Ukrainian-Medium",
  },
  showMore: {
    fontSize: 16,
    fontFamily: "Ukrainian-Medium",
    textAlign: "center",
    padding: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    fontFamily: "Ukrainian-Regular",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
});
