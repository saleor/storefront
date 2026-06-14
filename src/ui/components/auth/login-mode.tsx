"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginWithBff, syncAuthSurfacesAfterSignIn } from "@/lib/auth";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginMode() {
	const t = useTranslations("account");
	const params = useParams<{ locale: string; channel: string }>();
	const router = useRouter();

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
			setError(t("errors.invalidEmail"));
			return;
		}

		if (!password) {
			setError(t("errors.passwordRequired"));
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await loginWithBff(email, password);

			if (result.errors?.length) {
				const err = result.errors[0];
				const isInvalidCredentials =
					err.code === "INVALID_CREDENTIALS" ||
					err.code === "INVALID_PASSWORD" ||
					err.message?.toLowerCase().includes("invalid") ||
					err.message?.toLowerCase().includes("credentials");
				const isRateLimited = err.code === "RATE_LIMITED";
				setError(
					isRateLimited
						? t("errors.rateLimited")
						: isInvalidCredentials
							? t("errors.invalidCredentials")
							: t("errors.signInFailed"),
				);
				return;
			}

			if (result.ok) {
				await syncAuthSurfacesAfterSignIn(params.channel, router, {
					redirectTo: buildStorefrontPath(params.locale, params.channel),
				});
				return;
			}

			setError(t("errors.signInFailed"));
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		setError("");
		setResetMessage("");

		if (!email || !EMAIL_RE.test(email)) {
			setError(t("errors.invalidEmailFirst"));
			return;
		}

		setIsSubmitting(true);

		try {
			const loginPath = buildStorefrontPath(params.locale, params.channel, "/login");
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					channel: params.channel,
					redirectUrl: `${window.location.origin}${loginPath}`,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				setError(t("errors.resetLinkFailed"));
				return;
			}

			setResetEmailSent(true);
			setResetMessage(t("login.resetSent", { email }));
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold">{t("login.title")}</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{t("login.noAccount")}{" "}
						<Link
							href={buildStorefrontPath(params.locale, params.channel, "/signup")}
							className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							{t("login.signUp")}
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
						<div role="status" className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
							{resetMessage}
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							{t("fields.email")}
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder={t("placeholders.email")}
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-12 pl-10"
								required
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							{t("fields.password")}
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder={t("placeholders.password")}
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? t("common.hidePassword") : t("common.showPassword")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					<div className="flex justify-end">
						<button
							type="button"
							onClick={() => void handleForgotPassword()}
							disabled={isSubmitting || resetEmailSent}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
						>
							{t("login.forgotPassword")}
						</button>
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? t("login.submitting") : t("login.submit")}
					</Button>
				</form>
			</div>
		</div>
	);
}
