import { StyleSheet } from "react-native";

export default StyleSheet.create({
  tipsCard: {
    width: "100%",
    maxWidth: 448,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    marginTop: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  tipsContent: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  tipText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
});
