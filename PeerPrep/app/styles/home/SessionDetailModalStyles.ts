import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  ratingSection: {
    alignItems: "center",
    gap: 12,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  starFilled: {
    fontSize: 20,
    color: "#FBBF24",
  },
  starEmpty: {
    fontSize: 20,
    color: "#D1D5DB",
  },
  ratingValue: {
    fontSize: 14,
    color: "#6B7280",
  },
  sessionIdContainer: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  sessionIdLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  sessionIdValue: {
    fontSize: 11,
    color: "#D1D5DB",
    fontFamily: "monospace",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "500",
    textAlign: "center",
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  feedbackScores: {
    gap: 12,
  },
  scoreItem: {
    gap: 4,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  scoreBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  commentsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
  },
  commentsText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  aiScoreContainer: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  aiScoreLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  aiScoreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8B5CF6",
  },
  aiSection: {
    marginBottom: 12,
  },
  aiSectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  aiSectionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  aiListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  aiListBullet: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  aiListText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  notesSection: {
    gap: 8,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  notesBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  codeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  languageText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366F1",
    textTransform: "uppercase",
  },
  codeBox: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  codeText: {
    fontSize: 13,
    color: "#E5E7EB",
    fontFamily: "monospace",
    lineHeight: 18,
  },
  emptySection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default styles;
