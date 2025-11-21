import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyEasy: {
    backgroundColor: "#DCFCE7",
  },
  difficultyMedium: {
    backgroundColor: "#FEF3C7",
  },
  difficultyHard: {
    backgroundColor: "#FEE2E2",
  },
  difficultyTextEasy: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyTextMedium: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyTextHard: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 12,
  },
  exampleRow: {
    marginBottom: 8,
  },
  exampleLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  exampleValue: {
    fontSize: 14,
    color: "#111827",
    fontFamily: "monospace",
  },
  exampleExplanation: {
    fontSize: 14,
    color: "#374151",
  },
});
