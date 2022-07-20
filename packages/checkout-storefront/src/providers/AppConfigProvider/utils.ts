import { BrandingColors } from "./types";
import hexToRgb from "hex-rgb";
import { kebabCase, reduce } from "lodash-es";

export const getParsedCssBody = (brandingColors: BrandingColors) => {
  const { errorColor, successColor } = brandingColors;

  const getRgbString = (hexColor: string) => {
    const { red, green, blue } = hexToRgb(hexColor);
    return `${red}, ${green}, ${blue}`;
  };

  /* we use this to style alerts from toastify lib */
  const alertColorsCSS = `
  --toastify-icon-color-error: ${errorColor};
  --toastify-icon-color-success: ${successColor};
  --toastify-color-error: rgba(${getRgbString(errorColor)}, 0.4);
  --toastify-color-success: rgba(${getRgbString(successColor)}, 0.4);
  `;

  const bodyCSS = reduce(
    brandingColors,
    (cssString, hexColor, varName) => {
      if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
        return cssString;
      }

      const parsedVarName = kebabCase(varName);
      const rgbColor = getRgbString(hexColor);

      const nextLineHex = `--${parsedVarName}: ${hexColor};`;
      const nextLineRGB = `--${parsedVarName}-rgb: ${rgbColor};`;

      return cssString.concat(nextLineHex, "\n", nextLineRGB, "\n");
    },
    ""
  );

  return `body {
    ${bodyCSS}
    ${alertColorsCSS}
  }`;
};
