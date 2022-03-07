import { ElementType } from "react";
import { useButton } from "@react-aria/button";
import { useRef } from "react";
import { AriaButtonProps } from "@react-types/button";

export const IconButton = (
  props: AriaButtonProps<ElementType<HTMLButtonElement>>
) => {
  const { children } = props;
  const ref = useRef<HTMLButtonElement | null>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      className="outline-none focus:outline-none active:outline-none"
      ref={ref}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
