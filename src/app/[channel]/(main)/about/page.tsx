import type { Metadata } from "next";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "About | InfinityBio Labs",
	description:
		"InfinityBio Labs provides pharmaceutical-grade research peptides with 99%+ purity. Learn about our mission, quality standards, and commitment to advancing research.",
};

const milestones = [
	{
		year: "2022",
		title: "Founded",
		description:
			"InfinityBio Labs established with a mission to provide researchers with the highest-purity peptides available.",
	},
	{
		year: "2023",
		title: "ISO Compliance",
		description:
			"Achieved ISO-compliant manufacturing processes and launched third-party testing partnerships.",
	},
	{
		year: "2024",
		title: "50+ Compounds",
		description:
			"Expanded our catalog to over 50 research-grade compounds across multiple therapeutic categories.",
	},
	{
		year: "2025",
		title: "Global Reach",
		description: "Serving researchers in 30+ countries with cold-chain logistics and same-day processing.",
	},
	{
		year: "2026",
		title: "73+ Compounds",
		description:
			"Continuing to expand our portfolio while maintaining ≥98% purity standards across every batch.",
	},
];

const values = [
	{
		title: "Purity Without Compromise",
		description:
			"Every compound undergoes HPLC analysis and independent verification. We reject batches that don't meet our thresholds — no exceptions.",
		icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
	},
	{
		title: "Full Transparency",
		description:
			"Batch-specific Certificates of Analysis with every order. HPLC chromatograms, mass spectrometry data, and endotoxin results — all available on request.",
		icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
	},
	{
		title: "Research-First Approach",
		description:
			"Built by researchers, for researchers. We understand the importance of reproducibility and provide compounds that deliver consistent results across experiments.",
		icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94.94a1.5 1.5 0 00-.22 1.927l2.3 3.45A1.5 1.5 0 007.39 21.5h9.22a1.5 1.5 0 001.25-.683l2.3-3.45a1.5 1.5 0 00-.22-1.927L19.8 15.3M5 14.5h14.8",
	},
	{
		title: "Cold-Chain Integrity",
		description:
			"Temperature-controlled packaging from synthesis to delivery. We don't cut corners on stability — your compounds arrive in optimal condition.",
		icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
	},
];

const stats = [
	{ value: "73+", label: "Research Compounds" },
	{ value: "≥98%", label: "Minimum Purity" },
	{ value: "30+", label: "Countries Served" },
	{ value: "48h", label: "Processing Time" },
];

export default function AboutPage() {
	return (
		<div className="bg-neutral-950 text-white">
			{/* Hero */}
			<section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">About Us</p>
						<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
							Advancing Research Through
							<br />
							<span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
								Uncompromising Quality
							</span>
						</h1>
						<p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
							InfinityBio Labs was founded on a simple premise: researchers deserve peptides they can trust.
							We provide pharmaceutical-grade compounds with verified purity, full documentation, and
							cold-chain delivery — so you can focus on what matters: the science.
						</p>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="border-y border-neutral-800">
				<div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-neutral-800 lg:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.label} className="px-4 py-8 text-center sm:px-6 sm:py-12">
							<p className="font-mono text-2xl font-bold tracking-tight text-emerald-400 sm:text-3xl lg:text-4xl">
								{stat.value}
							</p>
							<p className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Values */}
			<section className="py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">Our Principles</p>
						<h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
							What Sets Us Apart
						</h2>
					</div>

					<div className="mt-16 grid gap-8 sm:grid-cols-2">
						{values.map((value) => (
							<div
								key={value.title}
								className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
									<svg
										className="h-6 w-6 text-emerald-400"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.5}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
									</svg>
								</div>
								<h3 className="mt-5 text-lg font-semibold">{value.title}</h3>
								<p className="mt-3 text-sm leading-relaxed text-neutral-400">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Timeline */}
			<section className="border-t border-neutral-800 py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">Our Journey</p>
						<h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
							Built Step by Step
						</h2>
					</div>

					<div className="relative mx-auto mt-16 max-w-3xl">
						{/* Vertical line */}
						<div className="absolute left-4 top-0 h-full w-px bg-neutral-800 sm:left-1/2 sm:-translate-x-px" />

						<div className="space-y-12">
							{milestones.map((milestone, i) => (
								<div
									key={milestone.year}
									className={cn(
										"relative flex items-start gap-6 sm:gap-8",
										i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
									)}
								>
									{/* Dot */}
									<div className="absolute left-4 top-1 flex h-2.5 w-2.5 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-neutral-950 sm:left-1/2" />

									{/* Content */}
									<div
										className={cn(
											"ml-10 flex-1 sm:ml-0 sm:w-1/2",
											i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12",
										)}
									>
										<span className="font-mono text-sm font-bold text-emerald-400">{milestone.year}</span>
										<h3 className="mt-1 text-lg font-semibold">{milestone.title}</h3>
										<p className="mt-2 text-sm leading-relaxed text-neutral-400">{milestone.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="border-t border-neutral-800 py-20 sm:py-28">
				<div className="mx-auto max-w-3xl px-6 text-center">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to get started?</h2>
					<p className="mt-4 text-neutral-400">
						Browse our catalog of 73+ research-grade peptides, or reach out to discuss your specific research
						needs.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<LinkWithChannel
							href="/products"
							className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-500 px-8 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
						>
							Explore Compounds
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</LinkWithChannel>
						<LinkWithChannel
							href="/contact"
							className="inline-flex h-12 items-center rounded-full border border-neutral-700 px-8 text-sm font-semibold text-white transition-all hover:border-neutral-500 hover:bg-white/5"
						>
							Contact Us
						</LinkWithChannel>
					</div>
				</div>
			</section>
		</div>
	);
}
