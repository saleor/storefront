"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { Button } from "@/ui/components/ui/Button";
import { Input } from "@/ui/components/ui/Input";
import { Label } from "@/ui/components/ui/Label";

type FormMode = "login" | "setPassword";

export function LoginForm() {
	const router = useRouter();
	const params = useParams<{ channel: string }>();
	const searchParams = useSearchParams();
	const { signIn } = useSaleorAuthContext();

	// Check if this is a password reset callback
	const resetEmail = searchParams.get("email");
	const resetToken = searchParams.get("token");

	const [mode, setMode] = useState<FormMode>(resetEmail && resetToken ? "setPassword" : "login");

	const [email, setEmail] = useState(resetEmail || "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [resetEmailSent, setResetEmailSent] = useState(false);
	const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

	// Update mode when URL params change
	useEffect(() => {
		if (resetEmail && resetToken) {
			setMode("setPassword");
			setEmail(resetEmail);
		}
	}, [resetEmail, resetToken]);

	const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !validateEmail(email)) {
			setError("Please enter a valid email address");
			return;
		}

		if (!password) {
			setError("Please enter your password");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await signIn({ email, password });

			if (result.data?.tokenCreate?.errors?.length) {
				const err = result.data.tokenCreate.errors[0];
				// Check for invalid credentials by message pattern
				const isInvalidCredentials =
					err.message?.toLowerCase().includes("invalid") ||
					err.message?.toLowerCase().includes("credentials");
				if (isInvalidCredentials) {
					setError("Invalid email or password. Please try again.");
				} else {
					setError(err.message || "Sign in failed");
				}
				return;
			}

			if (result.data?.tokenCreate?.token) {
				router.push(`/${params.channel}`);
				router.refresh();
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!password) {
			setError("Please enter a new password");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/set-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: resetEmail,
					token: resetToken,
					password,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string; code?: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				const err = data.errors[0];
				if (err.code === "INVALID_TOKEN" || err.message?.includes("token")) {
					setError("This password reset link has expired. Please request a new one.");
				} else {
					setError(err.message || "Failed to set password");
				}
				return;
			}

			if (data.success) {
				setPasswordResetSuccess(true);
				// Clear URL params and redirect to clean login
				setTimeout(() => {
					router.push(`/${params.channel}/login`);
					router.refresh();
				}, 2000);
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		setError("");
		setSuccessMessage("");

		if (!email) {
			setError("Please enter your email address first");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					channel: params.channel,
					redirectUrl: `${window.location.origin}/${params.channel}/login`,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				setError(data.errors[0].message || "Failed to send reset link");
				return;
			}

			setResetEmailSent(true);
			setSuccessMessage(
				`If an account exists for ${email}, a password reset link has been sent. Note: You can only request one reset link every 15 minutes.`,
			);
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Success state after password reset
	if (passwordResetSuccess) {
		return (
			<div className="mx-auto mt-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>
						<h1 className="text-2xl font-semibold">Password Updated!</h1>
						<p className="text-muted-foreground">
							Your password has been successfully reset. You are now signed in.
						</p>
						<p className="text-sm text-muted-foreground">Redirecting you to the store...</p>
					</div>
				</div>
			</div>
		);
	}

	// Set New Password mode
	if (mode === "setPassword") {
		return (
			<div className="mx-auto mt-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="mb-6 text-center">
						<h1 className="text-2xl font-semibold">Set New Password</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Enter a new password for <span className="font-medium">{resetEmail}</span>
						</p>
					</div>

					<form onSubmit={handleSetPassword} className="space-y-4">
						{error && (
							<div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>
						)}

						{/* New Password */}
						<div className="space-y-1.5">
							<Label htmlFor="password" className="text-sm font-medium">
								New Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="At least 8 characters"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="h-12 pl-10 pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div className="space-y-1.5">
							<Label htmlFor="confirmPassword" className="text-sm font-medium">
								Confirm Password
							</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="h-12 pl-10 pr-10"
									required
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
							{isSubmitting ? "Updating..." : "Update Password"}
						</Button>

						<div className="text-center">
							<Link
								href={`/${params.channel}/login`}
								className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
							>
								Back to Sign In
							</Link>
						</div>
					</form>
				</div>
			</div>
		);
	}

	// Default Login mode
	return (
		<div className="mx-auto mt-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold">Welcome Back</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href={`/${params.channel}/signup`}
							className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							Sign up
						</Link>
					</p>
				</div>

				<form onSubmit={handleLogin} className="space-y-4">
					{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

					{successMessage && (
						<div className="rounded-md bg-green-100 p-3 text-sm text-green-800">{successMessage}</div>
					)}

					{/* Email */}
					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							Email address
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setResetEmailSent(false);
								}}
								className="h-12 pl-10"
								required
							/>
						</div>
					</div>

					{/* Password */}
					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							Password
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					{/* Forgot Password */}
					<div className="flex justify-end">
						<button
							type="button"
							onClick={handleForgotPassword}
							disabled={isSubmitting}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
						>
							{resetEmailSent ? "Resend link?" : "Forgot password?"}
						</button>
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</div>
		</div>
	);
}
