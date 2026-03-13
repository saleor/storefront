/**
 * Shared Logo Component
 *
 * Single source of truth for the storefront logo.
 * Uses the InfinityBio Labs PNG logo.
 *
 * @example
 * <Logo className="h-8 w-auto" />
 * <Logo className="h-8 w-auto" inverted />
 */

interface LogoProps {
	className?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** Invert colors (for dark backgrounds like footer) — adds brightness filter */
	inverted?: boolean;
}

export const Logo = ({ className, ariaLabel = "InfinityBio Labs", inverted = false }: LogoProps) => {
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src="/InfinityBio_logo.png"
			alt={ariaLabel}
			width={140}
			height={50}
			className={`object-contain ${inverted ? "brightness-150" : ""} ${className ?? ""}`}
		/>
	);
};
