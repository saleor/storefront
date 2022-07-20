import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    savebar: {
      position: "fixed",
      bottom: 0,
      width: "100%",
    },
  }),
  { name: "AppSavebar" }
);
