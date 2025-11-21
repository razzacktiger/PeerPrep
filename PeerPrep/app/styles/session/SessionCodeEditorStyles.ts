import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1F2937",
  },
  headerTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  editorContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 14,
    padding: 16,
    textAlignVertical: "top",
    color: "#111827",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  languageText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
