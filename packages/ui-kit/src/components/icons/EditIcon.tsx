import { SvgContainer, SvgProps } from "./SvgContainer";

export const EditIcon = (props: SvgProps) => (
  <SvgContainer size={24} fill='none' {...props}>
    <path
      d='M14.1111 4.33333L3 15.4444V21H8.55556L19.6667 9.88889M14.1111 4.33333L17.4444 1L23 6.55556L19.6667 9.88889M14.1111 4.33333L19.6667 9.88889'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </SvgContainer>
);
