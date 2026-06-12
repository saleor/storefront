/** Whether the information step should submit a saved account address vs form data. */
export function isUsingSavedShippingAddress(options: {
	isAuthenticated: boolean;
	savedAddressCount: number;
	showNewAddressForm: boolean;
	isEnteringNewAddress: boolean;
	selectedAddressId: string | null;
}): boolean {
	const { isAuthenticated, savedAddressCount, showNewAddressForm, isEnteringNewAddress, selectedAddressId } =
		options;

	if (!isAuthenticated || savedAddressCount === 0) {
		return false;
	}

	// Form mode (Add new, or no saved list) always uses typed form data.
	if (showNewAddressForm || isEnteringNewAddress) {
		return false;
	}

	return Boolean(selectedAddressId);
}

/**
 * Saleor `saveAddress` flag for checkout address mutations.
 * Persists to the customer address book on checkoutComplete (logged-in users only).
 * @see https://docs.saleor.io/developer/checkout/address
 */
export function getCheckoutSaveAddressFlag(options: {
	isAuthenticated: boolean;
	isUsingSavedAddress: boolean;
}): boolean {
	if (!options.isAuthenticated) {
		return false;
	}

	// Re-applying an existing saved address should not create a duplicate on complete.
	return !options.isUsingSavedAddress;
}

/** Whether billing should be saved on checkoutComplete. */
export function getBillingSaveAddressFlag(options: {
	isAuthenticated: boolean;
	selectedAddressId: string | null;
	savedAddressIds: ReadonlySet<string>;
}): boolean {
	if (!options.isAuthenticated) {
		return false;
	}

	if (!options.selectedAddressId) {
		return true;
	}

	return !options.savedAddressIds.has(options.selectedAddressId);
}
