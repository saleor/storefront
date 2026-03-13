import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import {
	ProductListByCollectionDocument,
	CollectionsListDocument,
	ProductOrderField,
	OrderDirection,
	type ProductListItemFragment,
} from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { ProductImageWrapper } from "@/ui/atoms/product-image-wrapper";
import { formatMoneyRange } from "@/lib/utils";
import heroPep from "../../../../public/hero-pep.png";
import { HomepageFAQ } from "./homepage-faq";

export const metadata = {
	title: "InfinityBio Labs — Pharmaceutical-Grade Research Peptides",
	description:
		"Premium research peptides and biotech compounds. HPLC-verified 99%+ purity, third-party tested with COA. Trusted by researchers worldwide. Fast shipping.",
};

// ─── Data Fetchers ──────────────────────────────────────────

async function getFeaturedProducts(channel: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag("collection:featured-products");

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel,
			first: 8,
			sortBy: { field: ProductOrderField.Collection, direction: OrderDirection.Asc },
		},
		revalidate: 300,
	});

	if (!result.ok) return [];
	return result.data.collection?.products?.edges.map(({ node }) => node) ?? [];
}

async function getBestSellers(channel: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag("collection:best-sellers");

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "summer-picks",
			channel,
			first: 8,
			sortBy: { field: ProductOrderField.Collection, direction: OrderDirection.Asc },
		},
		revalidate: 300,
	});

	if (!result.ok) return [];
	return result.data.collection?.products?.edges.map(({ node }) => node) ?? [];
}

async function getCollections(channel: string) {
	"use cache";
	cacheLife("hours");
	cacheTag("collections");

	const result = await executePublicGraphQL(CollectionsListDocument, {
		variables: { channel, first: 20 },
		revalidate: 3600,
	});

	if (!result.ok) return [];
	return result.data.collections?.edges.map(({ node }) => node) ?? [];
}

// ─── Icon Components (inline SVG for zero bundle cost) ──────

function IconShield({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
			/>
		</svg>
	);
}

function IconFlask({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94.94a1.5 1.5 0 00-.22 1.927l2.3 3.45A1.5 1.5 0 007.39 21.5h9.22a1.5 1.5 0 001.25-.683l2.3-3.45a1.5 1.5 0 00-.22-1.927L19.8 15.3M5 14.5h14.8"
			/>
		</svg>
	);
}

function IconTruck({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
			/>
		</svg>
	);
}

function IconCertificate({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
			/>
		</svg>
	);
}

function IconMolecule({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<circle cx="12" cy="7" r="2.5" />
			<circle cx="7" cy="17" r="2.5" />
			<circle cx="17" cy="17" r="2.5" />
			<path strokeLinecap="round" d="M10.5 9.5l-2 5M13.5 9.5l2 5M9.5 17h5" />
		</svg>
	);
}

function IconLock({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
			/>
		</svg>
	);
}

// ─── Collection icon mapping ────────────────────────────────

const collectionIcons: Record<string, string> = {
	"anti-aging-longevity": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
	"cognitive-mood":
		"M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
	"growth-recovery":
		"M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941",
	"weight-management":
		"M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
	performance: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75",
	"immune-support":
		"M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
	"sleep-recovery":
		"M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z",
	"sexual-health":
		"M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
	"tanning-skin":
		"M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
	aesthetics:
		"M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
	"fertility-hormonal":
		"M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94.94a1.5 1.5 0 00-.22 1.927l2.3 3.45A1.5 1.5 0 007.39 21.5h9.22a1.5 1.5 0 001.25-.683l2.3-3.45a1.5 1.5 0 00-.22-1.927L19.8 15.3M5 14.5h14.8",
	"vitamins-supplements":
		"M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342",
	accessories:
		"M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
	"recovery-healing":
		"M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
};

