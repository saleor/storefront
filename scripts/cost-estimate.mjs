#!/usr/bin/env node
/**
 * Rough dollars per 1M page views from a small input.
 * Usage: node scripts/cost-estimate.mjs invocations=2 edge=40
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const rates = JSON.parse(readFileSync(join(import.meta.dirname, "../cost-rates.json"), "utf8"));
const input = Object.fromEntries(
	process.argv.slice(2).map((pair) => {
		const [key, value] = pair.split("=");
		return [key, Number(value)];
	}),
);
const invocations = input.invocations ?? 1;
const edge = input.edge ?? 20;
const dollars =
	invocations * rates.perMillion.functionInvocations + (edge * rates.perMillion.edgeRequests) / 1000;
console.log(
	`Estimate (not a quote): ${invocations} function invocation(s) and ${edge} edge request(s) per view ≈ $${dollars.toFixed(2)} / 1M views.`,
);
console.log(rates.note);
