import { type ReactNode } from "react";
import { clsx } from "clsx";

export interface CardProps {
	children: ReactNode;
	className?: string;
	padding?: "none" | "sm" | "md" | "lg";
	shadow?: "none" | "sm" | "md" | "lg";
	border?: boolean;
	hover?: boolean;
}

export function Card({ 
	children, 
	className, 
	padding = "md", 
	shadow = "sm", 
	border = true,
	hover = false 
}: CardProps) {
	const baseClasses = "bg-white rounded-lg transition-shadow";
	
	const paddingClasses = {
		none: "",
		sm: "p-3",
		md: "p-4",
		lg: "p-6",
	};
	
	const shadowClasses = {
		none: "",
		sm: "shadow-sm",
		md: "shadow-md",
		lg: "shadow-lg",
	};
	
	const hoverClasses = hover ? "hover:shadow-md" : "";
	const borderClasses = border ? "border border-secondary-200" : "";
	
	return (
		<div 
			className={clsx(
				baseClasses,
				paddingClasses[padding],
				shadowClasses[shadow],
				borderClasses,
				hoverClasses,
				className
			)}
		>
			{children}
		</div>
	);
}