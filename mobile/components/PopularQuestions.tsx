import { Text, StyleSheet, ScrollView } from "react-native";
import { QuestionItem } from "./QuestionItem";
import { questions } from "../constants/questions";

export function PopularQuestions() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Поширені запитання</Text>

      {questions.map((item, index) => (
        <QuestionItem
          key={item.id}
          number={index + 1}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Ukrainian-Black",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
    textTransform: "uppercase",
  },
});
