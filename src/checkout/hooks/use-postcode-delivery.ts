import { useEffect, useState } from "react";

import { checkPostcodeDelivery } from "@/app/(checkout)/actions";
import type { CountryCode } from "@/checkout/graphql";

export type PostcodeDeliveryStatus = "idle" | "checking" | "served" | "unserved" | "unknown";
type PostcodeAnswer = "served" | "unserved" | "unknown";

/** Answers for this page load, per channel, country and postcode. Not cached on the server. */
const answers = new Map<string, PostcodeAnswer>();

const DEBOUNCE_MS = 300;

const answerKey = (channel: string, countryCode: string, postalCode: string) =>
	`${channel}|${countryCode}|${postalCode.trim().toUpperCase()}`;

/** What the postcode check answered on this page, if it ran. The shipping step words its empty state by it. */
export function knownPostcodeDelivery(
	channel: string,
	countryCode: string | null | undefined,
	postalCode: string | null | undefined,
): PostcodeAnswer | undefined {
	if (!countryCode || !postalCode?.trim()) return undefined;
	return answers.get(answerKey(channel, countryCode, postalCode));
}

/**
 * Whether the shop delivers to the postcode entered, so the address form can say so before the
 * shipping step. The caller passes an empty postcode while the shopper is still typing in the
 * field, so a partial code is never judged. An unanswered or "unknown" check never blocks; the
 * shipping step remains the backstop.
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
			? answerKey(input.channel, input.countryCode, postalCode)
			: null;
	const [answered, setAnswered] = useState<{ key: string; answer: PostcodeAnswer } | null>(null);
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
						answers.set(key, result.status);
						if (!cancelled) setAnswered({ key, answer: result.status });
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
	const answer = answers.get(key) ?? (answered?.key === key ? answered.answer : undefined);
	if (answer === undefined) return pendingKey === key ? "checking" : "idle";
	return answer;
}
