import clsx from "clsx";
import { XIcon } from "lucide-react";
import { type HTMLAttributes } from "react";

type Props = {
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls">;

export const CloseButton = (props: Props) => {
	return (
		<button
			className={clsx(
				"menu-button flex h-14 w-14 flex-col items-center justify-center text-white transition-all duration-300 ease-in-out hover:rotate-90 hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={true}
			aria-label="Close menu"
			onClick={props.onClick}
		>
			<XIcon className="h-8 w-8 shrink-0" strokeWidth={2} aria-hidden />
		</button>
	);
};
