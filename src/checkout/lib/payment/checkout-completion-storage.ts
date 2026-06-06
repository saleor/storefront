/** sessionStorage key — set before navigating to order confirmation after checkoutComplete. */
export const PENDING_ORDER_STORAGE_KEY = "checkout:pending-order";

export function setPendingOrderId(orderId: string) {
	try {
		sessionStorage.setItem(PENDING_ORDER_STORAGE_KEY, orderId);
	} catch {
		// Private browsing or storage disabled — navigation still works via URL.
	}
}

export function getPendingOrderId(): string | null {
	try {
		return sessionStorage.getItem(PENDING_ORDER_STORAGE_KEY);
	} catch {
		return null;
	}
}

export function clearPendingOrderId() {
	try {
		sessionStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
	} catch {
		// ignore
	}
}
