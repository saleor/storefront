import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      width: "80px",
    },
    label: {
      width: "100%",
    },
    input: {
      padding: theme.spacing(0.25, 0.5),
      cursor: "pointer",
    },
    colorBox: {
      width: "60px",
      height: "30px",
      padding: 0,
      cursor: "pointer",
    },
  }),
  { name: "ColorInput" }
);
