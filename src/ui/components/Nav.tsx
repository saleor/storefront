import { cookies } from "next/headers";
import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { ActiveLink } from "./ActiveLink";
import { AccountLink } from "./AccountLink";
import * as Checkout from "@/lib/checkout";

const NavLinks = [
	{ href: "/products", label: "All" },
	{ href: "/categories/t-shirts", label: "T-shirts" },
	{ href: "/categories/hoodies", label: "Hoodies" },
	{ href: "/categories/accessories", label: "Accessories" },
];

export async function Nav() {
	const checkoutId = cookies().get("checkoutId")?.value || "";

	const checkout = await Checkout.find(checkoutId);

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return (
		<div className="sticky top-0 z-20 border-b bg-neutral-100/50 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-2 sm:px-8">
				<div className="flex h-16 justify-between gap-4 md:gap-8">
					<div className="flex items-center font-bold">
						<Link aria-label="homepage" href="/">
							ACME
						</Link>
					</div>
					<div className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap lg:px-0">
						<div className="flex flex-shrink-0 items-center"></div>
						<div className="flex gap-4 lg:gap-8">
							{NavLinks.map((link) => (
								<ActiveLink key={link.href} href={link.href}>
									{link.label}
								</ActiveLink>
							))}
						</div>
					</div>
					<div className="ml-auto flex items-center justify-center whitespace-nowrap">
						<AccountLink />
					</div>
					<div className="flex items-center">
						<Link href="/cart" className="group -m-2 flex items-center p-2">
							<ShoppingBagIcon className="h-6 w-6 flex-shrink-0 " aria-hidden="true" />
							<span className="ml-2 min-w-[2ch] text-sm font-medium">{lineCount > 0 && lineCount}</span>
							<span className="sr-only">items in cart, view bag</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
