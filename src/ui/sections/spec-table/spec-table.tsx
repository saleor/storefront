import { cn } from "@/lib/utils";

export interface SpecRow {
	label: string;
	value: string;
}

export interface SpecTableProps {
	heading?: string;
	rows: readonly SpecRow[];
	className?: string;
}

/**
 * Specification / details table (label → value rows). Semantic `<table>` with row headers
 * for accessibility. Use for product specs, materials, dimensions, shipping facts.
 */
export function SpecTable({ heading, rows, className }: SpecTableProps) {
	if (rows.length === 0) {
		return null;
	}

	return (
		<section
			className={cn("bg-background py-section-md", className)}
			aria-labelledby={heading ? "spec-table-heading" : undefined}
		>
			<div className="container-prose">
				{heading ? (
					<h2 id="spec-table-heading" className="mb-8 text-balance text-h2">
						{heading}
					</h2>
				) : null}
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
			</div>
		</section>
	);
}
