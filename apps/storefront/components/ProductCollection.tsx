import React, { useState } from 'react';
import Link from 'next/link';
import { useProductsQuery } from '../generated/graphql';
import { Pagination } from './Pagination';

function Products() {
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const { loading, error, data } = useProductsQuery({
    variables: { after, before }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const latestProducts = data.products?.edges || [];

    return (
      <div>
        <ul role="list" className="grid gap-4 grid-cols-4">
          {latestProducts?.length > 0 &&
            latestProducts.map(
              ({ node: { id, name, thumbnail, category, variants = [], pricing } }) => (
                <li key={id} className="relative bg-white border">
                  <Link href={`/products/${id}`}>
                    <a>
                      <div className="aspect-h-1 aspect-w-1">
                        <img src={thumbnail?.url} alt="" className="object-center object-cover" />
                      </div>
                      <div className="px-4 py-2 border-gray-100 bg-gray-50 border-t">
                        <p className="block text-lg text-gray-900 truncate">{name}</p>
                        <p className="block text-sm font-medium text-gray-500">{category?.name}</p>
                      </div>
                    </a>
                  </Link>
                </li>
              ),
            )}
        </ul>

        <Pagination before={() => setBefore(latestProducts[0].cursor || '')} after={() => setAfter(latestProducts[latestProducts.length - 1].cursor || '')} />
      </div>
    );
  }

  return null;
}

export default Products;
