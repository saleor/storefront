export async function GET() {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL;

	if (!baseUrl) {
		return new Response("Base URL is not configured. Check the .env file", { status: 500 });
	}

	return Response.json({
		name: "Open Storefront App",
		id: "example.app.wonderful",
		version: "0.0.1",
		requiredSaleorVersion: "^3.21",
		author: "Saleor Community Resources",
		about: "Adds storefront redirection button to the Product Details page.",

		permissions: ["MANAGE_PRODUCTS"],

		tokenTargetUrl: new URL("/api/openStorefrontApp/register", baseUrl).toString(),

		webhooks: [],
		extensions: [
			{
				label: "Open this product in the Storefront",
				mount: "PRODUCT_DETAILS_MORE_ACTIONS",
				target: "NEW_TAB",
				permissions: [],
				url: new URL("/api/openStorefrontApp/redirect", baseUrl).toString(),
				options: {
					newTabTarget: {
						method: "GET",
					},
				},
			},
		],
	});
}
