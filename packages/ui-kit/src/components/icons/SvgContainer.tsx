import { SVGAttributes, ReactNode } from "react";

export type SvgProps = SVGAttributes<{}>;

export interface SvgContainerProps extends SvgProps {
  size?: number;
  children: ReactNode;
}

export const SvgContainer = ({ size, ...rest }: SvgContainerProps) => (
  <svg
    width={size}
    height={size}
    viewBox={size ? `0 0 ${size} ${size}` : undefined}
    xmlns='http://www.w3.org/2000/svg'
    {...rest}
  />
);
