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
				"top-0 ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center md:hidden",
			)}
			aria-controls={props["aria-controls"]}
			aria-expanded={true}
			aria-label="Close menu"
			onClick={props.onClick}
		>
			<XIcon className="h-6 w-6 shrink-0" aria-hidden />
		</button>
	);
};
