"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { confirmAccountWithBffDeduped } from "@/lib/auth/confirm-account-client";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { Button, buttonClassName } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

type ConfirmState = "form" | "success" | "error";

type ConfirmErrorKey =
	| "invalidConfirmToken"
	| "confirmFailed"
	| "passwordRequired"
	| "invalidCredentials"
	| "resetLinkFailed"
	| "generic";

type Props = {
	email: string;
	token: string;
	locale: string;
	channel: string;
	/** Called after a successful confirmation (e.g. refresh checkout session). */
	onConfirmed?: () => void | Promise<void>;
	signInHref?: string;
	continueShoppingHref?: string;
};

export function ConfirmAccountMode({
	email,
	token,
	locale,
	channel,
	onConfirmed,
	signInHref,
	continueShoppingHref,
}: Props) {
	const t = useTranslations("account");
	const [state, setState] = useState<ConfirmState>("form");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [resetEmailSent, setResetEmailSent] = useState(false);
	const [resetMessage, setResetMessage] = useState("");
	const [errorKey, setErrorKey] = useState<ConfirmErrorKey | null>(null);
	const onConfirmedRef = useRef(onConfirmed);

	const loginHref = signInHref ?? buildStorefrontPath(locale, channel, "/login");
	const storeHref = continueShoppingHref ?? buildStorefrontPath(locale, channel);

	useEffect(() => {
		onConfirmedRef.current = onConfirmed;
	}, [onConfirmed]);

	async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErrorKey(null);

		if (!password) {
			setErrorKey("passwordRequired");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await confirmAccountWithBffDeduped(email, token, password);

			if (result.errors?.length) {
				const err = result.errors[0];
				const message = err.message?.toLowerCase() ?? "";
				const code = err.code ?? "";

				if (code === "INVALID_TOKEN" || message.includes("token")) {
					setErrorKey("invalidConfirmToken");
					setState("error");
					return;
				}

				if (code === "INVALID_CREDENTIALS" || code === "INVALID_PASSWORD" || message.includes("password")) {
					setErrorKey("invalidCredentials");
					return;
				}

				setErrorKey("confirmFailed");
				return;
			}

			if (result.success) {
				setState("success");
				await onConfirmedRef.current?.();
				return;
			}

			setErrorKey("confirmFailed");
			setState("error");
		} catch {
			setErrorKey("generic");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleForgotPassword() {
		setErrorKey(null);
		setResetMessage("");
		setIsResettingPassword(true);

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify({
					email,
					channel,
					redirectUrl: new URL(loginHref, window.location.origin).toString(),
				}),
			});

			const data = (await response.json()) as { errors?: Array<{ message: string }>; success?: boolean };

			if (!response.ok || data.errors?.length) {
				setErrorKey("resetLinkFailed");
				return;
			}

			setResetEmailSent(true);
			setResetMessage(t("login.resetSent", { email }));
		} catch {
			setErrorKey("generic");
		} finally {
			setIsResettingPassword(false);
		}
	}

	const errorMessage = errorKey ? t(`errors.${errorKey}`) : "";

	if (state === "success") {
		return (
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-8 w-8 text-green-600" aria-hidden />
						</div>
						<h1 className="text-balance text-h1">{t("confirm.successTitle")}</h1>
						<p className="text-muted-foreground">{t("confirm.successBody", { email })}</p>
						<Link
							href={loginHref}
							className={buttonClassName({
								asLink: true,
								className: "h-12 w-full text-base font-semibold",
							})}
						>
							{t("confirm.signIn")}
						</Link>
						<Link
							href={storeHref}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							{t("confirm.continueShopping")}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (state === "error") {
		return (
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="flex flex-col items-center gap-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
							<Mail className="h-8 w-8 text-muted-foreground" aria-hidden />
						</div>
						<h1 className="text-balance text-h1">{t("confirm.errorTitle")}</h1>
						<p role="alert" className="text-sm text-destructive">
							{errorMessage}
						</p>
						<Button
							type="button"
							variant="outline-solid"
							className="h-12 w-full text-base font-semibold"
							onClick={() => {
								setState("form");
								setErrorKey(null);
							}}
						>
							{t("confirm.tryAgain")}
						</Button>
						<Link
							href={storeHref}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							{t("confirm.continueShopping")}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-balance text-h1">{t("confirm.title")}</h1>
					<p className="mt-2 text-sm text-muted-foreground">{t("confirm.body", { email })}</p>
				</div>

				<form onSubmit={handleConfirm} className="space-y-4">
					{errorKey && (
						<div role="alert" className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">
							{errorMessage}
						</div>
					)}

					{resetMessage && (
						<div role="status" className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
							{resetMessage}
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="confirm-account-password" className="text-sm font-medium">
							{t("fields.password")}
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="confirm-account-password"
								type={showPassword ? "text" : "password"}
								placeholder={t("placeholders.password")}
								autoComplete="current-password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
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
							disabled={isSubmitting || isResettingPassword || resetEmailSent}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
						>
							{t("login.forgotPassword")}
						</button>
					</div>

					<Button
						type="submit"
						disabled={isSubmitting || isResettingPassword}
						className="h-12 w-full text-base font-semibold"
					>
						{isSubmitting ? t("confirm.submitting") : t("confirm.submit")}
					</Button>
				</form>
			</div>
		</div>
	);
}
