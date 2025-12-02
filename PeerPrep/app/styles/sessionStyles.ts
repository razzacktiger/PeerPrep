import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 0,
  },
  tabIndicator: {
    backgroundColor: "#2563EB",
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "none",
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  recordingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recordingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recordingDotActive: {
    backgroundColor: "#EF4444",
  },
  recordingDotInactive: {
    backgroundColor: "#D1D5DB",
  },
  recordingText: {
    fontSize: 14,
    color: "#111827",
  },
  recordingButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  recordingButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialogCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    maxWidth: 400,
    width: "100%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  dialogIcon: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  dialogMessage: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  dialogButtons: {
    flexDirection: "row",
    gap: 12,
  },
  dialogCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
  },
  dialogConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
  },
  dialogButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
