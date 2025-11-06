"use client";

import { useState } from "react";
import { useUserRegisterMutation } from "@/checkout/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export function RegisterForm() {
	const [, userRegister] = useUserRegisterMutation();
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors([]);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();
		const confirmPassword = formData.get("confirmPassword")?.toString();

		if (!email || !password || !confirmPassword) {
			setErrors(["All fields are required"]);
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setErrors(["Passwords do not match"]);
			setLoading(false);
			return;
		}

		if (password.length < 8) {
			setErrors(["Password must be at least 8 characters long"]);
			setLoading(false);
			return;
		}

		try {
			// Build the confirmation URL
			const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
			const confirmUrl = `${baseUrl}/confirm-account`;

			const result = await userRegister({
				input: {
					email,
					password,
					channel: "default-channel",
					redirectUrl: confirmUrl,
				},
			});

			if (result.data?.accountRegister?.errors?.length) {
				// Log errors for debugging
				console.log("Registration errors:", result.data.accountRegister.errors);

				const errorMessages = result.data.accountRegister.errors.map((error) => {
					// Handle specific error codes
					if (error.code === "UNIQUE") {
						return "An account with this email already exists. Please sign in instead.";
					}
					if (error.code === "PASSWORD_TOO_SHORT") {
						return "Password must be at least 8 characters long.";
					}
					if (error.code === "PASSWORD_TOO_COMMON") {
						return "This password is too common. Please choose a more secure password.";
					}
					// For all other errors including INVALID, show the backend's actual error message
					// This helps us understand what the backend is actually complaining about
					return error.message || "An error occurred during registration";
				});
				setErrors(errorMessages);
			} else {
				// Success! Show confirmation message
				setSuccess(true);
			}
		} catch (error) {
			console.error("Registration error:", error);
			setErrors(["An unexpected error occurred. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="mx-auto mt-16 w-full max-w-lg">
				<div className="card p-8">
					<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900 text-green-100">
						<svg
							className="h-8 w-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="mb-4 font-display text-2xl font-light text-white">
						Check Your Email
					</h2>
					<p className="mb-6 text-base-300">
						We&apos;ve sent a confirmation email to your inbox. Please click the link in the email to
						activate your account.
					</p>
					<div className="space-y-3">
						<LinkWithChannel href="/login" className="btn-primary block w-full text-center">
							Go to Sign In
						</LinkWithChannel>
						<LinkWithChannel href="/" className="btn-secondary block w-full text-center">
							Return to Home
						</LinkWithChannel>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="card p-8" onSubmit={handleSubmit}>
				<h2 className="mb-6 font-display text-2xl font-light text-white">Create Account</h2>

				{errors.length > 0 && (
					<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
						{errors.map((error, index) => (
							<p key={index} className="text-sm text-red-800">
								{error}
							</p>
						))}
					</div>
				)}

				<div className="mb-4">
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

				<div className="mb-4">
					<label className="label" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="At least 8 characters"
						autoCapitalize="off"
						autoComplete="new-password"
						className="input"
						required
						disabled={loading}
						minLength={8}
					/>
					<p className="mt-1 text-xs text-base-400">Must be at least 8 characters long</p>
				</div>

				<div className="mb-6">
					<label className="label" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						placeholder="Re-enter your password"
						autoCapitalize="off"
						autoComplete="new-password"
						className="input"
						required
						disabled={loading}
						minLength={8}
					/>
				</div>

				<button className="btn-primary mb-4 w-full" type="submit" disabled={loading}>
					{loading ? "Creating Account..." : "Create Account"}
				</button>

				<p className="text-center text-sm text-base-300">
					Already have an account?{" "}
					<LinkWithChannel href="/login" className="text-accent-200 hover:text-accent-300">
						Sign in
					</LinkWithChannel>
				</p>
			</form>
		</div>
	);
}
