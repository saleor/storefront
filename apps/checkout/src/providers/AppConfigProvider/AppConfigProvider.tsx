import { useFetch } from "@/hooks/useFetch";
import createSafeContext from "@/providers/createSafeContext";
import { getAppConfig } from "@/fetch";
import { PropsWithChildren, useEffect, useRef } from "react";
import { AppConfig, BrandingColors, BrandingColorsData } from "./types";
import isEqual from "lodash/isEqual";
import { getParsedCssBody } from "./utils";
import { defaultAppColors, STYLE_ELEMENT_ID } from "./consts";

interface AppConfigContextConsumerProps {
  config?: AppConfig | null;
  loading: boolean;
}

export const [useContext, Provider] =
  createSafeContext<AppConfigContextConsumerProps>();

export const AppConfigProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [{ data: appConfig, loading }] = useFetch(getAppConfig);
  const stylingRef = useRef(appConfig?.branding);

  const fulfillStyling = (
    brandingColors: BrandingColorsData
  ): BrandingColors => ({ ...defaultAppColors, ...brandingColors });

  const getOrCreateStyleEl = () => {
    const existingStyleElement = document.getElementById(STYLE_ELEMENT_ID);

    if (existingStyleElement) {
      existingStyleElement.innerHTML = "";
      return existingStyleElement;
    }

    const styleEl = document.createElement("style");
    styleEl.setAttribute("id", STYLE_ELEMENT_ID);

    return styleEl;
  };

  const appendStylingToBody = (brandingColors: BrandingColorsData) => {
    const css = getParsedCssBody(fulfillStyling(brandingColors));

    const styleEl = getOrCreateStyleEl();
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  };

  const handleAppStylingUpdate = () => {
    const hasStylingConfigChanged = !isEqual(
      appConfig?.branding,
      stylingRef.current
    );

    if (hasStylingConfigChanged) {
      // appendStylingToBody({
      //   // TMP this is not the obj passes from the dashboard app
      //   // because the names of the props don't match just yet and
      //   // colors are for preview purposes
      //   buttonBgColorPrimary: "#FF7C7C",
      //   textColor: "#FF85BA",
      //   borderColorPrimary: "#9D39FF",
      // });
    }

    stylingRef.current = appConfig?.branding;
  };

  const handleAppDefaultStylingSetup = () =>
    appendStylingToBody(defaultAppColors);

  useEffect(handleAppDefaultStylingSetup, []);

  useEffect(handleAppStylingUpdate, [appConfig]);

  return <Provider value={{ config: appConfig, loading }}>{children}</Provider>;
};
