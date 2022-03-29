import { ButtonProps } from "./Button";

export const IconButton = (
  props: Omit<ButtonProps, "title"> & { ariaLabel: string }
) => {
  const { children, ariaLabel } = props;

  return (
    <button
      className="outline-none focus:outline-none active:outline-none"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
