import clsx from "clsx";
import { HTMLAttributes } from "react";

import styles from "./Box.module.css";

export type BoxProps = HTMLAttributes<HTMLDivElement>

export function Box({ className, ...rest }: BoxProps) {
  return <div className={clsx(styles.box, className)} {...rest} />
}

export default Box;
