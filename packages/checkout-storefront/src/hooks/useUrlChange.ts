import { getQueryVariables, QueryVariables } from "@/checkout-storefront/lib/utils";
import { useEffect } from "react";

export const URL_CHANGED = "urlChangedEvent";

export type UrlChangeHandlerArgs = { queryParams: QueryVariables };

export const useUrlChange = (onLocationChange: ({ queryParams }: UrlChangeHandlerArgs) => void) => {
  useEffect(() => {
    const handleChange = () => onLocationChange({ queryParams: getQueryVariables() });

    window.addEventListener(URL_CHANGED, handleChange);

    return () => {
      window.removeEventListener(URL_CHANGED, handleChange);
    };
  }, []);
};
