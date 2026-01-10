import Link from "next/link";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const SaleorLogoFooter = () => (
	<svg
		width="84"
		height="17"
		viewBox="0 0 84 17"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-label="Saleor"
		className="h-5 w-auto"
	>
		{/* AI Sparkle Icon */}
		<g>
			<path d="M10 0L11.2 6.5L17.5 8.5L11.2 10.5L10 17L8.8 10.5L2.5 8.5L8.8 6.5L10 0Z" fill="currentColor" />
			<path d="M3 2L3.5 4L5.5 4.5L3.5 5L3 7L2.5 5L0.5 4.5L2.5 4L3 2Z" fill="currentColor" opacity="0.6" />
		</g>
		{/* "saleor" wordmark */}
		<path
			d="M30.8847 13.0381H30.8842C30.6538 12.6731 30.1159 12.5172 29.2147 12.3511C29.1117 12.334 29.0068 12.317 28.9007 12.2997C26.8541 11.9673 24.31 11.554 24.3312 8.74532C24.3312 6.4644 25.6036 5.03125 29.2147 5.03125C32.5082 5.03125 33.9492 6.42159 34.0101 8.74601L30.9072 8.81016C30.7932 7.78989 30.3759 7.44185 29.1499 7.44185C28.1499 7.44185 27.5113 7.70303 27.5113 8.39789C27.5113 9.33131 28.2154 9.4622 29.7602 9.72277C31.7352 10.0413 34.1043 10.525 34.2125 13.0381L34.2125 13.0386C34.2164 13.1191 34.2181 13.2017 34.2175 13.2865C34.2175 15.5674 32.9451 17.0006 29.334 17.0006C26.0405 17.0006 24.4971 15.6102 24.4362 13.2858L27.5903 13.2217C27.7043 14.2419 28.1984 14.59 29.4244 14.59C30.4243 14.59 31.0373 14.3288 31.0373 13.6339C31.0373 13.3852 30.9873 13.1905 30.8847 13.0381Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M40.8984 14.5023C39.3758 14.5023 38.831 14.1763 38.831 13.0906C38.831 12.1132 39.3758 11.7217 41.0117 11.7217H42.6469V12.8515C42.6469 13.9371 42.102 14.5023 40.8984 14.5023ZM39.4898 16.892C41.2612 16.892 42.0562 16.3269 42.6246 15.5017V16.7641H45.827V8.87633C45.827 6.24867 44.8047 4.92383 41.2612 4.92383C37.831 4.92383 36.1461 6.0824 36.1461 8.70262L39.3131 8.74162C39.3354 8.63278 39.3762 8.49319 39.4019 8.40035C39.6115 7.64115 39.9739 7.39979 41.1479 7.39979C42.4197 7.39979 42.6246 7.92093 42.6246 8.79008V9.59379H41.125C37.0595 9.59379 35.6738 10.8098 35.6738 13.2863C35.6738 15.7189 36.9233 16.892 39.4898 16.892Z"
			fill="currentColor"
		/>
		<path d="M47.6162 3.85163L50.8873 0V16.769H47.6162V3.85163Z" fill="currentColor" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M55.6865 9.69574V9.10916C55.6865 8.08831 56.1633 7.39287 57.5942 7.39287C58.9799 7.39287 59.4344 7.98005 59.4344 9.10916V9.69574H55.6865ZM57.5936 16.9505C60.6439 16.9505 61.8807 15.8134 62.3622 14.459C62.4617 14.1791 62.5289 13.8899 62.5733 13.5995C62.5846 13.4225 62.588 13.3088 62.5909 13.2456L59.455 13.1697C59.455 13.1824 59.4498 13.2203 59.4498 13.2203C59.4498 13.2203 59.4113 13.4575 59.382 13.5742C59.2117 14.2538 58.8362 14.6049 57.5942 14.6049C56.0271 14.6049 55.6859 13.8446 55.6859 12.8451V11.8897H62.5909V9.804C62.5909 6.89376 61.4331 4.96094 57.5942 4.96094C53.8005 4.96094 52.5059 6.91578 52.5059 9.39175V12.5197C52.5059 14.9303 53.8228 16.9505 57.5936 16.9505Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M69.2967 16.9505C73.0445 16.9505 74.5887 15.0605 74.5887 12.5197V9.39175C74.5887 6.8069 73.0445 4.96094 69.2967 4.96094C65.5488 4.96094 64.0498 6.8069 64.0498 9.39175V12.5197C64.0498 15.0612 65.5259 16.9505 69.2967 16.9505ZM69.2967 14.4305C67.9791 14.4305 67.3203 13.7577 67.3203 12.6714V9.3263C67.3203 8.21921 67.9791 7.54578 69.296 7.54578C70.6136 7.54578 71.3176 8.21859 71.3176 9.32691V12.6714C71.3176 13.7577 70.6136 14.4305 69.2967 14.4305Z"
			fill="currentColor"
		/>
		<path
			d="M83.6922 5.0625L80.9942 8.23872L80.9673 8.26572H79.2144V16.769H75.9434V8.26142L78.6606 5.0625H83.6922Z"
			fill="currentColor"
		/>
	</svg>
);

