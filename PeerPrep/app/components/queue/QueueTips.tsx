import React from "react";
import { View } from "react-native";
import { Text, Card } from "react-native-paper";
import styles from "../../styles/queue/QueueTipsStyles";

export default function QueueTips() {
  const tips = [
    "Review the topic basics",
    "Prepare your workspace",
    "Think about edge cases",
  ];

  return (
    <Card style={styles.tipsCard}>
      <Card.Content style={styles.tipsContent}>
        <Text style={styles.tipsTitle}>💡 While you wait:</Text>
        <View style={styles.tipsList}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
