import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSafeContext } from "@/checkout-storefront/providers/createSafeContext";
import { getById, getByUnmatchingId } from "@/checkout-storefront/lib/utils";
import {
  AddressFragment,
  useUserAddressCreateMutation,
  useUserAddressDeleteMutation,
  useUserAddressUpdateMutation,
  useUserQuery,
} from "@/checkout-storefront/graphql";
import { useAuthState } from "@saleor/sdk";
import {
  Address,
  AddressFormData,
  UserAddressFormData,
} from "@/checkout-storefront/components/AddressForm/types";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";
import {
  getAddressInputData,
  getMatchingAddressFromList,
  getUserAddressFormDataFromAddress,
  isMatchingAddress,
} from "@/checkout-storefront/lib/utils";
import { ApiErrors, useAlerts } from "@/checkout-storefront/hooks";
import { debounce } from "lodash-es";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";

interface AddressListProviderProps {
  onCheckoutAddressUpdate: (address: UserAddressFormData) => void;
  checkoutAddress: Address;
  defaultAddress: Address;
  checkAddressAvailability: boolean;
}

type SubmitReturnWithErrors = Promise<{
  hasErrors: boolean;
  errors: ApiErrors<AddressFormData>;
}>;

interface ContextConsumerProps {
  addressList: AddressFragment[];
  selectedAddressId: string | undefined;
  setSelectedAddressId: (id: string) => void;
  addressUpdate: (formData: UserAddressFormData) => SubmitReturnWithErrors;
  addressCreate: (formData: AddressFormData) => SubmitReturnWithErrors;
  addressDelete: (id: string) => SubmitReturnWithErrors;
  updating: boolean;
  deleting: boolean;
  creating: boolean;
}

export const [useAddressList, Provider] = createSafeContext<ContextConsumerProps>();

export const AddressListProvider: React.FC<PropsWithChildren<AddressListProviderProps>> = ({
  children,
  defaultAddress,
  checkoutAddress,
  onCheckoutAddressUpdate,
  checkAddressAvailability,
}) => {
  const { user: authUser } = useAuthState();
  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

  const { showErrors } = useAlerts();

  const user = data?.me;
  const addresses = user?.addresses || [];

  const [{ fetching: updating }, userAddressUpdate] = useUserAddressUpdateMutation();
  const [{ fetching: deleting }, userAddressDelete] = useUserAddressDeleteMutation();
  const [{ fetching: creating }, userAddressCreate] = useUserAddressCreateMutation();

  const [addressList, setAddressList] = useState(addresses);

  const getMatchingAddress = getMatchingAddressFromList(addressList);

  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    getMatchingAddress(checkoutAddress)?.id || defaultAddress?.id
  );

  const checkoutAddressRef = useRef<Address>(null);

  const handleCheckoutAddressUpdate = useCallback(
    (address: AddressFragment) =>
      onCheckoutAddressUpdate(getUserAddressFormDataFromAddress(address)),
    [onCheckoutAddressUpdate]
  );

  const getSelectedAddress = useCallback(
    (id: string | undefined = selectedAddressId) => addressList.find(getById(id)),
    [addressList, selectedAddressId]
  );

  const addressUpdate = useCallback(
    async (formData: UserAddressFormData) => {
      const result = await userAddressUpdate({
        address: getAddressInputData({
          ...formData,
        }),
        id: formData.id,
      });

      const [hasErrors, errors] = extractMutationErrors(result);

      if (hasErrors) {
        showErrors(errors, "userAddressUpdate");
        return { hasErrors, errors };
      }

      const updatedAddress = result?.data?.accountAddressUpdate?.address as AddressFragment;

      const updatedList = addressList.map((existingAddress) =>
        existingAddress.id === updatedAddress.id ? updatedAddress : existingAddress
      );

      setAddressList(updatedList);

      if (isAvailable(updatedAddress)) {
        setSelectedAddressId(updatedAddress.id);

        handleCheckoutAddressUpdate(updatedAddress);
      }

      return { hasErrors: false, errors: [] };
    },
    [addressList, handleCheckoutAddressUpdate, isAvailable, showErrors, userAddressUpdate]
  );

  const addressDelete = useCallback(
    async (id: string) => {
      const result = await userAddressDelete({
        id,
      });

      const [hasErrors, errors] = extractMutationErrors(result);

      if (hasErrors) {
        showErrors(errors, "userAddressDelete");
      }

      setAddressList(addressList.filter(getByUnmatchingId(id)));

      if (selectedAddressId === id && addressList[0]) {
        const newAddress = addressList[0];
        setSelectedAddressId(newAddress.id);
        handleCheckoutAddressUpdate(newAddress);
      }

      return { hasErrors, errors };
    },
    [addressList, handleCheckoutAddressUpdate, showErrors, userAddressDelete, selectedAddressId]
  );

  const addressCreate = useCallback(
    async (formData: AddressFormData) => {
      const result = await userAddressCreate({
        address: getAddressInputData({
          ...formData,
        }),
      });

      const [hasErrors, errors] = extractMutationErrors(result);

      if (hasErrors) {
        showErrors(errors, "userAddressCreate");
      } else {
        const address = result?.data?.accountAddressCreate?.address as AddressFragment;

        setAddressList([...addressList, address]);

        if (isAvailable(address)) {
          setSelectedAddressId(address.id);
          handleCheckoutAddressUpdate(address);
        }
      }

      return { hasErrors, errors };
    },
    [addressList, handleCheckoutAddressUpdate, showErrors, isAvailable, userAddressCreate]
  );

  // because eslint is unable to read deps inside of debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((address: AddressFragment) => {
      handleCheckoutAddressUpdate(address);
    }, 2000),
    [handleCheckoutAddressUpdate]
  );

  const handleAddressSelect = useCallback(
    (addressId: string) => {
      setSelectedAddressId(addressId);
      debouncedUpdate(getSelectedAddress(addressId) as AddressFragment);
    },
    [getSelectedAddress, debouncedUpdate]
  );

  const handleDefaultAddressSet = () => {
    const isSelectedAddressSameAsCheckout =
      !!getSelectedAddress() && isMatchingAddress(checkoutAddress, getSelectedAddress());

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
      handleAddressSelect(defaultAddress.id);
      return;
    }

    const firstAvailableAddress = addressList.find(isAvailable);

    // otherwise just choose any available
    if (firstAvailableAddress) {
      checkoutAddressRef.current = firstAvailableAddress;
      handleAddressSelect(firstAvailableAddress?.id);
    }
  };

  // otherwise it gets way overcomplicated to get this to run only when needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleDefaultAddressSet, [defaultAddress?.id, checkoutAddress?.id, addressList.length]);

  const providerValues: ContextConsumerProps = useMemo(() => {
    return {
      addressList,
      setSelectedAddressId: handleAddressSelect,
      selectedAddressId,
      addressCreate,
      addressUpdate,
      addressDelete,
      deleting,
      updating,
      creating,
    };
  }, [
    addressList,
    deleting,
    updating,
    creating,
    selectedAddressId,
    addressCreate,
    addressDelete,
    addressUpdate,
    handleAddressSelect,
  ]);

  return <Provider value={providerValues}>{children}</Provider>;
};
