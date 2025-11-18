import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from "../../styles/queue/QueueTopicInfoStyles";

interface QueueTopicInfoProps {
  topicName: string;
  difficulty: string;
  difficultyColors: {
    bg: string;
    text: string;
    border: string;
  };
}

export default function QueueTopicInfo({
  topicName,
  difficulty,
  difficultyColors,
}: QueueTopicInfoProps) {
  return (
    <View style={styles.topicInfoCard}>
      <View style={styles.topicInfoRow}>
        <Text style={styles.topicLabel}>Topic</Text>
        <Text style={styles.topicValue}>{topicName}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.topicInfoRow}>
        <Text style={styles.topicLabel}>Difficulty</Text>
        <View
          style={[
            styles.difficultyBadge,
            {
              backgroundColor: difficultyColors.bg,
              borderColor: difficultyColors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.difficultyText,
              { color: difficultyColors.text },
            ]}
          >
            {difficulty}
          </Text>
        </View>
      </View>
    </View>
  );
}
