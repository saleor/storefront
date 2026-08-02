"use client";

import { type FC, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Label } from "@/ui/components/ui/label";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { Input } from "@/ui/components/ui/input";
import { cn } from "@/lib/utils";
import { contactFieldAttributes } from "@/checkout/lib/consts/input-attributes";

// Re-export for backward compatibility
export { FormInput, FieldError } from "@/checkout/views/saleor-checkout/address-form-fields";

export interface GuestContactProps {
	/** Current email value */
	email: string;
	/** Called when email changes */
	onEmailChange: (email: string) => void;
	/** Called when email field loses focus (for validation) */
	onEmailBlur?: () => void;
	/** Email validation error */
	emailError?: string;
	/** Called when user wants to sign in */
	onSignInClick: () => void;
	/** Whether "create account" is checked */
	createAccount: boolean;
	/** Called when create account checkbox changes */
	onCreateAccountChange: (checked: boolean) => void;
	/** Password value (only used when createAccount is true) */
	password: string;
	/** Called when password changes */
	onPasswordChange: (password: string) => void;
	/** Password validation error */
	passwordError?: string;
}

/**
 * Guest checkout contact section.
 */
export const GuestContact: FC<GuestContactProps> = ({
	email,
	onEmailChange,
	onEmailBlur,
	emailError,
	onSignInClick,
	createAccount,
	onCreateAccountChange,
	password,
	onPasswordChange,
	passwordError,
}) => {
	const t = useTranslations("account");
	const tCheckout = useTranslations("checkout");
	const [showPassword, setShowPassword] = useState(false);

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{tCheckout("contact.title")}</h2>
				<p className="text-sm text-muted-foreground">
					{tCheckout("contact.haveAccount")}{" "}
					<button
						type="button"
						onClick={onSignInClick}
						className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
					>
						{tCheckout("actions.logIn")}
					</button>
				</p>
			</div>

			<div className="space-y-1.5">
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="email"
						name={contactFieldAttributes.email.name}
						inputMode={contactFieldAttributes.email.inputMode}
						placeholder={t("fields.emailAddress")}
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						onBlur={onEmailBlur}
						autoComplete={contactFieldAttributes.email.autoComplete}
						className={cn("h-12 pl-10", emailError && "border-destructive")}
						aria-invalid={!!emailError}
						aria-describedby={emailError ? "email-error" : undefined}
					/>
				</div>
				{emailError && (
					<p id="email-error" role="alert" className="text-sm text-destructive">
						{emailError}
					</p>
				)}
			</div>

			<div className="flex items-center gap-3">
				<Checkbox
					id="createAccount"
					checked={createAccount}
					onCheckedChange={(checked) => onCreateAccountChange(checked === true)}
				/>
				<Label htmlFor="createAccount" className="cursor-pointer text-sm text-muted-foreground">
					{tCheckout("contact.createAccountLabel")}
				</Label>
			</div>

			{createAccount && (
				<div className="space-y-3">
					<div className="space-y-1.5">
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type={showPassword ? "text" : "password"}
								name={contactFieldAttributes.newPassword.name}
								placeholder={tCheckout("contact.passwordMinPlaceholder")}
								value={password}
								onChange={(e) => onPasswordChange(e.target.value)}
								autoComplete={contactFieldAttributes.newPassword.autoComplete}
								className={cn("h-12 pl-10 pr-10", passwordError && "border-destructive")}
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
						{passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
					</div>
					<div className="bg-muted/50 flex items-start gap-2 rounded-md p-3 text-sm text-muted-foreground">
						<Info className="mt-0.5 h-4 w-4 shrink-0" />
						<p>{tCheckout("contact.activationNotice")}</p>
					</div>
				</div>
			)}
		</section>
	);
};
