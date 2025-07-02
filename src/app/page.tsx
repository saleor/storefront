import { redirect } from "next/navigation";
import { DEFAULT_CHANNEL } from "@/lib/utils";

export default function EmptyPage() {
	redirect(`/${DEFAULT_CHANNEL}`);
}
