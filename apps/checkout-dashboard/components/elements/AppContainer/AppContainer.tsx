import React from "react";
import { useStyles } from "./styles";

const AppContainer: React.FC = (props) => {
  const classes = useStyles();

  return <div className={classes.root} {...props} />;
};
export default AppContainer;
