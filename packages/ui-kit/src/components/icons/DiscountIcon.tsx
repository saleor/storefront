import { SvgContainer, SvgProps } from "./SvgContainer";

export const DiscountIcon = (props: SvgProps) => (
  <SvgContainer size={24} fill="none" {...props}>
    <path
      d="M5.5 7.5C5.5 8.32843 6.17157 9 7 9C7.82843 9 8.5 8.32843 8.5 7.5C8.5 6.67157 7.82843 6 7 6C6.17157 6 5.5 6.67157 5.5 7.5Z"
      fill="currentColor"
    />
    <path
      d="M2.5 3H10.5L21.5 14L13.5 22L2.5 11V3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgContainer>
);
