import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text, StatusBar, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScheduleHeader from "../components/schedule/ScheduleHeader";
import DatePicker from "../components/schedule/DatePicker";
import TimeSlotPicker from "../components/schedule/TimeSlotPicker";
import SessionSummary from "../components/schedule/SessionSummary";
import SuccessModal from "../components/schedule/SuccessModal";
import { useScheduleSession } from "../../lib/hooks";
import { TOPICS } from "../../lib/constants";
import styles from "../styles/scheduleStyles";

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Use the schedule hook
  const {
    formState,
    updateField,
    isSubmitting,
    error,
    success,
    scheduleSession,
    getValidationError,
  } = useScheduleSession();

  const durations = ["30 minutes", "45 minutes", "60 minutes"];

  useEffect(() => {
    if (params.topicId) {
      updateField("topicId", params.topicId as string);
    }
    if (params.difficulty) {
      updateField("difficulty", params.difficulty as string);
    }
  }, [params, updateField]);

  const handleSchedule = async () => {
    console.log("📅 Schedule button pressed...");
    
    // Validate form
    const validationError = getValidationError();
    if (validationError) {
      Alert.alert("Validation Error", validationError);
      return;
    }

    // Submit to API
    await scheduleSession();
  };

  // Handle success redirect
  useEffect(() => {
    if (success) {
      console.log("🎉 Session scheduled successfully!");
      setShowSuccess(true);
    }
  }, [success]);

  const handleSuccessDismiss = () => {
    console.log("🏠 Redirecting to home...");
    setShowSuccess(false);
    router.replace("/(app)/home");
  };

  const topicName = TOPICS.find((t) => t.id === formState.topicId)?.name || "";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <ScheduleHeader />

        <View style={styles.content}>
          {/* Error Message */}
          {error && (
            <View
              style={{
                backgroundColor: "#FEE2E2",
                borderRadius: 8,
                padding: 12,
                marginHorizontal: 16,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: "#DC2626",
              }}
            >
              <Text style={{ color: "#991B1B", fontSize: 14 }}>{error}</Text>
            </View>
          )}

          {/* Session Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Session Details</Text>

            <Text style={styles.fieldLabel}>Topic</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formState.topicId}
                onValueChange={(value) => updateField("topicId", value)}
              >
                <Picker.Item label="Select a topic" value="" />
                {TOPICS.map((topic) => (
                  <Picker.Item key={topic.id} label={`${topic.icon} ${topic.name}`} value={topic.id} />
                ))}
              </Picker>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Difficulty Level</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formState.difficulty}
                onValueChange={(value) => updateField("difficulty", value)}
              >
                <Picker.Item label="Select difficulty" value="" />
                <Picker.Item label="Easy" value="Easy" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Hard" value="Hard" />
              </Picker>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Duration</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formState.duration}
                onValueChange={(value) => updateField("duration", value)}
              >
                <Picker.Item label="Select duration" value="" />
                {durations.map((dur) => (
                  <Picker.Item key={dur} label={dur} value={dur} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Date Selection */}
          <DatePicker selectedDate={formState.date} onDateSelect={(date) => updateField("date", date)} />

          {/* Time Selection */}
          <TimeSlotPicker selectedTime={formState.time} onTimeSelect={(time) => updateField("time", time)} />

          {/* Summary */}
          <SessionSummary
            topic={topicName}
            difficulty={formState.difficulty}
            date={formState.date}
            time={formState.time}
            duration={formState.duration}
          />

          {/* Schedule Button */}
          <TouchableOpacity
            onPress={handleSchedule}
            disabled={isSubmitting}
            activeOpacity={0.8}
            style={{ marginTop: 8, opacity: isSubmitting ? 0.6 : 1 }}
          >
            <LinearGradient
              colors={["#9333EA", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scheduleButton}
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#FFFFFF" />
                <Text style={styles.scheduleButtonText}>
                  {isSubmitting ? "Scheduling..." : "Schedule Session"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal visible={showSuccess} onDismiss={handleSuccessDismiss} />
    </View>
  );
}