import type { SVGProps } from "react";

export const CookieIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			{...props}
		>
			<path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3-3c0-.217.031-.444.099-.716a.999.999 0 0 0-1.067-1.236A9.956 9.956 0 0 0 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-.049-.003-.097-.007-.16a1.004 1.004 0 0 0-.395-.776zM8.5 6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3zm-2 8a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zm2.5-6.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0zm3.5 6.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z" />
		</svg>
	);
};
