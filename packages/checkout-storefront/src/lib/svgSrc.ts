export const getSvgSrc = (svg: string | { src: string }) =>
  typeof svg === "string" ? svg : svg.src;
