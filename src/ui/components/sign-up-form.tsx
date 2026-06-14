"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { buildAccountConfirmationRedirectUrl } from "@/lib/auth/account-confirmation-url";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { cn } from "@/lib/utils";

export function SignUpForm() {
	const t = useTranslations("account");
	const params = useParams<{ locale: string; channel: string }>();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !validateEmail(email)) {
			setError(t("errors.invalidEmail"));
			return;
		}

		if (password.length < 8) {
			setError(t("errors.passwordMinLength"));
			return;
		}

		if (password !== confirmPassword) {
			setError(t("errors.passwordsMismatch"));
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
					firstName,
					lastName,
					channel: params.channel,
					redirectUrl: buildAccountConfirmationRedirectUrl(
						window.location.origin,
						params.locale,
						params.channel,
					),
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string; code?: string }>;
				user?: { id: string; email: string };
			};

			if (data.errors?.length) {
				const err = data.errors[0];
				if (err.code === "UNIQUE") {
					setError(t("errors.accountExists"));
				} else {
					setError(t("errors.createAccountFailed"));
				}
				return;
			}

			setSuccess(true);
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (success) {
		return (
			<div className="mx-auto mt-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<svg
								aria-hidden="true"
								className="h-6 w-6 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h2 className="text-xl font-semibold">{t("signup.successTitle")}</h2>
						<p className="mt-2 text-muted-foreground">{t("signup.successBody")}</p>
						<Link
							href={buildStorefrontPath(params.locale, params.channel, "/login")}
							className="mt-6 inline-block text-sm font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							{t("signup.goToSignIn")}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto mt-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold">{t("signup.title")}</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{t("signup.hasAccount")}{" "}
						<Link
							href={buildStorefrontPath(params.locale, params.channel, "/login")}
							className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							{t("signup.signIn")}
						</Link>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div role="alert" className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label htmlFor="firstName" className="text-sm font-medium">
								{t("fields.firstName")}
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="firstName"
									type="text"
									placeholder={t("placeholders.firstName")}
									autoComplete="given-name"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="h-12 pl-10"
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="lastName" className="text-sm font-medium">
								{t("fields.lastName")}
							</Label>
							<Input
								id="lastName"
								type="text"
								placeholder={t("placeholders.lastName")}
								autoComplete="family-name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="h-12"
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							{t("fields.emailAddress")}
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder={t("placeholders.email")}
								autoComplete="email"
								spellCheck={false}
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
								placeholder={t("placeholders.newPasswordMin")}
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
								minLength={8}
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

					<div className="space-y-1.5">
						<Label htmlFor="confirmPassword" className="text-sm font-medium">
							{t("fields.confirmPassword")}
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="confirmPassword"
								type={showPassword ? "text" : "password"}
								placeholder={t("placeholders.reenterPassword")}
								autoComplete="new-password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className={cn(
									"h-12 pl-10",
									confirmPassword && password !== confirmPassword && "border-destructive",
								)}
								required
							/>
						</div>
						{confirmPassword && password !== confirmPassword && (
							<p className="text-sm text-destructive">{t("errors.passwordsMismatch")}</p>
						)}
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? t("signup.submitting") : t("signup.submit")}
					</Button>

					<p className="text-center text-xs text-muted-foreground">
						{t.rich("signup.terms", {
							terms: (chunks) => (
								<Link href="#" className="underline hover:no-underline">
									{chunks}
								</Link>
							),
							privacy: (chunks) => (
								<Link href="#" className="underline hover:no-underline">
									{chunks}
								</Link>
							),
						})}
					</p>
				</form>
			</div>
		</div>
	);
}
