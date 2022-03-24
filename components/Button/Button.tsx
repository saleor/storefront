import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";

const styles = `bg-blue-100 border border-blue-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium hover:bg-blue-200`;

export interface ButtonProps
  extends Pick<HTMLAttributes<{}>, "className" | "onClick" | "children"> {}

export const Button = ({ className, ...rest }: ButtonProps) => (
  <button className={clsx(styles, className)} {...rest} />
);
