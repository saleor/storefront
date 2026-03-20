/**
 * Shared Logo Component
 *
 * Single source of truth for the storefront logo.
 * Uses SVG for crisp rendering at all sizes.
 * Switches between logo.svg (dark paths) and logo-dark.svg (white paths).
 *
 * @example
 * <Logo className="h-8 w-auto" />
 * <Logo className="h-8 w-auto" inverted />
 */

import Image from "next/image";

interface LogoProps {
	className?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** @deprecated No longer used — single logo variant */
	inverted?: boolean;
}

export const Logo = ({ className, ariaLabel = "InfinityBio Labs" }: LogoProps) => {
	return (
		<Image
			src="/InfinityBio_logo.png"
			alt={ariaLabel}
			width={140}
			height={50}
			className={`object-contain ${className ?? ""}`}
		/>
	);
};
