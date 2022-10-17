import {
  CountryCode,
  useAddressValidationRulesQuery,
  ValidationRulesFragment,
} from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { warnAboutMissingTranslation } from "@/checkout-storefront/hooks/useFormattedMessages/utils";
import { getRequiredAddressFields, getOrderedAddressFields } from "@/checkout-storefront/lib/utils";
import { Address } from "@/checkout-storefront/components/AddressForm/types";
import { defaultCountry } from "@/checkout-storefront/lib/consts";
import {
  AddressFieldLabel,
  addressFieldMessages,
  LocalizedAddressFieldLabel,
  localizedAddressFieldMessages,
} from "@/checkout-storefront/hooks/useAddressFormUtils/messages";
import camelCase from "lodash-es/camelCase";

export const useAddressFormUtils = (countryCode: CountryCode = defaultCountry) => {
  const formatMessage = useFormattedMessages();

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules as ValidationRulesFragment;

  const { countryAreaType, postalCodeType, cityType } = validationRules || {};

  const localizedFields = {
    countryArea: countryAreaType,
    city: cityType,
    postalCode: postalCodeType,
  };

  const hasAllRequiredFields = (address: Address) => !getMissingFieldsFromAddress(address).length;

  const getMissingFieldsFromAddress = (address: Address) => {
    if (!address) {
      return [];
    }

    return Object.entries(address).reduce((result, [fieldName, fieldValue]) => {
      if (!isRequiredField(fieldName as AddressField)) {
        return result;
      }

      return !!fieldValue ? result : ([...result, fieldName] as AddressField[]);
    }, [] as AddressField[]);
  };

  const isRequiredField = (field: AddressField) =>
    getRequiredAddressFields(validationRules?.requiredFields as AddressField[]).includes(field);

  const getLocalizedFieldLabel = (field: AddressField, localizedField?: string) => {
    try {
      const translatedLabel = formatMessage(
        localizedAddressFieldMessages[camelCase(localizedField) as LocalizedAddressFieldLabel]
      );
      return translatedLabel;
    } catch (e) {
      warnAboutMissingTranslation(localizedField);
      return formatMessage(addressFieldMessages[camelCase(field) as AddressFieldLabel]);
    }
  };

  const getFieldLabel = (field: AddressField) => {
    const localizedField = localizedFields[field as keyof typeof localizedFields];

    const isLocalizedField = !!localizedField && localizedField !== field;

    if (isLocalizedField) {
      return getLocalizedFieldLabel(
        field,
        localizedFields[field as keyof typeof localizedFields] as LocalizedAddressFieldLabel
      );
    }

    return formatMessage(addressFieldMessages[field as AddressFieldLabel]);
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
    ...validationRules,
    allowedFields: validationRules?.allowedFields as AddressField[],
  };
};
