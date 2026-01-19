"use client";

import { type FC, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/components/ui/button";
import { Label } from "@/ui/components/ui/label";
import { Input } from "@/ui/components/ui/input";
import { getQueryParams, createQueryString } from "@/checkout/lib/utils/url";

export interface ResetPasswordFormProps {
	/** Called when password reset is successful */
	onSuccess: () => void;
	/** Called when user wants to go back to sign in */
	onBackToSignIn: () => void;
}

/**
 * Form for setting a new password after clicking a reset link.
 *
 * Expects URL query params:
 * - passwordResetToken: The token from the reset email
 * - passwordResetEmail: The user's email address
 *
 * Features:
 * - Password confirmation
 * - Minimum length validation (8 chars)
 * - Password visibility toggle
 * - Clears URL params after success
 */
export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ onSuccess, onBackToSignIn }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { resetPassword } = useSaleorAuthContext();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		const { passwordResetToken, passwordResetEmail } = getQueryParams(searchParams);

		if (!passwordResetToken) {
			setError("Invalid or expired reset link");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await resetPassword({
				password,
				email: passwordResetEmail || "",
				token: passwordResetToken,
			});

			if (result.data?.setPassword?.errors?.length) {
				const err = result.data.setPassword.errors[0];
				setError(err.message || "Failed to reset password");
			} else if (result.data?.setPassword?.token) {
				// Clear the URL params
				const newQuery = createQueryString(searchParams, {
					passwordResetToken: null,
					passwordResetEmail: null,
				});
				router.replace(`?${newQuery}`, { scroll: false });
				onSuccess();
			} else {
				setError("Failed to reset password. The link may have expired.");
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<h2 className="text-xl font-semibold">Reset your password</h2>
				<p className="mt-1 text-sm text-muted-foreground">Enter a new password for your account</p>
			</div>

			{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

			<div className="space-y-1.5">
				<Label htmlFor="new-password" className="text-sm font-medium">
					New password
				</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="new-password"
						type={showPassword ? "text" : "password"}
						placeholder="Minimum 8 characters"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
						className="h-12 pl-10 pr-10"
						required
						minLength={8}
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

			<div className="space-y-1.5">
				<Label htmlFor="confirm-password" className="text-sm font-medium">
					Confirm password
				</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="confirm-password"
						type={showPassword ? "text" : "password"}
						placeholder="Re-enter your password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						autoComplete="new-password"
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
					Back to sign in
				</button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Resetting..." : "Reset password"}
				</Button>
			</div>
		</form>
	);
};
