import { redirect } from "next/navigation";

export default function EmptyPage() {
	redirect("/default-channel");
}
