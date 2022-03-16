import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: "flex",
      gap: "2rem",
    },
    optionList: {
      flex: "1",
    },
    option: {
      "& .MuiAccordionDetails-root": {
        padding: 0,
        paddingTop: theme.spacing(1),
      },
      "&.Mui-expanded": {
        margin: theme.spacing(2, 0),
        minHeight: 0,
        "&:first-child": {
          margin: theme.spacing(2, 0),
        },
      },
      "&:before": {
        display: "none",
      },
      display: "",
      margin: theme.spacing(2, 0),
      minHeight: 0,
      width: "100%",
      borderRadius: 6,
    },
    optionExpander: {
      "&.MuiAccordionSummary-root": {
        padding: theme.spacing(0, 4),
        "&.Mui-expanded": {
          minHeight: 0,
        },
      },
      "&> .MuiAccordionSummary-content": {
        margin: 0,
        padding: theme.spacing(2, 0),
        display: "flex",
        alignItems: "center",
      },
      "&> .MuiAccordionSummary-expandIcon": {
        padding: 0,
        position: "absolute",
        right: theme.spacing(3),
      },
      "&> .MuiIconButton-root": {
        border: "none",
        background: "none",
        padding: theme.spacing(0, 2),
      },
      margin: 0,
      minHeight: 0,
    },
    optionDetails: {
      "&> section": {
        width: "100%",
      },
    },
    optionDetailsContent: {
      width: "100%",
      padding: theme.spacing(0, 4, 4, 4),
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(2),
    },
    design: {
      flex: "2",
    },
    designPreview: {
      background: "#fff",
      minHeight: "500px", // TEMPORARY VALUE
      boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.16)",
      margin: "1rem 0 0 0",
    },
  }),
  { name: "DesignDetails" }
);
