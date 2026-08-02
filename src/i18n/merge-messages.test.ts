import { describe, expect, it } from "vitest";
import { mergeMessagesWithDefault } from "./merge-messages";

describe("mergeMessagesWithDefault", () => {
	it("keeps localized values and fills missing keys from the default locale", () => {
		const base = {
			contact: {
				title: "Contact",
				signOut: "Sign out",
			},
			actions: {
				loading: "Loading…",
			},
		};

		const localized = {
			contact: {
				title: "Kontakt",
			},
			actions: {
				loading: "Laster…",
			},
		};

		expect(mergeMessagesWithDefault(base, localized)).toEqual({
			contact: {
				title: "Kontakt",
				signOut: "Sign out",
			},
			actions: {
				loading: "Laster…",
			},
		});
	});
});
