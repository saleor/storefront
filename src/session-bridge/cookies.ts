/** Server and client agree on this cookie name per Saleor channel. */
export function checkoutIdCookieName(channel: string): string {
	return `checkoutId-${channel}`;
}
