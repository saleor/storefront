import { readFileSync, writeFileSync } from "node:fs";

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

const en = JSON.parse(readFileSync("scripts/checkout-messages/en.json", "utf8"));

for (const locale of ["pl", "de", "fr", "fi", "nb"]) {
	const path = `scripts/checkout-messages/${locale}.json`;
	const current = JSON.parse(readFileSync(path, "utf8"));
	deepMergeMissing(current, en);
	writeFileSync(path, JSON.stringify(current, null, "\t") + "\n");
	console.log(`synced missing keys → ${path}`);
}
