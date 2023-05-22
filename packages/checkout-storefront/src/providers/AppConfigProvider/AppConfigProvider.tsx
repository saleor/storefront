import { useFetch } from "@/checkout-storefront/hooks/useFetch";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { getAppConfig } from "@/checkout-storefront/fetch";
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import type { AppConfig, AppEnv, BrandingColors, BrandingColorsData } from "./types";
import { getParsedCssBody } from "./utils";
import { defaultAppColors, STYLE_ELEMENT_ID } from "./consts";
import { isEqual } from "lodash-es";
import { useDynamicAppConfig } from "@/checkout-storefront/hooks/useDynamicAppConfig";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
interface AppConfigContextConsumerProps {
  config?: AppConfig | null;
  loading: boolean;
  env: AppEnv;
  saleorApiUrl: string;
}

const [useAppConfig, Provider] = createSafeContext<AppConfigContextConsumerProps>();
export { useAppConfig };

export const AppConfigProvider: React.FC<PropsWithChildren<{ env: AppEnv }>> = ({
  children,
  env,
}) => {
  const { saleorApiUrl } = getQueryParams();
  const [{ data: storedAppConfig, loading }] = useFetch(getAppConfig, {
    args: { checkoutApiUrl: env.checkoutApiUrl, saleorApiUrl },
  });
  const dynamicAppConfig = useDynamicAppConfig<AppConfig>({
    checkoutAppUrl: env.checkoutAppUrl,
  });
  const appConfig = dynamicAppConfig || storedAppConfig;
  const stylingRef = useRef(appConfig?.branding);

  const fulfillStyling = (brandingColors: BrandingColorsData): BrandingColors => ({
    ...defaultAppColors,
    ...brandingColors,
  });

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

  const appendStylingToBody = useCallback((brandingColors: BrandingColorsData) => {
    const css = getParsedCssBody(fulfillStyling(brandingColors));

    const styleEl = getOrCreateStyleEl();
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }, []);

  const handleAppStylingUpdate = () => {
    const hasStylingConfigChanged = !isEqual(appConfig?.branding, stylingRef.current);

    if (hasStylingConfigChanged) {
      appendStylingToBody(appConfig?.branding as BrandingColors);
    }

    stylingRef.current = appConfig?.branding;
  };

  const handleAppDefaultStylingSetup = () => appendStylingToBody(defaultAppColors);

  useEffect(handleAppDefaultStylingSetup, [appendStylingToBody]);

  useEffect(handleAppStylingUpdate, [appConfig, appendStylingToBody]);

  const value = useMemo(() => {
    return { config: appConfig, env, loading, saleorApiUrl };
  }, [appConfig, env, loading, saleorApiUrl]);

  if (!saleorApiUrl) {
    console.warn(`Missing saleorApiUrl query param`);
    return null;
  }

  return <Provider value={value}>{children}</Provider>;
};
