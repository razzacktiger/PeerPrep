/**
 * Utility function to get difficulty-specific colors
 * Returns background, text, and border colors for difficulty badges
 */
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" };
    case "Medium":
      return { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" };
    case "Hard":
      return { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" };
    default:
      return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
  }
};

export type DifficultyColors = ReturnType<typeof getDifficultyColor>;
