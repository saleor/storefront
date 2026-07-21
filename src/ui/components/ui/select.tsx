"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectItemText = SelectPrimitive.ItemText;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3.5 py-2 text-sm font-medium",
			"ring-offset-background placeholder:text-muted-foreground",
			"transition-colors duration-150 hover:border-foreground/20",
			"focus:outline-hidden focus:ring-2 focus:ring-ring/40 focus:ring-offset-2",
			"disabled:cursor-not-allowed disabled:opacity-50",
			"data-[state=open]:border-foreground/25",
			"[&>span]:line-clamp-1",
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-70" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn("flex cursor-default items-center justify-center py-1", className)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn("flex cursor-default items-center justify-center py-1", className)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				"relative z-50 max-h-96 min-w-32 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg",
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className,
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				className={cn(
					"p-1.5",
					position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("px-2.5 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * Compose with {@link SelectItemText} for the value shown in the trigger;
 * siblings (e.g. discount) render in the list only.
 */
const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, style, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center gap-2.5 rounded-lg py-2.5 pl-2.5 pr-8 text-sm",
			"transition-colors duration-100",
			/* Match CommandItem: muted fill only — never browser blue focus chrome */
			"outline-none! ring-0! border-0 shadow-none [-webkit-tap-highlight-color:transparent]",
			"focus:outline-none! focus:ring-0! focus:border-0 focus:bg-muted focus:text-foreground focus:shadow-none",
			"focus-visible:outline-none! focus-visible:ring-0! focus-visible:border-0 focus-visible:bg-muted focus-visible:text-foreground focus-visible:shadow-none",
			"data-highlighted:bg-muted data-highlighted:text-foreground data-highlighted:outline-none! data-highlighted:ring-0!",
			"data-disabled:pointer-events-none data-disabled:opacity-50",
			className,
		)}
		{...props}
		style={{ outline: "none", boxShadow: "none", ...style }}
	>
		{children}
		<span className="absolute right-2.5 flex h-4 w-4 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-3.5 w-3.5 text-foreground" strokeWidth={2.25} />
			</SelectPrimitive.ItemIndicator>
		</span>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectItemText,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
};
