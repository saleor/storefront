import React from "react";
import { useIntl } from "react-intl";

import { ProductFilterInput, useProductCollectionQuery } from "@/saleor/api";

import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";
import { useRegions } from "./RegionsProvider";
import { Spinner } from "./Spinner";
import { messages } from "./translations";

export interface ProductCollectionProps {
  filter?: ProductFilterInput;
  allowMore?: boolean;
}

export const ProductCollection = ({
  filter,
  allowMore = true,
}: ProductCollectionProps) => {
  const t = useIntl();
  const { query } = useRegions();

  const { loading, error, data, fetchMore } = useProductCollectionQuery({
    variables: {
      filter: filter,
      ...query,
    },
  });

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: data?.products?.pageInfo.endCursor,
      },
    });
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error</p>;

  const products = data?.products?.edges.map((edge) => edge.node) || [];
  if (products.length === 0) {
    return <p>{t.formatMessage(messages.noProducts)}</p>;
  }
  return (
    <div>
      <ul
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
      {allowMore && (
        <Pagination
          onLoadMore={onLoadMore}
          pageInfo={data?.products?.pageInfo}
          itemsCount={data?.products?.edges.length}
          totalCount={data?.products?.totalCount || undefined}
        />
      )}
    </div>
  );
};

export default ProductCollection;
