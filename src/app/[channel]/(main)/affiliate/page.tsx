import type { Metadata } from "next";
import { DollarSign, Link2, BarChart3, Zap, Users, Shield } from "lucide-react";
import { AffiliateApplicationForm } from "./application-form";

export const metadata: Metadata = {
	title: "Affiliate Program | InfinityBio Labs",
	description:
		"Join the InfinityBio Labs affiliate program. Earn commissions promoting pharmaceutical-grade research peptides to your audience.",
};

const benefits = [
	{
		icon: DollarSign,
		title: "Competitive Commissions",
		description: "Earn on every sale you refer. Commissions are tracked automatically and paid out monthly.",
	},
	{
		icon: Link2,
		title: "Unique Referral Link",
		description:
			"Get your own promo code and referral link. Share it anywhere — your audience gets a discount too.",
	},
	{
		icon: BarChart3,
		title: "Real-Time Tracking",
		description: "Monitor your referrals and earnings. Full transparency on every order attributed to you.",
	},
	{
		icon: Zap,
		title: "High Conversion Products",
		description: "Pharmaceutical-grade peptides with 99%+ purity and COA. Products that sell themselves.",
	},
	{
		icon: Users,
		title: "Dedicated Support",
		description: "Our affiliate team is here to help you succeed — from creative assets to strategy advice.",
	},
	{
		icon: Shield,
		title: "Trusted Brand",
		description: "Third-party tested, HPLC-verified. Your audience gets quality they can trust.",
	},
];

const steps = [
	{
		step: "01",
		title: "Apply",
		description: "Fill out the application form below. We review every application.",
	},
	{
		step: "02",
		title: "Get Approved",
		description: "Once approved, you'll receive your unique promo code and referral link.",
	},
	{
		step: "03",
		title: "Share & Earn",
		description: "Promote InfinityBio Labs to your audience. Earn commission on every sale.",
	},
];

export default function AffiliatePage() {
	return (
		<div className="bg-foreground text-white">
			{/* Hero */}
			<section className="relative overflow-hidden py-24 sm:py-32">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
							Affiliate Program
						</p>
						<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
							Earn With InfinityBio Labs
						</h1>
						<p className="mt-6 text-lg leading-relaxed text-neutral-300">
							Partner with us and earn commissions promoting pharmaceutical-grade research peptides. Whether
							you&apos;re a researcher, content creator, or industry professional — there&apos;s a place for
							you in our program.
						</p>
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section className="border-t border-neutral-800 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">Why Join</p>
						<h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Built for Partners Who Care About Quality
						</h2>
					</div>
					<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{benefits.map((benefit) => (
							<div
								key={benefit.title}
								className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 transition-colors hover:border-neutral-700"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
									<benefit.icon className="h-5 w-5 text-emerald-400" />
								</div>
								<h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-neutral-400">{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="border-t border-neutral-800 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">How It Works</p>
						<h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Three Steps to Start Earning
						</h2>
					</div>
					<div className="mt-16 grid gap-8 sm:grid-cols-3">
						{steps.map((item) => (
							<div key={item.step} className="relative text-center">
								<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
									<span className="text-lg font-bold text-emerald-400">{item.step}</span>
								</div>
								<h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
								<p className="mt-3 text-sm leading-relaxed text-neutral-400">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Application Form */}
			<section id="apply" className="border-t border-neutral-800 py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-2xl">
						<div className="text-center">
							<p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">Apply Now</p>
							<h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
								Join Our Affiliate Program
							</h2>
							<p className="mt-4 text-neutral-400">
								Tell us about yourself and how you plan to promote InfinityBio Labs. We review every
								application and typically respond within a few business days.
							</p>
						</div>
						<div className="mt-12">
							<AffiliateApplicationForm />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
