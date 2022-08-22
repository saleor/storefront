import { AddressValidationData } from "@/checkout-storefront/graphql";
import { MessageKey, useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { AddressField, ApiAddressField } from "@/checkout-storefront/lib/globalTypes";
import { warnAboutMissingTranslation } from "@/checkout-storefront/hooks/useFormattedMessages/utils";
import { uniq } from "lodash-es";

const addressFieldsOrder: AddressField[] = [
  "firstName",
  "lastName",
  "companyName",
  "phone",
  "streetAddress1",
  "streetAddress2",
  "city",
  "postalCode",
  "cityArea",
  "countryArea",
];

// api doesn't order the fields but we want to
const getSortedAddressFields = (addressFields: AddressField[] = []): AddressField[] => {
  const filteredAddressFields = getFilteredAddressFields(addressFields);

  return addressFieldsOrder.filter((orderedAddressField) =>
    filteredAddressFields.includes(orderedAddressField)
  );
};

export const getSortedAddressFieldsFromAddress = (address: Partial<Record<AddressField, any>>) =>
  getSortedAddressFields(Object.keys(address) as AddressField[]);

const getRequiredAddressFields = (requiredFields: AddressField[]): AddressField[] => [
  ...requiredFields,
  "firstName",
  "lastName",
];

// api doesn't approve of "name" so we replace it with "firstName"
// and "lastName"
const getFilteredAddressFields = (addressFields: ApiAddressField[]): AddressField[] => {
  const filteredAddressFields = addressFields.filter(
    (addressField: ApiAddressField) => addressField !== "name"
  ) as AddressField[];

  return uniq([...filteredAddressFields, "firstName", "lastName"]);
};

export const useAddressFormUtils = (validationRules?: AddressValidationData | null) => {
  const formatMessage = useFormattedMessages();

  const isRequiredField = (field: AddressField) =>
    getRequiredAddressFields(validationRules?.requiredFields! as AddressField[]).includes(field);

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

  const sortedAddressFields = getSortedAddressFields(
    validationRules?.allowedFields! as AddressField[]
  );

  return { sortedAddressFields, getFieldLabel, isRequiredField };
};
