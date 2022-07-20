import { intersection, uniq } from "lodash-es";
import { AddressField, ApiAddressField } from "../globalTypes";

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

// api doesn't approve of "name" so we replace it with "firstName"
// and "lastName"
export const getFilteredAddressFields = (
  addressFields: ApiAddressField[]
): AddressField[] => {
  const filteredAddressFields = addressFields.filter(
    (addressField: ApiAddressField) => addressField !== "name"
  ) as AddressField[];

  return uniq([...filteredAddressFields, "firstName", "lastName"]);
};

// api doesn't order the fields but we want to
export const getSortedAddressFields = (
  addressFields: AddressField[] = []
): AddressField[] => {
  const filteredAddressFields = getFilteredAddressFields(addressFields);

  return addressFieldsOrder.reduce((result, orderedAddressField) => {
    if (!filteredAddressFields.includes(orderedAddressField)) {
      return result;
    }

    return [...result, orderedAddressField];
  }, [] as AddressField[]);
};

export const getSortedAddressFieldsFromAddress = (
  address: Partial<Record<AddressField, any>>
) => getSortedAddressFields(Object.keys(address) as AddressField[]);

export const getRequiredAddressFields = (
  requiredFields: AddressField[]
): AddressField[] => [...requiredFields, "firstName", "lastName"];
