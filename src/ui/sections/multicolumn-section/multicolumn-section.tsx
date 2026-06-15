import Image from "next/image";
import { cn } from "@/lib/utils";
import { PLP_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";

export interface MulticolumnItem {
	title: string;
	text: string;
	image?: string | null;
	imageAlt?: string;
}

export type MulticolumnDesktopColumns = 2 | 3;

export interface MulticolumnSectionProps {
	heading?: string;
	columns: readonly MulticolumnItem[];
	columnsDesktop?: MulticolumnDesktopColumns;
	className?: string;
}

const desktopGridClassName: Record<MulticolumnDesktopColumns, string> = {
	2: "md:grid-cols-2",
	3: "md:grid-cols-3",
};

export function MulticolumnSection({
	heading,
	columns,
	columnsDesktop = 3,
	className,
}: MulticolumnSectionProps) {
	if (columns.length === 0) {
		return null;
	}

	return (
		<section
			className={cn("bg-background py-16 md:py-24 lg:py-28", className)}
			aria-labelledby={heading ? "multicolumn-heading" : undefined}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{heading ? (
					<h2 id="multicolumn-heading" className="mb-8 text-balance text-center text-h2">
						{heading}
					</h2>
				) : null}
				<ul className={cn("grid list-none gap-8 sm:grid-cols-2", desktopGridClassName[columnsDesktop])}>
					{columns.map((column) => (
						<li key={column.title} className="flex flex-col gap-4 text-center">
							{column.image ? (
								<div className="relative mx-auto aspect-[4/3] w-full max-w-xs overflow-hidden rounded-lg bg-secondary">
									<Image
										src={column.image}
										alt={column.imageAlt ?? ""}
										fill
										className="object-cover"
										sizes={PLP_IMAGE_SIZES}
										quality={PRODUCT_IMAGE_QUALITY}
									/>
								</div>
							) : null}
							<div>
								<h3 className="text-h3">{column.title}</h3>
								<p className="mt-3 text-pretty text-sm text-muted-foreground md:text-base">{column.text}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
