"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
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
		<div className="w-full max-w-md">
			<div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-neutral-800/80 to-neutral-900/90 shadow-2xl shadow-black/30">
				<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

				<div className="noise-overlay relative p-8 sm:p-10">
					<div className="mb-8">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
							Researcher Account
						</p>
						<h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Sign in to your account
						</h1>
						<p className="mt-3 text-sm leading-relaxed text-neutral-400">
							Access order history, saved lab addresses, and reorder details.{" "}
							<Link
								href={`/${params.channel}/signup`}
								className="font-medium text-white underline underline-offset-2 transition-colors hover:text-emerald-400 hover:no-underline"
							>
								Create an account
							</Link>
						</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-5">
						{error && (
							<div
								role="alert"
								className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
							>
								{error}
							</div>
						)}

						{resetMessage && (
							<div
								aria-live="polite"
								className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
							>
								{resetMessage}
							</div>
						)}

						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-sm font-medium text-neutral-300">
								Email address
							</Label>
							<div className="relative">
								<Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
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
									className="h-12 rounded-xl border-white/[0.08] bg-white/[0.04] pl-11 text-white placeholder-neutral-500 transition-all focus:border-emerald-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/40"
									required
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-sm font-medium text-neutral-300">
									Password
								</Label>
								<button
									type="button"
									onClick={handleForgotPassword}
									disabled={isSubmitting}
									className="text-sm text-neutral-500 transition-colors hover:text-emerald-400 disabled:opacity-50"
								>
									{resetEmailSent ? "Resend reset link?" : "Forgot password?"}
								</button>
							</div>
							<div className="relative">
								<Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="h-12 rounded-xl border-white/[0.08] bg-white/[0.04] pl-11 pr-11 text-white placeholder-neutral-500 transition-all focus:border-emerald-500/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/40"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="mt-1 h-12 w-full rounded-xl bg-emerald-500 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50"
						>
							{isSubmitting ? "Signing in…" : "Sign In"}
						</button>
					</form>

					<div className="mt-8 border-t border-white/[0.06] pt-6">
						<p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
							Your account includes
						</p>
						<ul className="space-y-2.5 text-sm text-neutral-400">
							<li className="flex items-center gap-2.5">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
									<svg
										className="h-3.5 w-3.5 text-emerald-400"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
										/>
									</svg>
								</span>
								Order history and shipment tracking
							</li>
							<li className="flex items-center gap-2.5">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
									<svg
										className="h-3.5 w-3.5 text-emerald-400"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
										/>
									</svg>
								</span>
								Saved lab and delivery addresses
							</li>
							<li className="flex items-center gap-2.5">
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
									<svg
										className="h-3.5 w-3.5 text-emerald-400"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
										/>
									</svg>
								</span>
								Secure, encrypted account access
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
