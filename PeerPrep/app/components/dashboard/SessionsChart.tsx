import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import styles from "../../styles/dashboard/SessionsChartStyles";

const sessionsData = [
  { month: "Jan", sessions: 2 },
  { month: "Feb", sessions: 3 },
  { month: "Mar", sessions: 5 },
  { month: "Apr", sessions: 4 },
  { month: "May", sessions: 6 },
  { month: "Jun", sessions: 4 },
];

export default function SessionsChart() {
  const screenWidth = Dimensions.get("window").width - 64;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sessions Over Time</Text>
      <Text style={styles.subtitle}>Monthly practice sessions</Text>
      
      <LineChart
        data={{
          labels: sessionsData.map((d) => d.month),
          datasets: [{ data: sessionsData.map((d) => d.sessions) }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#6366F1",
            fill: "#6366F1",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#F0F0F0",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}
