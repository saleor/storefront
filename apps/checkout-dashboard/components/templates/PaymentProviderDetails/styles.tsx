import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    settings: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(2),
    },
  }),
  { name: "PaymentProviderDetails" }
);
