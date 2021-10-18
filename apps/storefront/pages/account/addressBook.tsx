import AccountBaseTemplate from "@/components/AccountBaseTemplate";
import BaseTemplate from "@/components/BaseTemplate";
import { Button } from "@/components/Button";
import AddressDisplay from "@/components/checkout/AddressDisplay";
import Spinner from "@/components/Spinner";
import {
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
  });
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useDeleteAddressMutation();

  if (loading) {
    return (
      <AccountBaseTemplate>
        <Spinner />
      </AccountBaseTemplate>
    );
  }
  if (error) return <p>Error : {error.message}</p>;

  const addresses = data?.me?.addresses || [];

  if (!data?.me) {
    return (
      <AccountBaseTemplate>
        No addresses information for this user
      </AccountBaseTemplate>
    );
  }

  const handleSetDefaultAddressMutation = async (
    address: AddressDetailsFragment,
    type: AddressTypeEnum
  ) => {
    const result = await setAddressDefaultMutation({
      variables: { id: address.id, type: type },
    });
    const errors = result.data?.accountSetDefaultAddress?.errors || [];
    if (errors.length > 0) {
      console.log(errors);
      //handle errors
    }
  };

  const handleDeleteAddressMutation = async (
    address: AddressDetailsFragment
  ) => {
    const result = await deleteAddressMutation({
      variables: { id: address.id },
    });
    const errors = result.data?.accountAddressDelete?.errors || [];
    if (errors.length > 0) {
      console.log(errors);
      //handle errors
    }
  };

  const getAddressSection = (address: AddressDetailsFragment, index: Key) => {
    if (address.isDefaultShippingAddress && address.isDefaultBillingAddress) {
      return (
        <div
          key={index}
          className="flex flex-col checkout-section-container mx-2 mb-2"
        >
          <p className="text-md font-semibold">
            Default billing and shipping address
          </p>
          <AddressDisplay address={address}></AddressDisplay>
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Set as billing default
          </Button>
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Set as shipping default
          </Button>
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Remove
          </Button>
        </div>
      );
    } else if (address.isDefaultBillingAddress) {
      return (
        <div
          key={index}
          className="flex flex-col checkout-section-container mx-2 mb-2"
        >
          <p className="text-md font-semibold">Default billing address</p>
          <AddressDisplay address={address}></AddressDisplay>
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Remove
          </Button>
        </div>
      );
    } else if (address.isDefaultShippingAddress) {
      return (
        <div
          key={index}
          className="flex flex-col checkout-section-container mx-2 mb-2"
        >
          <p className="text-md font-semibold">Default shipping address</p>
          <AddressDisplay address={address}></AddressDisplay>
          <Button className="my-1" onClick={() => console.log("Remove")}>
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
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Set as billing default
          </Button>
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Set as shipping default
          </Button>
          <Button className="my-1" onClick={() => console.log("Remove")}>
            Remove
          </Button>
        </div>
      );
    }
  };

  return (
    <AccountBaseTemplate>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {!!addresses.length &&
          addresses.map((address, index) => {
            if (address) {
              return getAddressSection(address, index);
              // return (
              //   <div
              //     key={index}
              //     className="checkout-section-container mx-2 mb-2"
              //   >
              //     <AddressDisplay address={address}></AddressDisplay>
              //   </div>
              // );
            }
          })}
      </div>
    </AccountBaseTemplate>
  );
};

export default AddressBookPage;
