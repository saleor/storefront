import { type Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
	title: "Confirm Account",
	description: `Confirm your ${SITE_CONFIG.name} account to complete registration and access your purchases.`,
};

export default function ConfirmAccountLayout({ children }: { children: React.ReactNode }) {
	return children;
}
