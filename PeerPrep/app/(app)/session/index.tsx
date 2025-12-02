/**
 * Session Room Screen
 * Active practice session with partner
 */

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  Alert,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TabView, TabBar, SceneMap, Route } from "react-native-tab-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useSessionStore } from "../../../stores/sessionStore";
import { useAuthStore } from "../../../stores/authStore";
import * as sessionsApi from "../../../lib/api/sessions";
import * as realtimeApi from "../../../lib/api/realtime";
import SessionHeader from "../../components/session/SessionHeader";
import SessionQuestion from "../../components/session/SessionQuestion";
import SessionCodeEditor from "../../components/session/SessionCodeEditor";
import SessionNotes from "../../components/session/SessionNotes";
import SessionChat from "../../components/session/SessionChat";
import EndSessionDialog from "../../components/session/EndSessionDialog";
import sessionStyles from "../../styles/sessionStyles";

type TabRoute = Route & {
  icon: string;
};

export default function SessionScreen() {
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    currentSession,
    setCurrentSession,
    timerSeconds,
    isTimerRunning,
    startTimer,
    tickTimer,
    chatMessages,
    addChatMessage,
    setChatMessages,
  } = useSessionStore();

  // Debug: Track parent component renders (commented out to reduce noise)
  // const renderCount = useRef(0);
  // renderCount.current += 1;
  // console.log(
  //   `🏠 SessionScreen render #${renderCount.current}, timer: ${timerSeconds}`
  // );

  // Local state for code and notes (prevents keyboard dismissal on re-render)
  const [localCode, setLocalCode] = useState(
    "// Write your solution here\n\nfunction twoSum(nums, target) {\n    \n}"
  );
  const [localNotes, setLocalNotes] = useState("");

  // Reset local code and notes when session changes
  useEffect(() => {
    if (currentSession) {
      console.log("🔄 New session detected, resetting code and notes");
      setLocalCode(
        "// Write your solution here\n\nfunction twoSum(nums, target) {\n    \n}"
      );
      setLocalNotes("");
      // CRITICAL: Reset userEndedSessionRef for new session
      userEndedSessionRef.current = false;
    }
  }, [currentSession?.id]); // Reset when session ID changes

  const [isRecording, setIsRecording] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);

  // Real-time channels
  const codeChannelRef = useRef<RealtimeChannel | null>(null);
  const notesChannelRef = useRef<RealtimeChannel | null>(null);
  const statusChannelRef = useRef<RealtimeChannel | null>(null);
  const chatChannelRef = useRef<RealtimeChannel | null>(null);

  // Track if update is from partner (to prevent overwriting local changes)
  const isUpdatingFromPartnerRef = useRef(false);

  // Track if current user ended the session (to prevent showing alert to self)
  const userEndedSessionRef = useRef(false);

  // Debounce timers
  const codeDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const notesDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: "question", title: "Question", icon: "file-document" },
    { key: "code", title: "Code", icon: "code-tags" },
    { key: "notes", title: "Notes", icon: "note-text" },
    { key: "chat", title: "Chat", icon: "chat" },
  ]);

  // Real-time subscriptions
  useEffect(() => {
    if (!currentSession) return;

    console.log(
      "🔌 Setting up real-time subscriptions for session:",
      currentSession.id
    );

    // Subscribe to code changes
    codeChannelRef.current = realtimeApi.subscribeToCodeChanges(
      currentSession.id,
      (newCode) => {
        console.log(
          "📝 Received code update from partner, length:",
          newCode.length
        );
        // Only update if code actually changed (prevent echo loop)
        setLocalCode((prevCode) => {
          if (prevCode === newCode) {
            console.log("   ↳ Same code, skipping update");
            return prevCode;
          }
          console.log("   ↳ Code changed, updating");
          isUpdatingFromPartnerRef.current = true;
          setTimeout(() => {
            isUpdatingFromPartnerRef.current = false;
          }, 100);
          return newCode;
        });
      }
    );

    // Subscribe to notes changes
    notesChannelRef.current = realtimeApi.subscribeToNotesChanges(
      currentSession.id,
      (newNotes) => {
        console.log(
          "📝 Received notes update from partner, length:",
          newNotes.length
        );
        // Only update if notes actually changed (prevent echo loop)
        setLocalNotes((prevNotes) => {
          if (prevNotes === newNotes) {
            console.log("   ↳ Same notes, skipping update");
            return prevNotes;
          }
          console.log("   ↳ Notes changed, updating");
          isUpdatingFromPartnerRef.current = true;
          setTimeout(() => {
            isUpdatingFromPartnerRef.current = false;
          }, 100);
          return newNotes;
        });
      }
    );

    // Subscribe to session status changes (when partner ends session)
    statusChannelRef.current = realtimeApi.subscribeToSessionStatus(
      currentSession.id,
      (newStatus) => {
        console.log("🚦 Session status changed to:", newStatus, {
          userEndedSession: userEndedSessionRef.current,
          sessionId: currentSession.id,
        });
        if (newStatus === "completed") {
          // Only show alert if partner ended it (not if current user ended it)
          if (!userEndedSessionRef.current) {
            console.log("⚠️ Partner ended the session");
            Alert.alert(
              "Session Ended",
              "Your partner has ended the session. Please provide feedback.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    // DON'T clear session - feedback screen needs it
                    router.replace("/(app)/session/feedback");
                  },
                },
              ]
            );
          } else {
            console.log("✅ Current user ended the session, no alert needed");
          }
        }
      }
    );

    // Subscribe to chat messages
    setChatMessages([]); // Reset chat messages for new session
    chatChannelRef.current = realtimeApi.subscribeToChatMessages(
      currentSession.id,
      (newMessage) => {
        console.log("💬 Received new chat message:", newMessage.message);
        addChatMessage(newMessage);
      }
    );

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up real-time subscriptions");
      if (codeChannelRef.current) {
        realtimeApi.unsubscribeChannel(codeChannelRef.current);
      }
      if (notesChannelRef.current) {
        realtimeApi.unsubscribeChannel(notesChannelRef.current);
      }
      if (statusChannelRef.current) {
        realtimeApi.unsubscribeChannel(statusChannelRef.current);
      }
      if (chatChannelRef.current) {
        realtimeApi.unsubscribeChannel(chatChannelRef.current);
      }
    };
  }, [
    currentSession,
    setCurrentSession,
    router,
    addChatMessage,
    setChatMessages,
  ]);

  // Timer effect - stop if no session
  useEffect(() => {
    if (!isTimerRunning || !currentSession) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer, currentSession]);

  // Auto-start timer when session starts
  useEffect(() => {
    if (currentSession) {
      // Reset timer to 25 minutes for new session
      const { resetTimer, startTimer: start } = useSessionStore.getState();
      resetTimer();
      start();
    }
  }, [currentSession?.id]); // Reset when session ID changes

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEndSession = async () => {
    setShowEndDialog(false);

    // Mark that current user ended the session (prevent showing alert to self)
    userEndedSessionRef.current = true;

    // End the session in database
    if (currentSession) {
      await sessionsApi.endSession(currentSession.id);
      // DON'T clear the session yet - feedback screen needs it
      // Session will be cleared after feedback submission or skip
    }

    // Navigate to feedback screen
    router.replace("/(app)/session/feedback");
  };

  // Store session ID in a ref to avoid recreating callbacks
  const sessionIdRef = useRef(currentSession?.id);
  useEffect(() => {
    sessionIdRef.current = currentSession?.id;
  }, [currentSession?.id]);

  // Handle code changes with debounce (sync to database)
  const handleCodeChange = useCallback(
    (newCode: string) => {
      console.log("🔧 handleCodeChange called, new length:", newCode.length);
      // Update local state immediately (keeps keyboard focused)
      setLocalCode(newCode);

      // Don't sync if this update came from partner
      if (isUpdatingFromPartnerRef.current) {
        console.log("   ↳ Skipping sync (partner update)");
        return;
      }

      // Debounce database update
      if (codeDebounceRef.current) {
        clearTimeout(codeDebounceRef.current);
      }

      codeDebounceRef.current = setTimeout(() => {
        const sessionId = sessionIdRef.current;
        if (sessionId) {
          console.log("💾 Syncing code to database");
          realtimeApi.updateSessionCode(sessionId, newCode);
        }
      }, 500); // 500ms debounce
    },
    [] // No dependencies - stable reference!
  );

  // Debug: Track when handleCodeChange changes
  useEffect(() => {
    console.log("🔄 handleCodeChange reference changed");
  }, [handleCodeChange]);

  // Handle notes changes with debounce (sync to database)
  const handleNotesChange = useCallback(
    (newNotes: string) => {
      // Update local state immediately (keeps keyboard focused)
      setLocalNotes(newNotes);

      // Don't sync if this update came from partner
      if (isUpdatingFromPartnerRef.current) {
        return;
      }

      // Debounce database update
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current);
      }

      notesDebounceRef.current = setTimeout(() => {
        const sessionId = sessionIdRef.current;
        if (sessionId) {
          console.log("💾 Syncing notes to database");
          realtimeApi.updateSessionNotes(sessionId, newNotes);
        }
      }, 500); // 500ms debounce
    },
    [] // No dependencies - stable reference!
  );

  // Handle sending chat messages
  const handleSendMessage = useCallback(async (message: string) => {
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      console.log("💬 Sending chat message:", message);
      const { error } = await realtimeApi.sendChatMessage(sessionId, message);
      if (error) {
        console.error("❌ Failed to send message:", error);
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    }
  }, []);

  // Use a custom renderScene instead of SceneMap to avoid recreation issues
  const renderScene = useCallback(
    ({ route }: { route: TabRoute }) => {
      switch (route.key) {
        case "question":
          return (
            <ScrollView
              style={sessionStyles.tabContent}
              contentContainerStyle={sessionStyles.scrollContent}
            >
              {currentSession?.question && (
                <SessionQuestion question={currentSession.question} />
              )}

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

        case "code":
          return (
            <View style={sessionStyles.tabContent}>
              <SessionCodeEditor
                code={localCode}
                onCodeChange={handleCodeChange}
              />
            </View>
          );

        case "notes":
          return (
            <ScrollView
              style={sessionStyles.tabContent}
              contentContainerStyle={sessionStyles.scrollContent}
            >
              <SessionNotes
                notes={localNotes}
                onNotesChange={handleNotesChange}
              />
            </ScrollView>
          );

        case "chat":
          return (
            <View style={sessionStyles.tabContent}>
              <SessionChat
                messages={chatMessages}
                currentUserId={user?.id || ""}
                onSendMessage={handleSendMessage}
              />
            </View>
          );

        default:
          return null;
      }
    },
    [
      currentSession?.question,
      isRecording,
      localCode,
      localNotes,
      chatMessages,
      user?.id,
      handleCodeChange,
      handleNotesChange,
      handleSendMessage,
    ]
  );

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

  const mainContent = (
    <View style={[sessionStyles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SessionHeader
        partnerName={currentSession?.partner_name || "Partner"}
        partnerAvatar={currentSession?.partner_avatar || ""}
        topicName={currentSession?.topic_name || "Topic"}
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

  // Conditional rendering: Show "No session" screen if currentSession is null
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
          <Button mode="contained" onPress={() => router.push("/(app)/home")}>
            Return Home
          </Button>
        </View>
      </View>
    );
  }

  return mainContent;
}
