import { AddressInput, CountryCode, CountryDisplay } from "@/graphql";
import { omit } from "lodash";
import { AddressFormData } from "./types";

export const getAddressInputData = ({
  name,
  firstName,
  lastName,
  countryCode,
  country,
  ...rest
}: Partial<
  AddressFormData & {
    name?: string;
    countryCode?: CountryCode;
    country: CountryDisplay;
  }
>): AddressInput => ({
  ...omit(rest, ["id", "__typename"]),
  firstName: firstName || name?.split(" ")[0] || "",
  lastName: lastName || name?.split(" ")[1] || "",
  country: countryCode || (country?.code as CountryCode),
});
