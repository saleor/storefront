"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function AffiliateApplicationForm() {
	const [status, setStatus] = useState<FormStatus>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("submitting");
		setErrorMessage("");

		const form = e.currentTarget;
		const data = {
			name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
			email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
			website: (form.elements.namedItem("website") as HTMLInputElement).value.trim(),
			social_media: (form.elements.namedItem("social_media") as HTMLInputElement).value.trim(),
			promotion_plan: (form.elements.namedItem("promotion_plan") as HTMLTextAreaElement).value.trim(),
		};

		try {
			const res = await fetch("/api/affiliate/apply", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = (await res.json()) as { error?: string; ok?: boolean };

			if (!res.ok) {
				setStatus("error");
				setErrorMessage(result.error || "Something went wrong. Please try again.");
				return;
			}

			setStatus("success");
		} catch {
			setStatus("error");
			setErrorMessage("Network error. Please check your connection and try again.");
		}
	}

	if (status === "success") {
		return (
			<div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
				<CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
				<h3 className="mt-4 text-xl font-semibold">Application Submitted</h3>
				<p className="mt-2 text-neutral-300">
					Thank you for your interest. We&apos;ll review your application and get back to you within a few
					business days.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{status === "error" && (
				<div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
					<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
					<p className="text-sm text-red-300">{errorMessage}</p>
				</div>
			)}

			<div className="grid gap-6 sm:grid-cols-2">
				{/* Name */}
				<div>
					<label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-200">
						Full Name <span className="text-red-400">*</span>
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						maxLength={200}
						placeholder="John Doe"
						className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					/>
				</div>

				{/* Email */}
				<div>
					<label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-200">
						Email <span className="text-red-400">*</span>
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						maxLength={200}
						placeholder="john@example.com"
						className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					/>
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				{/* Website */}
				<div>
					<label htmlFor="website" className="mb-2 block text-sm font-medium text-neutral-200">
						Website / Blog
					</label>
					<input
						id="website"
						name="website"
						type="url"
						maxLength={500}
						placeholder="https://yoursite.com"
						className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					/>
				</div>

				{/* Social Media */}
				<div>
					<label htmlFor="social_media" className="mb-2 block text-sm font-medium text-neutral-200">
						Social Media
					</label>
					<input
						id="social_media"
						name="social_media"
						type="text"
						maxLength={500}
						placeholder="@handle or profile URL"
						className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					/>
				</div>
			</div>

			{/* Promotion Plan */}
			<div>
				<label htmlFor="promotion_plan" className="mb-2 block text-sm font-medium text-neutral-200">
					How do you plan to promote InfinityBio Labs? <span className="text-red-400">*</span>
				</label>
				<textarea
					id="promotion_plan"
					name="promotion_plan"
					required
					maxLength={1000}
					rows={4}
					placeholder="Tell us about your audience, channels, and promotion strategy..."
					className="flex w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
				/>
			</div>

			<button
				type="submit"
				disabled={status === "submitting"}
				className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{status === "submitting" ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Submitting...
					</>
				) : (
					"Submit Application"
				)}
			</button>

			<p className="text-center text-xs text-neutral-500">
				By submitting, you agree to our affiliate program terms. We&apos;ll only use your email to communicate
				about the program.
			</p>
		</form>
	);
}
