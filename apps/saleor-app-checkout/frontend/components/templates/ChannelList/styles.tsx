import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    listItem: {
      height: "70px",
      cursor: "pointer",
    },
    listItemSkeleton: {
      margin: theme.spacing(0, 4),
    },
  }),
  { name: "ChannelList" }
);
