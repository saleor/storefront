import type { Metadata } from "next";
import { HomepageFAQ } from "../homepage-faq";

export const metadata: Metadata = {
	title: "FAQ | InfinityBio Labs",
	description:
		"Frequently asked questions about InfinityBio Labs research peptides — purity standards, shipping, storage, Certificates of Analysis, returns, and bulk pricing.",
};

export default function FAQPage() {
	return (
		<div className="bg-neutral-950 text-white">
			{/* Hero */}
			<section className="relative overflow-hidden py-24 sm:py-32">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">Support</p>
						<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
							Frequently Asked Questions
						</h1>
						<p className="mt-6 text-lg leading-relaxed text-neutral-300">
							Everything you need to know about our research compounds, quality standards, and ordering
							process.
						</p>
					</div>
				</div>
			</section>

			{/* FAQ accordion (reuses existing component) */}
			<HomepageFAQ />

			{/* Contact CTA */}
			<section className="border-t border-neutral-800 py-24 sm:py-32">
				<div className="mx-auto max-w-3xl px-6 text-center">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Still have questions?</h2>
					<p className="mt-4 text-neutral-400">
						Our support team is here to help. Reach out and we&apos;ll get back to you within one business
						day.
					</p>
					<a
						href="mailto:support@infinitybiolabs.com"
						className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
					>
						Contact Support
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</section>
		</div>
	);
}
