import { FC, ReactNode, MouseEvent } from "react";
import clsx from "clsx";

import styles from "./Chip.module.css";
import { ButtonLabel } from "../Button/Button";
import { RemoveIcon } from "../icons";
import { ClassNames } from "@lib/globalTypes";

export interface ChipProps {
  icon?: ReactNode;
  label: string;
  classNames?: ClassNames<"container" | "label" | "button">;
  onClick: (e?: MouseEvent) => void;
}

export const Chip: FC<ChipProps> = ({ label, icon, classNames, onClick, ...rest }) => (
  <div className={clsx(styles.chip, classNames?.container)} {...rest}>
    {icon}
    <ButtonLabel
      content={label}
      className={clsx({ [styles["chip-label-margin"]]: !!icon }, classNames?.label)}
    />
    <button className={clsx(styles["chip-button"], classNames?.button)} onClick={onClick}>
      <RemoveIcon />
    </button>
  </div>
);
