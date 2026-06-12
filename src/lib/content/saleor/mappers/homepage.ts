import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_HOMEPAGE_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrCollectionSlug, attrInt, attrText, buildAttributeMap } from "@/lib/content/saleor/attributes";
import { omitEmpty } from "@/lib/content/saleor/omit-empty";

const VALUE_COLUMNS = [
	{ title: A.valuesColumn1Title, text: A.valuesColumn1Text },
	{ title: A.valuesColumn2Title, text: A.valuesColumn2Text },
	{ title: A.valuesColumn3Title, text: A.valuesColumn3Text },
] as const;

export function mapHomepagePage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.homepage) return {};

	const attrs = buildAttributeMap(page);
	const partial: PartialStorefrontContent = { surfaces: { homepage: {} } };
	const homepage = partial.surfaces!.homepage!;

	const hero = omitEmpty({
		heading: attrText(attrs, A.heroHeading),
		subheading: attrText(attrs, A.heroSubheading),
		primaryCtaLabel: attrText(attrs, A.heroCtaLabel),
	});
	if (Object.keys(hero).length > 0) {
		homepage.hero = hero;
	}

	const featuredCollection = omitEmpty({
		heading: attrText(attrs, A.featuredHeading),
		collectionSlug: attrCollectionSlug(page, A.featuredCollection),
		limit: attrInt(attrs, A.featuredLimit),
	});
	if (Object.keys(featuredCollection).length > 0) {
		homepage.featuredCollection = featuredCollection;
	}

	const brandStoryHeading = attrText(attrs, A.brandStoryHeading);
	const paragraphs = [
		attrText(attrs, A.brandStoryParagraph1),
		attrText(attrs, A.brandStoryParagraph2),
	].filter((p): p is string => Boolean(p));
	const brandStory = omitEmpty({ heading: brandStoryHeading });
	if (brandStoryHeading || paragraphs.length > 0) {
		homepage.brandStory = {
			...brandStory,
			...(paragraphs.length > 0 ? { paragraphs } : {}),
		};
	}

	const valuesHeading = attrText(attrs, A.valuesHeading);
	const valueColumns = VALUE_COLUMNS.map(({ title, text }) => {
		const columnTitle = attrText(attrs, title);
		const columnText = attrText(attrs, text);
		if (!columnTitle && !columnText) return null;
		return omitEmpty({ title: columnTitle, text: columnText }) as { title: string; text: string };
	}).filter((column): column is { title: string; text: string } => column !== null);

	if (valuesHeading || valueColumns.length > 0) {
		const desktop = attrText(attrs, A.valuesColumnsDesktop);
		homepage.values = {
			...omitEmpty({ heading: valuesHeading }),
			...(valueColumns.length > 0 ? { columns: valueColumns } : {}),
			columnsDesktop: desktop === "2" ? 2 : 3,
		};
	}

	const editorialHeading = attrText(attrs, A.editorialHeading);
	const editorialParagraph = attrText(attrs, A.editorialParagraph1);
	if (editorialHeading || editorialParagraph) {
		const position = attrText(attrs, A.editorialImagePosition);
		homepage.editorial = {
			...omitEmpty({
				heading: editorialHeading,
				ctaLabel: attrText(attrs, A.editorialCtaLabel),
			}),
			...(editorialParagraph ? { paragraphs: [editorialParagraph] } : {}),
			imagePosition: position === "left" ? "left" : "right",
		};
	}

	if (Object.keys(homepage).length === 0) {
		return {};
	}

	return partial;
}
