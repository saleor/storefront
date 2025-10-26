import { redirect } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";

export default function EmptyPage() {
	redirect(`/${DefaultChannelSlug}`);
};
