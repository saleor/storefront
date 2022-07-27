import { Title } from "@/checkout-storefront/components/Title";
import React, { PropsWithChildren } from "react";
import { countries } from "./countries";
import { Select } from "@saleor/ui-kit";
import { useCountrySelect } from "@/checkout-storefront/providers/CountrySelectProvider";

interface UserAddressSectionContainerProps {
  title: string;
  displayCountrySelect: boolean;
}

export const UserAddressSectionContainer: React.FC<
  PropsWithChildren<UserAddressSectionContainerProps>
> = ({ title, children, displayCountrySelect }) => {
  const { countryCode, setCountryCode } = useCountrySelect();

  return (
    <div className="my-6">
      <div className="flex flex-row justify-between items-baseline mb-3">
        <Title>{title}</Title>
        {displayCountrySelect && (
          <Select
            classNames={{ container: "!w-1/3" }}
            onChange={setCountryCode}
            selectedValue={countryCode}
            options={countries.map(({ name, code }) => ({
              label: name,
              value: code,
            }))}
          />
        )}
      </div>
      {children}
    </div>
  );
};
