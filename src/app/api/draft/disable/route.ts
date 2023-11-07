import { draftMode } from "next/headers";

export async function GET() {
	draftMode().disable();
	return new Response("Draft mode disabled. Redirecting back.", {
		status: 200,
		headers: {
			"content-type": "text/plain",
			refresh: "1; url=/",
		},
	});
}
