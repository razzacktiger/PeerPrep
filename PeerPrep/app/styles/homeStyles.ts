import { StyleSheet } from "react-native";

// This file is deprecated. Styles have been moved to component-specific files:
// - headerStyles.ts (header and stats)
// - themeStyles.ts (weekly theme card)
// - actionStyles.ts (quick actions)
// - sessionStyles.ts (upcoming sessions)
// - activityStyles.ts (recent activity)

const styles = StyleSheet.create({
  // Only keeping container styles used in home.tsx
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  mainContent: {
    paddingHorizontal: 16,
    marginTop: -80,
    paddingBottom: 32,
    gap: 16,
  },
});

export default styles;