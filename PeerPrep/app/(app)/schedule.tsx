import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text, StatusBar } from "react-native";
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
import { TOPICS } from "../../lib/constants";
import styles from "../styles/scheduleStyles";

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const durations = ["30 minutes", "45 minutes", "60 minutes"];

  useEffect(() => {
    if (params.topicId) {
      setSelectedTopic(params.topicId as string);
    }
    if (params.difficulty) {
      setDifficulty(params.difficulty as string);
    }
  }, [params]);

  const handleSchedule = () => {
    if (!selectedTopic || !difficulty) {
      alert("Please select a topic and difficulty");
      return;
    }
    if (!time) {
      alert("Please select a time");
      return;
    }
    if (!duration) {
      alert("Please select a duration");
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.replace("/(app)/home");
    }, 2000);
  };

  const topicName = TOPICS.find((t) => t.id === selectedTopic)?.name || "";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <ScheduleHeader />

        <View style={styles.content}>
          {/* Session Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Session Details</Text>

            <Text style={styles.fieldLabel}>Topic</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedTopic}
                onValueChange={setSelectedTopic}
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
                selectedValue={difficulty}
                onValueChange={setDifficulty}
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
                selectedValue={duration}
                onValueChange={setDuration}
              >
                <Picker.Item label="Select duration" value="" />
                {durations.map((dur) => (
                  <Picker.Item key={dur} label={dur} value={dur} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Date Selection */}
          <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          {/* Time Selection */}
          <TimeSlotPicker selectedTime={time} onTimeSelect={setTime} />

          {/* Summary */}
          <SessionSummary
            topic={topicName}
            difficulty={difficulty}
            date={selectedDate}
            time={time}
            duration={duration}
          />

          {/* Schedule Button */}
          <TouchableOpacity
            onPress={handleSchedule}
            activeOpacity={0.8}
            style={{ marginTop: 8 }}
          >
            <LinearGradient
              colors={["#9333EA", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scheduleButton}
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#FFFFFF" />
                <Text style={styles.scheduleButtonText}>Schedule Session</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal visible={showSuccess} />
    </View>
  );
}