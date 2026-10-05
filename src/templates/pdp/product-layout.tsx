import type { ReactNode } from "react";

import { definePdpTemplate, type PdpTemplate, type PdpTemplateProps } from "@/lib/storefront/templates";
import type { PdpGalleryLayout } from "@/lib/storefront/contract/gallery";
import { BestsellerBadge } from "@/ui/components/ui/sale-label";
import { PDP_LAYOUT_CLASSES, type PdpLayoutClasses } from "@/ui/components/pdp/gallery-layout";
import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

/** Shared chrome for the built-in presets. A custom template can ignore this and arrange slots itself. */
export function PdpPresetLayout({
	product,
	slots,
	layout,
}: PdpTemplateProps & { layout: PdpLayoutClasses }): ReactNode {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<div className={layout.main}>
				<div className="mb-6 hidden sm:block">{slots.breadcrumbs}</div>

				<div className={layout.grid}>
					<div className={layout.galleryColumn}>{slots.gallery}</div>

					<div className={layout.infoColumn}>
						{product.isBestseller && (
							<div className="order-1 flex items-center gap-2">
								<BestsellerBadge />
							</div>
						)}

						<h1 className="order-2 text-balance text-h1">{product.name}</h1>

						{slots.buyBox}

						{layout.attributesPlacement === "info" && <div className="order-4 mt-6">{slots.attributes}</div>}
					</div>

					{layout.attributesPlacement === "gallery" && layout.attributesGalleryBlock && (
						<div className={layout.attributesGalleryBlock}>{slots.attributes}</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function definePresetTemplate(gallery: PdpGalleryLayout): PdpTemplate {
	const layout = PDP_LAYOUT_CLASSES[gallery];
	function Layout(props: PdpTemplateProps) {
		return <PdpPresetLayout {...props} layout={layout} />;
	}
	return definePdpTemplate({
		id: gallery,
		gallery,
		Layout,
		Skeleton: ProductRouteSkeleton,
	});
}
