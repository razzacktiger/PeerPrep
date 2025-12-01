import React from "react";
import { View } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TOPICS } from "../../lib/constants";
import { useQueueAnimations } from "../../lib/hooks/useQueueAnimations";
import { useQueueProgress } from "../../lib/hooks/useQueueProgress";
import { useMatchmaking } from "../../lib/hooks/useMatchmaking";
import { getDifficultyColor } from "../../lib/utils/difficultyColors";
import QueueStatusIcon from "../components/queue/QueueStatusIcon";
import QueueTopicInfo from "../components/queue/QueueTopicInfo";
import QueueProgress from "../components/queue/QueueProgress";
import QueueTips from "../components/queue/QueueTips";
import styles from "../styles/queueStyles";

export default function QueueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { topicId, difficulty, _t } = params;

  console.log("📺 QueueScreen render - params:", { topicId, difficulty, _t });

  // Find topic info
  const topic = TOPICS.find((t) => t.id === topicId);

  // Custom hooks for logic separation
  const {
    status,
    queuePosition,
    estimatedWaitTime,
    error,
    handleCancel,
    handleRetry,
  } = useMatchmaking(topicId, difficulty, _t);

  console.log("📺 QueueScreen render - status:", status);
  const { progress, resetProgress } = useQueueProgress(status);
  const { pingAnim1, pingAnim2, bounceAnim } = useQueueAnimations(status);

  // Get difficulty colors
  const difficultyColors = getDifficultyColor(difficulty as string);

  const onRetry = () => {
    resetProgress();
    handleRetry(difficulty);
  };

  if (status === "error") {
    return (
      <LinearGradient
        colors={["#7C3AED", "#3B82F6", "#4F46E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Card style={styles.mainCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.errorIconContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={64}
                  color="#EF4444"
                />
              </View>
              <Text style={styles.errorTitle}>No Match Found</Text>
              <Text style={styles.errorMessage}>{error}</Text>

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={onRetry}
                  style={styles.retryButton}
                  labelStyle={styles.retryButtonLabel}
                  buttonColor="#2563EB"
                >
                  Try Again
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => router.back()}
                  style={styles.backButton}
                  labelStyle={styles.backButtonLabel}
                  textColor="#6B7280"
                >
                  Back to Topics
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#7C3AED", "#3B82F6", "#4F46E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Card style={styles.mainCard}>
          <Card.Content style={styles.cardContent}>
            {/* Status Icon */}
            <QueueStatusIcon
              status={status}
              pingAnim1={pingAnim1}
              pingAnim2={pingAnim2}
              bounceAnim={bounceAnim}
            />

            {/* Status Text */}
            <View style={styles.statusSection}>
              <Text style={styles.statusTitle}>
                {status === "searching" && "Finding Your Match..."}
                {status === "found" && "Match Found! 🎉"}
              </Text>
              <Text style={styles.statusSubtitle}>
                {status === "searching" &&
                  "Searching for someone at your level"}
                {status === "found" && "Preparing your session..."}
              </Text>
            </View>

            {/* Topic Info */}
            {topic && (
              <QueueTopicInfo
                topicName={topic.name}
                difficulty={difficulty as string}
                difficultyColors={difficultyColors}
              />
            )}

            {/* Progress/Timer */}
            {status === "searching" && (
              <QueueProgress
                status="searching"
                estimatedTime={estimatedWaitTime}
                progress={progress}
              />
            )}

            {status === "found" && (
              <QueueProgress status="found" progress={1} />
            )}

            {/* Cancel Button */}
            {status === "searching" && (
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
                icon={() => (
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#6B7280"
                  />
                )}
                textColor="#374151"
              >
                Cancel Search
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Tips */}
        {status === "searching" && <QueueTips />}
      </View>
    </LinearGradient>
  );
}
