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

export const AddressBookCard: React.VFC<AddressBookCardProps> = ({
  address,
  onRefreshBook,
}) => {
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useDeleteAddressMutation();

  return (
    <div className="justify-between flex flex-col checkout-section-container md:mx-2 mb-2">
      {address.isDefaultShippingAddress && address.isDefaultBillingAddress && (
        <>
          <p className="text-md font-semibold mb-2">
            Default billing and shipping address
          </p>
          <AddressDisplay address={address}></AddressDisplay>
          <Button
            className="my-1"
            onClick={() => {
              deleteAddressMutation({
                variables: { id: address.id },
              });
              onRefreshBook();
            }}
          >
            Remove
          </Button>
        </>
      )}
      {address.isDefaultShippingAddress && !address.isDefaultBillingAddress && (
        <>
          <p className="text-md font-semibold">Default shipping address</p>
          <AddressDisplay address={address}></AddressDisplay>
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
          <Button
            className="my-1"
            onClick={() => {
              deleteAddressMutation({
                variables: { id: address.id },
              });
              onRefreshBook();
            }}
          >
            Remove
          </Button>
        </>
      )}
      {!address.isDefaultShippingAddress && address.isDefaultBillingAddress && (
        <>
          <p className="text-md font-semibold">Default billing address</p>
          <AddressDisplay address={address}></AddressDisplay>
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
          <Button
            className="my-1"
            onClick={() => {
              deleteAddressMutation({
                variables: { id: address.id },
              });
              onRefreshBook();
            }}
          >
            Remove
          </Button>
        </>
      )}
      {!address.isDefaultShippingAddress && !address.isDefaultBillingAddress && (
        <>
          <AddressDisplay address={address}></AddressDisplay>
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
          <Button
            className="my-1"
            onClick={() => {
              deleteAddressMutation({
                variables: { id: address.id },
              });
              onRefreshBook();
            }}
          >
            Remove
          </Button>
        </>
      )}
    </div>
  );
};
