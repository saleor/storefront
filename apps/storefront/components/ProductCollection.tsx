import React from "react";
import Link from "next/link";
import { tw } from 'twind'

import { useProductCollectionQuery } from "@/saleor/api";
import { Pagination } from "./Pagination";

const styles = {
  grid: tw`grid grid-cols-4 gap-4`,
  product: {
    name: tw`block text-lg text-gray-900 truncate`,
    category: tw`block text-sm font-medium text-gray-500`,
    details: tw`px-4 py-2 border-gray-100 bg-gray-50 border-t`,
  }
}

export const ProductCollection: React.VFC = () => {
  const { loading, error, data, fetchMore } = useProductCollectionQuery();

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: data?.products?.pageInfo.endCursor,
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const latestProducts = data.products?.edges || [];

    return (
      <div>
        <ul role="list" className={styles.grid}>
          {latestProducts?.length > 0 &&
            latestProducts.map(
              ({
                node: {
                  id,
                  slug,
                  name,
                  thumbnail,
                  category,
                  variants = [],
                  pricing,
                },
              }) => (
                <li key={id} className="relative bg-white border">
                  <Link href={`/products/${slug}`}>
                    <a>
                      <div className="aspect-h-1 aspect-w-1">
                        <img
                          src={thumbnail?.url}
                          alt=""
                          className="object-center object-cover"
                        />
                      </div>
                      <div className={styles.product.details}>
                        <p className={styles.product.name}>
                          {name}
                        </p>
                        <p className={styles.product.category}>
                          {category?.name}
                        </p>
                      </div>
                    </a>
                  </Link>
                </li>
              )
            )}
        </ul>
        <Pagination
          onLoadMore={onLoadMore}
          pageInfo={data?.products?.pageInfo}
        />
      </div>
    );
  }

  return null;
}

