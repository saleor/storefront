import AccountBaseTemplate from "@/components/AccountBaseTemplate";
import { Button } from "@/components/Button";
import AddressDisplay from "@/components/checkout/AddressDisplay";
import Spinner from "@/components/Spinner";
import {
  UserAddressesDocument,
  AddressTypeEnum,
  AddressDetailsFragment,
  useSetAddressDefaultMutation,
  useDeleteAddressMutation,
  useUserAddressesQuery,
} from "@/saleor/api";
import { useAuthState } from "@saleor/sdk";
import { Key } from "react";

const AddressBookPage: React.VFC = () => {
  const { authenticated } = useAuthState();
  const { loading, error, data } = useUserAddressesQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
  });
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useDeleteAddressMutation({
    refetchQueries: [{ query: UserAddressesDocument }],
  });
  if (loading) {
    return (
      <AccountBaseTemplate>
        <Spinner />
      </AccountBaseTemplate>
    );
  }
  if (error) return <p>Error : {error.message}</p>;

  if (!data?.me?.addresses) {
    return (
      <AccountBaseTemplate>
        No addresses information for this user
      </AccountBaseTemplate>
    );
  }

  let addresses = data?.me?.addresses || [];

  const getAddressSection = (address: AddressDetailsFragment, index: Key) => {
    if (address.isDefaultShippingAddress && address.isDefaultBillingAddress) {
      return (
        <div
          key={index}
          className="justify-between flex flex-col checkout-section-container mx-2 mb-2"
        >
          <p className="text-md font-semibold">
            Default billing and shipping address
          </p>
          <AddressDisplay address={address}></AddressDisplay>
          <Button
            className="my-1"
            onClick={() =>
              deleteAddressMutation({
                variables: { id: address.id },
              })
            }
          >
            Remove
          </Button>
        </div>
      );
    } else if (address.isDefaultBillingAddress) {
      return (
        <div
          key={index}
          className="justify-between flex flex-col checkout-section-container mx-2 mb-2"
        >
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
            onClick={() =>
              deleteAddressMutation({
                variables: { id: address.id },
              })
            }
          >
            Remove
          </Button>
        </div>
      );
    } else if (address.isDefaultShippingAddress) {
      return (
        <div
          key={index}
          className="justify-between flex flex-col checkout-section-container mx-2 mb-2"
        >
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
            onClick={() =>
              deleteAddressMutation({
                variables: { id: address.id },
              })
            }
          >
            Remove
          </Button>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className="flex flex-col checkout-section-container mx-2 mb-2"
        >
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
            onClick={() =>
              deleteAddressMutation({
                variables: { id: address.id },
              })
            }
          >
            Remove
          </Button>
        </div>
      );
    }
  };

  return (
    <AccountBaseTemplate>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {!!addresses &&
          addresses.map((address, index: React.Key) => {
            if (address) {
              return getAddressSection(address, index);
            }
          })}
      </div>
    </AccountBaseTemplate>
  );
};

export default AddressBookPage;
