import { templates } from "@/config/templates";

/**
 * Product page skeleton — shown immediately on route transitions (Next.js 16.3 instant nav).
 * Comes from the active PDP template so it cannot drift from the live layout.
 */
export default function ProductLoading() {
	const Skeleton = templates.pdp.Skeleton;
	return <Skeleton surface="route" />;
}
