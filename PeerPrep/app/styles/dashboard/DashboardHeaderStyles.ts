import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerContent: {
    maxWidth: 600,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 16,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 2,
  },
});
