export const accountRoutes = {
	overview: "/account",
	orders: "/account/orders",
	orderDetail: (number: string) => `/account/orders/${number}`,
	addresses: "/account/addresses",
	settings: "/account/settings",
} as const;
