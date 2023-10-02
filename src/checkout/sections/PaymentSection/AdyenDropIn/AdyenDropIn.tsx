import AdyenCheckout from "@adyen/adyen-web";
import { type FC, useCallback, useEffect, useRef } from "react";

import { useLocale } from "@/checkout/hooks/useLocale";
import { createAdyenCheckoutConfig } from "@/checkout/sections/PaymentSection/AdyenDropIn/utils";
import {
	type AdyenDropinProps,
	useAdyenDropin,
} from "@/checkout/sections/PaymentSection/AdyenDropIn/useAdyenDropin";
import "@adyen/adyen-web/dist/adyen.css";
import { type Locale } from "@/checkout/lib/regions";
import { type AdyenGatewayInitializePayload } from "@/checkout/sections/PaymentSection/AdyenDropIn/types";

type AdyenCheckoutInstance = Awaited<ReturnType<typeof AdyenCheckout>>;

// fake function just to get the type because can't import it :(
const _hack = (adyenCheckout: AdyenCheckoutInstance) =>
	adyenCheckout.create("dropin").mount("#dropin-container");
type DropinElement = ReturnType<typeof _hack>;

export const AdyenDropIn: FC<AdyenDropinProps> = ({ config }) => {
	const { locale } = useLocale();
	const { onSubmit, onAdditionalDetails } = useAdyenDropin({ config });
	const dropinContainerElRef = useRef<HTMLDivElement>(null);
	const dropinComponentRef = useRef<DropinElement | null>(null);

	const createAdyenCheckoutInstance = useCallback(
		async (locale: Locale, container: HTMLDivElement, data: AdyenGatewayInitializePayload) => {
			const adyenCheckout = await AdyenCheckout(
				createAdyenCheckoutConfig({ ...data, locale, onSubmit, onAdditionalDetails }),
			);

			dropinComponentRef.current?.unmount();

			const dropin = adyenCheckout.create("dropin").mount(container);

			dropinComponentRef.current = dropin;
		},
		[onAdditionalDetails, onSubmit],
	);

	useEffect(() => {
		if (dropinContainerElRef.current && !dropinComponentRef.current) {
			void createAdyenCheckoutInstance(locale, dropinContainerElRef.current, config.data);
		}
	}, []);

	return <div ref={dropinContainerElRef} />;
};
