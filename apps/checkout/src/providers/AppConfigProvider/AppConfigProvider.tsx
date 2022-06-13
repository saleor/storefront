import { useFetch } from "@/checkout/hooks/useFetch";
import { createSafeContext } from "@/checkout/providers/createSafeContext";
import { getAppConfig } from "@/checkout/fetch";
import { PropsWithChildren, useEffect, useRef } from "react";
import { AppConfig, BrandingColors, BrandingColorsData } from "./types";
import { getParsedCssBody } from "./utils";
import { defaultAppColors, STYLE_ELEMENT_ID } from "./consts";
import { isEqual } from "lodash-es";
import { useDynamicAppConfig } from "@/checkout/hooks/useDynamicAppConfig";

interface AppConfigContextConsumerProps {
  config?: AppConfig | null;
  loading: boolean;
}

export const [useContext, Provider] =
  createSafeContext<AppConfigContextConsumerProps>();

export const AppConfigProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [{ data: storedAppConfig, loading }] = useFetch(getAppConfig);
  const dynamicAppConfig = useDynamicAppConfig<AppConfig>();
  const appConfig = dynamicAppConfig || storedAppConfig;
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
      appendStylingToBody(appConfig?.branding as BrandingColors);
    }

    stylingRef.current = appConfig?.branding;
  };

  const handleAppDefaultStylingSetup = () =>
    appendStylingToBody(defaultAppColors);

  useEffect(handleAppDefaultStylingSetup, []);

  useEffect(handleAppStylingUpdate, [appConfig]);

  return <Provider value={{ config: appConfig, loading }}>{children}</Provider>;
};
