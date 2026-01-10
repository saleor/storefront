import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav aria-label="Breadcrumb" className="text-sm">
			<ol className="flex items-center gap-1.5 text-muted-foreground">
				{items.map((item, index) => (
					<li key={index} className="flex items-center gap-1.5">
						{index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
						{item.href ? (
							<Link href={item.href} className="transition-colors hover:text-foreground">
								{item.label}
							</Link>
						) : (
							<span className="text-foreground">{item.label}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
