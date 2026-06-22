import type { StorefrontContent } from "@/lib/content/types";

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends readonly (infer U)[]
		? readonly U[]
		: T[P] extends object
			? DeepPartial<T[P]>
			: T[P];
};

/** Partial overrides merged onto code defaults — Saleor provider returns this shape only. */
export type PartialStorefrontContent = {
	policies?: DeepPartial<StorefrontContent["policies"]>;
	chrome?: DeepPartial<StorefrontContent["chrome"]>;
	surfaces?: DeepPartial<StorefrontContent["surfaces"]>;
};
