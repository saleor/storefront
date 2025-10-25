import clsx from "clsx";
import { type HTMLAttributes } from "react";

type Props = {
	isOpen: boolean;
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls" | "aria-expanded">;

export const AnimatedMenuButton = (props: Props) => {
	return (
		<button
			className={clsx(
				"menu-button relative z-[10000] flex h-14 w-14 flex-col items-center justify-center gap-[6px] text-white transition-colors duration-300 hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={props["aria-expanded"]}
			aria-label={props.isOpen ? "Close menu" : "Open menu"}
			onClick={props.onClick}
		>
			{/* Top bar */}
			<span
				className={clsx(
					"block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out",
					props.isOpen
						? "translate-y-[8px] rotate-45"
						: "translate-y-0 rotate-0"
				)}
			/>
			{/* Middle bar */}
			<span
				className={clsx(
					"block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out",
					props.isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
				)}
			/>
			{/* Bottom bar */}
			<span
				className={clsx(
					"block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out",
					props.isOpen
						? "-translate-y-[8px] -rotate-45"
						: "translate-y-0 rotate-0"
				)}
			/>
		</button>
	);
};
