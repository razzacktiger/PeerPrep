import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 44,
  },
  mainCard: {
    width: "100%",
    maxWidth: 448,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardContent: {
    paddingVertical: 32,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  statusSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  statusSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  cancelButton: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  cancelButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  retryButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
  },
  retryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
  },
  backButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
