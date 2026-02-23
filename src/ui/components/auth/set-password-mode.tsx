"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";

type Props = {
	email: string;
	token: string;
};

export function SetPasswordMode({ email, token }: Props) {
	const router = useRouter();
	const params = useParams<{ channel: string }>();

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
			setError("Please enter a new password");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/auth/set-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, token, password }),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string; code?: string }>;
				success?: boolean;
			};

			if (data.errors?.length) {
				const err = data.errors[0];
				if (err.code === "INVALID_TOKEN" || err.message?.includes("token")) {
					setError("This password reset link has expired. Please request a new one.");
				} else {
					setError(err.message || "Failed to set password");
				}
				return;
			}

			if (data.success) {
				setSuccess(true);
				setTimeout(() => {
					router.push(`/${params.channel}/login`);
					router.refresh();
				}, 2000);
			}
		} catch {
			setError("An error occurred. Please try again.");
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
						<h1 className="text-2xl font-semibold">Password Updated!</h1>
						<p className="text-muted-foreground">
							Your password has been successfully reset. You are now signed in.
						</p>
						<p className="text-sm text-muted-foreground">Redirecting you to the store…</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-semibold">Set New Password</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Enter a new password for <span className="font-medium">{email}</span>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<div role="alert" className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							New Password
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="At least 8 characters…"
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="confirmPassword" className="text-sm font-medium">
							Confirm Password
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirm your password"
								autoComplete="new-password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="h-12 pl-10 pr-10"
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								aria-label={showConfirmPassword ? "Hide password" : "Show password"}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? "Updating…" : "Update Password"}
					</Button>

					<div className="text-center">
						<Link
							href={`/${params.channel}/login`}
							className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground hover:no-underline"
						>
							Back to Sign In
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
