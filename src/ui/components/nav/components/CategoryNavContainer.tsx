import { executeGraphQL } from "@/lib/graphql";
import { CategoriesListDocument, CollectionsListDocument } from "@/gql/graphql";
import { CategoryNav } from "./CategoryNav";
import { DefaultChannelSlug } from "@/app/config";

export async function CategoryNavContainer() {
	// Fetch categories and collections in parallel
	const [categoriesResult, collectionsResult] = await Promise.all([
		executeGraphQL(CategoriesListDocument, {
			variables: { first: 10 },
			revalidate: 60 * 60, // Cache for 1 hour
		}),
		executeGraphQL(CollectionsListDocument, {
			variables: { channel: DefaultChannelSlug, first: 10 },
			revalidate: 60 * 60, // Cache for 1 hour
		}),
	]);

	const categoryList =
		categoriesResult.categories?.edges.map((edge) => ({
			id: edge.node.id,
			name: edge.node.name,
			slug: edge.node.slug,
			children: edge.node.children?.edges.map((child) => ({
				id: child.node.id,
				name: child.node.name,
				slug: child.node.slug,
			})),
		})) || [];

	const collectionList =
		collectionsResult.collections?.edges.map((edge) => ({
			id: edge.node.id,
			name: edge.node.name,
			slug: edge.node.slug,
		})) || [];

	return <CategoryNav categories={categoryList} collections={collectionList} />;
}
