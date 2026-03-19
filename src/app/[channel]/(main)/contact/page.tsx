"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const contactReasons = [
	"Product inquiry",
	"Bulk / institutional pricing",
	"Certificate of Analysis request",
	"Shipping question",
	"Returns & refunds",
	"Affiliate program",
	"Other",
];

export default function ContactPage() {
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("sending");
		// TODO: wire to backend/email API
		setTimeout(() => setStatus("sent"), 1200);
	}

	return (
		<div className="bg-neutral-950 text-white">
			{/* Hero */}
			<section className="relative overflow-hidden py-20 sm:py-28">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">Get in Touch</p>
						<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Contact Us</h1>
						<p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
							Questions about products, bulk pricing, or your order? Our team typically responds within one
							business day.
						</p>
					</div>
				</div>
			</section>

			<section className="pb-24 sm:pb-32">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-16 lg:grid-cols-5 lg:gap-24">
						{/* Contact info */}
						<div className="lg:col-span-2">
							<h2 className="text-xl font-bold sm:text-2xl">How can we help?</h2>
							<p className="mt-4 text-sm leading-relaxed text-neutral-400">
								Whether you need a Certificate of Analysis, want to discuss bulk orders, or have a technical
								question about our compounds — we&apos;re here.
							</p>

							<dl className="mt-10 space-y-8">
								<div>
									<dt className="text-xs font-medium uppercase tracking-wider text-emerald-400">Email</dt>
									<dd className="mt-2">
										<a
											href="mailto:support@infinitybiolabs.com"
											className="text-sm text-neutral-300 transition-colors hover:text-white"
										>
											support@infinitybiolabs.com
										</a>
									</dd>
								</div>
								<div>
									<dt className="text-xs font-medium uppercase tracking-wider text-emerald-400">
										Response Time
									</dt>
									<dd className="mt-2 text-sm text-neutral-400">Within 1 business day (Mon-Fri)</dd>
								</div>
								<div>
									<dt className="text-xs font-medium uppercase tracking-wider text-emerald-400">
										Bulk Orders
									</dt>
									<dd className="mt-2 text-sm text-neutral-400">
										For institutional pricing and NET-30 terms, select &quot;Bulk / institutional
										pricing&quot; in the form.
									</dd>
								</div>
							</dl>
						</div>

						{/* Contact form */}
						<div className="lg:col-span-3">
							{status === "sent" ? (
								<div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] px-8 py-20 text-center">
									<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
										<svg className="h-8 w-8 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
											<path
												fillRule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<h3 className="mt-6 text-xl font-bold">Message Sent</h3>
									<p className="mt-2 text-neutral-400">We&apos;ll get back to you within one business day.</p>
								</div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid gap-6 sm:grid-cols-2">
										<div>
											<label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-300">
												Full Name
											</label>
											<input
												id="name"
												name="name"
												type="text"
												required
												className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
												placeholder="Dr. Jane Smith"
											/>
										</div>
										<div>
											<label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
												Email
											</label>
											<input
												id="email"
												name="email"
												type="email"
												required
												className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
												placeholder="jane@university.edu"
											/>
										</div>
									</div>

									<div>
										<label htmlFor="institution" className="mb-2 block text-sm font-medium text-neutral-300">
											Institution / Organization
										</label>
										<input
											id="institution"
											name="institution"
											type="text"
											className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
											placeholder="Stanford University"
										/>
									</div>

									<div>
										<label htmlFor="reason" className="mb-2 block text-sm font-medium text-neutral-300">
											Reason for Contact
										</label>
										<select
											id="reason"
											name="reason"
											required
											className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 text-sm text-white outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
										>
											<option value="">Select a reason...</option>
											{contactReasons.map((reason) => (
												<option key={reason} value={reason}>
													{reason}
												</option>
											))}
										</select>
									</div>

									<div>
										<label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-300">
											Message
										</label>
										<textarea
											id="message"
											name="message"
											required
											rows={5}
											className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
											placeholder="Tell us how we can help..."
										/>
									</div>

									<button
										type="submit"
										disabled={status === "sending"}
										className={cn(
											"h-12 w-full rounded-full text-sm font-semibold text-white transition-all sm:w-auto sm:px-10",
											status === "sending"
												? "cursor-not-allowed bg-emerald-500/50"
												: "bg-emerald-500 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25",
										)}
									>
										{status === "sending" ? "Sending..." : "Send Message"}
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
