import { getQueryParams, QueryParams } from "@/checkout-storefront/lib/utils";
import { useEffect } from "react";

export const URL_CHANGED = "urlChangedEvent";

export type UrlChangeHandlerArgs = { queryParams: QueryParams };

export const useUrlChange = (onLocationChange: ({ queryParams }: UrlChangeHandlerArgs) => void) => {
  useEffect(() => {
    const handleChange = () => onLocationChange({ queryParams: getQueryParams() });

    window.addEventListener(URL_CHANGED, handleChange);

    return () => {
      window.removeEventListener(URL_CHANGED, handleChange);
    };
  }, []);
};
