const getSpacing = (base /* number */, unit /* "px" | "rem" */, values /* number[] */) =>
  values.reduce((acc, value) => ({ ...acc, [value]: base * value + unit }), {});

const spacing = getSpacing(
  0.4,
  "rem",
  [
    0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 6.5, 7, 8, 10, 11, 12, 14, 16, 15, 18, 19, 21, 22, 28, 85,
    256, 350,
  ]
);

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.6rem",
        screens: {
          sm: "576px",
          md: "768px",
          lg: "992px",
          xl: "1200px",
          xxl: "1440px",

          "2xl": "1348px",
        },
      },
      colors: {
        brand: {
          DEFAULT: "#e76363",
        },
        main: {
          DEFAULT: "#394052",
          1: "rgba(57, 64, 82, 0.8)",
          2: "rgba(57, 64, 82, 0.6)",
          3: "rgba(57, 64, 82, 0.4)",
          4: "rgba(57, 64, 82, 0.15)",
          5: "rgba(57, 64, 82, 0.1)",
        },

        transparent: "transparent",
        black: "#22292f",
        "grey-darkest": "#3d4852",
        "grey-darker": "#606f7b",
        "grey-dark": "#8795a1",
        grey: "#b8c2cc",
        "grey-light": "#dae1e7",
        "grey-lighter": "#f1f5f8",
        "grey-lightest": "#f8fafc",
        white: "#ffffff",
        "blue-darker": "#0E1932",
        "blue-dark": "#1D2945",
        blue: "#2d374d",
        "blue-light": "#45526D",
        "blue-lighter": "#626E87",
        "pink-darker": "#A31E1E",
        "pink-dark": "#C63C3C",
        pink: "#e76363",
        "pink-light": "#FF9393",
        "pink-lighter": "#FFBCBC",
      },
      spacing: {
        px: "1px",
        ...spacing,
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      fontFamily: {
        sans: [
          "Muli",
          // "-apple-system",
          // "BlinkMacSystemFont",
          // "Segoe UI",
          // "Roboto",
          // "Helvetica Neue",
          "Arial",
          // "Noto Sans",
          "sans-serif",
        ],
        serif: [
          "Noto Serif",
          "Georgia",
          "Cambria",
          "Webdings",
          "Times New Roman",
          "Times",
          "serif",
        ],
        mono: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
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
      lineHeight: {
        none: 1,
        tight: 1.25,
        normal: 1.6,
        loose: 2,
      },

      borderRadius: {
        DEFAULT: "4px",
        full: "50%",
      },
      boxShadow: {
        "decorative-center": "0 32px 0 -16px #394052",
        decorative: "16px 16px 0 #394052",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // eslint-disable-line
    require("@tailwindcss/typography"), // eslint-disable-line
    require("@tailwindcss/aspect-ratio"), // eslint-disable-line
    require("tailwind-scrollbar-hide"), // eslint-disable-line
  ],
};
