import { type ButtonHTMLAttributes, type ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon: ReactNode;
	ariaLabel?: string;
}

export const IconButton = ({ icon, ariaLabel, ...rest }: IconButtonProps) => {
	return (
		<button
			aria-label={ariaLabel}
			type="button"
			className="block w-full appearance-none rounded-md transition-colors focus:outline-none focus:ring focus:ring-neutral-200 focus:ring-opacity-50 active:shadow-sm active:outline-none active:ring active:ring-neutral-200 active:ring-opacity-75"
			{...rest}
		>
			{icon}
		</button>
	);
};
