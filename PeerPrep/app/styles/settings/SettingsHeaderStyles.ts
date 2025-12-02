import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
  titleContainer: {
    flex: 1,
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
