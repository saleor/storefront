import { useAuthState } from "@saleor/sdk";

import { AccountBaseTemplate,AddressBookCard, Spinner } from "@/components";
import { useUserAddressesQuery } from "@/saleor/api";

const AddressBookPage: React.VFC = () => {
  const { authenticated } = useAuthState();
  const { loading, error, data, refetch } = useUserAddressesQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <AccountBaseTemplate>
        <Spinner />
      </AccountBaseTemplate>
    );
  }
  if (error) return <p>Error : {error.message}</p>;

  let addresses = data?.me?.addresses || [];

  if (addresses.length === 0) {
    return (
      <AccountBaseTemplate>
        No addresses information for this user
      </AccountBaseTemplate>
    );
  }

  return (
    <AccountBaseTemplate>
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
    </AccountBaseTemplate>
  );
};

export default AddressBookPage;
