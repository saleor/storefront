import { isIP } from "node:net";

type Env = Readonly<Record<string, string | undefined>>;

const DEFAULT_TRUSTED_PROXY_COUNT = 1;

function explicitProxyCount(env: Env): number | null {
	const raw = env.TRUSTED_PROXY_COUNT?.trim();
	if (!raw) return null;
	const count = Number(raw);
	return Number.isInteger(count) && count >= 0 ? count : null;
}

/** The eight 16-bit groups of an IPv6 address, or null. Handles `::` and a trailing IPv4 part. */
function ipv6Groups(address: string): number[] | null {
	let text = address;
	const ipv4Tail = /(\d+\.\d+\.\d+\.\d+)$/.exec(text)?.[1];
	if (ipv4Tail) {
		const [a = 0, b = 0, c = 0, d = 0] = ipv4Tail.split(".").map(Number);
		text = `${text.slice(0, -ipv4Tail.length)}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
	}
	const [head = "", tail, extra] = text.split("::");
	if (extra !== undefined) return null;
	const parse = (part: string) => (part ? part.split(":").map((group) => Number.parseInt(group, 16)) : []);
	const front = parse(head);
	const back = tail === undefined ? [] : parse(tail);
	const missing = 8 - front.length - back.length;
	if (missing < 0 || (tail === undefined && missing !== 0)) return null;
	const groups = [...front, ...Array<number>(missing).fill(0), ...back];
	return groups.every((group) => Number.isInteger(group) && group >= 0 && group <= 0xffff) ? groups : null;
}

/**
 * One key per visitor network: an IPv4 address as is, an IPv6 address by its /64 (one household or
 * server usually holds a whole /64, so single addresses would give it unlimited "IPs"). IPv4 in
 * IPv6 (`::ffff:1.2.3.4`) counts as IPv4. Anything else is not an address.
 */
export function ipRateLimitKey(raw: string): string | null {
	const address =
		raw
			.trim()
			.replace(/^\[|\]$/g, "")
			.split("%")[0] ?? "";
	const version = isIP(address);
	if (version === 4) return address;
	if (version !== 6) return null;
	const groups = ipv6Groups(address.toLowerCase());
	if (!groups) return null;
	if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
		const [high = 0, low = 0] = groups.slice(6);
		return [high >> 8, high & 0xff, low >> 8, low & 0xff].join(".");
	}
	return `${groups
		.slice(0, 4)
		.map((group) => group.toString(16))
		.join(":")}::/64`;
}

/**
 * The visitor's network for per-IP limits, as far as the hosting vouches for it.
 *
 * - Each proxy in front of Paper appends the address it received the request from to
 *   `x-forwarded-for`; entries before those are whatever the visitor sent. `TRUSTED_PROXY_COUNT`
 *   says how many of those proxies to count back from the end. Next.js adds the connection's
 *   address only when the header is missing, so with no proxy (`0`) the visitor can set it: per-IP
 *   limits are then weak, and the per-email and per-order limits do the work.
 * - Without that setting, on Vercel (`VERCEL` set) the platform's `x-real-ip` is used: Vercel sets
 *   it and overwrites `x-forwarded-for`. Elsewhere the default is one proxy. Set the count
 *   explicitly when self-hosting: `vercel env pull` writes `VERCEL=1` into `.env.local`.
 * - Values that are not IP addresses count as `unknown`.
 */
export function clientIpFromHeaders(headers: Pick<Headers, "get">, env: Env = process.env): string {
	const forwarded = (headers.get("x-forwarded-for") ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);
	const proxies = explicitProxyCount(env);

	let candidate: string | undefined;
	if (proxies === null && env.VERCEL) {
		candidate = headers.get("x-real-ip") ?? forwarded[0];
	} else {
		const hops = Math.max(proxies ?? DEFAULT_TRUSTED_PROXY_COUNT, 1);
		candidate = forwarded[Math.max(0, forwarded.length - hops)];
	}
	return (candidate && ipRateLimitKey(candidate)) || "unknown";
}
