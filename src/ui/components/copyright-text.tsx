"use client";

import { use } from "react";
import { io } from "next/cache";
import { getCopyrightText } from "@/config/brand";

/**
 * Copyright line with the current year. Render it inside `<Suspense>`.
 *
 * `new Date()` during a prerender is sync IO. Under Cache Components it aborts the
 * prerender mid-tree, and the request-time resume of the surrounding boundary then
 * fails ("Couldn't find all resumable slots") and falls back to client rendering.
 * `io()` turns the read into a small dynamic hole instead.
 */
export function CopyrightText() {
	use(io());
	return <>{getCopyrightText()}</>;
}
