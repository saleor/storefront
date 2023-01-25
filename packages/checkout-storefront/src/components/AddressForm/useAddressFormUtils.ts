import {
  CountryCode,
  useAddressValidationRulesQuery,
  ValidationRulesFragment,
} from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { warnAboutMissingTranslation } from "@/checkout-storefront/hooks/useFormattedMessages/utils";
import { OptionalAddress, AddressField } from "@/checkout-storefront/components/AddressForm/types";
import { defaultCountry } from "@/checkout-storefront/lib/consts/countries";
import {
  AddressFieldLabel,
  addressFieldMessages,
  LocalizedAddressFieldLabel,
  localizedAddressFieldMessages,
} from "@/checkout-storefront/components/AddressForm/messages";
import camelCase from "lodash-es/camelCase";
import { useCallback, useMemo } from "react";
import {
  getOrderedAddressFields,
  getRequiredAddressFields,
} from "@/checkout-storefront/components/AddressForm/utils";

export const useAddressFormUtils = (countryCode: CountryCode = defaultCountry) => {
  const formatMessage = useFormattedMessages();

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules as ValidationRulesFragment;

  const { countryAreaType, postalCodeType, cityType } = validationRules || {};

  const localizedFields = useMemo(
    () => ({
      countryArea: countryAreaType,
      city: cityType,
      postalCode: postalCodeType,
    }),
    [cityType, countryAreaType, postalCodeType]
  );

  const isRequiredField = useCallback(
    (field: AddressField) =>
      getRequiredAddressFields(validationRules?.requiredFields as AddressField[]).includes(field),
    [validationRules?.requiredFields]
  );

  const getMissingFieldsFromAddress = useCallback(
    (address: OptionalAddress) => {
      if (!address) {
        return [];
      }

      return Object.entries(address).reduce((result, [fieldName, fieldValue]) => {
        if (!isRequiredField(fieldName as AddressField)) {
          return result;
        }

        return !!fieldValue ? result : ([...result, fieldName] as AddressField[]);
      }, [] as AddressField[]);
    },
    [isRequiredField]
  );

  const hasAllRequiredFields = useCallback(
    (address: OptionalAddress) => !getMissingFieldsFromAddress(address).length,
    [getMissingFieldsFromAddress]
  );

  const getLocalizedFieldLabel = useCallback(
    (field: AddressField, localizedField?: string) => {
      try {
        const translatedLabel = formatMessage(
          localizedAddressFieldMessages[camelCase(localizedField) as LocalizedAddressFieldLabel]
        );
        return translatedLabel;
      } catch (e) {
        warnAboutMissingTranslation(localizedField);
        return formatMessage(addressFieldMessages[camelCase(field) as AddressFieldLabel]);
      }
    },
    [formatMessage]
  );

  const getFieldLabel = useCallback(
    (field: AddressField) => {
      const localizedField = localizedFields[field as keyof typeof localizedFields];

      const isLocalizedField = !!localizedField && localizedField !== field;

      if (isLocalizedField) {
        return getLocalizedFieldLabel(
          field,
          localizedFields[field as keyof typeof localizedFields] as LocalizedAddressFieldLabel
        );
      }

      return formatMessage(addressFieldMessages[field as AddressFieldLabel]);
    },
    [formatMessage, getLocalizedFieldLabel, localizedFields]
  );

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
