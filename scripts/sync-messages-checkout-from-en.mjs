import { readFileSync, writeFileSync } from "node:fs";

/**
 * Copy missing keys from messages/en.json → checkout namespace into other locale files.
 * Existing translations are preserved; only absent keys are filled from English.
 *
 * Usage: node scripts/sync-messages-checkout-from-en.mjs
 */

function deepMergeMissing(target, source) {
	for (const [key, value] of Object.entries(source)) {
		if (value && typeof value === "object" && !Array.isArray(value)) {
			target[key] ??= {};
			deepMergeMissing(target[key], value);
		} else if (!(key in target)) {
			target[key] = value;
		}
	}
	return target;
}

const enMessages = JSON.parse(readFileSync("messages/en.json", "utf8"));
const enCheckout = enMessages.checkout;

if (!enCheckout) {
	throw new Error("messages/en.json is missing the checkout namespace");
}

for (const locale of ["pl", "de", "fr", "fi", "nb"]) {
	const path = `messages/${locale}.json`;
	const messages = JSON.parse(readFileSync(path, "utf8"));
	messages.checkout ??= {};
	deepMergeMissing(messages.checkout, enCheckout);
	writeFileSync(path, JSON.stringify(messages, null, "\t") + "\n");
	console.log(`synced missing checkout keys → ${path}`);
}
