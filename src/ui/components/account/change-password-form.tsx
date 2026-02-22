"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { changePassword } from "@/app/[channel]/(main)/account/actions";

export function ChangePasswordForm() {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = useCallback(
		(formData: FormData) => {
			setError("");
			setSuccess(false);

			startTransition(async () => {
				const result = await changePassword(formData);
				if (!result.success) {
					setError(result.error);
				} else {
					setSuccess(true);
					setIsOpen(false);
					formRef.current?.reset();
				}
			});
		},
		[startTransition],
	);

	if (!isOpen) {
		return (
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-muted-foreground">Password</p>
					<p className="font-medium">••••••••</p>
				</div>
				<div className="flex items-center gap-2">
					{success && (
						<span aria-live="polite" className="text-sm text-green-600">
							Updated
						</span>
					)}
					<Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
						Change
					</Button>
				</div>
			</div>
		);
	}

	return (
		<form ref={formRef} action={handleSubmit} className="space-y-4">
			<p className="text-sm text-muted-foreground">Password</p>
			{error && (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}

			<div className="space-y-1.5">
				<Label htmlFor="oldPassword">Current password</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="oldPassword"
						name="oldPassword"
						type={showOld ? "text" : "password"}
						autoComplete="current-password"
						className="pl-10 pr-10"
						required
					/>
					<button
						type="button"
						onClick={() => setShowOld(!showOld)}
						aria-label={showOld ? "Hide password" : "Show password"}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						{showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="newPassword">New password</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="newPassword"
						name="newPassword"
						type={showNew ? "text" : "password"}
						autoComplete="new-password"
						placeholder="At least 8 characters…"
						className="pl-10 pr-10"
						minLength={8}
						required
					/>
					<button
						type="button"
						onClick={() => setShowNew(!showNew)}
						aria-label={showNew ? "Hide password" : "Show password"}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						{showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="confirmPassword">Confirm new password</Label>
				<div className="relative">
					<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autoComplete="new-password"
						className="pl-10"
						minLength={8}
						required
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<Button type="submit" size="sm" disabled={isPending}>
					{isPending ? "Changing…" : "Change password"}
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => {
						setIsOpen(false);
						setError("");
						formRef.current?.reset();
					}}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
