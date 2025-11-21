import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    maxWidth: 672,
    marginHorizontal: "auto",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  saveButton: {
    height: 36,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
  },
  saveButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
  },
  textInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    fontSize: 15,
    textAlignVertical: "top",
    minHeight: 300,
    color: "#111827",
  },
});