// Default footer links when no CMS data is available
const defaultFooterLinks = {
	support: [
		{ label: "Contact Us", href: "/contact" },
		{ label: "FAQs", href: "/faq" },
		{ label: "Shipping", href: "/shipping" },
		{ label: "Returns", href: "/returns" },
	],
	company: [
		{ label: "About", href: "/about" },
		{ label: "Sustainability", href: "/sustainability" },
		{ label: "Careers", href: "/careers" },
		{ label: "Press", href: "/press" },
	],
};

export async function Footer({ channel }: { channel: string }) {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel },
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
	const menuItems = footerLinks.menu?.items || [];

	return (
		<footer className="bg-foreground text-background">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link href={`/${channel}`} className="mb-4 inline-block">
							<SaleorLogoFooter />
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
							Minimal design, maximum impact. Thoughtfully crafted essentials for everyday comfort.
						</p>
					</div>

					{/* Dynamic menu items from Saleor CMS */}
					{menuItems.map((item) => (
						<div key={item.id}>
							<h4 className="mb-4 text-sm font-medium text-neutral-300">{item.name}</h4>
							<ul className="space-y-3">
								{item.children?.map((child) => {
									if (child.category) {
										return (
											<li key={child.id}>
												<LinkWithChannel
													href={`/categories/${child.category.slug}`}
													className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
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
													className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
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
													className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
												>
													{child.page.title}
												</LinkWithChannel>
											</li>
										);
									}
									if (child.url) {
										return (
											<li key={child.id}>
												<Link
													href={child.url}
													className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
												>
													{child.name}
												</Link>
											</li>
										);
									}
									return null;
								})}
							</ul>
						</div>
					))}

					{/* Static Support links (if no CMS data) */}
					{menuItems.length === 0 && (
						<>
							<div>
								<h4 className="mb-4 text-sm font-medium text-neutral-300">Support</h4>
								<ul className="space-y-3">
									{defaultFooterLinks.support.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className="mb-4 text-sm font-medium text-neutral-300">Company</h4>
								<ul className="space-y-3">
									{defaultFooterLinks.company.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</>
					)}
				</div>

				{/* Channel selector */}
				{channels?.channels && (
					<div className="mt-8 text-neutral-400">
						<label className="flex items-center gap-2 text-sm">
							<span>Change currency:</span>
							<ChannelSelect channels={channels.channels} />
						</label>
					</div>
				)}

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
					<p className="text-xs text-neutral-500">© {currentYear} Saleor Demo Store. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link
							href="/privacy"
							className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
						>
							Privacy Policy
						</Link>
						<Link href="/terms" className="text-xs text-neutral-500 transition-colors hover:text-neutral-300">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
