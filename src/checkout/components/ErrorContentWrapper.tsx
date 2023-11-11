import { type ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const ErrorContentWrapper = ({ children }: Props) => {
	return (
		<div className="mx-auto flex max-w-screen-sm flex-col items-center gap-y-4 bg-neutral-50 px-8 py-16 text-center">
			{children}
		</div>
	);
};
