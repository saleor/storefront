import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface PageHeaderProps {
	title: string;
	description?: string | null;
	breadcrumbs: BreadcrumbItem[];
}

/**
 * Simple page header with breadcrumbs for pages without hero images.
 * Use CategoryHero for pages with background images.
 */
export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
	return (
		<div className="w-full border-b border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Breadcrumbs */}
				<nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
					{breadcrumbs.map((crumb, index) => (
						<span key={crumb.href} className="flex items-center gap-1.5">
							{index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
							{index === breadcrumbs.length - 1 ? (
								<span className="font-medium text-foreground">{crumb.label}</span>
							) : (
								<Link href={crumb.href} className="transition-colors hover:text-foreground">
									{crumb.label}
								</Link>
							)}
						</span>
					))}
				</nav>

				<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
				{description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
			</div>
		</div>
	);
}
