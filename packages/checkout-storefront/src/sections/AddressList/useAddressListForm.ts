import { OptionalAddress } from "@/checkout-storefront/components/AddressForm/types";
import {
  getByMatchingAddress,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { useForm } from "@/checkout-storefront/hooks/useForm";
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
  checkoutAddress: OptionalAddress;
  defaultAddress: OptionalAddress;
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

  const previousCheckoutAddress = useRef<OptionalAddress>(null);

  const form = useForm<AddressListFormData>({
    initialValues: {
      addressList: addresses,
      selectedAddressId: addresses.find(getByMatchingAddress(checkoutAddress))?.id,
    },
    onSubmit,
  });

  const { values, setValues, setFieldValue, handleSubmit } = form;

  const debouncedSubmit = useDebouncedSubmit(handleSubmit);

  const { addressList, selectedAddressId } = values;
  const selectedAddress = addressList.find(getById(selectedAddressId));

  useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, selectedAddressId]);

  const addressListUpdate = async (
    selectedAddress: OptionalAddress,
    addressList: AddressFragment[]
  ) => {
    if (!selectedAddress) {
      return;
    }

    await setValues({
      addressList,
      selectedAddressId: selectedAddress.id,
    });

    handleSubmit();
  };

  const onAddressCreateSuccess = async (address: OptionalAddress) =>
    addressListUpdate(address, compact([...addressList, address]));

  const onAddressUpdateSuccess = async (address: OptionalAddress) =>
    addressListUpdate(
      address,
      addressList.map((existingAddress) =>
        existingAddress.id === address?.id ? address : existingAddress
      )
    );

  const onAddressDeleteSuccess = (id: string) =>
    addressListUpdate(addressList[0], addressList.filter(getByUnmatchingId(id)));

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

    // if not, prefer user default address
    if (defaultAddress) {
      previousCheckoutAddress.current = defaultAddress;
      void setFieldValue("selectedAddressId", defaultAddress.id);
      // void handleAutoAddressSelect(defaultAddress);
      return;
    }

    const firstAvailableAddress = addressList.find(isAvailable);

    // otherwise just choose any available
    if (firstAvailableAddress) {
      previousCheckoutAddress.current = firstAvailableAddress;
      void setFieldValue("selectedAddressId", firstAvailableAddress.id);
    }

    // otherwise it gets way overcomplicated to get this to run only when needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress?.id, checkoutAddress?.id]);

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
