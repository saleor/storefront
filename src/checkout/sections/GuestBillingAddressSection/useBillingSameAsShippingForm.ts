/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useRef, useState } from "react";
import { type OptionalAddress } from "@/checkout/components/AddressForm/types";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getEmptyAddress,
	isMatchingAddress,
	isMatchingAddressData,
} from "@/checkout/components/AddressForm/utils";
import { type AddressFragment, useCheckoutBillingAddressUpdateMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { type ChangeHandler, useForm } from "@/checkout/hooks/useForm";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

interface BillingSameAsShippingFormData {
	billingSameAsShipping: boolean;
	billingAddress: OptionalAddress;
}

interface BillingSameAsShippingFormProps {
	autoSave: boolean;
	onSetBillingSameAsShipping?: (address: OptionalAddress) => void;
}

export const useBillingSameAsShippingForm = (
	{ autoSave, onSetBillingSameAsShipping }: BillingSameAsShippingFormProps = { autoSave: false },
) => {
	const { checkout } = useCheckout();
	const { billingAddress, shippingAddress, isShippingRequired } = checkout;
	const previousShippingAddress = useRef<OptionalAddress>(shippingAddress);
	const previousIsShippingRequired = useRef(isShippingRequired);
	const { setChangingBillingCountry } = useCheckoutUpdateStateActions();
	const [formBillingAddress, setFormBillingAddress] =
		useState<MightNotExist<AddressFragment>>(billingAddress);

	const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

	const onSubmit = useFormSubmit<BillingSameAsShippingFormData, typeof checkoutBillingAddressUpdate>({
		scope: "checkoutBillingUpdate",
		onSubmit: checkoutBillingAddressUpdate,
		shouldAbort: () => !formBillingAddress || !Object.keys(formBillingAddress).length,
		onStart: () => {
			if (formBillingAddress?.country.code !== billingAddress?.country.code) {
				setChangingBillingCountry(true);
			}
		},
		parse: ({ languageCode, checkoutId }) => ({
			languageCode,
			checkoutId,
			billingAddress: getAddressInputDataFromAddress(formBillingAddress),
			validationRules: getAddressValidationRulesVariables({ autoSave }),
		}),
		onSuccess: ({ data }) => {
			setFormBillingAddress(data.checkout?.billingAddress);
		},
		onFinished: () => {
			setChangingBillingCountry(false);
		},
	});

	const getInitialShippingAsBillingValue = useCallback(() => {
		if (!checkout.isShippingRequired) {
			return false;
		}

		return !billingAddress || isMatchingAddress(shippingAddress, billingAddress);
	}, [shippingAddress, billingAddress, checkout.isShippingRequired]);

	const initialValues = {
		billingSameAsShipping: getInitialShippingAsBillingValue(),
		billingAddress: billingAddress,
	};

	const previousBillingSameAsShipping = useRef(initialValues.billingSameAsShipping);

	const form = useForm<BillingSameAsShippingFormData>({
		onSubmit,
		initialValues,
		initialDirty: true,
	});

	const {
		values: { billingSameAsShipping },
		setFieldValue,
		handleSubmit,
		handleChange,
	} = form;

	const onChange: ChangeHandler = (event) => {
		if (event.target.name === "billingSameAsShipping") {
			previousBillingSameAsShipping.current = billingSameAsShipping;
		}
		handleChange(event);
	};

	// handle "billing same as shipping" checkbox value changes
	useEffect(() => {
		const handleBillingSameAsShippingChanged = async () => {
			const hasBillingSameAsShippingChangedToTrue =
				billingSameAsShipping && !previousBillingSameAsShipping.current;

			const hasBillingSameAsShippingChangedToFalse =
				!billingSameAsShipping && previousBillingSameAsShipping.current;

			if (hasBillingSameAsShippingChangedToFalse) {
				previousBillingSameAsShipping.current = false;

				// autosave means it's geust form and we want to show empty form
				// and clear all the fields in api
				if (autoSave) {
					setFormBillingAddress(getEmptyAddress());
				}
				return;
			}

			if (!hasBillingSameAsShippingChangedToTrue) {
				return;
			}

			previousBillingSameAsShipping.current = true;
			setFormBillingAddress(shippingAddress);
			if (typeof onSetBillingSameAsShipping === "function") {
				onSetBillingSameAsShipping(shippingAddress);
			}
		};

		void handleBillingSameAsShippingChanged();
	}, [
		autoSave,
		billingSameAsShipping,
		handleSubmit,
		onSetBillingSameAsShipping,
		setFieldValue,
		shippingAddress,
	]);

	// once billing address in api and form don't match, submit
	useEffect(() => {
		if (formBillingAddress && !isMatchingAddress(billingAddress, formBillingAddress)) {
			handleSubmit();
		}
	}, [billingAddress, billingSameAsShipping, formBillingAddress, handleSubmit, shippingAddress]);

	// when shipping address changes in the api, set it as billing address
	useEffect(() => {
		const handleShippingAddressChanged = async () => {
			const hasShippingAddressChanged = !isMatchingAddressData(
				shippingAddress,
				previousShippingAddress.current,
			);

			if (!hasShippingAddressChanged) {
				return;
			}

			previousShippingAddress.current = shippingAddress;

			if (billingSameAsShipping) {
				setFormBillingAddress(shippingAddress);
			}
		};

		void handleShippingAddressChanged();
	}, [billingSameAsShipping, handleSubmit, shippingAddress]);

	useEffect(() => {
		if (!isShippingRequired && previousIsShippingRequired) {
			void setFieldValue("billingSameAsShipping", false);
		}
	}, [isShippingRequired, setFieldValue]);

	return {
		...form,
		handleChange: onChange,
	};
};
