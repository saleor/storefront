import { FC, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./ChipButton.module.css";

export interface ChipButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

export const ChipButton: FC<ChipButtonProps> = ({
  label,
  active,
  className,
  ...rest
}) => (
  <button
    className={clsx(
      styles["chip-button"],
      {
        [styles["chip-button-active"]]: active,
      },
      className
    )}
    {...rest}>
    {label}
  </button>
);
