"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const faqItems = [
	{
		q: "What purity standards do your peptides meet?",
		a: "All peptides are verified at ≥98% purity via High-Performance Liquid Chromatography (HPLC). Select compounds are available at ≥99%. Each batch is independently tested by accredited third-party laboratories, and Certificates of Analysis documenting purity, identity, and endotoxin levels are provided with every order.",
	},
	{
		q: "How are your products shipped and stored?",
		a: "Lyophilized peptides are shipped in temperature-controlled packaging with cold packs to maintain stability. We recommend storing at -20°C protected from light and moisture. After reconstitution, store at 2-8°C and use within the timeframe specified on each product's COA.",
	},
	{
		q: "Are your products intended for human use?",
		a: "No. All products are strictly for in-vitro research and laboratory use only. They are not intended for human consumption, veterinary use, or any clinical application. Purchasers must be affiliated with a research institution or laboratory.",
	},
	{
		q: "Do you provide Certificates of Analysis?",
		a: "Yes. Every order includes batch-specific COAs documenting HPLC purity data, mass spectrometry identity confirmation, endotoxin results, and physical characteristics. Historical COAs for any product lot are available upon request.",
	},
	{
		q: "What is your return policy?",
		a: "Returns are accepted within 14 days of delivery for unopened, sealed items only. If a product doesn't meet the specifications listed on the COA, we replace it at no cost. Contact our support team for return authorization.",
	},
	{
		q: "Do you offer bulk or institutional pricing?",
		a: "Yes. We offer volume discounts for bulk orders and institutional accounts with NET-30 payment terms for verified research organizations. Contact our sales team for custom pricing.",
	},
];

function FAQItem({
	item,
	index,
	isOpen,
	onToggle,
}: {
	item: (typeof faqItems)[0];
	index: number;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-2xl border-2 transition-all duration-500",
				isOpen
					? "-translate-y-0.5 border-emerald-500/40 bg-emerald-500/[0.05] shadow-xl shadow-emerald-500/10"
					: "border-neutral-800 bg-neutral-900/50 shadow-sm hover:-translate-y-0.5 hover:border-neutral-700 hover:shadow-lg",
			)}
		>
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:gap-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-3 sm:gap-6">
					<span
						className={cn(
							"flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all duration-300 sm:h-12 sm:w-12 sm:rounded-xl sm:text-sm",
							isOpen
								? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
								: "bg-neutral-800 text-neutral-400",
						)}
					>
						{String(index + 1).padStart(2, "0")}
					</span>
					<span
						className={cn(
							"text-base font-semibold transition-colors sm:text-lg lg:text-xl",
							isOpen ? "text-white" : "text-neutral-200",
						)}
					>
						{item.q}
					</span>
				</div>
				<span
					className={cn(
						"flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-10 sm:w-10",
						isOpen
							? "rotate-45 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
							: "bg-neutral-800 text-neutral-400",
					)}
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</span>
			</button>
			<div
				className={cn(
					"grid transition-[grid-template-rows] duration-300 ease-out",
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				)}
			>
				<div className="overflow-hidden">
					<div className="px-4 pb-6 pl-[3.75rem] sm:px-8 sm:pb-10 sm:pl-[5.5rem] lg:px-10 lg:pl-[6rem]">
						<p className="text-base leading-relaxed text-neutral-400">{item.a}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export function HomepageFAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<section
			className="border-t border-neutral-800 bg-neutral-950 py-24 text-white sm:py-32"
			aria-label="FAQ"
		>
			<div className="mx-auto max-w-4xl px-6">
				<div className="mb-12 text-center sm:mb-16">
					<p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">FAQ</p>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Questions & Answers</h2>
					<p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
						Everything you need to know about our research compounds, quality standards, and ordering process.
					</p>
				</div>

				<div className="flex flex-col gap-5">
					{faqItems.map((item, i) => (
						<FAQItem
							key={i}
							item={item}
							index={i}
							isOpen={openIndex === i}
							onToggle={() => setOpenIndex(openIndex === i ? null : i)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
