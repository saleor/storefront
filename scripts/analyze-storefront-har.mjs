#!/usr/bin/env node
/**
 * Classify a Chrome/Firefox HAR from one storefront page view into Paper cost buckets.
 *
 * Use this when you cannot assume what a fork still does: capture the homepage (or
 * any browse URL) after the Cloudflare/bot challenge, then bucket every request.
 *
 * Capture (Chrome):
 *   1. Incognito, DevTools → Network, Disable cache ON.
 *   2. Open the homepage. Wait until the spinner is idle (plus ~3s for prefetch).
 *   3. Right-click the request list → Save all as HAR with content.
 *   4. Run: node scripts/analyze-storefront-har.mjs path/to/page.har
 *
 * The script never names a merchant. Drop the HAR in chat or a local path
 * (*.har is gitignored) and read the bucket table.
 */
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {{ name: string; value: string }} HarHeader */

/**
 * @param {HarHeader[] | undefined} headers
 * @param {string} name
 */
export function header(headers, name) {
	const needle = name.toLowerCase();
	return headers?.find((h) => h.name.toLowerCase() === needle)?.value ?? "";
}

/**
 * @param {string} url
 */
export function safeUrl(url) {
	try {
		return new URL(url);
	} catch {
		return null;
	}
}

/**
 * Saleor media (and the thumbnail proxy) before `text/html`: a 302 off
 * `/thumbnail/…` often has an HTML body and must not look like a document hop.
 *
 * @param {string} host
 * @param {string} pathname
 */
export function isSaleorMedia(host, pathname) {
	return host.includes("media.saleor") || host.includes("saleor.cloud") || pathname.includes("/thumbnail/");
}

/**
 * Static leftovers (manifest, favicon, ads pixels) that sometimes return HTML 403.
 *
 * @param {string} pathname
 */
export function isStaticLeftoverPath(pathname) {
	return /\.(webmanifest|json|ico|png|jpe?g|gif|svg|xml|txt|map)(\?|$)/i.test(pathname);
}

/**
 * Pathname + query, minus the RSC flight token. Do not special-case a fork's
 * listing query keys — print whatever the capture actually requested.
 *
 * @param {URL} url
 */
export function rscDestination(url) {
	const params = new URLSearchParams(url.search);
	params.delete("_rsc");
	const qs = params.toString();
	return qs ? `${url.pathname}?${qs}` : url.pathname;
}

/**
 * @param {{ host: string; pathname: string; search: string; mime: string }} input
 */
export function classify({ host, pathname, search, mime }) {
	if (pathname.includes("/_next/image")) return "next-image";
	if (pathname.includes("/_next/static")) return "next-static";
	if (pathname.includes("/_next/data") || search.includes("_rsc=") || mime.includes("text/x-component")) {
		return "rsc";
	}
	if (pathname.startsWith("/api/") || pathname.includes("/api/")) return "api";
	if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(pathname) || mime.includes("font")) return "font";
	if (isSaleorMedia(host, pathname)) return "saleor-cdn";
	// Manifest / favicon / ads leftovers sometimes arrive as text/html 403.
	if (isStaticLeftoverPath(pathname)) return "other";
	if (mime.includes("text/html")) return "html";
	if (/\.(avif|webp|jpe?g|png|gif|svg)(\?|$)/i.test(pathname) || mime.startsWith("image/")) {
		return "image-other";
	}
	if (
		host.includes("speed-insights") ||
		host.includes("vitals.vercel") ||
		pathname.includes("/_vercel/speed-insights") ||
		host.includes("va.vercel-scripts") ||
		host.includes("google-analytics") ||
		host.includes("googletagmanager") ||
		host.includes("facebook") ||
		host.includes("hotjar") ||
		host.includes("clarity.ms")
	) {
		return "beacon";
	}
	if (host.includes("challenges.cloudflare") || host.includes("cloudflareinsights")) {
		return "bot-challenge";
	}
	if (mime.includes("javascript") || pathname.endsWith(".js")) return "script-other";
	if (mime.includes("css") || pathname.endsWith(".css")) return "css-other";
	return "other";
}

