"use client";

import { type FC, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { loginWithBff } from "@/lib/auth/bff-client";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { requestCheckoutPasswordReset } from "@/app/(checkout)/actions";
import { contactFieldAttributes } from "@/checkout/lib/consts/input-attributes";

export interface SignInFormProps {
	/** Pre-filled email address */
	initialEmail?: string;
	/** Saleor channel slug for password reset */
	channelSlug: string;
	/** Called when sign-in is successful (may be async — form waits before clearing loading state) */
	onSuccess: () => void | Promise<void>;
	/** Called when user wants to checkout as guest */
	onGuestCheckout: () => void;
}

/**
 * Sign-in form with email, password, and forgot password functionality.
 */
export const SignInForm: FC<SignInFormProps> = ({
	initialEmail = "",
	channelSlug,
	onSuccess,
	onGuestCheckout,
}) => {
	const t = useTranslations("account");
	const tCheckout = useTranslations("checkout.contact");
	const [email, setEmail] = useState(initialEmail);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [passwordResetSent, setPasswordResetSent] = useState(false);

	const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
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
				setError(isInvalidCredentials ? t("errors.invalidCredentials") : t("errors.signInFailed"));
			} else if (result.ok) {
				await onSuccess();
			} else {
				setError(t("errors.signInFailed"));
			}
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleForgotPassword = async () => {
		setError("");
		setSuccessMessage("");

		if (!email) {
			setError(t("errors.invalidEmailFirst"));
			return;
		}

		if (!validateEmail(email)) {
			setError(t("errors.invalidEmail"));
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await requestCheckoutPasswordReset({
				email,
				channel: channelSlug,
				redirectUrl: window.location.href,
			});

			if (!result.ok) {
				setError(result.error || t("errors.resetLinkFailed"));
				return;
			}

			setPasswordResetSent(true);
			setSuccessMessage(t("login.resetSent", { email }));
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{tCheckout("signInTitle")}</h2>
				<p className="text-sm text-muted-foreground">
					{tCheckout("newCustomer")}{" "}
					<button
						type="button"
						onClick={onGuestCheckout}
						className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
					>
						{tCheckout("guestCheckout")}
					</button>
				</p>
			</div>

			{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

			{successMessage && (
				<div className="rounded-md bg-green-100 p-3 text-sm text-green-800">{successMessage}</div>
			)}

			<div className="space-y-1.5">
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="email"
						name={contactFieldAttributes.email.name}
						inputMode={contactFieldAttributes.email.inputMode}
						placeholder={t("fields.emailAddress")}
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setPasswordResetSent(false);
						}}
						autoComplete={contactFieldAttributes.email.autoComplete}
						className="h-12 pl-10"
						required
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type={showPassword ? "text" : "password"}
						name={contactFieldAttributes.currentPassword.name}
						placeholder={t("fields.password")}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={contactFieldAttributes.currentPassword.autoComplete}
						className="h-12 pl-10 pr-10"
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						aria-label={showPassword ? t("common.hidePassword") : t("common.showPassword")}
					>
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={handleForgotPassword}
					disabled={isSubmitting}
					className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline disabled:opacity-50"
				>
					{passwordResetSent ? t("login.resendResetLink") : t("login.forgotPassword")}
				</button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? tCheckout("processing") : t("login.submit")}
				</Button>
			</div>
		</form>
	);
};
