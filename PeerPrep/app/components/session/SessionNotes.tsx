import React from "react";
import { View, TextInput } from "react-native";
import { Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/session/SessionNotesStyles";

interface SessionNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

export default function SessionNotes({
  notes,
  onNotesChange,
  onSave,
}: SessionNotesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Personal Notes</Text>
          <Button
            mode="outlined"
            onPress={onSave}
            style={styles.saveButton}
            labelStyle={styles.saveButtonLabel}
            icon={() => <MaterialCommunityIcons name="content-save" size={16} color="#374151" />}
          >
            Save
          </Button>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 These notes are private and not shared with your partner
          </Text>
        </View>

        <TextInput
          value={notes}
          onChangeText={onNotesChange}
          multiline
          style={styles.textInput}
          placeholder="Jot down your thoughts, approaches, or learnings..."
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
}
