import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/ui/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatProductPrice } from "./format-product-price";
import { formatPrice } from "./utils";
import type { ProductCardData } from "./product-card-data";

export interface ProductCardBaseProps {
	product: ProductCardData;
	priority?: boolean;
	/** Slot over the image (e.g. quick-add). Rendered outside the image link so clicks work. */
	imageOverlay?: ReactNode;
}

export function ProductCardBase({ product, priority = false, imageOverlay }: ProductCardBaseProps) {
	return (
		<article className="group">
			<div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
				<Link
					href={product.href}
					prefetch={false}
					className="absolute inset-0 z-0 block"
					aria-label={product.name}
				>
					<Image
						src={product.image}
						alt={product.imageAlt || product.name}
						fill
						sizes="(max-width: 1024px) 50vw, 33vw"
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
							sizes="(max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-all duration-500 ease-out md:group-hover:scale-105 md:group-hover:opacity-100"
						/>
					)}
				</Link>

				{product.badge && (
					<Badge
						variant={product.badge === "Sale" ? "destructive" : "default"}
						className="pointer-events-none absolute left-3 top-3 z-[1]"
					>
						{product.badge}
					</Badge>
				)}

				{imageOverlay ? <div className="absolute inset-0 z-10">{imageOverlay}</div> : null}
			</div>

			<Link href={product.href} prefetch={false} className="block">
				<div className="space-y-1.5">
					{product.brand && <p className="text-xs tracking-wide text-muted-foreground">{product.brand}</p>}
					<h3 className="line-clamp-2 font-medium leading-snug underline-offset-2 md:group-hover:underline">
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

					<div className="flex items-center gap-2 pt-0.5">
						<span className="font-semibold">{formatProductPrice(product)}</span>
						{product.compareAtPrice != null && (
							<span className="text-sm text-muted-foreground line-through">
								{formatPrice(product.compareAtPrice, product.currency)}
							</span>
						)}
					</div>
				</div>
			</Link>
		</article>
	);
}
