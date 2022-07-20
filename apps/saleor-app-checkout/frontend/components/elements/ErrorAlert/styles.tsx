import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    root: {
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "ErrorAlert" }
);
