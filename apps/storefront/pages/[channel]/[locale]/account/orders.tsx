import { useAuthState } from "@saleor/sdk";
import React, { ReactElement } from "react";

import { AccountLayout, OrdersTable, Pagination, Spinner } from "@/components";
import { mapEdgesToItems } from "@/lib/maps";
import { useOrdersQuery } from "@/saleor/api";

function OrdersPage() {
  const { authenticated } = useAuthState();
  const {
    data: ordersCollection,
    loading,
    error,
    fetchMore,
  } = useOrdersQuery({
    skip: !authenticated,
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <p>
        Error
        {error.message}
      </p>
    );
  }

  const orders = mapEdgesToItems(ordersCollection?.me?.orders);

  const onLoadMore = () => {
    return fetchMore({
      variables: {
        after: ordersCollection?.me?.orders?.pageInfo.endCursor,
      },
    });
  };

  return (
    <>
      <OrdersTable orders={orders} />
      <Pagination
        onLoadMore={onLoadMore}
        pageInfo={ordersCollection?.me?.orders?.pageInfo}
        itemsCount={ordersCollection?.me?.orders?.edges.length}
        totalCount={ordersCollection?.me?.orders?.totalCount || undefined}
      />
    </>
  );
}

export default OrdersPage;

OrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};
