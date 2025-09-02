import { registerOTel } from "@vercel/otel";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";

export const createBatchSpanProcessor = (args: { accessToken: string | undefined }) => {
	const headers = args.accessToken ? { "x-alb-access-token": args.accessToken } : undefined;

	return new BatchSpanProcessor(
		new OTLPTraceExporter({
			url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT!,

			headers,
		}),
	);
};

const saleorEnvironmentSpanAttr = new URL(process.env.NEXT_PUBLIC_SALEOR_API_URL!).host;

export function register() {
	registerOTel({
		serviceName: "storefront",
		attributes: {
			"saleor.environment.domain": saleorEnvironmentSpanAttr,
		},
		spanProcessors: [
			createBatchSpanProcessor({
				accessToken: process.env.OTEL_ACCESS_TOKEN!,
			}),
		],
		instrumentationConfig: {
			fetch: {
				propagateContextUrls: [process.env.NEXT_PUBLIC_SALEOR_API_URL!],
			},
		},
	});
}
