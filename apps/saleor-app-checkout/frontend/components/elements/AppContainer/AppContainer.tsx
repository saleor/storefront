import React, { PropsWithChildren } from "react";
import { useStyles } from "./styles";

const AppContainer: React.FC<PropsWithChildren<{}>> = (props) => {
  const classes = useStyles();

  return <div className={classes.root} {...props} />;
};
export default AppContainer;
