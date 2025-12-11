import { ChevronRight, Home } from "lucide-react";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { clsx } from "clsx";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className={clsx("flex", className)}>
			<ol className="flex items-center space-x-2 text-sm">
				<li>
					<LinkWithChannel 
						href="/" 
						className="text-secondary-500 hover:text-secondary-700 transition-colors"
					>
						<Home className="h-4 w-4" />
						<span className="sr-only">Home</span>
					</LinkWithChannel>
				</li>
				
				{items.map((item, index) => (
					<li key={index} className="flex items-center">
						<ChevronRight className="h-4 w-4 text-secondary-400 mx-2" />
						{item.href && index < items.length - 1 ? (
							<LinkWithChannel 
								href={item.href}
								className="text-secondary-500 hover:text-secondary-700 transition-colors"
							>
								{item.label}
							</LinkWithChannel>
						) : (
							<span className="text-secondary-900 font-medium">
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}