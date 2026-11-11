import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { postReview } from "./services";
import Rating from "../star-rating";
import { useAuth } from "@/context/AuthContext";

interface Props {
  placeId: string;
  onAdded: () => void;
  onClose: () => void;
  isAuthenticated: boolean;
}

const AddReviewForm: React.FC<Props> = ({
  placeId,
  onAdded,
  onClose,
  isAuthenticated,
}) => {
  const { token } = useAuth();

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async () => {
    if (!content.trim()) {
      Alert.alert("Увага", "Напишіть текст відгуку.");
      return;
    }

    if (!isAuthenticated || !token) {
      Alert.alert(
        "Авторизація",
        "Увійдіть в обліковий запис, щоб залишити відгук.",
      );
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      await postReview(
        placeId,
        {
          content: content.trim(),
          rating,
        },
        token,
      );

      onAdded();
      onClose();
    } catch (error: any) {
      console.error(
        "Помилка надсилання відгуку:",
        error.response?.data || error.message || error,
      );

      Alert.alert(
        "Помилка",
        error.response?.data?.message ||
          "Не вдалося надіслати відгук. Спробуйте ще раз.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.form}>
        <Text style={styles.txt}>
          Увійдіть в обліковий запис, щоб залишати відгуки.
        </Text>

        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.txt}>Закрити</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.modalTitle}>Новий відгук</Text>

      <TextInput
        placeholder="Ваш відгук"
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.textarea]}
        multiline
        textAlignVertical="top"
        editable={!submitting}
      />

      <View style={styles.ratingContainer}>
        <Text style={styles.txt}>Оцінка: </Text>
        <Rating rating={rating} mode="input" onChange={setRating} />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          disabled={submitting}
        >
          <Text style={styles.cancelText}>Скасувати</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={submitReview}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Надіслати</Text>
          )}
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
    fontFamily: "Ukrainian-Regular",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
  },
  textarea: {
    minHeight: 100,
  },
  modalTitle: {
    fontFamily: "Ukrainian-Bold",
    fontSize: 18,
    marginBottom: 5,
  },
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
    justifyContent: "center",
    marginLeft: 10,
    minHeight: 42,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    justifyContent: "center",
  },
  submitText: {
    fontFamily: "Ukrainian-Medium",
    color: "#fff",
  },
  cancelText: {
    fontFamily: "Ukrainian-Medium",
    color: "red",
  },
  disabledButton: {
    opacity: 0.6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  txt: {
    fontFamily: "Ukrainian-Medium",
  },
});
