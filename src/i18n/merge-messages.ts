type MessageTree = Record<string, unknown>;

function isMessageBranch(value: unknown): value is MessageTree {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Deep-merge localized messages over the default locale catalog.
 * Localized values win when present; missing nested keys fall back to `base`.
 */
export function mergeMessagesWithDefault<T extends MessageTree>(base: T, localized: T): T {
	const merged: MessageTree = { ...base };

	for (const [key, localizedValue] of Object.entries(localized)) {
		const baseValue = base[key];

		if (isMessageBranch(localizedValue) && isMessageBranch(baseValue)) {
			merged[key] = mergeMessagesWithDefault(baseValue, localizedValue);
		} else {
			merged[key] = localizedValue;
		}
	}

	return merged as T;
}
