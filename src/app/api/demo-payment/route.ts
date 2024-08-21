const removeWhiteSpace = (str: string): string => {
	return str.replaceAll(/[\t\n]/g, "");
};

export async function GET() {
	return Response.json({
		id: "storefront.demo-payment",
		version: "1.0.0",
		requiredSaleorVersion: "^3.20",
		name: "Demo Payment App",
		author: "Storefront",
		about: "Demo for processing payments. Can be used for testing purposes.",

		permissions: ["HANDLE_PAYMENTS"],

		appUrl: `${process.env.VERCEL_URL}`,
		configurationUrl: `${process.env.VERCEL_URL}`,
		tokenTargetUrl: `${process.env.VERCEL_URL}`,

		dataPrivacy: "",
		dataPrivacyUrl: `${process.env.VERCEL_URL}`,
		homepageUrl: `${process.env.VERCEL_URL}`,
		supportUrl: `${process.env.VERCEL_URL}`,
		brand: {
			logo: {
				default: `${process.env.VERCEL_URL}`,
			},
		},
		webhooks: [
			{
				name: "Transaction initialize",
				asyncEvents: ["TRANSACTION_INITIALIZE_SESSION"],
				query: removeWhiteSpace(`
				subscription {
					event {
						... on TransactionInitializeSession {
							__typename
							data
							action {
								amount
								currency
								actionType
							}
							issuedAt
							merchantReference
							idempotencyKey
						}
					}
				}`),
				targetUrl: `${process.env.VERCEL_URL}/api/demo-payment/transaction-initialize`,
				isActive: true,
			},
			{
				name: "Gateway initialize",
				asyncEvents: ["PAYMENT_GATEWAY_INITIALIZE_SESSION"],
				query: removeWhiteSpace(`subscription {
									event {
										... on TransactionInitializeSession {
											__typename
											data
											action {
												amount
												currency
												actionType
											}
											issuedAt
											merchantReference
											idempotencyKey
										}
									}
								}`),
				targetUrl: `${process.env.VERCEL_URL}/api/demo-payment/gateway-initialize`,
				isActive: true,
			},
		],
	});
}
