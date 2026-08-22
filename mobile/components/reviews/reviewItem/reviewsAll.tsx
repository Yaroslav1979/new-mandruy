import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import ReviewItem from "./reviewItem";
import AddReviewForm from "../addReviewForm";
import Rating from "../../star-rating";
import { Review } from "./typesReviews";

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
  totalRating, // Отримуємо з пропсів
}) => {
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [limit, setLimit] = useState<number>(2);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  // const totalRating = useMemo((): string => {
  //   if (!localReviews.length) return "0";
  //   const total = localReviews.reduce((acc, r) => acc + r.rating, 0);
  //   return (total / localReviews.length).toFixed(1);
  // }, [localReviews]);

  const currentReviews = localReviews.slice(0, limit);

  const toggleReviews = (): void => {
    setLimit(limit === localReviews.length ? 2 : localReviews.length);
  };

  const handleAdded = (): void => {
    setShowModal(false);
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
        <TouchableOpacity
          onPress={() => {
            // if (!isAuthenticated) return;
            setShowModal(!showModal);
          }}
        >
          <Text style={styles.button}>
            {showModal ? "Приховати" : "Залишити відгук"}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ marginVertical: 10, fontFamily: "Ukrainian-Medium" }}>
          Зареєструйтесь щоб залишити відгук
        </Text>
      )}

      <Modal
        visible={showModal}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        supportedOrientations={["portrait", "landscape"]}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              {/* Цей порожній TouchableWithoutFeedback зупиняє закриття при кліку на саму форму */}
              <View style={styles.modalContent}>
                <AddReviewForm
                  placeId={placeId}
                  onAdded={handleAdded}
                  onClose={() => setShowModal(false)} // Передаємо функцію закриття
                  isAuthenticated={isAuthenticated}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {currentReviews.map((review, index) => (
        <ReviewItem key={review._id || index.toString()} review={review} />
      ))}

      <TouchableOpacity onPress={toggleReviews}>
        <Text style={styles.showMore}>
          {limit >= localReviews.length ? "Згорнути" : "Читати більше..."}
        </Text>
      </TouchableOpacity>
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
