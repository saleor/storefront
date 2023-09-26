import { FC, LabelHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Label.module.css";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label: FC<LabelProps> = ({ className, ...rest }) => (
  <label className={clsx(styles.label, className)} {...rest} />
);
