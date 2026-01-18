/**
 * Shared Logo Component
 *
 * Single source of truth for the storefront logo.
 * Uses external SVG files for better caching and smaller bundle size.
 *
 * - /public/logo.svg: dark logo for light backgrounds
 * - /public/logo-dark.svg: light logo for dark backgrounds
 *
 * @example
 * <Logo className="h-7 w-auto" />                    // Header (auto light/dark)
 * <Logo className="h-7 w-auto" inverted />          // Footer (inverted for dark bg)
 */

interface LogoProps {
	className?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** Invert colors (for dark backgrounds like footer) */
	inverted?: boolean;
}

/**
 * Paper + Saleor combined logo (100x23, aspect ratio ~4.35:1)
 * Automatically switches between light/dark mode versions.
 *
 * Uses explicit width/height + aspect-ratio to prevent CLS while
 * allowing flexible sizing via className.
 */
export const Logo = ({ className, ariaLabel = "Paper by Saleor", inverted = false }: LogoProps) => {
	// When inverted, swap the light/dark mode logic
	const lightModeLogo = inverted ? "/logo-dark.svg" : "/logo.svg";
	const darkModeLogo = inverted ? "/logo.svg" : "/logo-dark.svg";

	// Base styles: preserve aspect ratio to prevent CLS
	// Height classes (e.g., h-7) will work correctly with w-auto
	const baseStyles = "aspect-[100/23]";

	return (
		<>
			{/* Light mode */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={lightModeLogo}
				alt={ariaLabel}
				width={100}
				height={23}
				className={`dark:hidden ${baseStyles} ${className ?? ""}`}
			/>
			{/* Dark mode */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={darkModeLogo}
				alt={ariaLabel}
				width={100}
				height={23}
				className={`hidden dark:block ${baseStyles} ${className ?? ""}`}
			/>
		</>
	);
};
