import { readFileSync, writeFileSync } from "node:fs";

const locales = ["en", "pl", "de", "fr", "fi", "nb"];

for (const locale of locales) {
	const fullPath = `messages/${locale}.json`;
	const checkoutPath = `scripts/checkout-messages/${locale}.json`;
	const full = JSON.parse(readFileSync(fullPath, "utf8"));
	const checkout = JSON.parse(readFileSync(checkoutPath, "utf8"));
	full.checkout = checkout;
	writeFileSync(fullPath, JSON.stringify(full, null, "\t") + "\n");
	console.log(`merged checkout → ${fullPath}`);
}
