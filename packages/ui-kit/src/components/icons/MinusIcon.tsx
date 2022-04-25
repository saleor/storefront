import { SvgContainer, SvgProps } from "./SvgContainer";

export const MinusIcon = (props: SvgProps) => (
  <SvgContainer size={24} fill='none' {...props}>
    <path d='M17 12L7 12' stroke='currentColor' strokeLinecap='round' />
  </SvgContainer>
);
