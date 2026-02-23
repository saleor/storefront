"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginMode() {
	const router = useRouter();
	const params = useParams<{ channel: string }>();
	const { signIn } = useSaleorAuthContext();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [resetMessage, setResetMessage] = useState("");
	const [resetEmailSent, setResetEmailSent] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !EMAIL_RE.test(email)) {
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
				const isInvalidCredentials =
					err.message?.toLowerCase().includes("invalid") ||
					err.message?.toLowerCase().includes("credentials");
				setError(
					isInvalidCredentials
						? "Invalid email or password. Please try again."
						: err.message || "Sign in failed",
				);
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

	const handleForgotPassword = async () => {
		setError("");
		setResetMessage("");

		if (!email || !EMAIL_RE.test(email)) {
			setError("Please enter a valid email address first");
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
			setResetMessage(
				`If an account exists for ${email}, a password reset link has been sent. Note: You can only request one reset link every 15 minutes.`,
			);
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto my-16 w-full max-w-md">
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
					{error && (
						<div role="alert" className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					{resetMessage && (
						<div aria-live="polite" className="rounded-md bg-green-100 p-3 text-sm text-green-800">
							{resetMessage}
						</div>
					)}

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
								autoComplete="email"
								spellCheck={false}
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
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

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
						{isSubmitting ? "Signing in…" : "Sign In"}
					</Button>
				</form>
			</div>
		</div>
	);
}
