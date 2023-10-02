import { useEffect } from "react";
import { getQueryParams, type QueryParams } from "@/checkout/lib/utils/url";

export const POPSTATE_EVENT = "popstate";

export type UrlChangeHandlerArgs = { queryParams: QueryParams };

export const useUrlChange = (onLocationChange: ({ queryParams }: UrlChangeHandlerArgs) => void) => {
	useEffect(() => {
		const handleChange = () => onLocationChange({ queryParams: getQueryParams() });

		window.addEventListener(POPSTATE_EVENT, handleChange);

		return () => {
			window.removeEventListener(POPSTATE_EVENT, handleChange);
		};
	}, [onLocationChange]);
};
