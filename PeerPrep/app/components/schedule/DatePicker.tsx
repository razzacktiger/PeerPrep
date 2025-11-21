import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import styles from "../../styles/schedule/DatePickerStyles";

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateSelect }: DatePickerProps) {
  const today = new Date().toISOString().split("T")[0];

  // Initialize with today's date if nothing is selected
  React.useEffect(() => {
    if (!selectedDate) {
      onDateSelect(today);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a Date</Text>
      <Calendar
        onDayPress={(day) => onDateSelect(day.dateString)}
        markedDates={{
          [selectedDate || today]: {
            selected: true,
            selectedColor: "#2563EB",
          },
        }}
        minDate={today}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: "#FFFFFF",
          calendarBackground: "#FFFFFF",
          textSectionTitleColor: "#6B7280",
          selectedDayBackgroundColor: "#2563EB",
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: "#2563EB",
          dayTextColor: "#111827",
          textDisabledColor: "#D1D5DB",
          dotColor: "#2563EB",
          selectedDotColor: "#FFFFFF",
          arrowColor: "#2563EB",
          monthTextColor: "#111827",
          indicatorColor: "#2563EB",
          textDayFontWeight: "400",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />
    </View>
  );
}
