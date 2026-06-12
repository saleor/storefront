import { type AddressFragment } from "@/checkout/graphql";
import { type BillingAddressData } from "@/checkout/components/payment";

export type StripeBillingContext = {
	billingData: BillingAddressData;
	sameAsBilling: boolean;
	hasShippingAddress: boolean;
	shippingAddress: AddressFragment | null | undefined;
	userAddresses: ReadonlyArray<AddressFragment> | undefined;
	authenticated: boolean;
};
