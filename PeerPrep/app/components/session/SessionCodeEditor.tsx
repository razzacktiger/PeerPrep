import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "react-native-paper";
import styles from "../../styles/session/SessionCodeEditorStyles";

interface SessionCodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export default function SessionCodeEditor({
  code,
  onCodeChange,
}: SessionCodeEditorProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Code Editor (Shared)</Text>
      </View>

      {/* Editor */}
      <View style={styles.editorContainer}>
        <TextInput
          value={code}
          onChangeText={onCodeChange}
          multiline
          style={styles.textInput}
          placeholder="// Write your solution here..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.languageText}>JavaScript</Text>
      </View>
    </View>
  );
}
