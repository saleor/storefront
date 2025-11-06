"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

interface ResetPasswordFormProps {
	email: string;
	token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
	const router = useRouter();
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors([]);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password")?.toString();
		const confirmPassword = formData.get("confirmPassword")?.toString();

		// Client-side validation
		if (!password) {
			setErrors(["Password is required"]);
			setLoading(false);
			return;
		}

		if (password.length < 8) {
			setErrors(["Password must be at least 8 characters long"]);
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setErrors(["Passwords do not match"]);
			setLoading(false);
			return;
		}

		try {
			// Use fetch directly since the setPassword mutation hook isn't generated yet
			const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL!, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `
						mutation setPassword($token: String!, $email: String!, $password: String!) {
							setPassword(token: $token, email: $email, password: $password) {
								errors {
									message
									field
									code
								}
								user {
									id
									email
								}
							}
						}
					`,
					variables: { token, email, password },
				}),
			});

			const { data } = (await response.json()) as {
				data?: {
					setPassword?: {
						errors?: Array<{ message?: string; field?: string; code?: string }>;
						user?: { id: string; email: string };
					};
				};
			};

			if (data?.setPassword?.errors && data.setPassword.errors.length > 0) {
				const errorMessages = data.setPassword.errors.map((error) => {
					const errorCode = error.code;

					// Handle specific error codes
					if (errorCode === "INVALID") {
						return "The password reset link is invalid or has expired. Please request a new one.";
					}
					if (errorCode === "PASSWORD_TOO_SHORT") {
						return "Password must be at least 8 characters long.";
					}
					if (errorCode === "PASSWORD_TOO_COMMON") {
						return "This password is too common. Please choose a more secure password.";
					}
					if (errorCode === "PASSWORD_ENTIRELY_NUMERIC") {
						return "Password cannot be entirely numeric.";
					}
					return error.message || "An error occurred while resetting your password";
				});
				setErrors(errorMessages);
			} else if (data?.setPassword?.user) {
				// Success - password has been reset
				setSuccess(true);
				// Redirect to login page after 2 seconds
				setTimeout(() => {
					router.push("/login");
				}, 2000);
			} else {
				setErrors(["An unexpected error occurred. Please try again."]);
			}
		} catch (error) {
			console.error("Password reset error:", error);
			setErrors(["An unexpected error occurred. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="mx-auto mt-16 w-full max-w-lg">
				<div className="card p-8">
					<h2 className="mb-6 font-display text-2xl font-light text-white">
						Password Reset Successful
					</h2>
					<div className="rounded-md border border-green-200 bg-green-50 p-4">
						<p className="mb-2 text-sm text-green-800">
							Your password has been successfully reset!
						</p>
						<p className="text-sm text-green-800">Redirecting you to the login page...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="card p-8" onSubmit={handleSubmit}>
				<h2 className="mb-6 font-display text-2xl font-light text-white">Reset Password</h2>

				{errors.length > 0 && (
					<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
						{errors.map((error, index) => (
							<p key={index} className="text-sm text-red-800">
								{error}
							</p>
						))}
					</div>
				)}

				<p className="mb-6 text-sm text-base-300">
					Enter your new password below. Make sure it&apos;s at least 8 characters long and secure.
				</p>

				<div className="mb-4">
					<label className="label" htmlFor="password">
						New Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter your new password"
						autoCapitalize="off"
						autoComplete="new-password"
						className="input"
						minLength={8}
						required
						disabled={loading}
					/>
				</div>

				<div className="mb-6">
					<label className="label" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						placeholder="Confirm your new password"
						autoCapitalize="off"
						autoComplete="new-password"
						className="input"
						minLength={8}
						required
						disabled={loading}
					/>
				</div>

				<button className="btn-primary mb-4 w-full" type="submit" disabled={loading}>
					{loading ? "Resetting..." : "Reset Password"}
				</button>

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
