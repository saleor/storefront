import { useAuthState } from "@saleor/sdk";
import React, { ReactElement } from "react";

import { AccountLayout, AddressBookCard, Spinner } from "@/components";
import { useCurrentUserAddressesQuery } from "@/saleor/api";

const AddressBookPage = () => {
  const { authenticated } = useAuthState();
  const { loading, error, data, refetch } = useCurrentUserAddressesQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <Spinner />;
  }
  if (error) return <p>Error : {error.message}</p>;

  let addresses = data?.me?.addresses || [];

  if (addresses.length === 0) {
    return <div>No addresses information for this user</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {addresses.map((address) => {
        return (
          address && (
            <AddressBookCard
              address={address}
              onRefreshBook={() => refetch()}
            />
          )
        );
      })}
    </div>
  );
};

export default AddressBookPage;

AddressBookPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};
