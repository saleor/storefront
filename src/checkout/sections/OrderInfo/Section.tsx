import { type FC, type ReactNode } from "react";

interface SectionProps {
	children: ReactNode;
	title: string;
}

export const Section: FC<SectionProps> = ({ children, title }) => (
	<div className="mb-6">
		<p className="mb-2 font-bold text-white">
			{title}
		</p>
		<div className="text-neutral-200">{children}</div>
	</div>
);
