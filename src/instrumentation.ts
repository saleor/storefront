import { registerOTel } from "@vercel/otel";

export function register() {
	registerOTel({
		serviceName: "storefront",

		instrumentationConfig: {
			fetch: {
				propagateContextUrls: [process.env.NEXT_PUBLIC_SALEOR_API_URL!],
			},
		},
	});
}
