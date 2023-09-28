import { SvgContainer, type SvgProps } from "./SvgContainer";

export const CheckIcon = (props: SvgProps) => (
	<SvgContainer size={20} fill="none" {...props}>
		<path d="M5 10L8 13L15 7" stroke="currentColor" strokeWidth="2" />
	</SvgContainer>
);
