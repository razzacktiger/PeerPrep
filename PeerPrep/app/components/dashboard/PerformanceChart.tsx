import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import styles from "../../styles/dashboard/PerformanceChartStyles";

interface PerformanceData {
  topic: string;
  score: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const screenWidth = Dimensions.get("window").width - 64;

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Performance by Topic</Text>
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>📊</Text>
          <Text style={[styles.subtitle, { textAlign: 'center', paddingHorizontal: 16 }]}>
            Complete sessions and receive feedback to see performance metrics
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance by Topic</Text>
      <Text style={styles.subtitle}>Average score per topic</Text>
      
      <BarChart
        data={{
          labels: data.map((d) => d.topic),
          datasets: [{ data: data.map((d) => d.score) }],
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
