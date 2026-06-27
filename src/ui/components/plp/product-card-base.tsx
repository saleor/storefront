import type { ReactNode } from "react";
import Image from "next/image";
import { DiscountPercentLabel, NewBadge, SaleBadge, BestsellerBadge } from "@/ui/components/ui/sale-label";
import { cn } from "@/lib/utils";
import { formatProductPrice } from "./format-product-price";
import { formatPrice } from "./utils";
import { PLP_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import type { ProductCardData } from "./product-card-data";
import { ProductCardLink } from "./product-card-link";

export interface ProductCardBaseProps {
	product: ProductCardData;
	priority?: boolean;
	imageSizes?: string;
	/** Slot over the image (e.g. quick-add). Rendered outside the image link so clicks work. */
	imageOverlay?: ReactNode;
}

export function ProductCardBase({
	product,
	priority = false,
	imageSizes = PLP_IMAGE_SIZES,
	imageOverlay,
}: ProductCardBaseProps) {
	return (
		<article className="group">
			<div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-card bg-secondary">
				<ProductCardLink href={product.href} className="absolute inset-0 z-0 block" aria-label={product.name}>
					<Image
						src={product.image}
						alt={product.imageAlt || product.name}
						fill
						sizes={imageSizes}
						quality={PRODUCT_IMAGE_QUALITY}
						className={cn(
							"object-cover transition-all duration-500 ease-out md:group-hover:scale-105",
							product.hoverImage && "md:group-hover:opacity-0",
						)}
						priority={priority}
					/>

					{product.hoverImage && (
						<Image
							src={product.hoverImage}
							alt={`${product.name} - alternate view`}
							fill
							sizes={imageSizes}
							quality={PRODUCT_IMAGE_QUALITY}
							className="object-cover opacity-0 transition-all duration-500 ease-out md:group-hover:scale-105 md:group-hover:opacity-100"
						/>
					)}
				</ProductCardLink>

				{(product.badge === "Sale" || product.badge === "New" || product.isBestseller) && (
					<div className="pointer-events-none absolute left-3 top-3 z-[1] flex flex-wrap items-center gap-1.5">
						{product.badge === "Sale" ? <SaleBadge /> : null}
						{product.isBestseller ? <BestsellerBadge /> : null}
						{product.badge === "New" ? <NewBadge /> : null}
					</div>
				)}

				{imageOverlay ? <div className="absolute inset-0 z-10">{imageOverlay}</div> : null}
			</div>

			<ProductCardLink href={product.href} className="block no-underline hover:no-underline">
				<div className="space-y-1.5">
					{product.brand && <p className="text-eyebrow uppercase text-muted-foreground">{product.brand}</p>}
					<h3
						className="truncate font-medium leading-snug text-foreground/80 no-underline transition-colors duration-200 md:group-hover:text-foreground"
						title={product.name}
					>
						{product.name}
					</h3>

					{product.colors && product.colors.length > 1 && (
						<div className="flex items-center gap-1.5 pt-1">
							{product.colors.slice(0, 4).map((color) => (
								<span
									key={color.name}
									className="h-4 w-4 rounded-full border border-border"
									style={{ backgroundColor: color.hex }}
									title={color.name}
								/>
							))}
							{product.colors.length > 4 && (
								<span className="ml-0.5 text-xs text-muted-foreground">+{product.colors.length - 4}</span>
							)}
						</div>
					)}

					<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5">
						<span className="font-semibold tabular-nums">{formatProductPrice(product)}</span>
						{product.compareAtPrice != null && (
							<span className="text-sm tabular-nums text-muted-foreground line-through">
								{formatPrice(product.compareAtPrice, product.currency, product.localeBcp47)}
							</span>
						)}
						{product.discountPercent != null && product.discountPercent > 0 && (
							<DiscountPercentLabel percent={product.discountPercent} />
						)}
					</div>
				</div>
			</ProductCardLink>
		</article>
	);
}
