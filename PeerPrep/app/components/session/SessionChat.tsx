import React, { memo, useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ChatMessage } from "../../../lib/api/realtime";
import styles from "../../styles/session/sessionChatStyles";

interface SessionChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
}

const SessionChat = memo(function SessionChat({
  messages,
  currentUserId,
  onSendMessage,
}: SessionChatProps) {
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <MaterialCommunityIcons
          name="shield-check-outline"
          size={14}
          color="#6B7280"
        />
        <Text style={styles.securityText}>
          Keep conversations focused on coding. Don't share personal info.
        </Text>
      </View>

      {/* Messages List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="chat-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start chatting with your partner!
            </Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === currentUserId;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isOwnMessage
                    ? styles.ownMessageWrapper
                    : styles.partnerMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isOwnMessage
                      ? styles.ownMessageBubble
                      : styles.partnerMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isOwnMessage
                        ? styles.ownMessageText
                        : styles.partnerMessageText,
                    ]}
                  >
                    {msg.message}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      isOwnMessage
                        ? styles.ownMessageTime
                        : styles.partnerMessageTime,
                    ]}
                  >
                    {formatTime(msg.created_at)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={inputText.trim() ? "#2563EB" : "#D1D5DB"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});

export default SessionChat;
