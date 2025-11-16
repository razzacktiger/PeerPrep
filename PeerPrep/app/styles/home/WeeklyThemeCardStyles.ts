import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  themeCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  themeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  themeInfo: {
    flex: 1,
  },
  themeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  trendingIcon: {
    fontSize: 16,
  },
  themeBadgeText: {
    fontSize: 14,
    color: "#9333ea",
  },
  themeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  themeSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  themeProgress: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeProgressText: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "600",
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressBarBg: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
});

export default styles;
