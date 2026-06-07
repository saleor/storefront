import { unstable_rethrow } from "next/navigation";

/** Let Next.js `redirect()` / `notFound()` errors propagate through payment try/catch blocks. */
export function rethrowNextInternalError(error: unknown): void {
	unstable_rethrow(error);
}