function CollectionIcon({ slug, className }: { slug: string; className?: string }) {
	const path = collectionIcons[slug];
	if (!path) {
		return (
			<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.94.94a1.5 1.5 0 00-.22 1.927l2.3 3.45A1.5 1.5 0 007.39 21.5h9.22a1.5 1.5 0 001.25-.683l2.3-3.45a1.5 1.5 0 00-.22-1.927L19.8 15.3M5 14.5h14.8"
				/>
			</svg>
		);
	}
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d={path} />
		</svg>
	);
}

// ─── Trust Items ────────────────────────────────────────────

const trustItems = [
	{ label: "HPLC Purity Verified", icon: IconShield },
	{ label: "Third-Party Lab Tested", icon: IconFlask },
	{ label: "Free Shipping Over $150", icon: IconTruck },
	{ label: "Certificate of Analysis", icon: IconCertificate },
	{ label: "Secure Encrypted Checkout", icon: IconLock },
	{ label: "Same-Day Processing", icon: IconMolecule },
];

// ─── Quality Pillars ────────────────────────────────────────

const qualityPillars = [
	{
		title: "HPLC Purity Analysis",
		stat: "≥98%",
		description:
			"Every batch is analyzed via High-Performance Liquid Chromatography. We reject anything below our strict purity thresholds.",
	},
	{
		title: "Third-Party Verification",
		stat: "100%",
		description:
			"Independent accredited laboratories verify identity (mass spectrometry), purity, and endotoxin levels for every production lot.",
	},
	{
		title: "Cold-Chain Logistics",
		stat: "2-8°C",
		description:
			"Temperature-controlled packaging from our facility to your lab. Lyophilized peptides shipped with cold packs to maintain stability.",
	},
	{
		title: "Full Documentation",
		stat: "COA",
		description:
			"Certificates of Analysis provided with every order. Batch-specific documentation including HPLC chromatograms and MS data.",
	},
];

// ─── Stats ──────────────────────────────────────────────────

const statsData = [
	{ value: "73+", label: "Research Compounds" },
	{ value: "99%+", label: "Purity Standard" },
	{ value: "48h", label: "Order Processing" },
	{ value: "100%", label: "Batch Tested" },
];

// ─── Testimonials ───────────────────────────────────────────

const testimonials = [
	{
		quote:
			"The purity consistency across batches is exceptional. We've been running comparative assays for 6 months and InfinityBio's peptides deliver reproducible results every time.",
		author: "Dr. Sarah M.",
		role: "Principal Investigator, Molecular Biology",
		rating: 5,
	},
	{
		quote:
			"Finally found a supplier that provides actual HPLC chromatograms with every order. The COA documentation is thorough and their support team understands the science.",
		author: "Dr. James R.",
		role: "Research Director, Pharmacology Lab",
		rating: 5,
	},
	{
		quote:
			"Switched from our previous supplier after purity issues. InfinityBio's cold-chain shipping and consistent ≥98% purity has been a game changer for our research protocols.",
		author: "Dr. Elena K.",
		role: "Postdoctoral Fellow, Biochemistry",
		rating: 5,
	},
];

// ════════════════════════════════════════════════════════════
// SECTIONS
// ════════════════════════════════════════════════════════════

// ─── 1. Hero ────────────────────────────────────────────────

