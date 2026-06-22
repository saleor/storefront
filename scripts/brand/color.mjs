/**
 * Reference-color helper (CLI) — convert sRGB hex to the bare OKLCH channels brand.css wants.
 *
 * brand.css stores colors as bare "L C H" (Tailwind wraps them as oklch(var(--token) / <alpha>)).
 * Rebranding from a reference gives you hex; you can't eyeball OKLCH, and oklch.com / DevTools emit
 * `oklch(52% 0.14 255)` (percentage L, wrapped) — not the paste-ready triplet. This prints that
 * triplet. See `design-from-image.md` ("Borrowing colors from a reference").
 *
 * Usage: node scripts/brand/color.mjs "#1466b3" "#f08c1d"
 *
 * Conversion: sRGB -> linear -> OKLab -> OKLCH (Bjorn Ottosson's matrices).
 */

const round = (n, d) => {
	const f = 10 ** d;
	return Math.round(n * f) / f;
};

/** @param {string} hex @returns {[number, number, number]} 0-255 RGB */
function hexToRgb(hex) {
	let h = hex.replace("#", "").trim();
	if (h.length === 3) {
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const n = Number.parseInt(h, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const srgbToLinear = (c) => {
	const x = c / 255;
	return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};

/** @returns {string} bare OKLCH channels, e.g. "0.62 0.18 255" */
function hexToOklchChannels(hex) {
	const [r, g, b] = hexToRgb(hex);
	const lr = srgbToLinear(r);
	const lg = srgbToLinear(g);
	const lb = srgbToLinear(b);

	const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

	const C = Math.sqrt(a * a + bb * bb);
	let h = (Math.atan2(bb, a) * 180) / Math.PI;
	if (h < 0) h += 360;

	return `${round(L, 4)} ${round(C, 4)} ${C > 0.0005 ? round(h, 1) : 0}`;
}

const isHex = (v) => typeof v === "string" && /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());

const args = process.argv.slice(2);
if (args.length === 0) {
	console.error('Usage: node scripts/brand/color.mjs "#1466b3" ["#f08c1d" …]');
	process.exit(1);
}
for (const arg of args) {
	if (!isHex(arg)) {
		console.error(`✗ not a hex color: ${arg}`);
		process.exitCode = 1;
		continue;
	}
	console.log(`${arg} -> ${hexToOklchChannels(arg)}`);
}
