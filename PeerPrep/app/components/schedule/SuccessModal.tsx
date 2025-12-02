import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/schedule/SuccessModalStyles";

interface SuccessModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function SuccessModal({ visible, onDismiss }: SuccessModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={onDismiss}
        >
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
            <TouchableOpacity 
              style={styles.button}
              onPress={onDismiss}
            >
              <Text style={styles.buttonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
