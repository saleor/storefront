import { NoSsr } from "@material-ui/core";
import { Savebar, SavebarLabels, SavebarProps } from "@saleor/macaw-ui";
import React from "react";
import { useStyles } from "./styles";

interface AppSavebarProps extends Omit<SavebarProps, "labels"> {
  labels?: Partial<SavebarLabels>;
}

const AppSavebar: React.FC<AppSavebarProps> = ({ labels = {}, ...rest }) => {
  const defaultLabels: SavebarLabels = {
    cancel: "Back",
    confirm: "Save",
    delete: "Delete",
    error: "Error",
  };
  const componentLabels: SavebarLabels = {
    ...defaultLabels,
    ...labels,
  };
  const classes = useStyles();

  return (
    <NoSsr>
      <Savebar labels={componentLabels} className={classes.savebar} {...rest} />
    </NoSsr>
  );
};
export default AppSavebar;
