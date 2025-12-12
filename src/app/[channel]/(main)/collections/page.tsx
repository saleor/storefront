import Image from "next/image";
import { executeGraphQL } from "@/lib/graphql";
import { CollectionsListDocument } from "@/gql/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { Package } from "lucide-react";

export const metadata = {
	title: "Collections | Luxior Mall",
	description: "Browse our curated collections of premium products.",
};

export default async function CollectionsPage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	const { collections } = await executeGraphQL(CollectionsListDocument, {
		variables: { channel: params.channel, first: 20 },
		revalidate: 60 * 60, // 1 hour
	});

	const collectionList = collections?.edges.map((edge) => edge.node) || [];

	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<Breadcrumb items={[{ label: "Collections" }]} className="mb-6" />

			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">Collections</h1>
				<p className="mt-2 text-secondary-600">Explore our curated collections of premium products</p>
			</div>

			{collectionList.length === 0 ? (
				<div className="py-16 text-center">
					<Package className="mx-auto h-12 w-12 text-secondary-400" />
					<h2 className="mt-4 text-lg font-medium text-secondary-900">No collections found</h2>
					<p className="mt-2 text-secondary-600">Check back later for new collections.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{collectionList.map((collection) => (
						<LinkWithChannel
							key={collection.id}
							href={`/collections/${collection.slug}`}
							className="group relative overflow-hidden rounded-xl border border-secondary-200 bg-white transition-all hover:border-primary-300 hover:shadow-lg"
						>
							<div className="aspect-[4/3] overflow-hidden bg-secondary-100">
								{collection.backgroundImage?.url ? (
									<Image
										src={collection.backgroundImage.url}
										alt={collection.backgroundImage.alt || collection.name}
										width={400}
										height={300}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								) : (
									<div className="flex h-full items-center justify-center">
										<Package className="h-16 w-16 text-secondary-300" />
									</div>
								)}
							</div>
							<div className="p-4">
								<h2 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600">
									{collection.name}
								</h2>
								{collection.description && (
									<p className="mt-1 line-clamp-2 text-sm text-secondary-600">{collection.description}</p>
								)}
								<p className="mt-2 text-sm text-secondary-500">
									{collection.products?.totalCount || 0} products
								</p>
							</div>
						</LinkWithChannel>
					))}
				</div>
			)}
		</section>
	);
}
