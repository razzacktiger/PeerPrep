import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/schedule/TimeSlotPickerStyles";

interface TimeSlotPickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

export default function TimeSlotPicker({ selectedTime, onTimeSelect }: TimeSlotPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Time</Text>
      <View style={styles.grid}>
        {timeSlots.map((slot) => {
          const isSelected = selectedTime === slot;
          return isSelected ? (
            <LinearGradient
              key={slot}
              colors={["#2563EB", "#4F46E5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.timeSlot, styles.timeSlotSelected]}
            >
              <TouchableOpacity
                onPress={() => onTimeSelect(slot)}
                activeOpacity={0.7}
                style={{ width: "100%", alignItems: "center" }}
              >
                <Text style={[styles.timeSlotText, styles.timeSlotTextSelected]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              key={slot}
              onPress={() => onTimeSelect(slot)}
              activeOpacity={0.7}
              style={styles.timeSlot}
            >
              <Text style={styles.timeSlotText}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
