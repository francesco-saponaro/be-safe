// Colors.js (or wherever your Colors constant is defined)

const tintColorLight = "#FF69B4"; // hot pink accent
const tintColorDark = "#FF69B4"; // using the same accent in dark mode

export const Colors = {
  light: {
    text: "#4A4A4A",
    background: "#FFF0F6", // very light pink background
    tint: tintColorLight,
    icon: "#FF85C1",
    tabIconDefault: "#FF85C1",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#FDEFF4",
    background: "#1A1A1A",
    tint: tintColorDark,
    icon: "#F7A8B8",
    tabIconDefault: "#F7A8B8",
    tabIconSelected: tintColorDark,
  },
};
