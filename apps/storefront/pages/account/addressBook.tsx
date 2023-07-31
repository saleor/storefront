import React, { ReactElement } from "react";
import { useIntl } from "react-intl";

import { AccountLayout, AddressBookCard, Spinner } from "@/components";
import { messages } from "@/components/translations";
import { useCurrentUserAddressesQuery } from "@/saleor/api";
import { useUser } from "@/lib/useUser";

function AddressBookPage() {
  const t = useIntl();
  const { authenticated } = useUser();
  const { loading, error, data, refetch } = useCurrentUserAddressesQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <p>Error :{error.message}</p>;
  }

  const addresses = data?.me?.addresses || [];

  if (addresses.length === 0) {
    return <div>{t.formatMessage(messages.noAddressDataMessage)}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {addresses.map((address) => (
        <AddressBookCard key={address.id} address={address} onRefreshBook={() => refetch()} />
      ))}
    </div>
  );
}

export default AddressBookPage;

AddressBookPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};
