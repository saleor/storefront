import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
    },
    label: {
      width: "100%",
    },
    uploadField: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      width: "100%",
      border: `1px dashed ${theme.palette.grey[800]}`,
      borderRadius: theme.spacing(0.5),
      padding: theme.spacing(3),
    },
    uploadLabel: {
      width: "100%",
      textAlign: "center",
    },
    uploadSizeLabel: {
      color: theme.palette.grey[600],
    },
    uploadButton: {
      marginTop: theme.spacing(1),
    },
    input: {
      display: "none",
    },
    media: {
      height: "100%",
      objectFit: "contain",
      userSelect: "none",
      width: "100%",
    },
    mediaContainer: {
      "&:hover, &.dragged": {
        "& $mediaOverlay": {
          display: "block",
        },
      },
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.grey[400]}`,
      borderRadius: theme.spacing(),
      height: 148,
      overflow: "hidden",
      padding: theme.spacing(0.75),
      position: "relative",
      width: 148,
    },
    mediaOverlay: {
      background: "rgba(0, 0, 0, 0.2)",
      display: "none",
      height: 148,
      left: 0,
      position: "absolute",
      top: 0,
      width: 148,
    },
    mediaToolbar: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "2px",
    },
    mediaToolbarIcon: {
      "&:hover": {
        background: theme.palette.background.paper,
      },
    },
  }),
  { name: "FileInput" }
);
