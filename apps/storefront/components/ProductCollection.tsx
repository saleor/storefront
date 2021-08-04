import { useLatestProductsQuery, useTShirtProductsQuery, useFilterProductsQuery, OrderDirection, ProductOrderField } from '../generated/graphql';

function Products() {
  // const { loading, error, data } = useLatestProductsQuery();
  const { loading, error, data } = useFilterProductsQuery({
    variables: {
      filter: { search: 'T-Shirt' },
      sortBy: {
        field: ProductOrderField.Name,
        direction: OrderDirection.Desc
      }
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const latestProducts = data.products?.edges || [];

    return (
      <ul role="list" className="grid gap-4 grid-cols-4">
        {latestProducts?.length > 0 &&
          latestProducts.map(
            ({ node: { id, name, thumbnail, category } }) => (
              <li key={id} className="relative bg-white">
                <img src={thumbnail?.url} alt="" />
                <div className="p-2 border-gray-100 border-t">
                  <p className="block text-lg text-gray-900 truncate">{name}</p>
                  <p className="block text-sm font-medium text-gray-500">{category?.name}</p>
                </div>
              </li>
            ),
          )}
      </ul>
    );
  }

  return null;
}

export default Products;
