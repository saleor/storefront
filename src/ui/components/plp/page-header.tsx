import { Breadcrumbs, type BreadcrumbItem } from "@/ui/components/breadcrumbs";

export type { BreadcrumbItem };

interface PageHeaderProps {
	title: string;
	description?: string | null;
	breadcrumbs: BreadcrumbItem[];
	breadcrumbAriaLabel: string;
}

/**
 * Simple page header with breadcrumbs for pages without hero images.
 * Use CategoryHero for pages with background images.
 */
export function PageHeader({ title, description, breadcrumbs, breadcrumbAriaLabel }: PageHeaderProps) {
	return (
		<div className="w-full border-b border-border bg-background">
			<div className="container-content py-8">
				<Breadcrumbs items={breadcrumbs} ariaLabel={breadcrumbAriaLabel} className="mb-4" />

				<h1 className="text-balance text-h1 text-foreground">{title}</h1>
				{description && <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">{description}</p>}
			</div>
		</div>
	);
}
