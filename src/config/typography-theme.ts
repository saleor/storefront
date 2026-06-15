/**
 * Typography theme — default is Direction C (Geist-only scale drama).
 * Optional example: editorial (Direction A, Fraunces display). See config/themes/README.md.
 */
export type TypographyTheme = "default" | "editorial";

const EDITORIAL_ALIASES = new Set(["editorial", "a", "direction-a"]);

export function getTypographyTheme(): TypographyTheme {
	const raw = process.env.NEXT_PUBLIC_TYPOGRAPHY_THEME?.trim().toLowerCase();
	if (raw && EDITORIAL_ALIASES.has(raw)) {
		return "editorial";
	}
	return "default";
}

export function isEditorialTypography(): boolean {
	return getTypographyTheme() === "editorial";
}
