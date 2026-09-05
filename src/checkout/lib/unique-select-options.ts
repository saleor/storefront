export type SelectOption = { value: string; label: string };

/**
 * Saleor `countryAreaChoices` repeats the same `raw` with bilingual / romanized
 * `verbose` values (ES Álava+Araba → `VI`, JP 東京都+Tokyo, VN "An Giang Province").
 * A native `<select>` cannot have two options with the same value.
 */
export function uniqueSelectOptions(options: readonly SelectOption[]): SelectOption[] {
	const labelsByValue = new Map<string, string[]>();

	for (const option of options) {
		const value = option.value.trim();
		if (!value) continue;

		const labels = labelsByValue.get(value) ?? [];
		const label = option.label.trim();
		if (label && !labels.includes(label)) {
			labels.push(label);
		}
		labelsByValue.set(value, labels);
	}

	return [...labelsByValue.entries()].map(([value, labels]) => ({
		value,
		label: mergeOptionLabels(value, labels),
	}));
}

function mergeOptionLabels(value: string, labels: string[]): string {
	if (labels.length === 0) return value;
	if (labels.length === 1) return labels[0] ?? value;

	const compact = labels.filter(
		(candidate, index) =>
			!labels.some((other, otherIndex) => index !== otherIndex && isRedundantLabel(candidate, other)),
	);
	return (compact.length > 0 ? compact : labels).join(" / ");
}

/** "An Giang Province" is redundant when "An Giang" is already present. */
function isRedundantLabel(candidate: string, other: string): boolean {
	if (candidate === other) return false;
	return (
		candidate.startsWith(`${other} `) ||
		candidate.startsWith(`${other}-`) ||
		candidate.startsWith(`${other}–`)
	);
}
