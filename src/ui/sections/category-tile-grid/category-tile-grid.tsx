import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { PLP_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { cn } from "@/lib/utils";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";
import { Section, type SectionTone, type SectionWidth } from "@/ui/sections/section";
import { SectionHeader, type SectionHeaderCta } from "@/ui/sections/section-header";

export interface CategoryTile {
	title: string;
	href: string;
	image?: string | null;
	imageAlt?: string;
	/** Small overline above the title (e.g. item count, category group). */
	subtitle?: string;
}

export type CategoryTileColumns = 2 | 3 | 4;
export type CategoryTileFit = "cover" | "contain";
export type CategoryTileAspect = "portrait" | "square" | "landscape";

export interface CategoryTileGridProps {
	heading?: string;
	eyebrow?: string;
	intro?: string;
	cta?: SectionHeaderCta;
	tiles: readonly CategoryTile[];
	columns?: CategoryTileColumns;
	/** `cover` overlays the label on a lifestyle photo; `contain` suits packshots (label below). */
	imageFit?: CategoryTileFit;
	aspect?: CategoryTileAspect;
	tone?: SectionTone;
	width?: SectionWidth;
	className?: string;
}

const columnsClassName: Record<CategoryTileColumns, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "grid-cols-2 lg:grid-cols-4",
};

const aspectClassName: Record<CategoryTileAspect, string> = {
	portrait: "aspect-[4/5]",
	square: "aspect-square",
	landscape: "aspect-[4/3]",
};

function TileLink({
	href,
	className,
	children,
}: {
	href: string;
	className: string;
	children: React.ReactNode;
}) {
	return (
		<NavHrefLink href={href} className={className}>
			{children}
		</NavHrefLink>
	);
}

export function CategoryTileGrid({
	heading,
	eyebrow,
	intro,
	cta,
	tiles,
	columns = 3,
	imageFit = "cover",
	aspect = "portrait",
	tone = "default",
	width = "content",
	className,
}: CategoryTileGridProps) {
	if (tiles.length === 0) {
		return null;
	}

	const headingId = "category-tile-grid-heading";
	const isContain = imageFit === "contain";

	return (
		<Section
			tone={tone}
			width={width}
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader
				id={headingId}
				eyebrow={eyebrow}
				heading={heading}
				intro={intro}
				cta={cta}
				className="mb-10"
			/>
			<ul className={cn("grid list-none gap-4 lg:gap-6", columnsClassName[columns])}>
				{tiles.map((tile) => (
					<li key={tile.href}>
						{isContain ? (
							<TileLink href={tile.href} className="group block no-underline hover:no-underline">
								<div
									className={cn(
										"relative overflow-hidden rounded-card bg-secondary",
										aspectClassName[aspect],
									)}
								>
									{tile.image ? (
										<Image
											src={tile.image}
											alt={tile.imageAlt || tile.title}
											fill
											sizes={PLP_IMAGE_SIZES}
											quality={PRODUCT_IMAGE_QUALITY}
											className="object-contain p-8 transition-transform duration-slow ease-standard motion-reduce:transition-none md:group-hover:scale-105"
										/>
									) : null}
								</div>
								<div className="mt-4 flex items-center justify-between gap-3">
									<div>
										{tile.subtitle ? (
											<p className="text-eyebrow uppercase text-muted-foreground">{tile.subtitle}</p>
										) : null}
										<h3 className="text-h3 text-foreground">{tile.title}</h3>
									</div>
									<ArrowRight
										className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-base ease-standard motion-reduce:transition-none md:group-hover:translate-x-1"
										aria-hidden="true"
									/>
								</div>
							</TileLink>
						) : (
							<TileLink
								href={tile.href}
								className={cn(
									"group relative block overflow-hidden rounded-card bg-secondary no-underline hover:no-underline",
									aspectClassName[aspect],
								)}
							>
								{tile.image ? (
									<Image
										src={tile.image}
										alt={tile.imageAlt || tile.title}
										fill
										sizes={PLP_IMAGE_SIZES}
										quality={PRODUCT_IMAGE_QUALITY}
										className="object-cover transition-transform duration-slow ease-standard motion-reduce:transition-none md:group-hover:scale-105"
									/>
								) : null}
								<div
									className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent"
									aria-hidden="true"
								/>
								<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
									<div>
										{tile.subtitle ? (
											<p className="text-eyebrow uppercase text-background/80">{tile.subtitle}</p>
										) : null}
										<h3 className="text-h3 text-background">{tile.title}</h3>
									</div>
									<ArrowRight
										className="h-5 w-5 shrink-0 text-background transition-transform duration-base ease-standard motion-reduce:transition-none md:group-hover:translate-x-1"
										aria-hidden="true"
									/>
								</div>
							</TileLink>
						)}
					</li>
				))}
			</ul>
		</Section>
	);
}
