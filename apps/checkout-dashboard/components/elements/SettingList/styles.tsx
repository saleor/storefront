import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      gap: "2rem",
      width: "100%",
    },
  }),
  { name: "SettingList" }
);
