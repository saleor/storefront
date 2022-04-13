import { Classes } from "@lib/globalTypes";
import clsx from "clsx";
import { ButtonProps } from "./Button";

interface IconButtonProps extends Classes, Omit<ButtonProps, "title"> {
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  ariaLabel,
  className,
  onClick,
}) => (
  <button
    className={clsx("icon-button", className)}
    aria-label={ariaLabel}
    onClick={onClick}
  >
    {children}
  </button>
);
