import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    header: {
      display: "flex",
      gap: "1rem",
      marginBottom: theme.spacing(2),
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
