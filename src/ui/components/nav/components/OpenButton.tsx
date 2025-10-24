import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { type HTMLAttributes } from "react";

type Props = {
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls" | "aria-expanded">;

export const OpenButton = (props: Props) => {
	return (
		<button
			className={clsx(
				"menu-button flex h-14 w-14 flex-col items-center justify-center text-white transition-colors duration-300 hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={props["aria-expanded"]}
			aria-label="Toggle menu"
			onClick={props.onClick}
		>
			<MenuIcon className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" strokeWidth={2} aria-hidden />
		</button>
	);
};
