import { registerOTel, OTLPHttpProtoTraceExporter } from "@vercel/otel";

const saleorEnvironmentSpanAttr = new URL(process.env.NEXT_PUBLIC_SALEOR_API_URL!).host;

export function register() {
	registerOTel({
		serviceName: "storefront",
		attributes: {
			"saleor.environment.domain": saleorEnvironmentSpanAttr,
		},
		traceExporter: new OTLPHttpProtoTraceExporter({
			headers: {
				"x-alb-access-token": process.env.OTEL_ACCESS_TOKEN!,
			},
		}),
		instrumentationConfig: {
			fetch: {
				propagateContextUrls: [process.env.NEXT_PUBLIC_SALEOR_API_URL!],
			},
		},
	});
}
