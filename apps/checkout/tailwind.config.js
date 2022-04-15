const getSpacing = (
  base /* number */,
  unit /* "px" | "rem" */,
  values /* number[] */
) => {
  return values.reduce((acc, value) => {
    return { ...acc, [value]: base * value + unit };
  }, {});
};

const spacing = getSpacing(
  0.4,
  "rem",
  [
    0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 14, 16, 18, 19, 20, 21, 22, 28, 85, 256,
    350,
  ]
);

const theme = {
  colors: {
    transparent: "transparent",
    skeleton: "#DEE4EF",
    background: {
      primary: "#FAFAFA",
      secondary: "#FFFFFF",
      tertiary: "#EEF1F7",
    },
    text: {
      primary: "var(--text-color)",
      secondary: "rgba(var(--text-color-rgb), 0.6)",
      tertiary: "rgba(var(--text-color-rgb), 0.4)",
      button: "var(--button-text-color)",
      error: "var(--error-color)",
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
  fontFamily: {
    sans: ["Inter"],
  },
  spacing: {
    px: "1px",
    ...spacing,
  },
  fontWeight: {
    normal: 400,
    regular: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: ["1.1rem", "1.6rem"],
    sm: ["1.2rem", "2.1rem"],
    base: ["1.4rem", "2.1rem"],
    md: ["1.6rem", "2.3rem"],
    lg: ["2.4rem", "3.2rem"],
    xl: ["3.2rem", "4.6rem"],
  },
  extend: {
    minHeight: spacing,
    maxWidth: spacing,
    minWidth: spacing,
    top: spacing,
    borderWidth: spacing,
  },
};

module.exports = {
  content: ["./src/**/*.tsx"],
  mode: "jit",
  theme: theme,
  plugins: [],
};
