import { StyleSheet } from "react-native";

export default StyleSheet.create({
  topicInfoCard: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  topicInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  topicValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
