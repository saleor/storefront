export const getSvgSrc = (svg: typeof import("*.svg")) =>
  typeof svg === "string" ? svg : svg.src;
