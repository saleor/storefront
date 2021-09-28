import React from "react";

import { ProductFilterInput, useProductCollectionQuery } from "@/saleor/api";
import { Pagination } from "./Pagination";
import Spinner from "./Spinner";
import { ProductCard } from "./ProductCard";

export interface ProductCollectionProps {
  filter?: ProductFilterInput;
  allowMore?: boolean;
}

export const ProductCollection: React.VFC<ProductCollectionProps> = ({
  filter,
  allowMore = true,
}) => {
  const { loading, error, data, fetchMore } = useProductCollectionQuery({
    variables: { filter: filter },
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
    return <p>No products.</p>;
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
          itemCount={data?.products?.edges.length}
          totalCount={data?.products?.totalCount || undefined}
        />
      )}
    </div>
  );
};

export default ProductCollection;
