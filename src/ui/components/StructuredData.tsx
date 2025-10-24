import type { StructuredDataProps } from "@/types/seo";

interface StructuredDataComponentProps {
	data: StructuredDataProps | StructuredDataProps[];
}

/**
 * Component for rendering structured data (JSON-LD) for SEO
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
export function StructuredData({ data }: StructuredDataComponentProps) {
	const jsonLd = Array.isArray(data) ? data : [data];

	return (
		<>
			{jsonLd.map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}
		</>
	);
}
