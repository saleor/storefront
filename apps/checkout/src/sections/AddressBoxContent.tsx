import { Text } from "@/components/Text";
import React from "react";
import { RadioOptionChildrenProps } from "@/components/Radio";
import { IconButton } from "@/components/IconButton";
import { PenIcon, TrashIcon } from "@/icons";
import { AddressField } from "@/lib/globalTypes";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { getSortedAddressFieldsFromAddress } from "@/lib/utils";
import { pull } from "lodash-es";

interface AddressBoxContentProps extends RadioOptionChildrenProps {
  address: Partial<Record<AddressField, any>>;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressBoxContent: React.FC<AddressBoxContentProps> = ({
  address,
  htmlFor,
  onDelete,
  onEdit,
}) => {
  const formatMessage = useFormattedMessages();
  const name = `${address.firstName} ${address.lastName}`;

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-col">
        <label htmlFor={htmlFor}>
          <Text weight="semibold">{name}</Text>
          {pull(
            getSortedAddressFieldsFromAddress(address),
            "firstName",
            "lastName"
          ).map((field: AddressField) => (
            <Text key={field}>{address[field] as string}</Text>
          ))}
        </label>
      </div>
      <div>
        <IconButton
          onClick={onEdit}
          ariaLabel={formatMessage("editAddressLabel")}
          className="mr-2"
        >
          <img src={PenIcon} />
        </IconButton>
        <IconButton
          onClick={onDelete}
          ariaLabel={formatMessage("deleteAddressLabel")}
        >
          <img src={TrashIcon} />
        </IconButton>
      </div>
    </div>
  );
};
