import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  topSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  topicName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyEasy: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  difficultyMedium: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  difficultyHard: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  difficultyDefault: {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
  },
  questionsCount: {
    fontSize: 12,
    color: "#6B7280",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  practiceButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
  },
  practiceGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  scheduleButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  scheduleButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});
