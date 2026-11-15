import { useCallback, useEffect, useRef, useState } from "react";

import { calculateDeliveryOptions } from "@/app/(checkout)/actions";
import { hasStaleDeliveryProblem } from "@/checkout/lib/delivery-problems";
import type { DeliveryOption, ServerCheckout } from "@/checkout/lib/checkout-types";
import { shippingDeliveriesCacheKey } from "@/checkout/lib/shipping-deliveries";

export function useShippingDeliveries(checkout: ServerCheckout | null, isActive: boolean) {
	const [deliveries, setDeliveries] = useState<DeliveryOption[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	// Saleor could not be asked: not the same as "no method for this address".
	const [loadFailed, setLoadFailed] = useState(false);
	const loadedKeyRef = useRef<string | null>(null);
	const prevStaleRef = useRef(false);

	const isStale = hasStaleDeliveryProblem(checkout);

	const loadDeliveries = useCallback(
		async (force = false) => {
			if (!checkout) return;
			const key = shippingDeliveriesCacheKey(checkout);
			if (!key) return;
			if (!force && loadedKeyRef.current === key) return;

			setIsLoading(true);
			try {
				const result = await calculateDeliveryOptions(checkout.id);
				setDeliveries(result.ok ? result.deliveries : []);
				setLoadFailed(!result.ok);
				loadedKeyRef.current = key;
			} catch {
				setDeliveries([]);
				setLoadFailed(true);
				loadedKeyRef.current = key;
			} finally {
				setIsLoading(false);
			}
		},
		[checkout],
	);

	useEffect(() => {
		if (!isActive) return;
		void loadDeliveries();
	}, [isActive, loadDeliveries]);

	useEffect(() => {
		if (!isActive || !checkout) return;
		if (isStale && !prevStaleRef.current) {
			loadedKeyRef.current = null;
			void loadDeliveries(true);
		}
		prevStaleRef.current = isStale;
	}, [isStale, isActive, checkout, loadDeliveries]);

	const cacheKey = isActive && checkout ? shippingDeliveriesCacheKey(checkout) : null;
	const awaitingFetch = cacheKey !== null && loadedKeyRef.current !== cacheKey;

	const retry = useCallback(() => {
		loadedKeyRef.current = null;
		void loadDeliveries(true);
	}, [loadDeliveries]);

	return { deliveries, isLoading: isLoading || awaitingFetch, loadFailed, retry };
}
