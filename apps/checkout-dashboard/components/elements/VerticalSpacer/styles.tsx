import { makeStyles } from "@saleor/macaw-ui";
import { VerticalSpacerProps } from "./types";

export const useStyles = makeStyles(
  (theme) => ({
    container: ({ spacing }: VerticalSpacerProps) => ({
      height: theme.spacing(spacing),
    }),
  }),
  { name: "VerticalSpacer" }
);
