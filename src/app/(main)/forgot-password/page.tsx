import { ForgotPasswordForm } from "@/ui/components/ForgotPasswordForm";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
	title: "Forgot Password",
	description: `Reset your ${SITE_CONFIG.name} account password. Enter your email to receive password reset instructions.`,
};

export default function ForgotPasswordPage() {
	return (
		<section className="mx-auto max-w-7xl p-8">
			<ForgotPasswordForm />
		</section>
	);
}
