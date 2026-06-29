import { HomepageSkeleton } from "@/ui/sections/homepage-skeleton";

/**
 * Homepage skeleton — shown immediately on route transitions (Next.js 16.3 instant nav).
 * Mirrors the live hero + featured collection so navigations land without CLS.
 */
export default function HomepageLoading() {
	return <HomepageSkeleton />;
}
