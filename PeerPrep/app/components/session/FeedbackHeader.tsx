import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/session/FeedbackHeaderStyles";

export default function FeedbackHeader() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#10B981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Text style={styles.emoji}>🎉</Text>
      </LinearGradient>
      <Text style={styles.title}>Session Complete!</Text>
      <Text style={styles.subtitle}>Help us improve by sharing your feedback</Text>
    </View>
  );
}
