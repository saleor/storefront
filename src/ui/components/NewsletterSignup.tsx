"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

export function NewsletterSignup() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Basic email validation
		if (!email.includes("@")) {
			setError("Please enter a valid email address");
			setIsLoading(false);
			return;
		}

		setIsSubmitted(true);
		setIsLoading(false);
	};

	if (isSubmitted) {
		return (
			<section className="bg-primary-900 py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
					<div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
						<CheckCircle className="h-8 w-8 text-green-400" />
					</div>
					<h2 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h2>
					<p className="text-primary-200">
						Thanks for subscribing. Check your inbox for a welcome surprise.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-primary-900 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto text-center">
					<div className="mx-auto w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
						<Mail className="h-6 w-6 text-primary-200" />
					</div>
					<h2 className="text-2xl font-bold text-white mb-2">
						Stay in the Loop
					</h2>
					<p className="text-primary-200 mb-8">
						Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
					</p>

					<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
						<div className="flex-1">
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
								fullWidth
								error={error}
								className="bg-white/10 border-white/20 text-white placeholder:text-primary-300"
							/>
						</div>
						<Button
							type="submit"
							variant="primary"
							loading={isLoading}
							className="bg-white text-primary-900 hover:bg-primary-50 whitespace-nowrap"
						>
							Subscribe
						</Button>
					</form>

					<p className="mt-4 text-xs text-primary-300">
						By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
					</p>
				</div>
			</div>
		</section>
	);
}
