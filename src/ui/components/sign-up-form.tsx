"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { cn } from "@/lib/utils";

export function SignUpForm() {
	const params = useParams<{ channel: string }>();

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

		// Validation
		if (!email || !validateEmail(email)) {
			setError("Please enter a valid email address");
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
			// Call Saleor accountRegister mutation
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
					firstName,
					lastName,
					channel: params.channel,
					redirectUrl: `${window.location.origin}/${params.channel}/login`,
				}),
			});

			const data = (await response.json()) as {
				errors?: Array<{ message: string; code?: string }>;
				user?: { id: string; email: string };
			};

			if (data.errors?.length) {
				const err = data.errors[0];
				if (err.code === "UNIQUE") {
					setError("An account with this email already exists. Please sign in instead.");
				} else {
					setError(err.message || "Failed to create account");
				}
				return;
			}

			// Success - show confirmation message
			setSuccess(true);
		} catch {
			setError("An error occurred. Please try again.");
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
							<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h2 className="text-xl font-semibold">Account Created!</h2>
						<p className="mt-2 text-muted-foreground">Please check your email to verify your account.</p>
						<Link
							href={`/${params.channel}/login`}
							className="mt-6 inline-block text-sm font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							Go to Sign In
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
					<h1 className="text-2xl font-semibold">Create an Account</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link
							href={`/${params.channel}/login`}
							className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
						>
							Sign in
						</Link>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && <div className="bg-destructive/10 rounded-md p-3 text-sm text-destructive">{error}</div>}

					{/* Name fields */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label htmlFor="firstName" className="text-sm font-medium">
								First name
							</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									id="firstName"
									type="text"
									placeholder="First name"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="h-12 pl-10"
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="lastName" className="text-sm font-medium">
								Last name
							</Label>
							<Input
								id="lastName"
								type="text"
								placeholder="Last name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="h-12"
							/>
						</div>
					</div>

					{/* Email */}
					<div className="space-y-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							Email address
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-12 pl-10"
								required
							/>
						</div>
					</div>

					{/* Password */}
					<div className="space-y-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							Password
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Minimum 8 characters"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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

					{/* Confirm Password */}
					<div className="space-y-1.5">
						<Label htmlFor="confirmPassword" className="text-sm font-medium">
							Confirm password
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								id="confirmPassword"
								type={showPassword ? "text" : "password"}
								placeholder="Re-enter your password"
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
							<p className="text-sm text-destructive">Passwords do not match</p>
						)}
					</div>

					<Button type="submit" disabled={isSubmitting} className="h-12 w-full text-base font-semibold">
						{isSubmitting ? "Creating account..." : "Create Account"}
					</Button>

					<p className="text-center text-xs text-muted-foreground">
						By creating an account, you agree to our{" "}
						<Link href="#" className="underline hover:no-underline">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link href="#" className="underline hover:no-underline">
							Privacy Policy
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
