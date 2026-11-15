import { useCallback, useEffect, useState } from "react";

import { checkPostcodeDelivery } from "@/app/(checkout)/actions";
import type { CountryCode } from "@/checkout/graphql";

export type PostcodeDeliveryStatus = "idle" | "checking" | "served" | "unserved" | "unknown";
export type PostcodeAnswer = "served" | "unserved" | "unknown";

/** Answers for this page load, per channel, country and postcode. Not cached on the server. */
const answers = new Map<string, PostcodeAnswer>();

const DEBOUNCE_MS = 300;

// Spacing and case differ between what a shopper types and what Saleor stores ("1234ab", "1234 AB").
const answerKey = (channel: string, countryCode: string, postalCode: string) =>
	`${channel}|${countryCode}|${postalCode.replace(/\s+/g, "").toUpperCase()}`;

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
 * shipping step. While `paused` (the shopper is typing in the field) the status stays "idle", so
 * a partial code is never judged. `check()` answers for the current postcode at once, for the
 * submit handler. An unanswered or "unknown" check never blocks; the shipping step remains the
 * backstop.
 */
export function usePostcodeDelivery(input: {
	channel: string;
	countryCode: CountryCode | null | undefined;
	postalCode: string | null | undefined;
	paused: boolean;
	enabled: boolean;
}): { status: PostcodeDeliveryStatus; check: () => Promise<PostcodeAnswer | undefined> } {
	const { channel, countryCode, enabled, paused } = input;
	const postalCode = (input.postalCode ?? "").trim();
	const currentKey =
		enabled && countryCode && postalCode ? answerKey(channel, countryCode, postalCode) : null;
	const key = paused ? null : currentKey;
	const [answered, setAnswered] = useState<{ key: string; answer: PostcodeAnswer } | null>(null);
	const [pendingKey, setPendingKey] = useState<string | null>(null);

	const ask = useCallback(
		async (askedKey: string, code: CountryCode, postcode: string): Promise<PostcodeAnswer | undefined> => {
			const known = answers.get(askedKey);
			if (known) return known;
			try {
				const result = await checkPostcodeDelivery(channel, code, postcode);
				if (!result.ok) return undefined;
				answers.set(askedKey, result.status);
				setAnswered({ key: askedKey, answer: result.status });
				return result.status;
			} catch {
				return undefined;
			}
		},
		[channel],
	);

	useEffect(() => {
		if (!key || answers.has(key) || !countryCode) {
			return;
		}
		let cancelled = false;
		const timer = setTimeout(() => {
			setPendingKey(key);
			void ask(key, countryCode, postalCode).finally(() => {
				if (!cancelled) setPendingKey((current) => (current === key ? null : current));
			});
		}, DEBOUNCE_MS);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [key, countryCode, postalCode, ask]);

	const check = useCallback(async () => {
		if (!currentKey || !countryCode) return undefined;
		return ask(currentKey, countryCode, postalCode);
	}, [currentKey, countryCode, postalCode, ask]);

	let status: PostcodeDeliveryStatus = "idle";
	if (key) {
		const answer = answers.get(key) ?? (answered?.key === key ? answered.answer : undefined);
		status = answer ?? (pendingKey === key ? "checking" : "idle");
	}
	return { status, check };
}
