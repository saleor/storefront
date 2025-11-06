"use client";

import { useState } from "react";
import { useRequestPasswordResetMutation } from "@/checkout/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export function ForgotPasswordForm() {
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [, requestPasswordReset] = useRequestPasswordResetMutation();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors([]);
		setLoading(true);
		setSuccess(false);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email")?.toString();

		if (!email) {
			setErrors(["Email is required"]);
			setLoading(false);
			return;
		}

		try {
			// Get the storefront URL and channel from environment
			const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || window.location.origin;
			const redirectUrl = `${storefrontUrl}/reset-password`;
			const channel = "default-channel"; // You can make this configurable

			const { data } = await requestPasswordReset({
				email,
				channel,
				redirectUrl,
			});

			if (data?.requestPasswordReset?.errors && data.requestPasswordReset.errors.length > 0) {
				const errorMessages = data.requestPasswordReset.errors.map((error) => {
					// Handle specific error codes if needed
					return error.message || "An error occurred while requesting password reset";
				});
				setErrors(errorMessages);
			} else {
				// Success - show confirmation message
				setSuccess(true);
			}
		} catch (error) {
			console.error("Password reset request error:", error);
			setErrors(["An unexpected error occurred. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="card p-8" onSubmit={handleSubmit}>
				<h2 className="mb-6 font-display text-2xl font-light text-white">Forgot Password</h2>

				{errors.length > 0 && (
					<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
						{errors.map((error, index) => (
							<p key={index} className="text-sm text-red-800">
								{error}
							</p>
						))}
					</div>
				)}

				{success ? (
					<div className="rounded-md border border-green-200 bg-green-50 p-4">
						<p className="mb-4 text-sm text-green-800">
							If an account exists with this email address, you will receive password reset
							instructions shortly. Please check your inbox.
						</p>
						<p className="text-sm text-green-800">
							Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
						</p>
					</div>
				) : (
					<>
						<p className="mb-6 text-sm text-base-300">
							Enter your email address and we&apos;ll send you instructions to reset your password.
						</p>

						<div className="mb-6">
							<label className="label" htmlFor="email">
								Email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								placeholder="you@example.com"
								className="input"
								required
								disabled={loading}
							/>
						</div>

						<button className="btn-primary mb-4 w-full" type="submit" disabled={loading}>
							{loading ? "Sending..." : "Send Reset Instructions"}
						</button>
					</>
				)}

				<p className="text-center text-sm text-base-300">
					Remember your password?{" "}
					<LinkWithChannel href="/login" className="text-accent-200 hover:text-accent-300">
						Back to login
					</LinkWithChannel>
				</p>
			</form>
		</div>
	);
}
