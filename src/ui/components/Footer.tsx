import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { CookiePreferencesButton } from "@/components/CookieConsent";
import { DEFAULT_CHANNEL } from "@/app/config";

export async function Footer() {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel: DEFAULT_CHANNEL },
		revalidate: 60 * 60 * 24,
	});
	const channels = process.env.SALEOR_APP_TOKEN
		? await executeGraphQL(ChannelsListDocument, {
				withAuth: false,
				headers: {
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
			})
		: null;
	const currentYear = new Date().getFullYear();

	return (
		<footer id="footer" className="mt-24 border-t border-base-900 bg-base-950">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="grid grid-cols-1 gap-12 py-20 md:grid-cols-3 md:gap-16">
					{footerLinks.menu?.items?.map((item) => {
						return (
							<div key={item.id}>
								<h3 className="mb-6 font-display text-sm font-medium uppercase tracking-wider text-white">
									{item.name}
								</h3>
								<ul className="space-y-4">
									{item.children?.map((child) => {
										if (child.category) {
											return (
												<li key={child.id}>
													<LinkWithChannel
														href={`/categories/${child.category.slug}`}
														className="text-base-300 transition-colors duration-200 hover:text-accent-200"
													>
														{child.category.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.collection) {
											return (
												<li key={child.id}>
													<LinkWithChannel
														href={`/collections/${child.collection.slug}`}
														className="text-base-300 transition-colors duration-200 hover:text-accent-200"
													>
														{child.collection.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.page) {
											return (
												<li key={child.id}>
													<LinkWithChannel
														href={`/pages/${child.page.slug}`}
														className="text-base-300 transition-colors duration-200 hover:text-accent-200"
													>
														{child.page.title}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.url) {
											return (
												<li key={child.id}>
													<LinkWithChannel
														href={child.url}
														className="text-base-300 transition-colors duration-200 hover:text-accent-200"
													>
														{child.name}
													</LinkWithChannel>
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
					<div className="mb-8 border-b border-base-900 pb-8">
						<label className="flex items-center gap-3 text-base-300">
							<span className="text-sm font-medium">Change currency:</span>
							<ChannelSelect channels={channels.channels} />
						</label>
					</div>
				)}

				<div className="flex flex-col justify-between gap-6 border-t border-base-900 py-10 sm:flex-row sm:items-center">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
						<p className="text-sm text-base-400">
							Copyright &copy; {currentYear} Sonic Drive Studio. All rights reserved.
						</p>
						<CookiePreferencesButton />
					</div>
				</div>
			</div>
		</footer>
	);
}
