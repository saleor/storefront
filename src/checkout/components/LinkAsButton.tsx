import { type ReactNode, type AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
	children: ReactNode;
	href: string;
	variant?: "primary" | "secondary" | "tertiary";
};

export const LinkAsButton = ({ children, href, variant = "primary" }: Props) => {
	const classes = clsx(
		"inline-flex h-10 items-center justify-center whitespace-nowrap rounded border active:outline-none font-bold",
		{
			"bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-700 text-white px-4 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700":
				variant === "primary",
			"border-neutral-600 hover:border-neutral-700 hover:bg-neutral-300 active:bg-neutral-300 disabled:border-neutral-300 aria-disabled:border-neutral-300 bg-transparent disabled:bg-transparent aria-disabled:bg-transparent px-4":
				variant === "secondary",
			"h-auto border-none bg-transparent p-0": variant === "tertiary",
		},
	);

	return (
		<a href={href} className={classes}>
			{children}
		</a>
	);
};
