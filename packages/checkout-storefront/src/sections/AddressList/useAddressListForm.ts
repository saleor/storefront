import { Address } from "@/checkout-storefront/components/AddressForm/types";
import {
  getByMatchingAddress,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { FormSubmitFn } from "@/checkout-storefront/hooks/useSubmit";
import { getById, getByUnmatchingId } from "@/checkout-storefront/lib/utils/common";
import { useAuthState } from "@saleor/sdk";
import { compact, DebouncedFunc } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";

export interface AddressListFormData {
  selectedAddressId: string | undefined;
  addressList: AddressFragment[];
}

interface UseAddressListProps {
  onSubmit: FormSubmitFn<AddressListFormData>;
  debouncedSubmit: DebouncedFunc<FormSubmitFn<AddressListFormData>>;
  checkoutAddress: Address;
  defaultAddress: Address;
  checkAddressAvailability?: boolean;
}

export const useAddressListForm = ({
  onSubmit,
  debouncedSubmit,
  checkoutAddress,
  defaultAddress,
  checkAddressAvailability = false,
}: UseAddressListProps) => {
  const { user } = useAuthState();

  const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

  // sdk has outdated types
  const addresses = (user?.addresses || []) as AddressFragment[];

  const checkoutAddressRef = useRef<Address>(null);

  const form = useForm<AddressListFormData>({
    initialValues: {
      addressList: addresses,
      selectedAddressId: addresses.find(getByMatchingAddress(checkoutAddress))?.id,
    },
    onSubmit,
  });

  const { values, setValues, setFieldValue, handleSubmit } = form;
  const { addressList, selectedAddressId } = values;
  const selectedAddress = addressList.find(getById(selectedAddressId));

  const addressListUpdate = async (address: Address, addressList: AddressFragment[]) => {
    if (!address) {
      return;
    }

    await setValues({
      addressList,
      selectedAddressId: address.id,
    });

    handleSubmit();
  };

  const onAddressCreateSuccess = async (address: Address) =>
    addressListUpdate(address, compact([...addressList, address]));

  const onAddressUpdateSuccess = async (address: Address) =>
    addressListUpdate(
      address,
      addressList.map((existingAddress) =>
        existingAddress.id === address?.id ? address : existingAddress
      )
    );

  const onAddressDeleteSuccess = (id: string) =>
    addressListUpdate(addressList[0], addressList.filter(getByUnmatchingId(id)));

  const handleAutoAddressSelect = useCallback(
    async (address: AddressFragment) => {
      await setFieldValue("selectedAddressId", address.id);
      debouncedSubmit(values);
    },
    [debouncedSubmit, setFieldValue, values]
  );

  const handleDefaultAddressSet = useCallback(async () => {
    const isSelectedAddressSameAsCheckout =
      !!selectedAddress && isMatchingAddress(checkoutAddress, selectedAddress);

    const hasCheckoutAddressChanged = !isMatchingAddress(
      checkoutAddress,
      checkoutAddressRef.current
    );

    // currently selected address is the same as checkout or
    // address hasn't changed at all -> do nothing
    if (isSelectedAddressSameAsCheckout || (checkoutAddress && !hasCheckoutAddressChanged)) {
      return;
    }

    // in case some address needs to be set prefer to select
    // user default address
    if (defaultAddress) {
      checkoutAddressRef.current = defaultAddress;
      void handleAutoAddressSelect(defaultAddress);
      return;
    }

    const firstAvailableAddress = addressList.find(isAvailable);

    // otherwise just choose any available
    if (firstAvailableAddress) {
      checkoutAddressRef.current = firstAvailableAddress;
      void handleAutoAddressSelect(firstAvailableAddress);
    }

    // otherwise it gets way overcomplicated to get this to run only when needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress?.id, checkoutAddress?.id, addressList.length]);

  useEffect(() => {
    void handleDefaultAddressSet();
  }, [handleDefaultAddressSet]);

  return {
    form,
    userAddressActions: {
      onAddressCreateSuccess,
      onAddressUpdateSuccess,
      onAddressDeleteSuccess,
    },
  };
};
