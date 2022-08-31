import {
  AddressFragment,
  CountryCode,
  useAddressValidationRulesQuery,
} from "@/checkout-storefront/graphql";
import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { warnAboutMissingTranslation } from "@/checkout-storefront/hooks/useFormattedMessages/utils";
import { reduce } from "lodash-es";
import {
  getRequiredAddressFields,
  getOrderedAddressFields,
} from "@/checkout-storefront/sections/Addresses/utils";

export const useAddressFormUtils = (countryCode: CountryCode) => {
  const formatMessage = useFormattedMessages();

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules;

  const hasAllRequiredFields = (address: AddressFragment) =>
    !getMissingFieldsFromAddress(address).length;

  const getMissingFieldsFromAddress = (address: AddressFragment) =>
    reduce(
      address,
      (result, fieldValue, fieldName) => {
        if (!isRequiredField(fieldName)) {
          return result;
        }

        return !!fieldValue ? result : [...result, fieldName];
      },
      []
    );

  const isRequiredField = (field: AddressField) =>
    getRequiredAddressFields(validationRules?.requiredFields as AddressField[]).includes(field);

  const getLocalizedFieldName = (field: AddressField, localizedField?: string | null) => {
    try {
      const translatedLabel = formatMessage(localizedField as MessageKey);
      return translatedLabel;
    } catch (e) {
      warnAboutMissingTranslation(localizedField as string);
      return formatMessage(field as MessageKey);
    }
  };

  const getFieldLabel = (field: AddressField) => {
    const { countryAreaType, postalCodeType, cityType } = validationRules || {};

    const localizedFields: Partial<Record<AddressField, string | undefined>> = {
      countryArea: countryAreaType,
      city: cityType,
      postalCode: postalCodeType,
    };

    const isLocalizedField = Object.keys(localizedFields).includes(field);

    if (!isLocalizedField) {
      return formatMessage(field as MessageKey);
    }

    return getLocalizedFieldName(field, localizedFields[field]);
  };

  const orderedAddressFields = getOrderedAddressFields(
    validationRules?.allowedFields as AddressField[]
  );

  return {
    orderedAddressFields,
    getFieldLabel,
    isRequiredField,
    hasAllRequiredFields,
    getMissingFieldsFromAddress,
    validationRules,
  };
};
