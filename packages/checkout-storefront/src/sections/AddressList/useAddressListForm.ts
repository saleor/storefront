import { Address } from "@/checkout-storefront/components/AddressForm/types";
import {
  getByMatchingAddress,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { ChangeHandler, useForm } from "@/checkout-storefront/hooks/useForm";
import { FormSubmitFn } from "@/checkout-storefront/hooks/useFormSubmit";
import { getById, getByUnmatchingId } from "@/checkout-storefront/lib/utils/common";
import { useAuthState } from "@saleor/sdk";
import { compact } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";

export interface AddressListFormData {
  selectedAddressId: string | undefined;
  addressList: AddressFragment[];
}

interface UseAddressListProps {
  onSubmit: FormSubmitFn<AddressListFormData>;
  checkoutAddress: Address;
  defaultAddress: Address;
  checkAddressAvailability?: boolean;
}

export const useAddressListForm = ({
  onSubmit,
  checkoutAddress,
  defaultAddress,
  checkAddressAvailability = false,
}: UseAddressListProps) => {
  const { user } = useAuthState();

  const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

  // sdk has outdated types
  const addresses = (user?.addresses || []) as AddressFragment[];

  const previousCheckoutAddress = useRef<Address>(null);

  const form = useForm<AddressListFormData>({
    initialValues: {
      addressList: addresses,
      selectedAddressId: addresses.find(getByMatchingAddress(checkoutAddress))?.id,
    },
    onSubmit,
  });

  const { values, setValues, setFieldValue, handleSubmit, handleChange } = form;

  const debouncedSubmit = useDebouncedSubmit(handleSubmit);

  const { addressList, selectedAddressId } = values;
  const selectedAddress = addressList.find(getById(selectedAddressId));

  const onChange: ChangeHandler = (e) => {
    handleChange(e);
    debouncedSubmit();
  };

  const addressListUpdate = async (selectedAddress: Address, addressList: AddressFragment[]) => {
    if (!selectedAddress) {
      return;
    }

    await setValues({
      addressList,
      selectedAddressId: selectedAddress.id,
    });

    handleSubmit();
  };

  const onAddressCreateSuccess = async (address: Address) =>
    addressListUpdate(address, compact([...addressList, address]));

  const onAddressUpdateSuccess = async (address: Address) => {
    void addressListUpdate(
      address,
      addressList.map((existingAddress) =>
        existingAddress.id === address?.id ? address : existingAddress
      )
    );
  };

  const onAddressDeleteSuccess = (id: string) =>
    addressListUpdate(addressList[0], addressList.filter(getByUnmatchingId(id)));

  const handleAutoAddressSelect = useCallback(
    async (address: AddressFragment) => {
      await setFieldValue("selectedAddressId", address.id);
      debouncedSubmit();
    },
    [debouncedSubmit, setFieldValue]
  );

  const handleDefaultAddressSet = useCallback(async () => {
    const isSelectedAddressSameAsCheckout =
      !!selectedAddress && isMatchingAddress(checkoutAddress, selectedAddress);

    const hasCheckoutAddressChanged = !isMatchingAddress(
      checkoutAddress,
      previousCheckoutAddress.current
    );

    // currently selected address is the same as checkout or
    // address hasn't changed at all -> do nothing
    if (isSelectedAddressSameAsCheckout || (checkoutAddress && !hasCheckoutAddressChanged)) {
      return;
    }

    // a new address has been added but since it's a user address
    // its id doesn't match checkout address id
    if (
      checkoutAddress &&
      checkoutAddress.id !== selectedAddressId &&
      isMatchingAddress(checkoutAddress, selectedAddress)
    ) {
      previousCheckoutAddress.current = checkoutAddress;
      void setValues({
        addressList: addressList.map((existingAddress) =>
          existingAddress.id === selectedAddressId ? checkoutAddress : existingAddress
        ),
        selectedAddressId: checkoutAddress.id,
      });
      return;
    }

    // if not, prefer user default address
    if (defaultAddress) {
      previousCheckoutAddress.current = defaultAddress;
      void handleAutoAddressSelect(defaultAddress);
      return;
    }

    const firstAvailableAddress = addressList.find(isAvailable);

    // otherwise just choose any available
    if (firstAvailableAddress) {
      previousCheckoutAddress.current = firstAvailableAddress;
      void handleAutoAddressSelect(firstAvailableAddress);
    }

    // otherwise it gets way overcomplicated to get this to run only when needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress?.id, checkoutAddress?.id, addressList.length]);

  useEffect(() => {
    void handleDefaultAddressSet();
  }, [handleDefaultAddressSet]);

  return {
    form: { ...form, handleChange: onChange },
    userAddressActions: {
      onAddressCreateSuccess,
      onAddressUpdateSuccess,
      onAddressDeleteSuccess,
    },
  };
};
