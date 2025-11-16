import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  actionButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  actionButtonGradient: {
    padding: 24,
    borderRadius: 24,
  },
  actionButtonWhite: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    color: "#ffffff",
  },
  actionIconDark: {
    fontSize: 24,
    color: "#2563eb",
  },
  actionTextContainer: {
    alignItems: "flex-start",
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#bfdbfe",
  },
  actionTitleDark: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  actionSubtitleDark: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default styles;
