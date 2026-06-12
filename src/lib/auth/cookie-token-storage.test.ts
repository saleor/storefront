import { describe, expect, it } from "vitest";

import { encodeCookieName } from "./constants";
import { createCookieTokenStorage, type WritableCookieStore } from "./cookie-token-storage";

const apiUrl = "https://demo.saleor.io/graphql/";
const options = { secure: false, accessTokenMaxAge: 900, refreshTokenMaxAge: 604800 };
const accessKey = [apiUrl, "saleor_auth_access_token"].join("+");

/** Cookie store as seen during an RSC render: reads work, writes throw. */
function renderContextStore(initial: Array<{ name: string; value: string }> = []): WritableCookieStore {
	const jar = new Map(initial.map((c) => [c.name, c.value]));
	const readonlyError = () => {
		throw new Error("Cookies can only be modified in a Server Action or Route Handler.");
	};
	return {
		get: (name) => (jar.has(name) ? { value: jar.get(name)! } : undefined),
		getAll: () => Array.from(jar, ([name, value]) => ({ name, value })),
		set: readonlyError,
		delete: readonlyError,
	};
}

describe("createCookieTokenStorage", () => {
	it("returns a token written via setItem even when cookie writes throw (render context)", () => {
		// Reproduces the SDK refreshing an expired access token mid-render:
		// the cookie write is rejected, but the cache must retain the new token
		// so the immediately-following authorized request reads the fresh value.
		const storage = createCookieTokenStorage(renderContextStore(), apiUrl, options);

		storage.setItem(accessKey, "fresh-token");

		expect(storage.getItem(accessKey)).toBe("fresh-token");
	});

	it("reads from cookies when nothing was written to the cache", () => {
		const store = renderContextStore([{ name: encodeCookieName(accessKey), value: "cookie-token" }]);
		const storage = createCookieTokenStorage(store, apiUrl, options);

		expect(storage.getItem(accessKey)).toBe("cookie-token");
	});

	it("persists to cookies in a writable context", () => {
		const writes: Array<{ name: string; value: string }> = [];
		const store: WritableCookieStore = {
			...renderContextStore(),
			set: (name, value) => writes.push({ name, value }),
		};
		const storage = createCookieTokenStorage(store, apiUrl, options);

		storage.setItem(accessKey, "token");

		expect(writes).toEqual([{ name: encodeCookieName(accessKey), value: "token" }]);
		expect(storage.getItem(accessKey)).toBe("token");
	});

	it("clears the cached value on removeItem", () => {
		const storage = createCookieTokenStorage(renderContextStore(), apiUrl, options);

		storage.setItem(accessKey, "token");
		storage.removeItem(accessKey);

		expect(storage.getItem(accessKey)).toBeNull();
	});
});
