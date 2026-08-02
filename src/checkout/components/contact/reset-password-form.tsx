"use client";

import { type FC, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { setPasswordWithBff } from "@/lib/auth/bff-client";
import { Button } from "@/ui/components/ui/button";
import { Label } from "@/ui/components/ui/label";
import { Input } from "@/ui/components/ui/input";
import { getQueryParams, createQueryString } from "@/checkout/lib/utils/url";
import { contactFieldAttributes } from "@/checkout/lib/consts/input-attributes";

export interface ResetPasswordFormProps {
	/** Called when password reset is successful */
	onSuccess: () => void | Promise<void>;
	/** Called when user wants to go back to sign in */
	onBackToSignIn: () => void;
}

/**
 * Form for setting a new password after clicking a reset link.
 */
export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ onSuccess, onBackToSignIn }) => {
	const t = useTranslations("account");
	const tCheckout = useTranslations("checkout.contact");
	const router = useRouter();
	const searchParams = useSearchParams();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password.length < 8) {
			setError(t("errors.passwordMinLength"));
			return;
		}

		if (password !== confirmPassword) {
			setError(t("errors.passwordsMismatch"));
			return;
		}

		const { passwordResetToken, passwordResetEmail } = getQueryParams(searchParams);

		if (!passwordResetToken) {
			setError(t("errors.invalidResetToken"));
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await setPasswordWithBff(passwordResetEmail || "", passwordResetToken, password);

			if (result.errors?.length) {
				setError(result.errors[0].message ?? t("errors.setPasswordFailed"));
			} else if (result.success) {
				const newQuery = createQueryString(searchParams, {
					passwordResetToken: null,
					passwordResetEmail: null,
				});
				router.replace(`?${newQuery}`, { scroll: false });
				onSuccess();
			} else {
				setError(t("errors.invalidResetToken"));
			}
		} catch {
			setError(t("errors.generic"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<h2 className="text-xl font-semibold">{tCheckout("resetPasswordTitle")}</h2>
				<p className="mt-1 text-sm text-muted-foreground">{tCheckout("resetPasswordSubtitle")}</p>
			</div>

			{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

			<div className="space-y-1.5">
				<Label htmlFor="new-password" className="text-sm font-medium">
					{t("fields.newPassword")}
				</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="new-password"
						type={showPassword ? "text" : "password"}
						name={contactFieldAttributes.newPassword.name}
						placeholder={t("placeholders.newPasswordMin")}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete={contactFieldAttributes.newPassword.autoComplete}
						className="h-12 pl-10 pr-10"
						required
						minLength={8}
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

			<div className="space-y-1.5">
				<Label htmlFor="confirm-password" className="text-sm font-medium">
					{t("fields.confirmPassword")}
				</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="confirm-password"
						type={showPassword ? "text" : "password"}
						name="confirmPassword"
						placeholder={t("placeholders.reenterPassword")}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						autoComplete={contactFieldAttributes.newPassword.autoComplete}
						className="h-12 pl-10"
						required
					/>
				</div>
			</div>

			<div className="flex items-center justify-between pt-2">
				<button
					type="button"
					onClick={onBackToSignIn}
					className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
				>
					{t("setPassword.backToSignIn")}
				</button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? t("setPassword.submitting") : t("setPassword.submit")}
				</Button>
			</div>
		</form>
	);
};
