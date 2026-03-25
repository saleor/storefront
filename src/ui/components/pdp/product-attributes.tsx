"use client";

import {
	FlaskConical,
	Thermometer,
	Scale,
	Hash,
	Dna,
	Beaker,
	TestTube,
	Tag,
	Droplets,
	BookOpen,
	HelpCircle,
	Truck,
	AlertTriangle,
} from "lucide-react";
import {
	Accordion,
	AccordionItemWithContext,
	AccordionTrigger,
	AccordionContent,
} from "@/ui/components/ui/accordion";
import { Badge } from "@/ui/components/ui/badge";
import { type ReactNode } from "react";

interface Attribute {
	name: string;
	value: string | boolean | string[];
}

interface FaqItem {
	question: string;
	answer: string;
}

interface ProductAttributesProps {
	descriptionHtml?: string[] | null;
	attributes?: Attribute[];
	careInstructions?: string | null;
	faqItems?: FaqItem[] | null;
	references?: string[] | null;
}

const attributeIcons: Record<string, ReactNode> = {
	Purity: <FlaskConical className="h-4 w-4" />,
	Form: <TestTube className="h-4 w-4" />,
	Storage: <Thermometer className="h-4 w-4" />,
	"Molecular Weight": <Scale className="h-4 w-4" />,
	"CAS Number": <Hash className="h-4 w-4" />,
	Sequence: <Dna className="h-4 w-4" />,
	Origin: <Tag className="h-4 w-4" />,
	Solubility: <Droplets className="h-4 w-4" />,
	"Research Category": <Beaker className="h-4 w-4" />,
};

function formatValue(value: string | boolean | string[]): ReactNode {
	if (typeof value === "boolean") return value ? "Yes" : "No";
	if (Array.isArray(value)) {
		return (
			<div className="flex flex-wrap justify-end gap-1">
				{value.map((v) => (
					<Badge key={v} variant="secondary" className="font-normal">
						{v}
					</Badge>
				))}
			</div>
		);
	}
	return value;
}

export function ProductAttributes({
	descriptionHtml,
	attributes = [],
	careInstructions,
	faqItems,
	references,
}: ProductAttributesProps) {
	const displayAttributes = attributes.filter((attr) => !["Size", "Color"].includes(attr.name));

	const defaultOpen = ["description"];
	if (displayAttributes.length > 0) defaultOpen.push("details");

	return (
		<div className="flex flex-col gap-6">
			{/* Research Use Only disclaimer */}
			<div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
				<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
				<p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
					<span className="font-semibold">For Research Use Only.</span> Not for human consumption. All
					products are sold strictly for in-vitro research and laboratory use.
				</p>
			</div>

			<Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
				{descriptionHtml && descriptionHtml.length > 0 && (
					<AccordionItemWithContext value="description" className="border-border">
						<h2>
							<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
								Description
							</AccordionTrigger>
						</h2>
						<AccordionContent>
							<div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-foreground prose-strong:text-foreground">
								{descriptionHtml.map((html, i) => (
									<div key={i} dangerouslySetInnerHTML={{ __html: html }} />
								))}
							</div>
						</AccordionContent>
					</AccordionItemWithContext>
				)}

				{displayAttributes.length > 0 && (
					<AccordionItemWithContext value="details" className="border-border">
						<h2>
							<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
								Product Details
							</AccordionTrigger>
						</h2>
						<AccordionContent>
							<div className="grid gap-3">
								{displayAttributes.map((attr) => (
									<div key={attr.name} className="flex items-start justify-between gap-4 text-sm">
										<span className="flex items-center gap-2 text-muted-foreground">
											{attributeIcons[attr.name]}
											{attr.name}
										</span>
										<span className="text-right font-medium">{formatValue(attr.value)}</span>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItemWithContext>
				)}

				{careInstructions && (
					<AccordionItemWithContext value="care" className="border-border">
						<h2>
							<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
								Care Instructions
							</AccordionTrigger>
						</h2>
						<AccordionContent className="leading-relaxed text-muted-foreground">
							{careInstructions}
						</AccordionContent>
					</AccordionItemWithContext>
				)}

				{faqItems && faqItems.length > 0 && (
					<AccordionItemWithContext value="faq" className="border-border">
						<h2>
							<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
								<span className="flex items-center gap-2">
									<HelpCircle className="h-4 w-4" />
									Frequently Asked Questions
								</span>
							</AccordionTrigger>
						</h2>
						<AccordionContent>
							<dl className="grid gap-4">
								{faqItems.map((faq, i) => (
									<div key={i}>
										<dt className="mb-1 text-sm font-medium text-foreground">{faq.question}</dt>
										<dd className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
									</div>
								))}
							</dl>
						</AccordionContent>
					</AccordionItemWithContext>
				)}

				{references && references.length > 0 && (
					<AccordionItemWithContext value="references" className="border-border">
						<h2>
							<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
								<span className="flex items-center gap-2">
									<BookOpen className="h-4 w-4" />
									Research References
								</span>
							</AccordionTrigger>
						</h2>
						<AccordionContent>
							<ol className="grid gap-2 pl-4">
								{references.map((ref, i) => (
									<li key={i} className="list-decimal text-xs leading-relaxed text-muted-foreground">
										{ref}
									</li>
								))}
							</ol>
						</AccordionContent>
					</AccordionItemWithContext>
				)}

				<AccordionItemWithContext value="shipping" className="border-border">
					<h2>
						<AccordionTrigger className="py-4 text-sm font-medium hover:no-underline">
							<span className="flex items-center gap-2">
								<Truck className="h-4 w-4" />
								Shipping & Returns
							</span>
						</AccordionTrigger>
					</h2>
					<AccordionContent className="leading-relaxed text-muted-foreground">
						<div className="grid gap-2 text-sm">
							<p>Free shipping on orders over $150. Standard delivery 3-7 business days.</p>
							<p>All products are shipped in temperature-controlled packaging to maintain stability.</p>
							<p>
								Returns accepted within 14 days of delivery for unopened, sealed items only. Contact support
								for return authorization.
							</p>
						</div>
					</AccordionContent>
				</AccordionItemWithContext>
			</Accordion>
		</div>
	);
}