function transferSize(entry) {
	const reported = entry.response?._transferSize;
	if (typeof reported === "number" && reported >= 0) return reported;
	const body = entry.response?.bodySize;
	const headers = entry.response?.headersSize;
	if (typeof body === "number" && body >= 0) {
		return body + (typeof headers === "number" && headers > 0 ? headers : 0);
	}
	return 0;
}

/**
 * @param {unknown[]} entries
 */
export function analyzeEntries(entries) {
	const buckets = new Map();
	const hosts = new Map();
	/** @type {Map<string, number>} */
	const rscDestinations = new Map();
	/** @type {string[]} */
	const flags = [];
	let documentUrl = "";
	let documentHost = "";

	for (const entry of entries) {
		const url = safeUrl(entry.request?.url ?? "");
		if (!url) continue;
		const mime = (entry.response?.content?.mimeType ?? "").toLowerCase();
		const bucket = classify({
			host: url.hostname,
			pathname: url.pathname,
			search: url.search,
			mime,
		});
		const bytes = transferSize(entry);
		const status = entry.response?.status ?? 0;
		const server = header(entry.response?.headers, "server");
		const cacheControl = header(entry.response?.headers, "cache-control");
		const cfRay = header(entry.response?.headers, "cf-ray");
		const vercelId = header(entry.response?.headers, "x-vercel-id");
		const initiator = entry._initiator?.type ?? "";

		if (!documentUrl && bucket === "html" && status >= 200 && status < 400) {
			documentUrl = url.href;
			documentHost = url.hostname;
		}

		if (bucket === "rsc") {
			const dest = rscDestination(url);
			rscDestinations.set(dest, (rscDestinations.get(dest) ?? 0) + 1);
		}

		const prev = buckets.get(bucket) ?? { count: 0, bytes: 0, vercel: 0, cloudflare: 0, prefetch: 0 };
		prev.count += 1;
		prev.bytes += bytes;
		if (vercelId) prev.vercel += 1;
		if (cfRay) prev.cloudflare += 1;
		if (initiator === "other" && bucket === "rsc") prev.prefetch += 1;
		buckets.set(bucket, prev);

		const hostPrev = hosts.get(url.hostname) ?? { count: 0, bytes: 0 };
		hostPrev.count += 1;
		hostPrev.bytes += bytes;
		hosts.set(url.hostname, hostPrev);

		if (bucket === "next-image") {
			flags.push(`/_next/image ${url.searchParams.get("url") ?? url.href}`.slice(0, 160));
		}
		if (bucket === "html" && /max-age=0|no-store|private/i.test(cacheControl)) {
			flags.push(`uncacheable HTML ${status} ${cacheControl || "(no cache-control)"}`);
		}
		if (status >= 300 && status < 400 && bucket === "html") {
			flags.push(`HTML redirect ${status} → ${header(entry.response?.headers, "location")}`);
		}
		if (bucket === "html" && header(entry.response?.headers, "set-cookie")) {
			flags.push("HTML Set-Cookie (can mark the document uncacheable at a shared CDN)");
		}
		if (
			server.toLowerCase().includes("cloudflare") &&
			bucket === "html" &&
			status === 403 &&
			!isStaticLeftoverPath(url.pathname)
		) {
			flags.push("HTML 403 from Cloudflare — this HAR may be the challenge page, not the shop");
		}
	}

	return { buckets, hosts, rscDestinations, flags, documentUrl, documentHost };
}

const BUCKET_ORDER = [
	"html",
	"next-static",
	"rsc",
	"next-image",
	"saleor-cdn",
	"image-other",
	"font",
	"beacon",
	"bot-challenge",
	"api",
	"script-other",
	"css-other",
	"other",
];

const fmtKb = (n) => `${(n / 1024).toFixed(1)} KB`;

