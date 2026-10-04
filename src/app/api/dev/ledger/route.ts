import { NextResponse } from "next/server";
import { recentSaleorCalls } from "@/lib/saleor";

/**
 * Dev-only ring buffer of Saleor calls made by this server process.
 * Agents read it (or the `[paper:saleor]` lines in the dev log) instead of guessing.
 */
export function GET() {
	if (process.env.NODE_ENV !== "development") {
		return NextResponse.json({ error: "not found" }, { status: 404 });
	}

	const calls = recentSaleorCalls();
	const summary = calls.reduce<Record<string, number>>((acc, call) => {
		acc[call.mode] = (acc[call.mode] ?? 0) + 1;
		return acc;
	}, {});

	return NextResponse.json(
		{ calls, summary },
		{
			headers: {
				"x-paper-ledger": Object.entries(summary)
					.map(([mode, count]) => `${mode}=${count}`)
					.join(" "),
			},
		},
	);
}
