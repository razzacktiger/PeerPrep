import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from "../../styles/session/SessionQuestionStyles";

interface Question {
  title: string;
  difficulty: string;
  prompt: string;
  hints?: string[];
}

interface SessionQuestionProps {
  question: Question;
}

export default function SessionQuestion({ question }: SessionQuestionProps) {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return {
          badge: styles.difficultyEasy,
          text: styles.difficultyTextEasy,
        };
      case "Medium":
        return {
          badge: styles.difficultyMedium,
          text: styles.difficultyTextMedium,
        };
      case "Hard":
        return {
          badge: styles.difficultyHard,
          text: styles.difficultyTextHard,
        };
      default:
        return {
          badge: styles.difficultyEasy,
          text: styles.difficultyTextEasy,
        };
    }
  };

  const difficultyStyle = getDifficultyStyles(question.difficulty);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{question.title}</Text>
        <View style={[styles.difficultyBadge, difficultyStyle.badge]}>
          <Text style={difficultyStyle.text}>{question.difficulty}</Text>
        </View>
      </View>

      <Text style={styles.description}>{question.prompt}</Text>

      {question.hints && question.hints.length > 0 && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>💡 Hints:</Text>
          {question.hints.map((hint, index) => (
            <View key={index} style={styles.exampleRow}>
              <Text style={styles.exampleValue}>• {hint}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
