import "server-only";

import edjsHTML from "editorjs-html";
import xss from "xss";

import { mapProductExtensions } from "@/config/storefront-view";
import type { ProductShell } from "@/lib/catalog/get-product-data";
import { BESTSELLER_ATTRIBUTE_SLUGS, isBestseller } from "@/lib/catalog/product-flags";
import { defaultProductImages } from "@/lib/storefront/mappers/gallery-images";
import type { ProductView, ProductViewAttribute } from "@/lib/storefront/contract/product";
import { pickTranslatedName } from "@/lib/saleor-translations";

const parser = edjsHTML();

const VARIANT_ATTRIBUTE_SLUGS = ["size", "color", "colour", "variant"];
const INTERNAL_ATTRIBUTE_SLUGS = ["care-instructions", "care", ...BESTSELLER_ATTRIBUTE_SLUGS];

type AssignedAttribute = NonNullable<ProductShell["assignedAttributes"]>[number];

/**
 * Map a cached product shell into the template contract.
 * Pure: no fetch, no request, no cache directive. Call it after `getProductData`.
 */
export function toProductView(product: ProductShell): ProductView {
	const start = product.pricing?.priceRange?.start?.gross;
	const stop = product.pricing?.priceRange?.stop?.gross;

	return {
		id: product.id,
		slug: product.slug,
		name: product.name,
		category: product.category
			? { id: product.category.id, name: product.category.name, slug: product.category.slug }
			: null,
		descriptionHtml: parseDescription(product.description),
		attributes: extractProductAttributes(product),
		careInstructions: extractCareInstructions(product),
		images: defaultProductImages(product),
		priceRange: start
			? {
					low: start.amount,
					high: stop?.amount ?? start.amount,
					currency: start.currency,
				}
			: null,
		isAvailable: product.isAvailable ?? false,
		isBestseller: isBestseller(product),
		variantCount: product.productVariants?.totalCount ?? 0,
		seoTitle: product.seoTitle ?? null,
		seoDescription: product.seoDescription ?? null,
		extensions: mapProductExtensions(product),
	};
}

function parseDescription(description: string | null | undefined): string[] | null {
	if (!description) return null;

	try {
		const parsed = parser.parse(JSON.parse(description));
		return parsed.map((html: string) => xss(html));
	} catch {
		return [xss(`<p>${description}</p>`)];
	}
}

function extractProductAttributes(product: Pick<ProductShell, "assignedAttributes">): ProductViewAttribute[] {
	return (product.assignedAttributes || [])
		.filter((attr) => attr.attribute.name)
		.filter((attr) => !VARIANT_ATTRIBUTE_SLUGS.includes((attr.attribute.slug ?? "").toLowerCase()))
		.filter((attr) => !INTERNAL_ATTRIBUTE_SLUGS.includes((attr.attribute.slug ?? "").toLowerCase()))
		.map((attr) => {
			const name = pickTranslatedName({
				name: attr.attribute.name!,
				translation: attr.attribute.translation,
			});
			const value = assignedAttributeDisplayValue(attr);
			return { name, value };
		})
		.filter((attr): attr is ProductViewAttribute => {
			if (attr.value === null || attr.value === undefined) return false;
			if (Array.isArray(attr.value)) return attr.value.length > 0;
			if (typeof attr.value === "boolean") return true;
			return attr.value !== "";
		});
}

function extractCareInstructions(product: Pick<ProductShell, "assignedAttributes">): string | null {
	const careAttr = (product.assignedAttributes || []).find(
		(attr) =>
			attr.attribute.slug === "care-instructions" ||
			attr.attribute.slug === "care" ||
			(attr.attribute.name ?? "").toLowerCase().includes("care"),
	);

	if (!careAttr) return null;
	const value = assignedAttributeDisplayValue(careAttr);
	if (value === null || value === undefined) return null;
	if (Array.isArray(value)) return value.filter(Boolean).join(". ") || null;
	if (typeof value === "boolean") return null;
	return value || null;
}

function assignedAttributeDisplayValue(attr: AssignedAttribute): string | string[] | boolean | null {
	if ("plainText" in attr && (attr.plainText != null || attr.plainTextTranslation != null)) {
		return (attr.plainTextTranslation || attr.plainText || "").trim() || null;
	}
	if ("boolean" in attr && typeof attr.boolean === "boolean") {
		return attr.boolean;
	}
	if ("numeric" in attr && attr.numeric != null) {
		return String(attr.numeric);
	}
	if ("choice" in attr && attr.choice) {
		return attr.choice.translation?.trim() || attr.choice.name?.trim() || null;
	}
	if ("choices" in attr && Array.isArray(attr.choices)) {
		return attr.choices
			.map((choice) => choice.translation?.trim() || choice.name?.trim() || "")
			.filter(Boolean);
	}
	return null;
}
