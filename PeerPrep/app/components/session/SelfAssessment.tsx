import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/session/SelfAssessmentStyles";

interface SelfAssessmentProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const getRatingMessage = (rating: number) => {
  if (rating >= 4) return "Great job! Keep up the good work! 💪";
  if (rating === 3) return "Good effort! Practice makes perfect! 📚";
  if (rating <= 2) return "Don't worry, every session is a learning opportunity! 🌱";
  return null;
};

export default function SelfAssessment({ rating, onRatingChange }: SelfAssessmentProps) {
  const message = getRatingMessage(rating);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Self Assessment</Text>
      <Text style={styles.subtitle}>How do you feel about your performance?</Text>

      {/* Star Rating */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            <MaterialCommunityIcons
              name={star <= rating ? "star" : "star-outline"}
              size={40}
              color={star <= rating ? "#60A5FA" : "#D1D5DB"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Message */}
      {message && (
        <LinearGradient
          colors={["#DBEAFE", "#E9D5FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.messageContainer}
        >
          <Text style={styles.messageText}>{message}</Text>
        </LinearGradient>
      )}
    </View>
  );
}
