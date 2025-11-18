import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 128,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerContent: {
    maxWidth: 600,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: "#4ade80",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  welcomeText: {
    fontSize: 14,
    color: "#bfdbfe",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#bfdbfe",
  },
});

export default styles;
