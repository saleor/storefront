import type { ComponentType, ReactNode } from "react";

import type { PdpGalleryLayout } from "@/ui/components/pdp/gallery-layout";
import type { ProductView } from "@/lib/storefront/contract/product";

/**
 * What a PDP template is allowed to see.
 *
 * No params, no searchParams, no cookies, no loaders. The route builds the
 * dynamic islands and hands them over as slots. A template arranges slots and
 * renders `product` (the view model). It cannot open a dynamic hole.
 */
export interface PdpTemplateSlots {
	/** Suspense-wrapped variant gallery. Place exactly once. */
	gallery: ReactNode;
	/** ErrorBoundary + Suspense buy box. Place exactly once. */
	buyBox: ReactNode;
	breadcrumbs: ReactNode;
	/** Default description / specs / shipping accordion. Optional to place. */
	attributes: ReactNode;
}

export interface PdpTemplateProps {
	product: ProductView;
	slots: PdpTemplateSlots;
}

export interface PdpTemplateSkeletonProps {
	surface?: "route" | "page";
}

export interface PdpTemplate {
	id: string;
	/** Which gallery island renderer the route and skeleton use. */
	gallery: PdpGalleryLayout;
	Layout: ComponentType<PdpTemplateProps>;
	Skeleton: ComponentType<PdpTemplateSkeletonProps>;
}

export function definePdpTemplate(template: PdpTemplate): PdpTemplate {
	return template;
}
