import React, { useRef, useState, memo, useEffect } from "react";
import { View, TextInput } from "react-native";
import { Text } from "react-native-paper";
import styles from "../../styles/session/SessionCodeEditorStyles";

interface SessionCodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const SessionCodeEditor = memo(function SessionCodeEditor({
  code,
  onCodeChange,
}: SessionCodeEditorProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const renderCount = useRef(0);

  // Debug: Track renders
  useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 SessionCodeEditor render #${renderCount.current}`);
  });

  // Debug: Track mount/unmount
  useEffect(() => {
    console.log("✅ SessionCodeEditor MOUNTED");
    return () => {
      console.log(
        "❌ SessionCodeEditor UNMOUNTED - THIS SHOULD NOT HAPPEN WHILE TYPING!"
      );
    };
  }, []);

  // Debug: Track code prop changes
  useEffect(() => {
    console.log("📝 Code prop changed, length:", code.length);
  }, [code]);

  // Debug: Track focus changes
  useEffect(() => {
    console.log("👁️ Focus state:", isFocused);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Code Editor (Shared)</Text>
        {isFocused && <Text style={styles.syncIndicator}>🔄 Syncing</Text>}
      </View>

      {/* Editor */}
      <View style={styles.editorContainer}>
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(text) => {
            console.log("⌨️ User typed, new length:", text.length);
            onCodeChange(text);
          }}
          onFocus={() => {
            console.log("🎯 TextInput FOCUSED");
            setIsFocused(true);
          }}
          onBlur={() => {
            console.log("💨 TextInput BLURRED - WHY DID THIS HAPPEN?");
            setIsFocused(false);
          }}
          multiline
          style={styles.textInput}
          placeholder="// Write your solution here..."
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="default"
          textAlignVertical="top"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.languageText}>JavaScript</Text>
      </View>
    </View>
  );
});

export default SessionCodeEditor;
