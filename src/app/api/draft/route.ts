import { draftMode } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export async function GET() {
	(await draftMode()).enable();
	redirect("/", RedirectType.replace);
}
