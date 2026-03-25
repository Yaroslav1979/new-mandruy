import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { postReview } from "./services";
// import { Review } from "./reviewItem/typesReviews";
import Rating from "../star-rating";

interface Props {
  placeId: string;
  onAdded: () => void; // Спростимо, бо ми все одно оновлюємо дані з сервера
  onClose: () => void; // Новий пропс для закриття
  isAuthenticated: boolean;
}

const AddReviewForm: React.FC<Props> = ({
  placeId,
  onAdded,
  onClose,
  isAuthenticated,
}) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const submitReview = async () => {
    if (!author.trim() || !content.trim()) {
      alert("Заповніть всі поля");
      return;
    }

    try {
      // Переконайся, що сервіс postReview приймає об'єкт саме такої структури
      await postReview({
        author,
        content,
        rating,
        placeId,
      });

      onAdded(); // Викликає fetchPlace у батька
      onClose();
    } catch (e) {
      console.error("Помилка:", e);
      alert("Не вдалося надіслати відгук");
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.form}>
        <Text>Зареєструйтесь щоб залишати відгуки</Text>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text>Закрити</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.modalTitle}>Новий відгук</Text>

      <TextInput
        placeholder="Ваше ім'я"
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />

      <TextInput
        placeholder="Ваш відгук"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.textarea]}
        multiline
      />

      <View style={styles.ratingContainer}>
        <Text>Оцінка: </Text>
        <Rating rating={rating} mode="input" onChange={setRating} />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={{ color: "red" }}>Скасувати</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Надіслати</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddReviewForm;

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
  textarea: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    minHeight: 80,
  },
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
