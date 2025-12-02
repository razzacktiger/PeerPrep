import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Text, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import SessionDetailModal from "./SessionDetailModal";
import styles from "../../styles/home/RecentActivityStyles";

interface Activity {
  id: string;
  topic: string;
  partner: string;
  rating: number;
  date: string;
  difficulty: string;
  duration: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSessionPress = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedSessionId(null), 300);
  };
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} style={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </Text>
    ));
  };

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
        {activities.map((activity, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.activityItem,
              pressed && styles.activityItemPressed,
            ]}
            onPress={() => handleSessionPress(activity.id)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${activity.topic} session with ${activity.partner}`}
            accessibilityHint="Opens session details modal"
          >
            <View style={styles.activityContent}>
              <LinearGradient
                colors={["#f3e8ff", "#dbeafe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activityIconContainer}
              >
                <Text style={styles.activityIcon}>📖</Text>
              </LinearGradient>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTopic} numberOfLines={1}>
                  {activity.topic}
                </Text>
                <View style={styles.activityMetaContainer}>
                  <Text style={styles.activityDetails} numberOfLines={1}>
                    {activity.partner}
                  </Text>
                  <Text style={styles.activityDot}>•</Text>
                  <Text style={styles.activityDetails} numberOfLines={1}>
                    {activity.date}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              {renderStars(activity.rating)}
            </View>
          </Pressable>
        ))}
      </Card.Content>

      <SessionDetailModal
        visible={modalVisible}
        sessionId={selectedSessionId}
        onClose={handleCloseModal}
      />
    </Card>
  );
}
