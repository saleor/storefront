import React from 'react';

export const CheckoutProductList = ({ products }: { products: any }) => {
  console.log(products);
  return (
    <ul role="list" className="flex-auto overflow-y-auto divide-y divide-gray-200 px-4">
      {products.map((product: any, idx: number) => (
        <li key={idx} className="flex py-4 space-x-4">
          <img
            src={product.thumbnail.url}
            className="border bg-white w-32 h-32 object-center object-cover rounded-md"
          />
          <div className="flex flex-col justify-between space-y-4">
            <div className="text-sm font-medium space-y-1">
              <h3 className="text-gray-900">{product.name}</h3>
              <p className="text-gray-900">{product.price}</p>
              <p className="text-gray-500">{product.color}</p>
              <p className="text-gray-500">{product.size}</p>
            </div>
            <div className="flex space-x-4">
              <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
