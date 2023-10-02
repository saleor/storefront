import { cookies } from "next/headers";
import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import { ActiveLink } from "./ActiveLink";
import * as Checkout from "@/lib/checkout";

const NavLinks = [
	{ href: "/", label: "Home" },
	{ href: "/products", label: "All" },
	{ href: "/categories/t-shirts", label: "T-shirts" },
	{ href: "/categories/hoodies", label: "Hoodies" },
	{ href: "/categories/accessories", label: "Accessories" },
];

export async function Nav() {
	const checkoutId = cookies().get("checkoutId")?.value || "";

	const checkout = await Checkout.find(checkoutId);
	const lines = checkout ? checkout.lines : [];

	return (
		<div className="sticky top-0 z-20 border-b bg-slate-100/75 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-2 lg:px-8">
				<div className="flex h-16 justify-between">
					<div className="flex px-2 lg:px-0">
						<div className="flex flex-shrink-0 items-center"></div>
						<div className="hidden lg:flex lg:space-x-8">
							{NavLinks.map((link) => (
								<ActiveLink key={link.href} href={link.href}>
									{link.label}
								</ActiveLink>
							))}
						</div>
					</div>
					<div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
						<div className="">
							<Link href="/cart" className="group -m-2 flex items-center p-2">
								<ShoppingBagIcon className="h-6 w-6 flex-shrink-0 " aria-hidden="true" />
								<span className="ml-2 text-sm font-medium ">{lines.length}</span>
								<span className="sr-only">items in cart, view bag</span>
							</Link>
						</div>
					</div>
					<div className="lg:ml-4 lg:flex lg:items-center"></div>
				</div>
			</div>
		</div>
	);
}
