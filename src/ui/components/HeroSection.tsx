import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { Button } from "../atoms/Button";
import { ArrowRight } from "lucide-react";
import { getHeroContent } from "@/lib/content";

export async function HeroSection() {
	const hero = await getHeroContent();

	return (
		<section className="relative overflow-hidden bg-gradient-to-r from-primary-900 to-primary-700">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
					<defs>
						<pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
							<circle cx="10" cy="10" r="1" fill="currentColor" />
						</pattern>
					</defs>
					<rect fill="url(#hero-pattern)" width="100%" height="100%" />
				</svg>
			</div>

			<div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
				<div className="max-w-2xl">
					{/* Badge */}
					<span className="mb-6 inline-flex items-center rounded-full bg-primary-500/20 px-3 py-1 text-sm font-medium text-primary-100">
						{hero.badge}
					</span>

					{/* Headline */}
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
						{hero.headline}
						<span className="block text-primary-200">{hero.headlineAccent}</span>
					</h1>

					{/* Description */}
					<p className="mt-6 max-w-xl text-lg text-primary-100">{hero.description}</p>

					{/* CTAs */}
					<div className="mt-10 flex flex-wrap gap-4">
						<LinkWithChannel href={hero.primaryCta.href}>
							<Button
								variant="secondary"
								size="lg"
								className="!border-2 !border-primary-600 !bg-primary-600 !text-white hover:!bg-primary-700"
							>
								{hero.primaryCta.text}
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</LinkWithChannel>
						<LinkWithChannel href={hero.secondaryCta.href}>
							<Button
								variant="ghost"
								size="lg"
								className="!border-2 !border-white !bg-transparent !text-white hover:!bg-white hover:!text-primary-900"
							>
								{hero.secondaryCta.text}
							</Button>
						</LinkWithChannel>
					</div>

					{/* Stats */}
					<div className="mt-12 grid grid-cols-3 gap-8 border-t border-primary-500/30 pt-8">
						{hero.stats.map((stat) => (
							<div key={stat.label}>
								<p className="text-3xl font-bold text-white">{stat.value}</p>
								<p className="text-sm text-primary-200">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
