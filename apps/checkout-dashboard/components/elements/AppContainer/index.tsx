import classNames from "classnames";
import React from "react";
import { useStyles } from "./styles";

export const AppContainer: React.FC = (props) => {
  const classes = useStyles();

  return <div className={classes.root} {...props} />;
};
export default AppContainer;
