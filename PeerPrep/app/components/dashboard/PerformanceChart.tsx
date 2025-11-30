import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import styles from "../../styles/dashboard/PerformanceChartStyles";

const performanceData = [
  { topic: "Arrays", score: 85 },
  { topic: "Strings", score: 78 },
  { topic: "Trees", score: 92 },
  { topic: "Graphs", score: 68 },
  { topic: "DP", score: 75 },
];

export default function PerformanceChart() {
  const screenWidth = Dimensions.get("window").width - 64;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance by Topic</Text>
      <Text style={styles.subtitle}>Average score per topic</Text>
      
      <BarChart
        data={{
          labels: performanceData.map((d) => d.topic),
          datasets: [{ data: performanceData.map((d) => d.score) }],
        }}
        width={screenWidth}
        height={220}
        yAxisLabel={""}
        yAxisSuffix={"%"}
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#F0F0F0",
          },
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />
    </View>
  );
}
