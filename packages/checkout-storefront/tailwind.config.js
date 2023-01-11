const getSpacing = (base /* number */, unit /* "px" | "rem" */, values /* number[] */) => {
  return values.reduce((acc, value) => {
    return { ...acc, [value]: base * value + unit };
  }, {});
};

const spacing = getSpacing(
  0.4,
  "rem",
  [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 20, 21, 22, 28, 30, 38, 40, 72,
    85, 90, 100, 160, 220, 256, 350,
  ]
);

const theme = {
  colors: {
    transparent: "transparent",
    skeleton: "rgba(var(--border-color-primary-rgb), 0.1)",
    background: {
      primary: "#FAFAFA",
      secondary: "#FFFFFF",
      tertiary: "#EEF1F7",
      error: "rgba(var(--error-color-rgb), 0.4)",
      success: "rgba(var(--success-color-rgb), 0.4)",
    },
    text: {
      primary: "var(--text-color)",
      secondary: "rgba(var(--text-color-rgb), 0.6)",
      tertiary: "rgba(var(--text-color-rgb), 0.4)",
      button: "var(--button-text-color)",
      error: "var(--error-color)",
      success: "var(--success-color)",
    },
    button: {
      primary: "var(--button-bg-color-primary)",
      secondary: "var(--button-bg-color-hover)",
      tertiary: "rgba(var(--button-bg-color-primary-rgb), 0.15)",
      quaternary: "rgba(var(--button-bg-color-primary-rgb), 0.10)",
    },
    border: {
      primary: "rgba(var(--border-color-primary-rgb), 0.4)",
      secondary: "rgba(var(--border-color-primary-rgb), 0.15)",
      active: "var(--border-color-primary)",
      error: "var(--error-color)",
    },
    tooltip: {
      primary: "#28234A",
    },
    snackbar: {
      error: "#FFE9EA",
      success: "#EDF9F0",
    },
  },
  spacing: {
    px: "1px",
    ...spacing,
  },
  extend: {
    minHeight: spacing,
    maxWidth: spacing,
    minWidth: spacing,
    top: spacing,
    borderWidth: spacing,
    zIndex: { 1000: 1000 },
    transitionDuration: { 1500: "1500ms", 400: "400ms" },
    transitionProperty: {
      top: "top",
    },
    borderRadius: {
      lg: "0.8rem",
      DEFAULT: "0.4rem",
    },
  },
};

module.exports = {
  content: ["./src/**/*.{tsx,ts,css}"],
  mode: "jit",
  theme: theme,
  plugins: [],
};
