import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerContent: {
    maxWidth: 672,
    marginHorizontal: "auto",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E7FF",
    marginBottom: 24,
  },
  contentContainer: {
    maxWidth: 672,
    marginHorizontal: "auto",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
