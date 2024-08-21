const url = `https://${process.env.VERCEL_BRANCH_URL}`;

export async function GET() {
	return Response.json({
		id: "storefront.demo-payment",
		version: "1.0.0",
		requiredSaleorVersion: "^3.20",
		name: "Demo Payment App",
		author: "Storefront",
		about: "Demo for processing payments. Can be used for testing purposes.",

		permissions: ["HANDLE_PAYMENTS"],

		appUrl: `${url}`,
		configurationUrl: `${url}`,
		tokenTargetUrl: `${url}`,

		dataPrivacy: "",
		dataPrivacyUrl: `${url}`,
		homepageUrl: `${url}`,
		supportUrl: `${url}`,
		// brand: {
		// 	logo: {
		// 		default: [APP_ICON_URL],
		// 	},
		// },
		webhooks: [
			{
				name: "Transaction initialize",
				asyncEvents: ["TRANSACTION_INITIALIZE_SESSION"],
				query: `
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
				}`,
				targetUrl: `${url}/api/demo-payment/transaction-initialize`,
				isActive: true,
			},
			{
				name: "Gateway initialize",
				asyncEvents: ["PAYMENT_GATEWAY_INITIALIZE_SESSION"],
				query: `
				subscription {
					event {
						... on PaymentGatewayInitializeSession {
							__typename
							amount
							data
						}
					}
				}`,
				targetUrl: `${url}/api/demo-payment/gateway-initialize`,
				isActive: true,
			},
		],
	});
}
