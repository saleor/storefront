import Link from "next/link";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { DEFAULT_CHANNEL } from "@/checkout/lib/regions";

export async function Footer() {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel: DEFAULT_CHANNEL },
		revalidate: 60 * 60 * 24,
	});
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-neutral-300 bg-neutral-50">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="grid grid-cols-3 gap-8 py-16">
					{footerLinks.menu?.items?.map((item) => {
						return (
							<div key={item.id}>
								<h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
								<ul className="mt-4 space-y-4 [&>li]:text-neutral-500">
									{item.children?.map((child) => {
										if (child.category) {
											return (
												<li key={child.id} className="text-sm">
													<Link href={`/categories/${child.category.slug}`}>{child.category.name}</Link>
												</li>
											);
										}
										if (child.collection) {
											return (
												<li key={child.id} className="text-sm">
													<Link href={`/collections/${child.collection.slug}`}>{child.collection.name}</Link>
												</li>
											);
										}
										if (child.page) {
											return (
												<li key={child.id} className="text-sm">
													<Link href={`/pages/${child.page.slug}`}>{child.page.title}</Link>
												</li>
											);
										}
										if (child.url) {
											return (
												<li key={child.id} className="text-sm">
													<Link href={child.url}>{child.name}</Link>
												</li>
											);
										}
										return null;
									})}
								</ul>
							</div>
						);
					})}
				</div>

				<div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
					<p className="text-sm text-neutral-500">Copyright &copy; {currentYear} Your Store, Inc.</p>
					<p className="text-sm text-neutral-500">Powered by Saleor</p>
				</div>
			</div>
		</footer>
	);
}
