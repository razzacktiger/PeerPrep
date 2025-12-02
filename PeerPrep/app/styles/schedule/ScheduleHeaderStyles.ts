import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  content: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 2,
  },
});
