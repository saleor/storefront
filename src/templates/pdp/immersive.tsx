import type { ReactNode } from "react";

import { definePdpTemplate, type PdpTemplateProps } from "@/lib/storefront/templates";
import { BestsellerBadge } from "@/ui/components/ui/sale-label";
import { PDP_LAYOUT_CLASSES } from "@/ui/components/pdp/gallery-layout";
import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

const layout = PDP_LAYOUT_CLASSES.immersive;

/**
 * Current Paper PDP: wide gallery, sticky buy box, specs under the images.
 * This is the default template. A different layout is a new file under src/templates/pdp/.
 */
export function ImmersivePdpLayout({ product, slots }: PdpTemplateProps): ReactNode {
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

export const immersivePdp = definePdpTemplate({
	id: "immersive",
	gallery: "immersive",
	Layout: ImmersivePdpLayout,
	Skeleton: ProductRouteSkeleton,
});
