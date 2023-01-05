import { FC, ReactNode } from "react";
import clsx from "clsx";

import styles from "./IconButton.module.css";
import { Button, ButtonProps, ButtonLabel } from "../Button/Button";
import { HorizontalAlignment } from "@lib/globalTypes";

export interface IconButtonProps
  extends Omit<ButtonProps, "variant" | "label">,
    Partial<Pick<ButtonProps, "label">> {
  icon: ReactNode;
  alignment?: HorizontalAlignment;
  variant?: "bare";
}

export const IconButton: FC<IconButtonProps> = ({
  label,
  icon,
  className,
  variant,
  alignment = "left",
  ...rest
}) => {
  if (variant === "bare") {
    return (
      <button type="button" className={clsx(styles["bare-icon-button"], className)} {...rest}>
        {icon}
      </button>
    );
  }

  return (
    <Button
      label={
        <>
          {icon}
          {typeof label === "string" && (
            <ButtonLabel
              className={
                styles[alignment === "right" ? "icon-button-label-reverse" : "icon-button-label"]
              }
              content={label}
            />
          )}
        </>
      }
      variant="secondary"
      className={clsx(
        styles["icon-button"],
        {
          [styles["icon-button-reverse"]]: alignment === "right",
          [styles["icon-button-nolabel"]]: !label,
        },
        className
      )}
      {...rest}
    />
  );
};
