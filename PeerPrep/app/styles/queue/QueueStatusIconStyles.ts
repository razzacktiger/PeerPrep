import { StyleSheet } from "react-native";

export default StyleSheet.create({
  iconSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  searchingContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  pingCircle: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#60A5FA",
  },
  pingCircle1: {
    backgroundColor: "#60A5FA",
  },
  pingCircle2: {
    backgroundColor: "#93C5FD",
  },
  iconGradient: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  foundContainer: {
    alignItems: "center",
  },
});
