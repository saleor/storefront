export type DeleteCartLine = (checkoutId: string, lineId: string, channel: string) => Promise<void>;

export type UpdateCartLineQuantity = (
	checkoutId: string,
	lineId: string,
	quantity: number,
	channel: string,
) => Promise<void>;
