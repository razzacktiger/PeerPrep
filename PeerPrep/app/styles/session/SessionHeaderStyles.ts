import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  partnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  partnerDetails: {
    marginLeft: 12,
    flex: 1,
    minWidth: 0,
  },
  partnerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  partnerName: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  topicName: {
    fontSize: 12,
    color: "#BFDBFE",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timerText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mediaControls: {
    flexDirection: "row",
    gap: 8,
  },
  mediaButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  endButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
  },
  endButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
