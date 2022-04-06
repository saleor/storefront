import { getSortedAddressFieldsFromAddress } from "@lib/utils/address";
import { Text } from "@components/Text";
import React from "react";
import { RadioOption, RadioOptionContentProps } from "@components/Radio";
import { IconButton } from "@components/IconButton";
import { PenIcon, TrashIcon } from "@icons";
import { AddressField } from "@lib/globalTypes";

interface addressBoxContentProps
  extends RadioOptionContentProps,
    Pick<RadioOption, "disabled"> {
  address: Record<AddressField, any>;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressBoxContent: React.FC<addressBoxContentProps> = ({
  address,
  htmlFor,
  onDelete,
  onEdit,
}) => {
  const name = address.name || `${address.firstName} ${address.lastName}`;

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-col">
        <label htmlFor={htmlFor}>
          <Text weight="semibold">{name}</Text>
          {getSortedAddressFieldsFromAddress(address).map(
            (field: AddressField) => (
              <Text key={field}>{address[field] as string}</Text>
            )
          )}
        </label>
      </div>
      <div>
        <IconButton onClick={onEdit} ariaLabel="edit address" className="mr-2">
          <img src={PenIcon} />
        </IconButton>
        <IconButton onClick={onDelete} ariaLabel="delete address">
          <img src={TrashIcon} />
        </IconButton>
      </div>
    </div>
  );
};
