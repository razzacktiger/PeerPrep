import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  arrowIcon: {
    fontSize: 20,
    color: "#9ca3af",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  activityItemPressed: {
    backgroundColor: "#f9fafb",
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0, // Allow content to shrink
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0, // Prevent icon from shrinking
  },
  activityIcon: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
    minWidth: 0, // Allow text to truncate if needed
  },
  activityTopic: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  activityMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activityDetails: {
    fontSize: 12,
    color: "#6b7280",
    flexShrink: 1,
  },
  activityDot: {
    fontSize: 12,
    color: "#6b7280",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
    marginLeft: 8,
    flexShrink: 0, // Prevent rating from shrinking
  },
  starFilled: {
    fontSize: 14,
    color: "#fbbf24",
  },
  starEmpty: {
    fontSize: 14,
    color: "#d1d5db",
  },
});

export default styles;
