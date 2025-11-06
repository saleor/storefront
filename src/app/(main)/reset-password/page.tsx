"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/ui/components/ResetPasswordForm";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	// If email or token is missing, show error
	if (!email || !token) {
		return (
			<section className="mx-auto max-w-7xl p-8">
				<div className="mx-auto mt-16 w-full max-w-lg">
					<div className="card p-8">
						<h2 className="mb-6 font-display text-2xl font-light text-white">Invalid Link</h2>
						<div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
							<p className="text-sm text-red-800">
								This password reset link is invalid or incomplete. Please request a new password
								reset link.
							</p>
						</div>
						<LinkWithChannel href="/forgot-password" className="btn-primary block w-full text-center">
							Request New Link
						</LinkWithChannel>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			<ResetPasswordForm email={email} token={token} />
		</section>
	);
}
