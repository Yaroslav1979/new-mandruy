import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  number: number;
  question: string;
  answer: string;
};

export function QuestionItem({ number, question, answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.block}>
      <Pressable style={styles.questionRow} onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.questionWrapper}>
          <Text style={styles.number}>{number}.</Text>
          <Text style={styles.questionText}>{question}</Text>
        </View>

        <Text style={styles.icon}>{isOpen ? "-" : "+"}</Text>
      </Pressable>

      {isOpen && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#333639",
    padding: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionWrapper: {
    flexDirection: "row",
    flex: 1,
    paddingRight: 10,
  },
  number: {
    marginRight: 8,
    fontSize: 16,
  },
  questionText: {
    fontSize: 16,
    flexShrink: 1,
  },
  icon: {
    fontSize: 28,
    fontWeight: "600",
  },
  answer: {
    marginTop: 10,
    paddingLeft: 20,
    fontSize: 15,
    lineHeight: 22,
  },
});
