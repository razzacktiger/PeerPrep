import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
  },
  value: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeEasy: {
    backgroundColor: "#D1FAE5",
  },
  badgeMedium: {
    backgroundColor: "#FEF3C7",
  },
  badgeHard: {
    backgroundColor: "#FEE2E2",
  },
  badgeDefault: {
    backgroundColor: "#F3F4F6",
  },
});
