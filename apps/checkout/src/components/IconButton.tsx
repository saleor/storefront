import { useButton } from "@react-aria/button";
import { useRef } from "react";
import { ButtonProps } from "./Button";

export const IconButton = (
  props: Omit<ButtonProps, "title"> & { ariaLabel: string }
) => {
  const { children, ariaLabel } = props;
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      className="outline-none focus:outline-none active:outline-none"
      aria-label={ariaLabel}
      ref={ref}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
