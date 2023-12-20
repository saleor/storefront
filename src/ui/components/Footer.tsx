import Link from "next/link";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function Footer({ channel }: { channel: string }) {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel },
		revalidate: 60 * 60 * 24,
	});
	const channels = process.env.SALEOR_APP_TOKEN
		? await executeGraphQL(ChannelsListDocument, {
				withAuth: false, // disable cookie-based auth for this call
				headers: {
					// and use app token instead
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
		  })
		: null;
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
													<LinkWithChannel href={`/categories/${child.category.slug}`}>
														{child.category.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.collection) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={`/collections/${child.collection.slug}`}>
														{child.collection.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.page) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={`/pages/${child.page.slug}`}>
														{child.page.title}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.url) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel href={child.url}>{child.name}</LinkWithChannel>
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

				{channels?.channels && (
					<div className="mb-4 text-neutral-500">
						<label>
							<span className="text-sm">Change currency:</span> <ChannelSelect channels={channels.channels} />
						</label>
					</div>
				)}

				<div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
					<p className="text-sm text-neutral-500">Copyright &copy; {currentYear} Your Store, Inc.</p>
					<p className="flex gap-1 text-sm text-neutral-500">
						Powered by{" "}
						<Link target={"_blank"} href={"https://saleor.io/"}>
							Saleor
						</Link>{" "}
						<Link href={"https://github.com/saleor/saleor"} target={"_blank"} className={"opacity-30"}>
							<Image alt="Saleor github repository" height={20} width={20} src={"/github-mark.svg"} />
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
