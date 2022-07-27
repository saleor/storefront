import { FC, HTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Text.module.css";

export interface TextProps extends HTMLAttributes<{}> {
  as?: keyof JSX.IntrinsicElements;
  size?: "xs" | "sm" | "md" | "base" | "lg" | "xl";
  color?: "secondary" | "tertiary" | "error" | "success";
  weight?: "normal" | "regular" | "semibold" | "bold";
}

export const Text: FC<TextProps> = ({
  as = "p",
  size = "base",
  color,
  weight,
  className,
  ...rest
}) => {
  const classes = clsx(
    {
      [styles["txt-primary"]]: !color,
      [styles["txt-secondary"]]: color === "secondary",
      [styles["txt-tertiary"]]: color === "tertiary",
      [styles["txt-error"]]: color === "error",
      [styles["txt-success"]]: color === "error",
      [styles["txt-xs"]]: size === "xs",
      [styles["txt-sm"]]: size === "sm",
      [styles["txt-md"]]: size === "md",
      [styles["txt-base"]]: size === "base",
      [styles["txt-lg"]]: size === "lg",
      [styles["txt-xl"]]: size === "xl",
      [styles["txt-bold"]]: weight === "bold",
      [styles["txt-semibold"]]: weight === "semibold",
      [styles["txt-regular"]]: weight === "regular",
    },
    className
  );

  const CustomTag = as;

  return <CustomTag className={classes} {...rest} />;
};
