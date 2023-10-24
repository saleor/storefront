import { Text } from "@saleor/ui-kit";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { mapEdgesToItems } from "@/lib/maps";
import { ProductCollectionSaleQueryVariables, useProductCollectionSaleQuery } from "@/saleor/api";

import { Pagination } from "../Pagination";
import { ProductCard } from "../ProductCard";
import { Spinner } from "../Spinner";
import { messages } from "../translations";
import { useRegions } from "../RegionsProvider";

export interface ProductCollectionSaleProps {
  allowMore?: boolean;
  perPage?: number;
}

export function ProductCollectionSale({
  allowMore = true,
  perPage = 4,
}: ProductCollectionSaleProps) {
  const t = useIntl();
  const { query } = useRegions();
  const [loadingMore, setLoadingMore] = useState(false);
  const endCursor = "";

  const variables: ProductCollectionSaleQueryVariables = {
    first: perPage,
    after: endCursor,
    id: "RXh0ZXJuYWxTYWxlOjE4",
    ...query,
  };

  const { loading, error, data, fetchMore } = useProductCollectionSaleQuery({
    variables,
  });

  const onLoadMore = () => {
    if (data?.externalSale?.products?.pageInfo.hasNextPage) {
      setLoadingMore(true);
      return fetchMore({
        variables: {
          after: data?.externalSale?.products?.pageInfo.endCursor,
        },
      }).finally(() => {
        console.log("Updated data: ", data);
        setLoadingMore(false);
      });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error</p>;

  const products = mapEdgesToItems(data?.externalSale?.products);
  if (products.length === 0) {
    return (
      <Text size="xl" color="secondary" data-testid="noResultsText">
        {t.formatMessage(messages.noProducts)}
      </Text>
    );
  }

  return (
    <div>
      <ul
        className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
        data-testid="productsList"
      >
        {data?.externalSale?.products?.edges.map(({ node: product }) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </ul>

      {loadingMore ? (
        <Spinner />
      ) : (
        allowMore && (
          <Pagination
            onLoadMore={onLoadMore}
            pageInfo={data?.externalSale?.products?.pageInfo}
            itemsCount={data?.externalSale?.products?.edges.length}
            totalCount={data?.externalSale?.products?.totalCount || undefined}
          />
        )
      )}
    </div>
  );
}

export default ProductCollectionSale;
