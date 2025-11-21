import React from "react";
import { Modal, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/schedule/SuccessModalStyles";

interface SuccessModalProps {
  visible: boolean;
}

export default function SuccessModal({ visible }: SuccessModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={["#10B981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons name="check-circle" size={40} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.title}>Session Scheduled! 🎉</Text>
          <Text style={styles.message}>
            We'll match you with a partner and send you a notification before the session starts.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
