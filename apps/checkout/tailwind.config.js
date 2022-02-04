const theme = {
  colors: {
    text: {
      primary: "#394052",
      secondary: "#8A919F",
      tertiary: "#EEF1F7",
      error: "#B65757",
    },
    button: {
      primary: "#394052",
      secondary: "#FFFFFF",
      tertiary: "#DEE4EF",
      transparent: "transparent",
    },
    border: {
      primary: "#B9C1CF",
      active: "#394052",
      error: "#B65757",
    },
    tooltip: {
      primary: "#28234A",
    },
    snackbar: {
      error: "#FFE9EA",
      success: "#EDF9F0",
    },
  },
  fontFamily: {
    sans: ["Inter"],
  },
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    9: "36px",
    10: "40px",
  },
  fontWeight: {
    normal: 400,
    bold: 600,
  },
  fontSize: {
    xs: ["11px", "16px"],
    sm: ["12px", "21px"],
    base: ["14px", "21px"],
    lg: ["16px", "23px"],
    xl: ["32px", "46px"],
  },
  extend: {},
};

module.exports = {
  content: ["./src/**/*.tsx"],
  mode: "jit",
  theme: theme,
  plugins: [],
};
