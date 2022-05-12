import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    tabs: {
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "AppNavigation" }
);
