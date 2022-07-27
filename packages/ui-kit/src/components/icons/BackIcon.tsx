import { SvgContainer, SvgProps } from "./SvgContainer";

export const BackIcon = (props: SvgProps) => (
  <SvgContainer size={24} fill="none" {...props}>
    <path d="M9.5 8L5 12M5 12L9.5 16M5 12L19 12" stroke="currentColor" />
  </SvgContainer>
);
