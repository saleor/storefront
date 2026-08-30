export type DeleteCartLine = (checkoutId: string, lineId: string) => Promise<void>;

export type UpdateCartLineQuantity = (checkoutId: string, lineId: string, quantity: number) => Promise<void>;
