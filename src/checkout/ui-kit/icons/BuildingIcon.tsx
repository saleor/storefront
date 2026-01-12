import { type FC, type SVGProps } from "react";

/**
 * Building icon for apartment/suite input fields.
 */
export const BuildingIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
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
		<rect x="4" y="2" width="16" height="20" rx="2" />
		<path d="M9 22v-4h6v4" />
		<path d="M8 6h.01" />
		<path d="M16 6h.01" />
		<path d="M12 6h.01" />
		<path d="M12 10h.01" />
		<path d="M12 14h.01" />
		<path d="M16 10h.01" />
		<path d="M16 14h.01" />
		<path d="M8 10h.01" />
		<path d="M8 14h.01" />
	</svg>
);
