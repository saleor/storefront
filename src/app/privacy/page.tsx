import { notFound, redirect } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";

export default function PrivacyRedirectPage() {
	if (!DefaultChannelSlug) {
		notFound();
	}

	redirect(`/${DefaultChannelSlug}/privacy`);
}