function HeroSection() {
	return (
		<section className="noise-overlay relative -mt-16 flex min-h-[90vh] items-center overflow-hidden bg-foreground pt-16">
			{/* Gradient orbs */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
				<div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-500/15 blur-[120px]" />
				<div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[100px]" />
			</div>

			{/* Subtle grid */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			<div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16">
				<div>
					<p className="mb-6 animate-fade-in text-sm font-medium uppercase tracking-[0.3em] text-neutral-400 opacity-0">
						Pharmaceutical-Grade Research Peptides
					</p>
					<h1 className="animate-fade-in-up text-5xl font-bold leading-[1.05] tracking-tight text-white opacity-0 sm:text-6xl lg:text-7xl">
						The Science
						<br />
						<span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
							of Purity
						</span>
					</h1>
					<p className="mt-8 max-w-xl animate-fade-in-up-delay-1 text-lg leading-relaxed text-neutral-400 opacity-0">
						HPLC-verified, 99%+ purity research peptides and biotech compounds. Every batch independently
						tested. Every order documented with a Certificate of Analysis.
					</p>

					{/* CTAs */}
					<div className="mt-10 flex animate-fade-in-up-delay-2 flex-wrap items-center gap-4 opacity-0">
						<LinkWithChannel
							href="/products"
							className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
						>
							Explore Compounds
							<svg
								className="h-4 w-4 transition-transform group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</LinkWithChannel>
						<LinkWithChannel
							href="/products"
							className="inline-flex items-center rounded-full border border-neutral-700 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-neutral-500 hover:bg-white/5"
						>
							View All Products
						</LinkWithChannel>
					</div>

					{/* Hero stats */}
					<dl className="mt-12 flex animate-fade-in-up-delay-2 flex-wrap gap-8 opacity-0 sm:gap-12">
						{statsData.map((stat) => (
							<div key={stat.label}>
								<dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
									{stat.label}
								</dt>
								<dd className="mt-1 font-mono text-2xl font-bold text-emerald-400">{stat.value}</dd>
							</div>
						))}
					</dl>
				</div>

				{/* Hero image */}
				<div className="relative animate-fade-in-up-delay-1 opacity-0 lg:flex lg:justify-end">
					<div className="relative">
						<div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-3xl" />
						<Image
							src={heroPep}
							alt="InfinityBio research peptide vials"
							width={600}
							height={600}
							priority
							className="relative rounded-2xl object-contain drop-shadow-2xl"
						/>
					</div>
				</div>
			</div>

			{/* Scroll indicator */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
				<div className="flex h-10 w-6 justify-center rounded-full border-2 border-neutral-600 pt-2">
					<div className="h-2 w-1 rounded-full bg-neutral-400" />
				</div>
			</div>
		</section>
	);
}

// ─── 2. Trust Bar ───────────────────────────────────────────

function TrustBar() {
	const items = [...trustItems, ...trustItems];
	return (
		<div className="overflow-hidden border-y border-neutral-800 bg-neutral-900/50 py-4">
			<div className="flex w-max animate-marquee">
				{items.map((item, i) => {
					const Icon = item.icon;
					return (
						<span
							key={i}
							className="mx-8 inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.15em] text-neutral-500"
						>
							<Icon className="h-3.5 w-3.5 text-emerald-500/70" />
							{item.label}
						</span>
					);
				})}
			</div>
		</div>
	);
}

// ─── 3. Stats Banner ────────────────────────────────────────

function StatsBanner() {
	return (
		<section className="border-b border-neutral-800 bg-foreground">
			<div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-neutral-800 lg:grid-cols-4">
				{statsData.map((stat) => (
					<div key={stat.label} className="px-6 py-10 text-center sm:py-14">
						<p className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</p>
						<p className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-500">{stat.label}</p>
					</div>
				))}
			</div>
		</section>
	);
}

// ─── 4. Shop by Goal (Collections) ─────────────────────────

async function ShopByGoalSection({ params }: { params: Promise<{ channel: string }> }) {
	const { channel } = await params;
	const collections = await getCollections(channel);

	const excludeSlugs = ["accessories"];
	const displayCollections = collections.filter((c) => !excludeSlugs.includes(c.slug));

	if (displayCollections.length === 0) return null;

	return (
		<section
			className="noise-overlay relative overflow-hidden bg-foreground text-white"
			aria-label="Shop by Goal"
		>
			{/* Background */}
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-emerald-500/8 absolute -left-40 top-0 h-[500px] w-[500px] rounded-full blur-[120px]" />
				<div className="bg-teal-500/8 absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full blur-[120px]" />
			</div>

			<div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
				{/* Section header */}
				<div className="mb-12 sm:mb-16">
					<div className="flex items-end justify-between">
						<div>
							<p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
								Research Goals
							</p>
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Shop by Goal</h2>
						</div>
						<LinkWithChannel
							href="/products"
							className="hidden items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:inline-flex"
						>
							View All
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
							</svg>
						</LinkWithChannel>
					</div>
				</div>

				{/* All collections — uniform grid */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
					{displayCollections.map((collection) => (
						<LinkWithChannel
							key={collection.id}
							href={`/collections/${collection.slug}`}
							className="glow-emerald group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 hover:border-emerald-500/30 hover:bg-neutral-800/80 sm:p-8"
						>
							<div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-colors duration-300 group-hover:bg-emerald-500/20">
								<CollectionIcon slug={collection.slug} className="h-6 w-6 text-emerald-400" />
							</div>
							<div>
								<h3 className="text-sm font-semibold text-neutral-200 transition-colors duration-300 group-hover:text-white sm:text-base">
									{collection.name}
								</h3>
								<span className="mt-1 flex items-center gap-1 text-xs font-medium text-neutral-500 transition-colors duration-300 group-hover:text-emerald-400">
									Browse
									<svg
										className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</span>
							</div>
						</LinkWithChannel>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── 5. Featured Products ───────────────────────────────────

function ProductCard({ product, index }: { product: ProductListItemFragment; index: number }) {
	const startPrice = product.pricing?.priceRange?.start?.gross;
	const undiscounted = product.pricing?.priceRangeUndiscounted?.start?.gross;
	const hasDiscount = undiscounted && startPrice && undiscounted.amount !== startPrice.amount;

	return (
		<li className="card-lift group">
			<LinkWithChannel href={`/products/${product.slug}`} prefetch={false}>
				<div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 transition-colors duration-300 group-hover:border-neutral-700">
					{hasDiscount && (
						<div className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
							Sale
						</div>
					)}
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={index < 4 ? "eager" : "lazy"}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							priority={index < 2}
							className="transition-transform duration-700 ease-out group-hover:scale-105"
						/>
					)}
				</div>
				<div className="mt-4 space-y-1 px-0.5">
					<p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
						{product.category?.name}
					</p>
					<h3 className="text-sm font-semibold leading-snug text-neutral-200">{product.name}</h3>
					<div className="flex items-center gap-2 pt-1">
						<span className="text-sm font-bold text-white">
							{formatMoneyRange({
								start: startPrice,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</span>
						{hasDiscount && (
							<span className="text-xs text-neutral-500 line-through">
								{formatMoneyRange({
									start: undiscounted,
									stop: product?.pricing?.priceRangeUndiscounted?.stop?.gross,
								})}
							</span>
						)}
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}

async function FeaturedProductsSection({ params }: { params: Promise<{ channel: string }> }) {
	const { channel } = await params;
	const products = await getFeaturedProducts(channel);
	if (products.length === 0) return null;

	return (
		<section className="bg-foreground py-24 text-white sm:py-32" aria-label="Featured Products">
			<div className="mx-auto max-w-7xl px-6">
				<div className="mb-12 flex items-end justify-between sm:mb-16">
					<div>
						<p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
							Curated Selection
						</p>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Featured Compounds</h2>
					</div>
					<LinkWithChannel
						href="/products"
						className="hidden items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:inline-flex"
					>
						View All
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</LinkWithChannel>
				</div>
				<ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
					{products.map((product, i) => (
						<ProductCard key={product.id} product={product} index={i} />
					))}
				</ul>
			</div>
		</section>
	);
}

// ─── 6. Science & Quality ───────────────────────────────────

function ScienceQualitySection() {
	return (
		<section
			className="noise-overlay relative overflow-hidden bg-foreground text-white"
			aria-label="Quality Assurance"
		>
			{/* Background */}
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-emerald-500/8 absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full blur-[150px]" />
				<div className="bg-teal-500/6 absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full blur-[150px]" />
			</div>
			{/* Grid overlay */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.02]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
				{/* Header */}
				<div className="mb-16 text-center sm:mb-20">
					<p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
						Quality Assurance
					</p>
					<h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
						Every Compound Tells
						<br />
						<span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
							a Verified Story
						</span>
					</h2>
					<p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-neutral-400">
						From synthesis to your lab bench, every compound undergoes rigorous multi-stage verification.
					</p>
				</div>

				{/* Two-column layout: COA card + quality pillars */}
				<div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
					{/* Left: Mock COA Document */}
					<div className="relative">
						<div className="absolute -inset-px animate-glow-pulse rounded-2xl bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent" />
						<div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-sm">
							{/* COA Header */}
							<div className="border-b border-neutral-800 px-8 py-8 sm:px-12 sm:py-10">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
											Certificate of Analysis
										</p>
										<p className="mt-3 text-xl font-bold text-white sm:text-2xl">
											BPC-157 — Lot #IB-2026-0847
										</p>
									</div>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
										<svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
											<path
												fillRule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							</div>

							{/* COA Data rows */}
							<div className="divide-y divide-neutral-800/60 px-8 sm:px-12">
								{[
									{ label: "Purity (HPLC)", value: "99.2%", status: "pass" },
									{ label: "Identity (MS)", value: "Confirmed", status: "pass" },
									{ label: "Endotoxin", value: "<0.5 EU/mg", status: "pass" },
									{ label: "Appearance", value: "White lyophilized powder", status: "pass" },
									{ label: "Molecular Weight", value: "1419.53 Da", status: "pass" },
									{ label: "Sequence", value: "GEPPPGKPADDAGLV", status: "pass" },
								].map((row) => (
									<div key={row.label} className="flex items-center justify-between py-6">
										<span className="text-sm font-medium text-neutral-400">{row.label}</span>
										<div className="flex items-center gap-3">
											<span className="font-mono text-sm font-semibold text-white">{row.value}</span>
											<span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
												<svg className="h-3 w-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
													<path
														fillRule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clipRule="evenodd"
													/>
												</svg>
											</span>
										</div>
									</div>
								))}
							</div>

							{/* COA Footer */}
							<div className="border-t border-neutral-800 px-8 py-6 sm:px-12">
								<div className="flex items-center justify-between">
									<p className="text-xs text-neutral-500">Tested by independent accredited laboratory</p>
									<span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
										All Tests Passed
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right: Quality pillars */}
					<div className="flex flex-col gap-10 lg:gap-14">
						{qualityPillars.map((pillar) => (
							<div key={pillar.title} className="group">
								<span className="mb-3 inline-block rounded-lg bg-emerald-500/10 px-3 py-1.5 font-mono text-sm font-bold text-emerald-400">
									{pillar.stat}
								</span>
								<h3 className="text-lg font-semibold text-white sm:text-xl">{pillar.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-neutral-400 sm:text-base">
									{pillar.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

// ─── 7. Best Sellers ────────────────────────────────────────

async function BestSellersSection({ params }: { params: Promise<{ channel: string }> }) {
	const { channel } = await params;
	const products = await getBestSellers(channel);
	if (products.length === 0) return null;

	return (
		<section className="bg-foreground py-24 text-white sm:py-32" aria-label="Best Sellers">
			<div className="mx-auto max-w-7xl px-6">
				<div className="mb-12 flex items-end justify-between sm:mb-16">
					<div>
						<p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
							Most Popular
						</p>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Best Sellers</h2>
						<p className="mt-4 max-w-lg text-neutral-400">
							Our most requested research compounds. Purity-verified and in stock.
						</p>
					</div>
					<LinkWithChannel
						href="/products"
						className="hidden items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:inline-flex"
					>
						Shop All
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</LinkWithChannel>
				</div>

				<ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
					{products.map((product, i) => (
						<ProductCard key={product.id} product={product} index={i} />
					))}
				</ul>
			</div>
		</section>
	);
}

// ─── 8. Testimonials ────────────────────────────────────────

function TestimonialsSection() {
	return (
		<section className="bg-foreground text-white" aria-label="Testimonials">
			<div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
				<div className="mb-12 text-center sm:mb-16">
					<p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
						Trusted Worldwide
					</p>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">What Researchers Say</h2>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{testimonials.map((t, i) => (
						<article
							key={i}
							className="card-lift relative flex flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 sm:p-10"
						>
							{/* Decorative quote mark */}
							<div className="pointer-events-none absolute -right-2 -top-4 font-serif text-[120px] leading-none text-emerald-500/[0.08]">
								&ldquo;
							</div>

							{/* Stars */}
							<div className="relative mb-6 flex gap-1">
								{Array.from({ length: t.rating }).map((_, s) => (
									<svg key={s} className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>

							{/* Quote */}
							<blockquote className="flex-1 text-base leading-relaxed text-neutral-400">
								&ldquo;{t.quote}&rdquo;
							</blockquote>

							{/* Author */}
							<div className="mt-8 flex items-center gap-4 border-t border-neutral-800 pt-6">
								<div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400">
									{t.author
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</div>
								<div>
									<p className="text-base font-semibold text-white">{t.author}</p>
									<p className="text-sm text-neutral-500">{t.role}</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── 9. Newsletter CTA ─────────────────────────────────────

function NewsletterSection() {
	return (
		<section className="bg-foreground px-6 py-24 sm:py-32" aria-label="Newsletter">
			{/* Outer glow border */}
			<div className="relative mx-auto max-w-4xl rounded-[26px] bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20 p-px">
				<div className="noise-overlay relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-8 py-16 text-center sm:px-16 sm:py-20">
					<div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />
					<div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-teal-500/15 blur-3xl" />

					<div className="relative">
						<h2 className="text-3xl font-bold text-white sm:text-4xl">Research Updates & Exclusive Access</h2>
						<p className="mx-auto mt-4 max-w-md text-neutral-400">
							New compound launches, research highlights, and early access to limited-stock products.
						</p>
						<div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 rounded-full border border-neutral-700 bg-neutral-800/50 px-5 py-3.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
							/>
							<button
								type="button"
								className="rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
							>
								Subscribe
							</button>
						</div>
						<p className="mt-4 text-xs text-neutral-500">
							No spam, ever. Unsubscribe anytime. Join 2,000+ researchers.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

// ─── Skeletons ──────────────────────────────────────────────

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<section className="bg-foreground">
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="mb-12">
					<div className="mb-2 h-3 w-16 animate-pulse rounded bg-neutral-800" />
					<div className="h-9 w-56 animate-pulse rounded bg-neutral-800" />
				</div>
				<ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
					{Array.from({ length: count }).map((_, i) => (
						<li key={i} className="animate-pulse">
							<div className="aspect-square rounded-2xl bg-neutral-800" />
							<div className="mt-3 space-y-2 px-0.5">
								<div className="h-2.5 w-16 rounded bg-neutral-800" />
								<div className="h-3.5 w-28 rounded bg-neutral-800" />
								<div className="h-3.5 w-16 rounded bg-neutral-800" />
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

function CollectionsSkeleton() {
	return (
		<section className="bg-foreground">
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="mb-12">
					<div className="mb-2 h-3 w-20 animate-pulse rounded bg-neutral-800" />
					<div className="h-9 w-48 animate-pulse rounded bg-neutral-800" />
				</div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-800" />
					))}
				</div>
			</div>
		</section>
	);
}

// ─── Main Page ──────────────────────────────────────────────

export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<>
			<HeroSection />
			<TrustBar />
			<StatsBanner />

			<Suspense fallback={<CollectionsSkeleton />}>
				<ShopByGoalSection params={props.params} />
			</Suspense>

			<Suspense fallback={<ProductGridSkeleton />}>
				<FeaturedProductsSection params={props.params} />
			</Suspense>

			<ScienceQualitySection />

			<Suspense fallback={<ProductGridSkeleton />}>
				<BestSellersSection params={props.params} />
			</Suspense>

			<TestimonialsSection />

			<HomepageFAQ />

			<NewsletterSection />
		</>
	);
}
