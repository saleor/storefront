import { Radio, Text } from "@saleor/ui-kit";
import React, { useId, useRef } from "react";
import { IconButton } from "@/components/IconButton";
import { PenIcon, TrashIcon } from "@/icons";
import { AddressField } from "@/lib/globalTypes";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { getSortedAddressFieldsFromAddress } from "@/lib/utils";
import { pull } from "lodash-es";
import { Label } from "@/components/Label";
import {
  getRadioPropsFromRadioBoxProps,
  RadioBoxProps,
} from "@/components/RadioBox";

interface AddressRadioBoxProps extends RadioBoxProps {
  address: Partial<Record<AddressField, any>>;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressRadioBox: React.FC<AddressRadioBoxProps> = ({
  address,
  onDelete,
  onEdit,
  ...rest
}) => {
  const formatMessage = useFormattedMessages();
  const name = `${address.firstName} ${address.lastName}`;

  return (
    <div className="radio-box address-radio-box">
      <Radio
        {...getRadioPropsFromRadioBoxProps(rest)}
        classNames={{ label: "w-full" }}
        label={
          <div className="w-full flex flex-row justify-between w-full">
            <div className="flex flex-col">
              <Text weight="semibold">{name}</Text>
              {pull(
                getSortedAddressFieldsFromAddress(address),
                "firstName",
                "lastName"
              ).map((field: AddressField) => (
                <Text key={field}>{address[field] as string}</Text>
              ))}
            </div>
            <div>
              <IconButton
                variant="bare"
                icon={<img src={PenIcon} />}
                onClick={onEdit}
                ariaLabel={formatMessage("editAddressLabel")}
                className="mr-2"
              />
              <IconButton
                variant="bare"
                onClick={onDelete}
                ariaLabel={formatMessage("deleteAddressLabel")}
                icon={<img src={TrashIcon} />}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
