"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Context for accordion state
interface AccordionContextValue {
	openItems: string[];
	toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
	const context = useContext(AccordionContext);
	if (!context) throw new Error("Accordion components must be used within Accordion");
	return context;
}

// Accordion Root
interface AccordionProps {
	type?: "single" | "multiple";
	defaultValue?: string[];
	children: ReactNode;
	className?: string;
}

export function Accordion({ type = "multiple", defaultValue = [], children, className }: AccordionProps) {
	const [openItems, setOpenItems] = useState<string[]>(defaultValue);

	const toggle = (value: string) => {
		if (type === "single") {
			setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
		} else {
			setOpenItems((prev) =>
				prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
			);
		}
	};

	return (
		<AccordionContext.Provider value={{ openItems, toggle }}>
			<div className={cn("w-full", className)}>{children}</div>
		</AccordionContext.Provider>
	);
}

// Accordion Item Context
const AccordionItemContext = createContext<string | null>(null);

// Accordion Item
interface AccordionItemProps {
	value: string;
	children: ReactNode;
	className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
	return (
		<div className={cn("border-b", className)} data-value={value}>
			{children}
		</div>
	);
}

// Accordion Trigger
interface AccordionTriggerProps {
	children: ReactNode;
	className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
	const { openItems, toggle } = useAccordion();
	const item = useContext(AccordionItemContext);
	const isOpen = item ? openItems.includes(item) : false;

	return (
		<button
			type="button"
			onClick={() => item && toggle(item)}
			className={cn(
				"flex w-full items-center justify-between py-4 text-left font-medium transition-all",
				className,
			)}
			data-state={isOpen ? "open" : "closed"}
			aria-expanded={isOpen}
		>
			{children}
			<ChevronDown
				className={cn(
					"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
					isOpen && "rotate-180",
				)}
			/>
		</button>
	);
}

// Accordion Content - uses CSS grid for smooth height animation
interface AccordionContentProps {
	children: ReactNode;
	className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
	const { openItems } = useAccordion();
	const item = useContext(AccordionItemContext);
	const isOpen = item ? openItems.includes(item) : false;

	return (
		<div
			className={cn(
				"grid transition-[grid-template-rows] duration-300 ease-out",
				isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
			)}
			data-state={isOpen ? "open" : "closed"}
			aria-hidden={!isOpen}
		>
			<div className="overflow-hidden">
				<div className={cn("pb-4 text-sm", className)}>{children}</div>
			</div>
		</div>
	);
}

// Wrap AccordionItem to provide context
export function AccordionItemWithContext({ value, children, className }: AccordionItemProps) {
	return (
		<AccordionItemContext.Provider value={value}>
			<AccordionItem value={value} className={className}>
				{children}
			</AccordionItem>
		</AccordionItemContext.Provider>
	);
}

// Re-export with proper names
export { AccordionItemWithContext as AccordionItemWrapper };
