import { StyleSheet } from "react-native";

export default StyleSheet.create({
  searchContainer: {
    position: "relative",
    marginBottom: 24,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: 20,
    zIndex: 1,
  },
  searchInput: {
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
});
