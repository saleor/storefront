"use client";

import { type ReactNode, useState, createContext, useContext } from "react";
import { Menu } from "lucide-react";
import { Logo } from "../../logo";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetCloseButton,
} from "@/ui/components/ui/sheet";

// Context to allow children to close the menu
const MobileMenuContext = createContext<{ close: () => void } | null>(null);

export const useMobileMenuClose = () => {
	const context = useContext(MobileMenuContext);
	return context?.close ?? (() => {});
};

type Props = {
	children: ReactNode;
};

export const MobileMenu = ({ children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const close = () => setIsOpen(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
					aria-label="Open menu"
				>
					<Menu className="h-5 w-5" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="flex w-full flex-col p-0 sm:max-w-sm">
				<SheetTitle className="sr-only">Navigation menu</SheetTitle>
				<SheetHeader className="justify-between border-b border-border px-4 py-4">
					<Logo />
					<SheetCloseButton className="static" />
				</SheetHeader>
				<nav className="flex-1 overflow-y-auto">
					<MobileMenuContext.Provider value={{ close }}>
						<ul
							className="flex flex-col whitespace-nowrap p-4 [&>*:nth-child(n+2)]:border-t [&>*:nth-child(n+2)]:border-border [&>li]:py-3"
							id="mobile-menu"
							onClick={(e) => {
								// Close menu when a link is clicked
								if ((e.target as HTMLElement).closest("a")) {
									close();
								}
							}}
						>
							{children}
						</ul>
					</MobileMenuContext.Provider>
				</nav>
			</SheetContent>
		</Sheet>
	);
};
