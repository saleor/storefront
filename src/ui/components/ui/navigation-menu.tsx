"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STOREFRONT_HEADER_ID = "storefront-header";

const navigationMenuTriggerClassName =
	"group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground";

const NavigationMenu = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Root
		ref={ref}
		className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
		{...props}
	>
		{children}
		<NavigationMenuViewport />
	</NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
		{...props}
	/>
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		className={cn(navigationMenuTriggerClassName, className)}
		{...props}
	>
		{children}{" "}
		<ChevronDown
			className="relative top-px ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
			aria-hidden="true"
		/>
	</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		className={cn("top-0 w-full md:absolute", className)}
		{...props}
	/>
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, style, ...props }, ref) => {
	const [header, setHeader] = React.useState<HTMLElement | null>(null);

	React.useLayoutEffect(() => {
		setHeader(document.getElementById(STOREFRONT_HEADER_ID));
	}, []);

	const viewport = (
		<NavigationMenuPrimitive.Viewport
			ref={ref}
			className={cn(
				"relative w-full overflow-hidden rounded-none bg-background text-foreground shadow-none",
				"h-[var(--radix-navigation-menu-viewport-height)]",
				className,
			)}
			style={{
				...style,
				width: "100%",
				["--radix-navigation-menu-viewport-width" as string]: "100%",
			}}
			{...props}
		/>
	);

	if (!header) {
		return <div className="hidden">{viewport}</div>;
	}

	return ReactDOM.createPortal(
		<div
			data-slot="mega-menu-panel"
			className="absolute inset-x-0 top-full z-30 hidden border-b border-border bg-background shadow-none [&:has([data-state=open])]:block"
		>
			{viewport}
		</div>,
		header,
	);
});
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Indicator
		ref={ref}
		className={cn(
			"z-1 top-full flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
			className,
		)}
		{...props}
	>
		<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
	</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
	navigationMenuTriggerClassName,
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationMenuViewport,
};
