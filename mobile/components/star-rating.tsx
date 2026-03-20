import { View, StyleSheet, DimensionValue } from "react-native";
import StarEmpty from "../assets/svg/Star_rating-empty.svg";
import StarFilled from "../assets/svg/Star_rating-yellow.svg";

type Props = {
  rating?: number;
  starLimit?: number;
};

// Винесемо константи, щоб легше було рахувати ширину
const STAR_SIZE = 16;
const STAR_MARGIN = 3;
const FULL_STAR_WIDTH = STAR_SIZE + STAR_MARGIN * 2;

export default function StarRating({ rating = 0, starLimit = 5 }: Props) {
  // Розраховуємо точну ширину контейнера
  const containerWidth = FULL_STAR_WIDTH * starLimit;
  // Відсоток заповнення
  const widthPercent = `${(rating / starLimit) * 100}%` as DimensionValue;

  return (
    <View style={[styles.wrapper, { width: containerWidth }]}>
      {/* Нижні порожні зірки */}
      <View style={styles.row}>
        {Array.from({ length: starLimit }).map((_, i) => (
          <StarEmpty
            key={i}
            width={STAR_SIZE}
            height={15}
            style={styles.star}
          />
        ))}
      </View>

      {/* Верхній шар із заповненими зірками */}
      <View style={[styles.overlay, { width: widthPercent }]}>
        <View style={[styles.row, { width: containerWidth }]}>
          {Array.from({ length: starLimit }).map((_, i) => (
            <StarFilled
              key={i}
              width={STAR_SIZE}
              height={15}
              style={styles.star}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    // Тепер ширина задається динамічно в inline-стилях
  },
  row: {
    flexDirection: "row",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden", // Саме це обрізає зірки
  },
  star: {
    marginHorizontal: STAR_MARGIN,
  },
});
