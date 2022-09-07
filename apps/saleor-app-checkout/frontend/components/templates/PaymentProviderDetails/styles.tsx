import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    settings: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(2),
    },
    settingsDescription: {
      color: theme.palette.text.hint,
    },
    skeleton: {
      width: "100%",
    },
    formLine: {
      width: "100%",
      display: "flex",
      gap: theme.spacing(2),
    },
  }),
  { name: "PaymentProviderDetails" }
);
