import { CHECKOUT_TOKEN } from "@/lib/const";
import {
  AddressFragment,
  Checkout,
  CheckoutDetailsFragment,
  CheckoutError,
  CountryCode,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from "@/saleor/api";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "react-use";

export enum AddressType {
  SHIPPING,
  BILLING,
}
interface AddressForm {
  firstName: string;
  lastName: string;
  phone: string;
  country: CountryCode;
  streetAddress1: string;
  city: string;
  postalCode: string;
}

export const AddressForm = ({
  addressType,
  existingAddressData,
  toggle,
}: {
  addressType: AddressType;
  existingAddressData?: AddressFragment;
  toggle: () => void;
}) => {
  const [token] = useLocalStorage(CHECKOUT_TOKEN);

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    setError: setErrorAddress,
    getValues,
  } = useForm<AddressForm>({
    defaultValues: {
      firstName: existingAddressData?.firstName || "",
      lastName: existingAddressData?.lastName || "",
      phone: existingAddressData?.phone || "",
      country: CountryCode.Pl,
      streetAddress1: existingAddressData?.streetAddress1 || "",
      city: existingAddressData?.city || "",
      postalCode: existingAddressData?.postalCode || "",
    },
  });

  const [checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation({});

  const [checkoutShippingAddressUpdate] =
    useCheckoutShippingAddressUpdateMutation({});

  const onAddressFormSubmit = handleSubmitAddress(
    async (formData: AddressForm) => {
      let errors: CheckoutError[] = [];
      if (addressType === AddressType.BILLING) {
        const result = await checkoutBillingAddressUpdate({
          variables: {
            address: {
              ...formData,
            },
            token,
          },
        });
        const mutationErrors =
          result.data?.checkoutBillingAddressUpdate?.errors || [];
        errors = errors.concat(mutationErrors);
      } else {
        const result = await checkoutShippingAddressUpdate({
          variables: {
            address: {
              ...formData,
            },
            token,
          },
        });
        const mutationErrors =
          result.data?.checkoutShippingAddressUpdate?.errors || [];
        errors = errors.concat(mutationErrors);
      }

      if (errors.length > 0) {
        errors.forEach((e) =>
          setErrorAddress(e.field as keyof AddressForm, {
            message: e.message || "",
          })
        );
        return;
      }
      toggle();
    }
  );
  return (
    <form onSubmit={onAddressFormSubmit}>
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-full">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="phone"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm"
              {...registerAddress("phone", {
                required: true,
                pattern:
                  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i,
              })}
            />
            {!!errorsAddress.phone && <p>{errorsAddress.phone.message}</p>}
          </div>
        </div>

        <div className="col-span-full sm:col-span-6">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="province"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...registerAddress("firstName", {
                required: true,
              })}
            />
            {!!errorsAddress.firstName && (
              <p>{errorsAddress.firstName.message}</p>
            )}
          </div>
        </div>

        <div className="col-span-full sm:col-span-6">
          <label
            htmlFor="province"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="lastName"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...registerAddress("lastName", {
                required: true,
              })}
            />
            {!!errorsAddress.lastName && (
              <p>{errorsAddress.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="streetAddress1"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm"
              {...registerAddress("streetAddress1", {
                required: true,
              })}
            />
            {!!errorsAddress.streetAddress1 && (
              <p>{errorsAddress.streetAddress1.message}</p>
            )}
          </div>
        </div>

        <div className="col-span-full sm:col-span-6">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="city"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...registerAddress("city", { required: true })}
            />
            {!!errorsAddress.city && <p>{errorsAddress.city.message}</p>}
          </div>
        </div>

        {/* <div className="col-span-full sm:col-span-4">
        <label
          htmlFor="province"
          className="block text-sm font-medium text-gray-700"
        >
          Province
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="province"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div> */}

        <div className="col-span-full sm:col-span-6">
          <label
            htmlFor="postal-code"
            className="block text-sm font-medium text-gray-700"
          >
            Postal code
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="postal-code"
              autoComplete="postal-code"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...registerAddress("postalCode", {
                required: true,
              })}
            />
            {!!errorsAddress.postalCode && (
              <p>{errorsAddress.postalCode.message}</p>
            )}
          </div>
        </div>

        <div className="col-span-full">
          <button
            className="w-full bg-blue-100 border border-blue-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium hover:bg-blue-200"
            onClick={() => onAddressFormSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
