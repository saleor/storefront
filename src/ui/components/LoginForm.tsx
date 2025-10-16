"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saleorAuthClient } from "@/ui/components/AuthProvider";

export function LoginForm() {
	const router = useRouter();
	const [errors, setErrors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors([]);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();

		if (!email || !password) {
			setErrors(["Email and password are required"]);
			setLoading(false);
			return;
		}

		// Clear any old localStorage tokens (migration from old auth system)
		if (typeof window !== "undefined" && window.localStorage) {
			window.localStorage.removeItem("saleor_auth_module_refresh_token");
			window.localStorage.removeItem("saleor_auth_access_token");
		}

		try {
			const { data } = await saleorAuthClient.signIn({ email, password });

			if (data?.tokenCreate?.errors && data.tokenCreate.errors.length > 0) {
				const errorMessages = data.tokenCreate.errors.map((error) => {
					// Handle specific error codes
					if (error.code === "ACCOUNT_NOT_CONFIRMED") {
						return "Your account needs to be confirmed via email. Please check your inbox for a confirmation link.";
					}
					if (error.code === "INVALID_CREDENTIALS") {
						return "Invalid email or password. Please try again.";
					}
					if (error.code === "INACTIVE") {
						return "Your account has been deactivated. Please contact support.";
					}
					if (error.code === "LOGIN_ATTEMPT_DELAYED") {
						return "Too many login attempts. Please try again later.";
					}
					return error.message || "An error occurred during login";
				});
				setErrors(errorMessages);
			} else {
				// Successful login - redirect to home page
				router.push("/");
				router.refresh();
			}
		} catch (error) {
			console.error("Login error:", error);
			setErrors(["An unexpected error occurred. Please try again."]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="card p-8" onSubmit={handleSubmit}>
				<h2 className="mb-6 font-display text-2xl font-light text-white">Sign In</h2>

				{errors.length > 0 && (
					<div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
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
				<div className="mb-6">
					<label className="label" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter your password"
						autoCapitalize="off"
						autoComplete="current-password"
						className="input"
						required
						disabled={loading}
					/>
				</div>

				<button className="btn-primary w-full" type="submit" disabled={loading}>
					{loading ? "Signing in..." : "Log In"}
				</button>
			</form>
		</div>
	);
}
