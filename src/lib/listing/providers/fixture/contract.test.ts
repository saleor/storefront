import { describe } from "vitest";
import { fixtureListingProvider } from "@/lib/listing/providers/fixture";
import { runListingProviderContract } from "@/lib/listing/testing";

describe("fixture listing provider", () => {
	runListingProviderContract(fixtureListingProvider, {
		query: {
			surface: { kind: "category", slug: "hoodies" },
			channel: "default-channel",
			locale: "en",
			selections: {},
			page: { mode: "offset", number: 1 },
			pageSize: 12,
		},
	});
});
