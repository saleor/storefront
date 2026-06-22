"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { setPasswordWithBff, syncAuthSurfacesAfterSignIn } from "@/lib/auth";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

type Props = {
	email: string;
	token: string;
};

export function SetPasswordMode({ email, token }: Props) {
	const t = useTranslations("account");
	const router = useRouter();
	const params = useParams<{ locale: string; channel: string }>();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!password) {
			setError(t("errors.newPasswordRequired"));
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
			const data = await setPasswordWithBff(email, token, password);

			if (data.errors?.length) {
				const err = data.errors[0];
				if (err.code === "INVALID_TOKEN" || err.message?.includes("token")) {
					setError(t("errors.invalidResetToken"));
				} else {
					setError(t("errors.setPasswordFailed"));
				}
				return;
			}

			if (data.success) {
				setSuccess(true);
				await syncAuthSurfacesAfterSignIn(params.channel, router, { skipRefresh: true });
				setTimeout(() => {
					window.location.assign(buildStorefrontPath(params.locale, params.channel));
				}, 2000);
			}
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (success) {
		return (
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-8 w-8 text-green-600" />
						</div>
						<h1 className="text-balance text-h1">{t("setPassword.successTitle")}</h1>
						<p className="text-muted-foreground">{t("setPassword.successBody")}</p>
						<p className="text-sm text-muted-foreground">{t("setPassword.redirecting")}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-balance text-h1">{t("setPassword.title")}</h1>
					<p className="mt-2 text-sm text-muted-foreground">{t("setPassword.subtitle", { email })}</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div role="alert" className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							{t("fields.newPassword")}
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
								type={showConfirmPassword ? "text" : "password"}
								placeholder={t("placeholders.confirmPassword")}
								autoComplete="new-password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								aria-label={showConfirmPassword ? t("common.hidePassword") : t("common.showPassword")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? t("setPassword.submitting") : t("setPassword.submit")}
					</Button>

					<div className="text-center">
						<Link
							href={buildStorefrontPath(params.locale, params.channel, "/login")}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							{t("setPassword.backToSignIn")}
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
