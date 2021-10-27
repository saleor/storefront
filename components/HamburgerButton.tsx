import clsx from "clsx";

interface HamburgerButtonProps {
  onClick: (ev: any) => void;
  active?: boolean;
}
export const HamburgerButton: React.VFC<HamburgerButtonProps> = ({
  onClick,
  active,
}) => {
  return (
    <button
      onClick={(ev) => onClick(ev)}
      className={clsx(
        "flex-shrink-0 h-6 w-6 mt-4 ml-3 cursor-pointer",
        active && "bg-gray-100 rounded-md border-1 shadow-inner"
      )}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};
