import { ArrowRight } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { ProductList } from "./ProductList";
import Image from "next/image";
import edjsHTML from "editorjs-html";

const parser = edjsHTML();

type Product = {
	id: string;
	name: string;
	slug: string;
	thumbnail?: { url: string; alt?: string | null } | null;
	pricing?: {
		onSale?: boolean | null;
		priceRange?: {
			start?: { gross: { amount: number; currency: string } } | null;
			stop?: { gross: { amount: number; currency: string } } | null;
		} | null;
		priceRangeUndiscounted?: {
			start?: { gross: { amount: number; currency: string } } | null;
		} | null;
	} | null;
	category?: { name: string } | null;
};

type CollectionMetadata = {
	key: string;
	value: string;
};

export interface HomepageSectionProps {
	title: string;
	subtitle?: string;
	slug: string;
	products: Product[];
	totalCount?: number;
	backgroundImage?: { url: string; alt?: string | null } | null;
	metadata?: CollectionMetadata[];
	variant?: "grid" | "carousel" | "featured" | "banner";
	columns?: 3 | 4 | 5;
	showViewAll?: boolean;
	maxProducts?: number;
}

// Helper to parse EditorJS description
function parseDescription(description: string | null | undefined): string | null {
	if (!description) return null;
	try {
		const parsed = JSON.parse(description) as { blocks?: Array<{ data?: { text?: string } }> };
		if (parsed.blocks) {
			const html = parser.parse(parsed);
			return html
				.join(" ")
				.replace(/<[^>]*>/g, "")
				.trim();
		}
		return description;
	} catch {
		return description;
	}
}

// Get metadata value by key
function getMetadataValue(metadata: CollectionMetadata[] | undefined, key: string): string | null {
	return metadata?.find((m) => m.key === key)?.value || null;
}

export function HomepageSection({
	title,
	subtitle,
	slug,
	products,
	totalCount = 0,
	backgroundImage,
	metadata,
	variant = "grid",
	columns = 4,
	showViewAll = true,
	maxProducts = 8,
}: HomepageSectionProps) {
	// Get display settings from metadata
	const displayStyle = getMetadataValue(metadata, "homepage_style") || variant;
	const customTitle = getMetadataValue(metadata, "homepage_title");
	const customSubtitle = getMetadataValue(metadata, "homepage_subtitle");
	const bgColor = getMetadataValue(metadata, "homepage_bg_color");
	const priority = getMetadataValue(metadata, "homepage_priority");

	const displayTitle = customTitle || title;
	const displaySubtitle = customSubtitle || subtitle;
	const displayProducts = products.slice(0, maxProducts);

	if (displayProducts.length === 0) {
		return null;
	}

	// Banner style - full width with background image
	if (displayStyle === "banner" && backgroundImage?.url) {
		return (
			<section className="relative overflow-hidden">
				<div className="absolute inset-0">
					<Image src={backgroundImage.url} alt={backgroundImage.alt || title} fill className="object-cover" />
					<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
				</div>
				<div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
					<div className="max-w-xl">
						<h2 className="text-3xl font-bold text-white sm:text-4xl">{displayTitle}</h2>
						{displaySubtitle && <p className="mt-4 text-lg text-white/80">{displaySubtitle}</p>}
						<LinkWithChannel
							href={`/collections/${slug}`}
							className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-secondary-900 transition-colors hover:bg-primary-50"
						>
							Shop Collection
							<ArrowRight className="h-4 w-4" />
						</LinkWithChannel>
					</div>
				</div>
			</section>
		);
	}

	// Featured style - larger cards with more details
	if (displayStyle === "featured") {
		return (
			<section className="py-16" style={bgColor ? { backgroundColor: bgColor } : undefined}>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-secondary-900">{displayTitle}</h2>
							{displaySubtitle && <p className="mt-1 text-secondary-600">{displaySubtitle}</p>}
						</div>
						{showViewAll && totalCount > maxProducts && (
							<LinkWithChannel
								href={`/collections/${slug}`}
								className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
							>
								View all ({totalCount})
								<ArrowRight className="h-4 w-4" />
							</LinkWithChannel>
						)}
					</div>
					<ProductList products={displayProducts} variant="grid" columns={columns} />
				</div>
			</section>
		);
	}

	// Default grid style
	return (
		<section className="py-16" style={bgColor ? { backgroundColor: bgColor } : undefined}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-secondary-900">{displayTitle}</h2>
						{displaySubtitle && <p className="mt-1 text-secondary-600">{displaySubtitle}</p>}
					</div>
					{showViewAll && totalCount > maxProducts && (
						<LinkWithChannel
							href={`/collections/${slug}`}
							className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
						>
							View all ({totalCount})
							<ArrowRight className="h-4 w-4" />
						</LinkWithChannel>
					)}
				</div>
				<ProductList products={displayProducts} variant="grid" columns={columns} />
			</div>
		</section>
	);
}
