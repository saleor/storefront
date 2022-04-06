import { AddressField } from "@lib/globalTypes";

const addressFieldsOrder: AddressField[] = [
  "name",
  "companyName",
  "streetAddress1",
  "streetAddress2",
  "city",
  "postalCode",
];

// api doesn't order the fields but we want to
export const getSortedAddressFields = (addressFields: AddressField[] = []) =>
  addressFieldsOrder.reduce((result, orderedAddressField) => {
    if (!addressFields.includes(orderedAddressField)) {
      return result;
    }

    return [...result, orderedAddressField];
  }, [] as AddressField[]);

export const getSortedAddressFieldsFromAddress = (
  address: Partial<Record<AddressField, any>>
) => getSortedAddressFields(Object.keys(address) as AddressField[]);
