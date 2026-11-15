import { useEffect, useState } from "react";

import { checkPostcodeDelivery } from "@/app/(checkout)/actions";
import type { CountryCode } from "@/checkout/graphql";

export type PostcodeDeliveryStatus = "idle" | "checking" | "served" | "unserved";

/** Answers for this page load, per channel, country and postcode. Not cached on the server. */
const answers = new Map<string, boolean>();

const DEBOUNCE_MS = 500;

/**
 * Whether the shop delivers to the postcode being entered, so the address form can say so before
 * the shipping step. Asks Paper's server action after typing pauses; an unanswered check stays
 * "idle" and the shipping step remains the backstop.
 */
export function usePostcodeDelivery(input: {
	channel: string;
	countryCode: CountryCode | null | undefined;
	postalCode: string | null | undefined;
	enabled: boolean;
}): PostcodeDeliveryStatus {
	const postalCode = (input.postalCode ?? "").trim();
	const key =
		input.enabled && input.countryCode && postalCode
			? `${input.channel}|${input.countryCode}|${postalCode.toUpperCase()}`
			: null;
	const [answered, setAnswered] = useState<{ key: string; served: boolean } | null>(null);
	const [pendingKey, setPendingKey] = useState<string | null>(null);

	useEffect(() => {
		if (!key || answers.has(key) || !input.countryCode) {
			return;
		}
		const countryCode = input.countryCode;
		let cancelled = false;
		const timer = setTimeout(() => {
			setPendingKey(key);
			void checkPostcodeDelivery(input.channel, countryCode, postalCode)
				.then((result) => {
					if (result.ok) {
						answers.set(key, result.served);
						if (!cancelled) setAnswered({ key, served: result.served });
					}
				})
				.catch(() => {})
				.finally(() => {
					if (!cancelled) setPendingKey((current) => (current === key ? null : current));
				});
		}, DEBOUNCE_MS);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [key, input.channel, input.countryCode, postalCode]);

	if (!key) return "idle";
	const served = answers.get(key) ?? (answered?.key === key ? answered.served : undefined);
	if (served === undefined) return pendingKey === key ? "checking" : "idle";
	return served ? "served" : "unserved";
}
