/**
 * Shared Logo Component
 *
 * - /public/logo.svg — default (light backgrounds)
 * - /public/logo-dark.svg — inverted surfaces (e.g. footer on bg-foreground)
 *
 * @example
 * <Logo className="h-7 w-auto" />
 * <Logo className="h-7 w-auto" inverted />
 */

interface LogoProps {
	className?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** Light logo for dark/inverted backgrounds (footer) */
	inverted?: boolean;
}

export const Logo = ({ className, ariaLabel = "Paper by Saleor", inverted = false }: LogoProps) => {
	const src = inverted ? "/logo-dark.svg" : "/logo.svg";

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img src={src} alt={ariaLabel} width={100} height={23} className={`aspect-[100/23] ${className ?? ""}`} />
	);
};
