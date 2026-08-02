import { describe, expect, it, vi } from "vitest";
import { resolveByPossiblyTranslatedSlug } from "./resolve-by-slug";

describe("resolveByPossiblyTranslatedSlug", () => {
	it("prefers translated slug, then falls back to primary", async () => {
		const fetchByPrimarySlug = vi.fn(async () => ({ id: "primary" }));
		const fetchByTranslatedSlug = vi.fn(async () => null);

		const result = await resolveByPossiblyTranslatedSlug({
			localeSlug: "en",
			urlSlug: "hoodie",
			fetchByPrimarySlug,
			fetchByTranslatedSlug,
		});

		expect(fetchByTranslatedSlug).toHaveBeenCalledWith("hoodie", "EN");
		expect(fetchByPrimarySlug).toHaveBeenCalledWith("hoodie");
		expect(result).toEqual({ id: "primary" });
	});

	it("returns translated match without primary lookup when found", async () => {
		const fetchByPrimarySlug = vi.fn(async () => ({ id: "primary" }));
		const fetchByTranslatedSlug = vi.fn(async () => ({ id: "translated" }));

		const result = await resolveByPossiblyTranslatedSlug({
			localeSlug: "pl",
			urlSlug: "bluza",
			fetchByPrimarySlug,
			fetchByTranslatedSlug,
		});

		expect(result).toEqual({ id: "translated" });
		expect(fetchByPrimarySlug).not.toHaveBeenCalled();
	});
});
