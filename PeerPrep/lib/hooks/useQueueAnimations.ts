import { useEffect, useRef } from "react";
import { Animated } from "react-native";

/**
 * Custom hook for managing queue screen animations
 * Handles ping animations for searching state and bounce animation for found state
 */
export const useQueueAnimations = (
  status: "searching" | "found" | "error"
) => {
  const pingAnim1 = useRef(new Animated.Value(0)).current;
  const pingAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Ping animation for searching state
    if (status === "searching") {
      const ping1 = Animated.loop(
        Animated.sequence([
          Animated.timing(pingAnim1, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pingAnim1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const ping2 = Animated.loop(
        Animated.sequence([
          Animated.delay(500),
          Animated.timing(pingAnim2, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pingAnim2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      ping1.start();
      ping2.start();

      return () => {
        ping1.stop();
        ping2.stop();
      };
    }

    // Bounce animation for found state
    if (status === "found") {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [status, pingAnim1, pingAnim2, bounceAnim]);

  return {
    pingAnim1,
    pingAnim2,
    bounceAnim,
  };
};
