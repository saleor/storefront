import React from "react";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { AddressSelectBox } from "../../components/AddressSelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAddressAvailability } from "@/checkout-storefront/hooks/useAddressAvailability";
import { userAddressLabels, userAddressMessages } from "./messages";
import { Text } from "@saleor/ui-kit";
import { Button } from "@/checkout-storefront/components/Button";
import { Title } from "@/checkout-storefront/components/Title";
import { UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { AddressListFormData } from "@/checkout-storefront/sections/AddressList/useAddressListForm";
import { FormProvider } from "@/checkout-storefront/hooks/useForm/FormProvider";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { camelCase } from "lodash-es";

export interface AddressListProps {
  onEditChange: (id: string) => void;
  onAddAddressClick: () => void;
  checkAddressAvailability?: boolean;
  title: string;
  form: UseFormReturn<AddressListFormData>;
}

export const AddressList: React.FC<AddressListProps> = ({
  onEditChange,
  checkAddressAvailability = false,
  title,
  onAddAddressClick,
  form,
}) => {
  const {
    values: { addressList },
  } = form;
  const formatMessage = useFormattedMessages();

  const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

  return (
    <FormProvider form={form}>
      <div className="flex flex-col">
        <Title>{title}</Title>
        {addressList.length < 1 && (
          <Text className="mb-3">{formatMessage(userAddressMessages.noAddresses)}</Text>
        )}
        <Button
          variant="secondary"
          ariaLabel={formatMessage(userAddressLabels.addAddress)}
          onClick={onAddAddressClick}
          label={formatMessage(userAddressMessages.addAddress)}
          className="mb-4 w-full"
        />
        <SelectBoxGroup label={formatMessage(userAddressLabels.userAddresses)}>
          {addressList.map(({ id, ...rest }: AddressFragment) => {
            const identifier = `${camelCase(title)}-${id}}`;

            return (
              <AddressSelectBox
                name="selectedAddressId"
                id={identifier}
                key={identifier}
                value={id}
                address={{ ...rest }}
                onEdit={() => onEditChange(id)}
                unavailable={!isAvailable(rest)}
              />
            );
          })}
        </SelectBoxGroup>
      </div>
    </FormProvider>
  );
};