function printReport(pathArg, entries, analysis) {
	const { buckets, hosts, rscDestinations, flags, documentUrl, documentHost } = analysis;

	console.log(`HAR: ${basename(pathArg)}`);
	console.log(`Entries: ${entries.length}${documentUrl ? `\nDocument: ${documentUrl}` : ""}`);
	console.log("");
	console.log(
		["bucket", "count", "bytes", "vercel", "cf", "rsc-prefetch"]
			.map((h, i) => h.padEnd(i === 0 ? 16 : 12))
			.join(""),
	);
	console.log("-".repeat(76));

	let totalCount = 0;
	let totalBytes = 0;
	for (const name of BUCKET_ORDER) {
		const row = buckets.get(name);
		if (!row) continue;
		totalCount += row.count;
		totalBytes += row.bytes;
		console.log(
			name.padEnd(16) +
				String(row.count).padEnd(12) +
				fmtKb(row.bytes).padEnd(12) +
				String(row.vercel).padEnd(12) +
				String(row.cloudflare).padEnd(12) +
				String(row.prefetch),
		);
	}

	console.log("-".repeat(76));
	console.log(`total`.padEnd(16) + String(totalCount).padEnd(12) + fmtKb(totalBytes));
	console.log("");
	if (rscDestinations.size) {
		console.log("RSC destinations (prefetch / PPR holes):");
		for (const [dest, count] of [...rscDestinations.entries()].sort((a, b) => b[1] - a[1])) {
			console.log(`  ${String(count).padStart(3)}  ${dest}`);
		}
		console.log("");
	}

	console.log("Hosts (by request count):");
	for (const [host, row] of [...hosts.entries()].sort((a, b) => b[1].count - a[1].count)) {
		console.log(`  ${String(row.count).padStart(3)}  ${fmtKb(row.bytes).padStart(10)}  ${host}`);
	}

	if (flags.length) {
		console.log("\nFlags (cost-relevant):");
		for (const flag of [...new Set(flags)].slice(0, 40)) {
			console.log(`  - ${flag}`);
		}
	}

	const imagesOnVercel = buckets.get("next-image")?.count ?? 0;
	const saleorImages = buckets.get("saleor-cdn")?.count ?? 0;
	const rsc = buckets.get("rsc")?.count ?? 0;
	const html = buckets.get("html")?.count ?? 0;

	console.log("\nRead:");
	if (html > 1) {
		console.log(
			`  ${html} HTML responses — look for redirect hops or a challenge page in front of the shop.`,
		);
	}
	if (imagesOnVercel && saleorImages) {
		console.log(
			`  ${imagesOnVercel} /_next/image and ${saleorImages} Saleor/CDN images — catalog may be fine; marketing/local files are still on the optimizer.`,
		);
	} else if (imagesOnVercel) {
		console.log(
			`  ${imagesOnVercel} /_next/image hits — catalog media is still on Vercel's optimizer (Saleor pipeline not in effect, or a silent srcset fallback).`,
		);
	} else if (saleorImages) {
		console.log(
			`  ${saleorImages} Saleor/CDN images, no /_next/image — image meter is off Vercel for this view.`,
		);
	}
	if (rsc) {
		console.log(
			`  ${rsc} RSC/prefetch payloads — each is an edge request; a function if the destination awaits searchParams.`,
		);
	}
	if ((buckets.get("beacon")?.count ?? 0) > 2) {
		console.log(
			"  Several analytics/insights beacons — confirm Speed Insights is sampled and no extra pixels fire per view.",
		);
	}
	if ((buckets.get("bot-challenge")?.count ?? 0) > 0) {
		console.log(
			"  Bot-challenge scripts present — confirm this HAR is a real shopper view, not the interstitial.",
		);
	}
	const sameOrigin = documentHost ? (hosts.get(documentHost)?.count ?? 0) : 0;
	if (sameOrigin) {
		console.log(
			`  ${sameOrigin} same-origin requests / 1 document — this is the Vercel Edge Request count for the view if the hostname is the Vercel project.`,
		);
	} else {
		console.log(
			`  ${totalCount} requests / ${html || 1} HTML ≈ ${(totalCount / (html || 1)).toFixed(1)} edge-shaped hits per document in this capture.`,
		);
	}
}

function main() {
	const pathArg = process.argv[2];
	if (!pathArg) {
		console.error("Usage: node scripts/analyze-storefront-har.mjs <file.har>");
		process.exit(1);
	}

	const raw = readFileSync(pathArg, "utf8");
	const har = JSON.parse(raw);
	const entries = har.log?.entries;
	if (!Array.isArray(entries)) {
		console.error("Not a HAR file (missing log.entries).");
		process.exit(1);
	}

	printReport(pathArg, entries, analyzeEntries(entries));
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
	main();
}
