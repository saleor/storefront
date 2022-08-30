import React, { ReactNode } from "react";
import { useStyles } from "./styles";

const AppContainer: React.FC<{ children: ReactNode }> = (props) => {
  const classes = useStyles();

  return <div className={classes.root} {...props} />;
};
export default AppContainer;
