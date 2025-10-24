import { LoginForm } from "@/ui/components/LoginForm";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
	title: "Login",
	description: `Sign in to your ${SITE_CONFIG.name} account to access your purchases, orders, and download high-quality guitar tones and amp captures.`,
};

export default function LoginPage() {
	return (
		<section className="mx-auto max-w-7xl p-8">
			<LoginForm />
		</section>
	);
}
