"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

type AuthMode = "login" | "register" | "forgot-password";

export function AuthForms() {
	const [mode, setMode] = useState<AuthMode>("login");

	return (
		<div className="mx-auto max-w-md">
			{mode === "login" && (
				<LoginForm
					onSwitchToRegister={() => setMode("register")}
					onSwitchToForgotPassword={() => setMode("forgot-password")}
				/>
			)}
			{mode === "register" && <RegisterForm onSwitchToLogin={() => setMode("login")} />}
			{mode === "forgot-password" && <ForgotPasswordForm onSwitchToLogin={() => setMode("login")} />}
		</div>
	);
}

interface LoginFormProps {
	onSwitchToRegister: () => void;
	onSwitchToForgotPassword: () => void;
}

function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword }: LoginFormProps) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				router.refresh();
				router.push("/orders");
			} else {
				const data = (await response.json()) as { message?: string };
				setError(data.message || "Invalid email or password");
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-secondary-200 bg-white p-8 shadow-sm">
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-bold text-secondary-900">Welcome Back</h1>
				<p className="mt-2 text-secondary-600">Sign in to your account</p>
			</div>

			{error && (
				<div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Input
						type="email"
						label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						required
						fullWidth
						leftIcon={<Mail className="h-5 w-5" />}
					/>
				</div>

				<div>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							label="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							fullWidth
							leftIcon={<Lock className="h-5 w-5" />}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<label className="flex items-center gap-2">
						<input
							type="checkbox"
							className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
						/>
						<span className="text-sm text-secondary-600">Remember me</span>
					</label>
					<button
						type="button"
						onClick={onSwitchToForgotPassword}
						className="text-sm text-primary-600 hover:text-primary-700"
					>
						Forgot password?
					</button>
				</div>

				<Button type="submit" variant="primary" fullWidth loading={isLoading}>
					{isLoading ? "Signing in..." : "Sign In"}
				</Button>
			</form>

			<div className="mt-6 text-center">
				<p className="text-sm text-secondary-600">
					Don&apos;t have an account?{" "}
					<button
						type="button"
						onClick={onSwitchToRegister}
						className="font-medium text-primary-600 hover:text-primary-700"
					>
						Create one
					</button>
				</p>
			</div>
		</div>
	);
}

interface RegisterFormProps {
	onSwitchToLogin: () => void;
}

function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = (await response.json()) as { message?: string };

			if (response.ok) {
				setSuccess(true);
			} else {
				setError(data.message || "Registration failed");
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Show success message after registration
	if (success) {
		return (
			<div className="rounded-lg border border-secondary-200 bg-white p-8 text-center shadow-sm">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
					<Mail className="h-6 w-6 text-green-600" />
				</div>
				<h2 className="mb-2 text-xl font-bold text-secondary-900">Check your email</h2>
				<p className="mb-6 text-secondary-600">
					We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>. Please click the link to
					activate your account.
				</p>
				<button
					type="button"
					onClick={onSwitchToLogin}
					className="font-medium text-primary-600 hover:text-primary-700"
				>
					Back to sign in
				</button>
			</div>
		);
	}

	// Password strength indicator
	const getPasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		return strength;
	};

	const passwordStrength = getPasswordStrength(formData.password);
	const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
	const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

	return (
		<div className="rounded-lg border border-secondary-200 bg-white p-8 shadow-sm">
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-bold text-secondary-900">Create Account</h1>
				<p className="mt-2 text-secondary-600">Join us today</p>
			</div>

			{error && (
				<div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<Input
						type="text"
						name="firstName"
						label="First Name"
						value={formData.firstName}
						onChange={handleChange}
						placeholder="John"
						required
						fullWidth
					/>
					<Input
						type="text"
						name="lastName"
						label="Last Name"
						value={formData.lastName}
						onChange={handleChange}
						placeholder="Doe"
						required
						fullWidth
					/>
				</div>

				<Input
					type="email"
					name="email"
					label="Email"
					value={formData.email}
					onChange={handleChange}
					placeholder="you@example.com"
					required
					fullWidth
					leftIcon={<Mail className="h-5 w-5" />}
				/>

				<div>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							name="password"
							label="Password"
							value={formData.password}
							onChange={handleChange}
							placeholder="••••••••"
							required
							fullWidth
							leftIcon={<Lock className="h-5 w-5" />}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
					{formData.password && (
						<div className="mt-2">
							<div className="mb-1 flex gap-1">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className={clsx(
											"h-1 flex-1 rounded",
											i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-secondary-200",
										)}
									/>
								))}
							</div>
							<p className="text-xs text-secondary-500">
								Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
							</p>
						</div>
					)}
				</div>

				<Input
					type="password"
					name="confirmPassword"
					label="Confirm Password"
					value={formData.confirmPassword}
					onChange={handleChange}
					placeholder="••••••••"
					required
					fullWidth
					leftIcon={<Lock className="h-5 w-5" />}
				/>

				<Button type="submit" variant="primary" fullWidth loading={isLoading}>
					{isLoading ? "Creating account..." : "Create Account"}
				</Button>
			</form>

			<div className="mt-6 text-center">
				<p className="text-sm text-secondary-600">
					Already have an account?{" "}
					<button
						type="button"
						onClick={onSwitchToLogin}
						className="font-medium text-primary-600 hover:text-primary-700"
					>
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
}

interface ForgotPasswordFormProps {
	onSwitchToLogin: () => void;
}

function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setIsSubmitted(true);
			} else {
				const data = (await response.json()) as { message?: string };
				setError(data.message || "Failed to send reset email");
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="rounded-lg border border-secondary-200 bg-white p-8 text-center shadow-sm">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
					<Mail className="h-6 w-6 text-green-600" />
				</div>
				<h2 className="mb-2 text-xl font-bold text-secondary-900">Check your email</h2>
				<p className="mb-6 text-secondary-600">
					We&apos;ve sent a password reset link to <strong>{email}</strong>
				</p>
				<button
					type="button"
					onClick={onSwitchToLogin}
					className="font-medium text-primary-600 hover:text-primary-700"
				>
					Back to sign in
				</button>
			</div>
		);
	}

	return (
		<div className="rounded-lg border border-secondary-200 bg-white p-8 shadow-sm">
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-bold text-secondary-900">Reset Password</h1>
				<p className="mt-2 text-secondary-600">Enter your email and we&apos;ll send you a reset link</p>
			</div>

			{error && (
				<div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					type="email"
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					required
					fullWidth
					leftIcon={<Mail className="h-5 w-5" />}
				/>

				<Button type="submit" variant="primary" fullWidth loading={isLoading}>
					{isLoading ? "Sending..." : "Send Reset Link"}
				</Button>
			</form>

			<div className="mt-6 text-center">
				<button
					type="button"
					onClick={onSwitchToLogin}
					className="text-sm font-medium text-primary-600 hover:text-primary-700"
				>
					Back to sign in
				</button>
			</div>
		</div>
	);
}
