/**
 * Queue Screen
 * Matchmaking queue with animated progress
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import {
  Text,
  Button,
  ProgressBar,
  Card,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as matchmakingApi from "../../lib/api/matchmaking";
import { TOPICS } from "../../lib/constants";
import { useSessionStore } from "../../stores/sessionStore";

export default function QueueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { topicId, difficulty } = params;

  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);

  const [isSearching, setIsSearching] = useState(true);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");
  const [error, setError] = useState("");

  // Find topic info
  const topic = TOPICS.find((t) => t.id === topicId);

  // Animated pulse effect
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Animated dots for "Searching..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!isSearching) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.95) return prev; // Stop at 95%
        return prev + 0.05;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isSearching]);

  // Start matchmaking
  useEffect(() => {
    let isCancelled = false;

    const findMatch = async () => {
      try {
        const result = await matchmakingApi.findMatch(topicId as string);

        if (isCancelled) return;

        if (result.error) {
          setError(result.error);
          setIsSearching(false);
          return;
        }

        if (result.data) {
          // Store session in global state
          setCurrentSession(result.data);

          // Navigate to session room
          setIsSearching(false);
          router.replace("/(app)/session");
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to find a match. Please try again.");
          setIsSearching(false);
        }
      }
    };

    findMatch();

    return () => {
      isCancelled = true;
    };
  }, [topicId]);

  const handleCancel = async () => {
    await matchmakingApi.cancelMatch();
    router.back();
  };

  const handleRetry = () => {
    setError("");
    setIsSearching(true);
    setProgress(0);
    router.replace({
      pathname: "/(app)/queue",
      params: { topicId, difficulty },
    });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content style={styles.errorContent}>
            <Text variant="headlineSmall" style={styles.errorTitle}>
              ⚠️ No Match Found
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              {error}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleRetry}
                style={styles.retryButton}
              >
                Try Again
              </Button>
              <Button mode="outlined" onPress={() => router.back()}>
                Back to Topics
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Topic Info */}
        <Card style={styles.topicCard}>
          <Card.Content style={styles.topicContent}>
            <Text style={styles.topicIcon}>{topic?.icon}</Text>
            <Text variant="headlineSmall" style={styles.topicName}>
              {topic?.name}
            </Text>
            <Text variant="bodyMedium" style={styles.difficulty}>
              Difficulty: {difficulty}
            </Text>
          </Card.Content>
        </Card>

        {/* Animated Search Indicator */}
        <Animated.View
          style={[
            styles.searchIndicator,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </Animated.View>

        {/* Status Text */}
        <View style={styles.statusContainer}>
          <Text variant="headlineMedium" style={styles.statusText}>
            Searching for a partner{dots}
          </Text>
          <Text variant="bodyMedium" style={styles.statusSubtext}>
            This usually takes 2-4 seconds
          </Text>
        </View>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          color="#6200ee"
          style={styles.progressBar}
        />

        {/* Cancel Button */}
        <Button
          mode="outlined"
          onPress={handleCancel}
          style={styles.cancelButton}
        >
          Cancel Search
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  topicCard: {
    width: "100%",
    backgroundColor: "white",
    marginBottom: 48,
  },
  topicContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  topicIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  topicName: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  difficulty: {
    color: "#666",
  },
  searchIndicator: {
    marginBottom: 32,
  },
  searchIcon: {
    fontSize: 80,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusText: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusSubtext: {
    color: "#666",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    marginBottom: 32,
  },
  cancelButton: {
    paddingHorizontal: 24,
  },
  errorCard: {
    margin: 24,
    backgroundColor: "white",
  },
  errorContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  errorTitle: {
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  errorMessage: {
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  retryButton: {
    paddingVertical: 6,
  },
});
