import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import { type HTMLAttributes } from "react";

type Props = {
	onClick: () => void;
} & Pick<HTMLAttributes<HTMLButtonElement>, "aria-controls">;

export const OpenButton = (props: Props) => {
	return (
		<button
			className={clsx(
				"flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center md:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={false}
			aria-label="Open menu"
			onClick={props.onClick}
		>
			<MenuIcon className="h-6 w-6 shrink-0" aria-hidden />
		</button>
	);
};
