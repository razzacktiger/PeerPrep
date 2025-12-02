import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
    gap: 6,
  },

  securityText: {
    fontSize: 12,
    color: "#92400E",
    flex: 1,
  },

  messagesContainer: {
    flex: 1,
  },

  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },

  messageWrapper: {
    marginBottom: 12,
    maxWidth: "80%",
  },

  ownMessageWrapper: {
    alignSelf: "flex-end",
  },

  partnerMessageWrapper: {
    alignSelf: "flex-start",
  },

  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  ownMessageBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },

  partnerMessageBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },

  ownMessageText: {
    color: "#FFFFFF",
  },

  partnerMessageText: {
    color: "#1F2937",
  },

  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },

  ownMessageTime: {
    color: "#DBEAFE",
    textAlign: "right",
  },

  partnerMessageTime: {
    color: "#9CA3AF",
    textAlign: "left",
  },

  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sendButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
});

