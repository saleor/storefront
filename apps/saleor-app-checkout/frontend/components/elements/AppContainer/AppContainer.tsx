import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { useStyles } from "./styles";

const AppContainer: React.FC<{ children: ReactNode }> = (props) => {
  const classes = useStyles();
  const router = useRouter();

  if (router.pathname === "/checkout-spa") {
    return <div {...props} />;
  }

  return <div className={classes.root} {...props} />;
};
export default AppContainer;
