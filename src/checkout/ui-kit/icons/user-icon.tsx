import { type FC, type SVGProps } from "react";

/**
 * User/person icon for name input fields.
 */
export const UserIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.5}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		{...props}
	>
		<circle cx="12" cy="8" r="5" />
		<path d="M20 21a8 8 0 0 0-16 0" />
	</svg>
);
