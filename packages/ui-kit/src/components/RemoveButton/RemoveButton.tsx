import { FC } from "react";
import clsx from "clsx";

import styles from "./RemoveButton.module.css";
import { Button, ButtonProps } from "../Button";
import { RemoveIcon } from "../icons";

export type RemoveButtonProps = Omit<ButtonProps, "label">;

export const RemoveButton: FC<RemoveButtonProps> = ({ className, ...rest }) => (
  <Button
    label={<RemoveIcon />}
    variant="secondary"
    className={clsx(styles["remove-button"], className)}
    {...rest}
  />
);
