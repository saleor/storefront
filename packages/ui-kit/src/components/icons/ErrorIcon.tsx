import { SvgContainer, SvgProps } from "./SvgContainer";

export const ErrorIcon = (props: SvgProps) => (
  <SvgContainer size={24} fill='none' color='#B65757' {...props}>
    <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='2' />
    <path
      d='M15.5355 8.46446L8.46447 15.5355'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M15.5355 15.5355L8.46447 8.46447'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </SvgContainer>
);
