import { Section, type SectionTone } from "@/ui/sections/section";
import { SectionHeader } from "@/ui/sections/section-header";

export interface SpecRow {
	label: string;
	value: string;
}

export interface SpecTableProps {
	heading?: string;
	eyebrow?: string;
	rows: readonly SpecRow[];
	tone?: SectionTone;
	className?: string;
}

/**
 * Specification / details table (label → value rows). Semantic `<table>` with row headers
 * for accessibility. Use for product specs, materials, dimensions, shipping facts.
 */
export function SpecTable({ heading, eyebrow, rows, tone = "default", className }: SpecTableProps) {
	if (rows.length === 0) {
		return null;
	}

	const headingId = "spec-table-heading";

	return (
		<Section
			tone={tone}
			width="prose"
			spacing="md"
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader id={headingId} eyebrow={eyebrow} heading={heading} className="mb-8" />
			<table className="w-full border-collapse text-left">
				<tbody className="divide-y divide-border border-y border-border">
					{rows.map((row) => (
						<tr key={row.label}>
							<th
								scope="row"
								className="py-3 pr-4 align-top text-sm font-medium text-muted-foreground sm:w-1/3"
							>
								{row.label}
							</th>
							<td className="text-pretty py-3 text-foreground">{row.value}</td>
						</tr>
					))}
				</tbody>
			</table>
		</Section>
	);
}
