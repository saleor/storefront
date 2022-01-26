import { useIntl } from "react-intl";

import { Button } from "@/components/Button";
import AddressDisplay from "@/components/checkout/AddressDisplay";
import {
  AddressDetailsFragment,
  useAddressDeleteMutation,
  useSetAddressDefaultMutation,
} from "@/saleor/api";

import { messages } from "./translations";

interface AddressBookCardProps {
  address: AddressDetailsFragment;
  onRefreshBook: () => void;
}

export const AddressBookCard = ({
  address,
  onRefreshBook,
}: AddressBookCardProps) => {
  const t = useIntl();
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useAddressDeleteMutation();

  let cardHeader = "";
  if (address.isDefaultShippingAddress && address.isDefaultBillingAddress) {
    cardHeader = t.formatMessage(messages.defaultBillingAndShipping);
  } else if (address.isDefaultShippingAddress) {
    cardHeader = t.formatMessage(messages.defaultShipping);
  } else if (address.isDefaultBillingAddress) {
    cardHeader = t.formatMessage(messages.defaultBilling);
  }

  const onDeleteAddress = (addressId: string) => {
    deleteAddressMutation({
      variables: { id: addressId },
    });
    onRefreshBook();
  };

  return (
    <div className="justify-between flex flex-col checkout-section-container md:mx-2 mb-2">
      {!!cardHeader && (
        <p className="text-md font-semibold mb-1">{cardHeader}</p>
      )}
      <AddressDisplay address={address}></AddressDisplay>
      {!address.isDefaultBillingAddress && (
        <Button
          className="my-1"
          onClick={() =>
            setAddressDefaultMutation({
              variables: { id: address.id, type: "BILLING" },
            })
          }
        >
          {t.formatMessage(messages.setDefaultBilling)}
        </Button>
      )}
      {!address.isDefaultShippingAddress && (
        <Button
          className="my-1"
          onClick={() =>
            setAddressDefaultMutation({
              variables: { id: address.id, type: "SHIPPING" },
            })
          }
        >
          {t.formatMessage(messages.setDefaultShipping)}
        </Button>
      )}
      <Button className="my-1" onClick={() => onDeleteAddress(address.id)}>
        {t.formatMessage(messages.removeButton)}
      </Button>
    </div>
  );
};
