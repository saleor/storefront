import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { saleorContentProvider } from "@/lib/content/saleor/saleor-provider";
import { executePublicGraphQL } from "@/lib/graphql";

vi.mock("@/lib/graphql", () => ({
	executePublicGraphQL: vi.fn(),
}));

describe("saleorContentProvider", () => {
	beforeEach(() => {
		vi.mocked(executePublicGraphQL).mockReset();
	});

	it("returns defaults when GraphQL fetch fails", async () => {
		vi.mocked(executePublicGraphQL).mockResolvedValue({
			ok: false,
			error: { message: "network error" },
		} as Awaited<ReturnType<typeof executePublicGraphQL>>);

		const content = await saleorContentProvider.load({
			channel: "default-channel",
			locale: "en",
		});

		expect(content).toEqual(defaultStorefrontContent);
	});
});
