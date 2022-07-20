import React from "react";
import { useStyles } from "./styles";
import { VerticalSpacerProps } from "./types";

const VerticalSpacer: React.FC<VerticalSpacerProps> = ({ spacing = 2 }) => {
  const classes = useStyles({ spacing });

  return <div className={classes.container} />;
};

export default VerticalSpacer;
