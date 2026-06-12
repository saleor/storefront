import { confirmAccountWithBff } from "./bff-client";

type ConfirmBffResponse = Awaited<ReturnType<typeof confirmAccountWithBff>>;

const inflight = new Map<string, Promise<ConfirmBffResponse>>();

/** Dedupes concurrent calls (e.g. React Strict Mode double-mount in dev). */
export function confirmAccountWithBffDeduped(email: string, token: string): Promise<ConfirmBffResponse> {
	const key = `${email}:${token}`;
	const existing = inflight.get(key);
	if (existing) {
		return existing;
	}

	const request = confirmAccountWithBff(email, token).finally(() => {
		inflight.delete(key);
	});

	inflight.set(key, request);
	return request;
}
