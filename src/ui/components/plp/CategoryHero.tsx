import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WavePattern } from "./WavePattern";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface CategoryHeroProps {
	title: string;
	description?: string | null;
	backgroundImage?: string | null;
	breadcrumbs: BreadcrumbItem[];
}

export function CategoryHero({ title, description, backgroundImage, breadcrumbs }: CategoryHeroProps) {
	const hasImage = !!backgroundImage;

	return (
		<section className="relative h-[340px] overflow-hidden border-b border-border">
			{/* Background */}
			<div className="absolute inset-0">
				{hasImage ? (
					<>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={backgroundImage} alt={title} className="h-full w-full object-cover" />
						<div className="from-foreground/70 via-foreground/40 absolute inset-0 bg-gradient-to-r to-transparent" />
					</>
				) : (
					<WavePattern className="h-full w-full" />
				)}
			</div>

			{/* Content - text colors adapt based on background */}
			<div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
				{/* Breadcrumbs */}
				<nav
					className={`mb-4 flex items-center gap-1.5 text-sm ${
						hasImage ? "text-background/70" : "text-muted-foreground"
					}`}
				>
					{breadcrumbs.map((crumb, index) => (
						<span key={crumb.href} className="flex items-center gap-1.5">
							{index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
							{index === breadcrumbs.length - 1 ? (
								<span className={`font-medium ${hasImage ? "text-background" : "text-foreground"}`}>
									{crumb.label}
								</span>
							) : (
								<Link
									href={crumb.href}
									className={`transition-colors ${
										hasImage ? "hover:text-background" : "hover:text-foreground"
									}`}
								>
									{crumb.label}
								</Link>
							)}
						</span>
					))}
				</nav>

				<h1
					className={`text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl ${
						hasImage ? "text-background" : "text-foreground"
					}`}
				>
					{title}
				</h1>
				{description && (
					<p
						className={`mt-3 max-w-lg text-base md:text-lg ${
							hasImage ? "text-background/80" : "text-muted-foreground"
						}`}
					>
						{description}
					</p>
				)}
			</div>
		</section>
	);
}
