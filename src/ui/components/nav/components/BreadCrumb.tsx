"use client";

import Link from "next/link";

interface BreadcrumbProps {
	channel: string;
	categoryName: string;
	categorySlug?: string;
	productName: string;
}

export function Breadcrumb({ channel, categoryName, categorySlug, productName }: BreadcrumbProps) {
	return (
		<nav className="mb-4 text-sm text-neutral-500" aria-label="Breadcrumb">
			<ol className="flex flex-wrap items-center gap-1">
				<li className="flex items-center">
					<Link
						href={`/${channel}`}
						className="transition-colors duration-200 hover:text-neutral-900 hover:underline"
					>
						Home
					</Link>
					<span className="mx-1">/</span>
				</li>

				{categoryName && (
					<li className="flex items-center">
						{categorySlug ? (
							<Link
								href={`/${channel}/category/${categorySlug}`}
								className="transition-colors duration-200 hover:text-neutral-900 hover:underline"
							>
								{categoryName}
							</Link>
						) : (
							<span className="text-neutral-700">{categoryName}</span>
						)}
						<span className="mx-1">/</span>
					</li>
				)}

				<li className="max-w-xs truncate font-medium text-neutral-900" title={productName}>
					{productName}
				</li>
			</ol>
		</nav>
	);
}
