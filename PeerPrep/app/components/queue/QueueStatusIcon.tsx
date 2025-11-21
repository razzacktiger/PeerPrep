import React from "react";
import { View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/queue/QueueStatusIconStyles";

interface QueueStatusIconProps {
  status: "searching" | "found" | "error";
  pingAnim1: Animated.Value;
  pingAnim2: Animated.Value;
  bounceAnim: Animated.Value;
}

export default function QueueStatusIcon({
  status,
  pingAnim1,
  pingAnim2,
  bounceAnim,
}: QueueStatusIconProps) {
  return (
    <View style={styles.iconSection}>
      {status === "searching" && (
        <View style={styles.searchingContainer}>
          {/* Ping animations */}
          <Animated.View
            style={[
              styles.pingCircle,
              styles.pingCircle1,
              {
                opacity: pingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.75, 0],
                }),
                transform: [
                  {
                    scale: pingAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2.5],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pingCircle,
              styles.pingCircle2,
              {
                opacity: pingAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 0],
                }),
                transform: [
                  {
                    scale: pingAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2],
                    }),
                  },
                ],
              },
            ]}
          />
          <LinearGradient
            colors={["#2563EB", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <MaterialCommunityIcons
              name="account-multiple"
              size={64}
              color="#FFFFFF"
            />
          </LinearGradient>
        </View>
      )}

      {status === "found" && (
        <Animated.View
          style={[
            styles.foundContainer,
            {
              transform: [
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <MaterialCommunityIcons
              name="account-multiple"
              size={64}
              color="#FFFFFF"
            />
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}
