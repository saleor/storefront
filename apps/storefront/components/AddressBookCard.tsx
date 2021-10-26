import AddressDisplay from "@/components/checkout/AddressDisplay";
import { Button } from "@/components/Button";
import {
  AddressTypeEnum,
  AddressDetailsFragment,
  useDeleteAddressMutation,
  useSetAddressDefaultMutation,
} from "@/saleor/api";

interface AddressBookCardProps {
  address: AddressDetailsFragment | any;
  onRefreshBook: () => void;
}

export const AddressBookCard = ({
  address,
  onRefreshBook,
}: AddressBookCardProps) => {
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useDeleteAddressMutation();

  let cardHeader = "";
  if (address.isDefaultShippingAddress && address.isDefaultBillingAddress) {
    cardHeader = "Default billing and shipping address";
  } else if (address.isDefaultShippingAddress) {
    cardHeader = "Default shipping address";
  } else if (address.isDefaultBillingAddress) {
    cardHeader = "Default billing address";
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
              variables: { id: address.id, type: AddressTypeEnum.Billing },
            })
          }
        >
          Set as billing default
        </Button>
      )}
      {!address.isDefaultShippingAddress && (
        <Button
          className="my-1"
          onClick={() =>
            setAddressDefaultMutation({
              variables: { id: address.id, type: AddressTypeEnum.Shipping },
            })
          }
        >
          Set as shipping default
        </Button>
      )}
      <Button className="my-1" onClick={() => onDeleteAddress(address.id)}>
        Remove
      </Button>
    </div>
  );
};
