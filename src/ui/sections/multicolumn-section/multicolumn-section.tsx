import Image from "next/image";
import { PLP_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { isExternalMenuHref } from "@/lib/menus/menu-item-utils";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Section, type SectionTone, type SectionWidth } from "@/ui/sections/section";
import { SectionHeader, type SectionHeaderCta } from "@/ui/sections/section-header";

export interface MulticolumnItem {
	title: string;
	text: string;
	image?: string | null;
	imageAlt?: string;
	/** When set, the whole column becomes a link. */
	href?: string;
}

export type MulticolumnDesktopColumns = 2 | 3;

export interface MulticolumnSectionProps {
	heading?: string;
	eyebrow?: string;
	intro?: string;
	cta?: SectionHeaderCta;
	columns: readonly MulticolumnItem[];
	columnsDesktop?: MulticolumnDesktopColumns;
	tone?: SectionTone;
	width?: SectionWidth;
	className?: string;
}

const desktopGridClassName: Record<MulticolumnDesktopColumns, string> = {
	2: "md:grid-cols-2",
	3: "md:grid-cols-3",
};

function ColumnInner({ column }: { column: MulticolumnItem }) {
	return (
		<>
			{column.image ? (
				<div className="relative mx-auto aspect-[4/3] w-full max-w-xs overflow-hidden rounded-card bg-secondary">
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
		</>
	);
}

export function MulticolumnSection({
	heading,
	eyebrow,
	intro,
	cta,
	columns,
	columnsDesktop = 3,
	tone = "default",
	width = "content",
	className,
}: MulticolumnSectionProps) {
	if (columns.length === 0) {
		return null;
	}

	const headingId = "multicolumn-heading";

	return (
		<Section
			tone={tone}
			width={width}
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader
				id={headingId}
				eyebrow={eyebrow}
				heading={heading}
				intro={intro}
				cta={cta}
				align="center"
				className="mb-12"
			/>
			<ul className={cn("grid list-none gap-10 sm:grid-cols-2", desktopGridClassName[columnsDesktop])}>
				{columns.map((column) => (
					<li key={column.title} className="flex flex-col gap-4 text-center">
						{column.href ? (
							isExternalMenuHref(column.href) ? (
								<a
									href={column.href}
									rel="noopener noreferrer"
									className="flex flex-col gap-4 no-underline transition-opacity duration-base ease-standard hover:opacity-80 motion-reduce:transition-none"
								>
									<ColumnInner column={column} />
								</a>
							) : (
								<LinkWithChannel
									href={column.href}
									prefetch={false}
									className="flex flex-col gap-4 no-underline transition-opacity duration-base ease-standard hover:opacity-80 motion-reduce:transition-none"
								>
									<ColumnInner column={column} />
								</LinkWithChannel>
							)
						) : (
							<ColumnInner column={column} />
						)}
					</li>
				))}
			</ul>
		</Section>
	);
}
