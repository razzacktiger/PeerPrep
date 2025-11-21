import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/sessionStyles";

interface EndSessionDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export default function EndSessionDialog({
  visible,
  onDismiss,
  onConfirm,
}: EndSessionDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.dialogOverlay}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogHeader}>
              <View style={styles.dialogIcon}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color="#EF4444"
                />
              </View>
              <Text style={styles.dialogTitle}>End Session?</Text>
            </View>

            <Text style={styles.dialogMessage}>
              Are you sure you want to end this practice session? You'll be
              asked to provide feedback.
            </Text>

            <View style={styles.dialogButtons}>
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.dialogCancelButton}
                labelStyle={styles.dialogButtonLabel}
                textColor="#374151"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={onConfirm}
                style={styles.dialogConfirmButton}
                labelStyle={styles.dialogButtonLabel}
                buttonColor="#EF4444"
              >
                End Session
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
