import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    itemList: {
      flex: "1",
    },
    itemListItem: {
      height: "70px",
      cursor: "pointer",
    },
    itemListItemActive: {
      borderLeft: `${theme.palette.primary.main} solid 0.5rem`,
    },
    itemListItemLogo: {
      width: "2.4em",
      height: "2.2em",
    },
    itemListItemSkeleton: {
      margin: theme.spacing(0, 4),
    },
  }),
  { name: "AppSidebar" }
);
