import { Text } from "@saleor/ui-kit";
import { useIntl } from "react-intl";

import { mapEdgesToItems } from "@/lib/maps";
import {
  OrderDirection,
  ProductCollectionQueryVariables,
  ProductFilterInput,
  ProductOrderField,
  useProductCollectionQuery,
} from "@/saleor/api";

import { Pagination } from "../Pagination";
import { ProductCard } from "../ProductCard";
import { useRegions } from "../RegionsProvider";
import { Spinner } from "../Spinner";
import { messages } from "../translations";
import { NetworkStatus } from "@apollo/client";
import { useEffect } from "react";

export interface ProductCollectionProps {
  filter?: ProductFilterInput;
  sortBy?: {
    field: ProductOrderField;
    direction?: OrderDirection;
  };
  allowMore?: boolean;
  perPage?: number;
  setCounter?: (counter: number) => void;
}

export function ProductCollection({
  filter,
  sortBy,
  allowMore = true,
  perPage = 4,
  setCounter,
}: ProductCollectionProps) {
  const t = useIntl();
  const { query } = useRegions();

  const variables: ProductCollectionQueryVariables = {
    filter: {
      ...filter,
      stockAvailability: "IN_STOCK",
    },
    first: perPage,
    ...query,
    ...(sortBy?.field &&
      sortBy?.direction && {
        sortBy: {
          direction: sortBy.direction,
          field: sortBy.field,
        },
      }),
  };

  const { loading, error, data, fetchMore, networkStatus } = useProductCollectionQuery({
    variables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (setCounter) {
      setCounter(data?.products?.totalCount || 0);
    }
  }, [setCounter, data?.products?.totalCount]);

  const onLoadMore = async () => {
    if (data?.products?.pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          after: data?.products?.pageInfo.endCursor,
        },
      });
    }
  };

  if (loading && networkStatus !== NetworkStatus.fetchMore)
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    );

  if (error) return <p>Error</p>;

  const products = mapEdgesToItems(data?.products);

  if (products.length === 0) {
    return (
      <Text size="xl" color="secondary" data-testid="noResultsText">
        {t.formatMessage(messages.noProducts)}
      </Text>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <ul
        className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
        data-testid="productsList"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
      {networkStatus === NetworkStatus.fetchMore ? (
        <div className="h-[100px] w-full flex mt-8 py-4 justify-center">
          <Spinner />
        </div>
      ) : (
        allowMore && (
          <Pagination
            onLoadMore={onLoadMore}
            pageInfo={data?.products?.pageInfo}
            itemsCount={data?.products?.edges.length}
            totalCount={data?.products?.totalCount}
          />
        )
      )}
    </div>
  );
}

export default ProductCollection;
