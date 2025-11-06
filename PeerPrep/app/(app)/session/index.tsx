/**
 * Session Room Screen
 * Active practice session with partner
 */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  Chip,
  Avatar,
  IconButton,
  Switch,
  Divider,
  Portal,
  Dialog,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useSessionStore } from "../../../stores/sessionStore";
import * as sessionsApi from "../../../lib/api/sessions";

export default function SessionScreen() {
  const router = useRouter();
  const {
    currentSession,
    sessionNotes,
    updateNotes,
    timerSeconds,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
  } = useSessionStore();

  const [isRecording, setIsRecording] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  // Auto-save notes (debounced in real app)
  useEffect(() => {
    if (currentSession && sessionNotes) {
      sessionsApi.updateSessionNotes(currentSession.id, sessionNotes);
    }
  }, [sessionNotes, currentSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndSession = () => {
    setShowEndDialog(false);
    pauseTimer();
    router.push("/(app)/session/feedback");
  };

  const handleNextQuestion = () => {
    // Stub - in real app, load next question
    setQuestionIndex((prev) => prev + 1);
  };

  if (!currentSession) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No active session</Text>
        <Button mode="contained" onPress={() => router.replace("/(app)/home")}>
          Go Home
        </Button>
      </View>
    );
  }

  const question = currentSession.question;
  const isTimerLow = timerSeconds < 300; // Less than 5 minutes

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.partnerInfo}>
              <Avatar.Image
                size={40}
                source={{ uri: currentSession.partner_avatar }}
              />
              <View style={styles.partnerDetails}>
                <Text variant="titleMedium" style={styles.partnerName}>
                  {currentSession.partner_name}
                </Text>
                <Text variant="bodySmall" style={styles.topicName}>
                  {currentSession.topic_name}
                </Text>
              </View>
            </View>

            <View style={styles.timerContainer}>
              <Text
                variant="headlineSmall"
                style={[styles.timer, isTimerLow && styles.timerLow]}
              >
                {formatTime(timerSeconds)}
              </Text>
              <View style={styles.timerButtons}>
                <IconButton
                  icon={isTimerRunning ? "pause" : "play"}
                  size={20}
                  onPress={isTimerRunning ? pauseTimer : startTimer}
                />
                <IconButton icon="refresh" size={20} onPress={resetTimer} />
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Question Panel */}
          <Card style={styles.questionCard}>
            <Card.Content>
              <View style={styles.questionHeader}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                  Question
                </Text>
                <Chip
                  mode="flat"
                  style={
                    question?.difficulty === "Easy"
                      ? styles.easyChip
                      : question?.difficulty === "Medium"
                      ? styles.mediumChip
                      : styles.hardChip
                  }
                  textStyle={styles.chipText}
                >
                  {question?.difficulty}
                </Chip>
              </View>

              <Text variant="headlineSmall" style={styles.questionTitle}>
                {question?.title}
              </Text>

              <Divider style={styles.divider} />

              <Text variant="bodyMedium" style={styles.questionPrompt}>
                {question?.prompt}
              </Text>

              {question?.hints && question.hints.length > 0 && (
                <View style={styles.hintsContainer}>
                  <Text variant="titleSmall" style={styles.hintsTitle}>
                    💡 Hints:
                  </Text>
                  {question.hints.map((hint, index) => (
                    <Text key={index} variant="bodySmall" style={styles.hint}>
                      • {hint}
                    </Text>
                  ))}
                </View>
              )}

              <Button
                mode="outlined"
                onPress={handleNextQuestion}
                style={styles.nextButton}
                icon="arrow-right"
              >
                Next Question
              </Button>
            </Card.Content>
          </Card>

          {/* Notes Panel */}
          <Card style={styles.notesCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Your Notes
              </Text>
              <Text variant="bodySmall" style={styles.notesSubtext}>
                Notes are auto-saved
              </Text>

              <TextInput
                mode="outlined"
                multiline
                numberOfLines={8}
                value={sessionNotes}
                onChangeText={updateNotes}
                placeholder="Take notes about your approach, solutions, or learnings..."
                style={styles.notesInput}
              />
            </Card.Content>
          </Card>

          {/* Recording Toggle (UI only) */}
          <Card style={styles.recordingCard}>
            <Card.Content>
              <View style={styles.recordingRow}>
                <View style={styles.recordingInfo}>
                  <Text variant="titleMedium">🎙️ Audio Recording</Text>
                  <Text variant="bodySmall" style={styles.recordingSubtext}>
                    {isRecording ? "Recording in progress..." : "Not recording"}
                  </Text>
                </View>
                <Switch
                  value={isRecording}
                  onValueChange={setIsRecording}
                  color="#6200ee"
                />
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={() => setShowEndDialog(true)}
            style={styles.endButton}
            buttonColor="#b00020"
          >
            End Session
          </Button>
        </View>

        {/* End Session Confirmation Dialog */}
        <Portal>
          <Dialog
            visible={showEndDialog}
            onDismiss={() => setShowEndDialog(false)}
          >
            <Dialog.Title>End Session?</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Are you sure you want to end this session? You'll be asked to
                provide feedback for your partner.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowEndDialog(false)}>Cancel</Button>
              <Button onPress={handleEndSession}>End Session</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  partnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  partnerDetails: {
    marginLeft: 12,
  },
  partnerName: {
    fontWeight: "bold",
  },
  topicName: {
    color: "#666",
  },
  timerContainer: {
    alignItems: "center",
  },
  timer: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  timerLow: {
    color: "#b00020",
  },
  timerButtons: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  questionCard: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  easyChip: {
    backgroundColor: "#4caf50",
  },
  mediumChip: {
    backgroundColor: "#ff9800",
  },
  hardChip: {
    backgroundColor: "#f44336",
  },
  chipText: {
    color: "white",
  },
  questionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  questionPrompt: {
    lineHeight: 22,
    marginBottom: 16,
  },
  hintsContainer: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  hintsTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  hint: {
    color: "#1976d2",
    marginBottom: 4,
  },
  nextButton: {
    marginTop: 8,
  },
  notesCard: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  notesSubtext: {
    color: "#666",
    marginBottom: 12,
  },
  notesInput: {
    marginTop: 8,
  },
  recordingCard: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  recordingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordingInfo: {
    flex: 1,
  },
  recordingSubtext: {
    color: "#666",
    marginTop: 4,
  },
  footer: {
    backgroundColor: "white",
    padding: 16,
    elevation: 8,
  },
  endButton: {
    paddingVertical: 6,
  },
});
