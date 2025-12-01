import React, { memo } from "react";
import { View, TextInput } from "react-native";
import { Text } from "react-native-paper";
import styles from "../../styles/session/SessionNotesStyles";

interface SessionNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const SessionNotes = memo(function SessionNotes({
  notes,
  onNotesChange,
}: SessionNotesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Shared Notes</Text>
          <Text style={styles.syncIndicator}>🔄 Auto-syncing</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 These notes are shared with your partner in real-time
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
});

export default SessionNotes;
