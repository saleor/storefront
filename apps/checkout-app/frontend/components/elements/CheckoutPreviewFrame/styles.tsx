import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    iframe: {
      width: "100%",
      border: "none",
    },
  }),
  { name: "CheckoutPreviewFrame" }
);
