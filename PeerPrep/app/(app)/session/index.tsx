/**
 * Session Room Screen
 * Active practice session with partner
 */

import React, { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions, StatusBar } from "react-native";
import { Text, Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TabView, TabBar, SceneMap, Route } from "react-native-tab-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSessionStore } from "../../../stores/sessionStore";
import * as sessionsApi from "../../../lib/api/sessions";
import SessionHeader from "../../components/session/SessionHeader";
import SessionQuestion from "../../components/session/SessionQuestion";
import SessionCodeEditor from "../../components/session/SessionCodeEditor";
import SessionNotes from "../../components/session/SessionNotes";
import EndSessionDialog from "../../components/session/EndSessionDialog";
import sessionStyles from "../../styles/sessionStyles";

type TabRoute = Route & {
  icon: string;
};

export default function SessionScreen() {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    currentSession,
    sessionNotes,
    updateNotes,
    timerSeconds,
    isTimerRunning,
    startTimer,
    tickTimer,
  } = useSessionStore();

  const [code, setCode] = useState(
    "// Write your solution here\n\nfunction twoSum(nums, target) {\n    \n}"
  );
  const [isRecording, setIsRecording] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: "question", title: "Question", icon: "file-document" },
    { key: "code", title: "Code", icon: "code-tags" },
    { key: "notes", title: "Notes", icon: "note-text" },
  ]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  // Auto-start timer
  useEffect(() => {
    startTimer();
  }, []);

  // Auto-save notes (debounced)
  useEffect(() => {
    if (currentSession && sessionNotes) {
      const timeoutId = setTimeout(() => {
        sessionsApi.updateSessionNotes(currentSession.id, sessionNotes);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sessionNotes, currentSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndSession = async () => {
    setShowEndDialog(false);

    // End the session in database
    if (currentSession) {
      await sessionsApi.endSession(currentSession.id);
    }

    router.push("/(app)/session/feedback");
  };

  const handleSaveNotes = () => {
    if (currentSession) {
      sessionsApi.updateSessionNotes(currentSession.id, sessionNotes);
    }
  };

  if (!currentSession) {
    return (
      <View style={sessionStyles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Text variant="headlineSmall">No active session</Text>
          <Button
            mode="contained"
            onPress={() => router.replace("/(app)/home")}
          >
            Go Home
          </Button>
        </View>
      </View>
    );
  }

  const QuestionRoute = () => (
    <ScrollView
      style={sessionStyles.tabContent}
      contentContainerStyle={sessionStyles.scrollContent}
    >
      <SessionQuestion question={currentSession.question!} />

      {/* Recording Toggle */}
      <View style={sessionStyles.recordingCard}>
        <View style={sessionStyles.recordingRow}>
          <View style={sessionStyles.recordingInfo}>
            <View
              style={[
                sessionStyles.recordingDot,
                isRecording
                  ? sessionStyles.recordingDotActive
                  : sessionStyles.recordingDotInactive,
              ]}
            />
            <Text style={sessionStyles.recordingText}>
              {isRecording ? "Recording..." : "Record session"}
            </Text>
          </View>
          <Button
            mode={isRecording ? "contained" : "outlined"}
            onPress={() => setIsRecording(!isRecording)}
            style={sessionStyles.recordingButton}
            labelStyle={sessionStyles.recordingButtonLabel}
            buttonColor={isRecording ? "#EF4444" : undefined}
            textColor={isRecording ? "#FFFFFF" : "#374151"}
          >
            {isRecording ? "Stop" : "Start"}
          </Button>
        </View>
      </View>
    </ScrollView>
  );

  const CodeRoute = () => (
    <View style={sessionStyles.tabContent}>
      <SessionCodeEditor code={code} onCodeChange={setCode} />
    </View>
  );

  const NotesRoute = () => (
    <ScrollView
      style={sessionStyles.tabContent}
      contentContainerStyle={sessionStyles.scrollContent}
    >
      <SessionNotes
        notes={sessionNotes}
        onNotesChange={updateNotes}
        onSave={handleSaveNotes}
      />
    </ScrollView>
  );

  const renderScene = SceneMap({
    question: QuestionRoute,
    code: CodeRoute,
    notes: NotesRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={sessionStyles.tabIndicator}
      style={sessionStyles.tabBar}
      labelStyle={sessionStyles.tabLabel}
      activeColor="#2563EB"
      inactiveColor="#6B7280"
      renderIcon={({ route, color }: { route: TabRoute; color: string }) => (
        <MaterialCommunityIcons
          name={route.icon as any}
          color={color}
          size={20}
        />
      )}
    />
  );

  return (
    <View style={[sessionStyles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SessionHeader
        partnerName={currentSession.partner_name}
        partnerAvatar={currentSession.partner_avatar || ""}
        topicName={currentSession.topic_name}
        time={formatTime(timerSeconds)}
        onEndSession={() => setShowEndDialog(true)}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />

      <EndSessionDialog
        visible={showEndDialog}
        onDismiss={() => setShowEndDialog(false)}
        onConfirm={handleEndSession}
      />
    </View>
  );
}
