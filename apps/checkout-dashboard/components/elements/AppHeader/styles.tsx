import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    header: {
      display: "flex",
      gap: "1rem",
    },
    title: {
      margin: 0,
      width: "100%",
    },
    backArrow: {
      fontSize: 30,
      transform: "rotate(180deg)",
    },
  }),
  { name: "AppHeader" }
);
