import { SvgContainer, SvgProps } from "./SvgContainer";

export const ChevronDownIcon = (props: SvgProps) => (
  <SvgContainer size={24} fill="none" {...props}>
    <path d="M8.5 10L12 14L15.5 10" stroke="currentColor" />
  </SvgContainer>
);
