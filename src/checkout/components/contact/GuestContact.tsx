"use client";

import { type FC, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Info } from "lucide-react";
import { Label } from "@/ui/components/ui/Label";
import { Checkbox } from "@/ui/components/ui/Checkbox";
import { Input } from "@/ui/components/ui/Input";
import { cn } from "@/lib/utils";

// Re-export for backward compatibility
export { FormInput, FieldError } from "@/checkout/views/SaleorCheckout/AddressFormFields";

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
 *
 * Features:
 * - Email input with icon
 * - "Have an account? Log in" link
 * - Optional "Create account" checkbox
 * - Password field (shown when create account is checked)
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
	const [showPassword, setShowPassword] = useState(false);

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">Contact</h2>
				<p className="text-sm text-muted-foreground">
					Have an account?{" "}
					<button
						type="button"
						onClick={onSignInClick}
						className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
					>
						Log in
					</button>
				</p>
			</div>

			<div className="space-y-1.5">
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="email"
						placeholder="Email address"
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						onBlur={onEmailBlur}
						autoComplete="email"
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
					Create an account for faster checkout next time
				</Label>
			</div>

			{createAccount && (
				<div className="space-y-3">
					<div className="space-y-1.5">
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type={showPassword ? "text" : "password"}
								placeholder="Password (minimum 8 characters)"
								value={password}
								onChange={(e) => onPasswordChange(e.target.value)}
								autoComplete="new-password"
								className={cn("h-12 pl-10 pr-10", passwordError && "border-destructive")}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
						{passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
					</div>
					{/* Account activation notice */}
					<div className="bg-muted/50 flex items-start gap-2 rounded-md p-3 text-sm text-muted-foreground">
						<Info className="mt-0.5 h-4 w-4 shrink-0" />
						<p>
							After checkout, you&apos;ll receive an email to activate your account before you can sign in.
						</p>
					</div>
				</div>
			)}
		</section>
	);
};
