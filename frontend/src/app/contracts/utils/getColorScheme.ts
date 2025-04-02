/**
 * Utility function to get color scheme based on contract type
 */
export const getColorScheme = (contractType: string) => {
  switch (contractType) {
    case "issue":
      return {
        bg: "bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700",
        text: "text-white",
        borderLight: "border-indigo-200/50 dark:border-indigo-700/40",
        iconFill: "fill-indigo-500 dark:fill-indigo-400",
        cardBorder: "border-indigo-200/50 dark:border-indigo-700/40",
        cardBg: "bg-indigo-50/50 dark:bg-indigo-900/20",
        cardHoverBorder: "border-indigo-300 dark:border-indigo-600",
        barFill: "bg-indigo-500 dark:bg-indigo-600",
      };
    case "card":
      return {
        bg: "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800",
        text: "text-white",
        borderLight: "border-emerald-200/50 dark:border-emerald-700/40",
        iconFill: "fill-emerald-500 dark:fill-emerald-400",
        cardBorder: "border-emerald-200/50 dark:border-emerald-700/40",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-900/20",
        cardHoverBorder: "border-emerald-300 dark:border-emerald-600",
        barFill: "bg-emerald-500 dark:bg-emerald-600",
      };
    case "liability":
    default:
      return {
        bg: "bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-800",
        text: "text-white",
        borderLight: "border-blue-200/50 dark:border-blue-700/40",
        iconFill: "fill-blue-500 dark:fill-blue-400",
        cardBorder: "border-blue-200/50 dark:border-blue-700/40",
        cardBg: "bg-blue-50/50 dark:bg-blue-900/20",
        cardHoverBorder: "border-blue-300 dark:border-blue-600",
        barFill: "bg-blue-500 dark:bg-blue-600",
      };
  }
};
