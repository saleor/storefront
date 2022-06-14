import { BrandingColors } from "./types";
import hexToRgb from "hex-rgb";
import { kebabCase, reduce } from "lodash-es";

export const getParsedCssBody = (brandingColors: BrandingColors) => {
  const bodyCSS = reduce(
    brandingColors,
    (cssString, hexColor, varName) => {
      if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
        return cssString;
      }

      const parsedVarName = kebabCase(varName);
      const { red, green, blue } = hexToRgb(hexColor);
      const rgbColor = `${red}, ${green}, ${blue}`;

      const nextLineHex = `--${parsedVarName}: ${hexColor};`;
      const nextLineRGB = `--${parsedVarName}-rgb: ${rgbColor};`;

      return cssString.concat(nextLineHex, "\n", nextLineRGB, "\n");
    },
    ""
  );

  return `body {
    ${bodyCSS}
  }`;
};
