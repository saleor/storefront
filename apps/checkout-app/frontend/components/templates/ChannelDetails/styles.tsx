import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  (theme) => ({
    paymentOption: {
      "& .MuiAccordionDetails-root": {
        padding: 0,
        paddingTop: theme.spacing(1),
      },
      "&.Mui-expanded": {
        margin: 0,
        minHeight: 0,
      },
      "&:before": {
        display: "none",
      },
      background: "none",
      display: "",
      margin: 0,
      minHeight: 0,
      width: "100%",
    },
    paymentOptionExpander: {
      "&.MuiAccordionSummary-root.Mui-expanded": {
        minHeight: 0,
      },
      "&> .MuiAccordionSummary-content": {
        margin: 0,
        padding: `${theme.spacing(2)} 0`,
        borderBottom: "1px solid rgba(40, 35, 74, 0.1)",
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
      },
      margin: 0,
      minHeight: 0,
      padding: 0,
    },
    paymentOptionIcon: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      background: "#fff",
      marginRight: theme.spacing(2),
    },
    paymentOptionDetails: {
      "&> section": {
        width: "100%",
      },
    },
    paymentMethod: {
      height: "70px",
    },
  }),
  { name: "ChannelDetails" }
);
