import { FC, ReactNode } from "react";
import clsx from "clsx";

import styles from "./Snackbar.module.css";
import { Text } from "../Text";
import { SuccessIcon, ErrorIcon } from "../icons";

export interface SnackbarProps {
  content: string;
  variant?: "success" | "error";
  className?: string;
}

const selectIcon = (
  variant: SnackbarProps["variant"]
): ReactNode | undefined => {
  switch (variant) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    default:
      return undefined;
  }
};

export const Snackbar: FC<SnackbarProps> = ({
  content,
  variant,
  className,
  ...rest
}) => {
  const icon = selectIcon(variant);

  return (
    <div
      className={clsx(
        styles.snackbar,
        styles[`snackbar-${variant}`],
        className
      )}
      {...rest}>
      {icon}
      <Text className={clsx({ [styles["snackbar-label-margin"]]: !!icon })}>
        {content}
      </Text>
    </div>
  );
};
