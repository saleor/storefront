import { notFound, redirect } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";

export default function TermsRedirectPage() {
	if (!DefaultChannelSlug) {
		notFound();
	}

	redirect(`/${DefaultChannelSlug}/terms`);
}
