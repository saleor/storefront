import type { ComponentType, ReactNode } from "react";

import type { PdpGalleryLayout } from "@/lib/storefront/contract/gallery";
import type { ProductView } from "@/lib/storefront/contract/product";
import type { ListingSurfaceKind } from "@/lib/storefront/contract/listing";

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

export type PlpFacetsPlacement = "bar" | "sidebar";

export interface PlpSurfaceView {
	kind: ListingSurfaceKind;
	title: string;
	description?: string | null;
}

/**
 * A PLP template arranges slots. It does not fetch.
 * Facet placement is a property of the results island, declared on the template
 * so the route and the island cannot disagree.
 */
export interface PlpTemplateSlots {
	/** Cached hero (title, breadcrumbs, image). Place exactly once. */
	header: ReactNode;
	/** Grid, facets, sort, and pagination. Place exactly once. */
	results: ReactNode;
	/** Empty state. Place once. The route may pass null when the grid has items. */
	empty: ReactNode;
}

export interface PlpTemplateProps {
	surface: PlpSurfaceView;
	slots: PlpTemplateSlots;
}

export interface PlpTemplate {
	id: string;
	facets: PlpFacetsPlacement;
	Layout: ComponentType<PlpTemplateProps>;
	Skeleton: ComponentType;
}

export function definePlpTemplate(template: PlpTemplate): PlpTemplate {
	return template;
}
