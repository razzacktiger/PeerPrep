import { StyleSheet } from "react-native";

export default StyleSheet.create({
  progressSection: {
    width: "100%",
    marginBottom: 32,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  timerText: {
    fontSize: 16,
    color: "#6B7280",
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 6,
  },
});
