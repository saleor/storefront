import React from 'react';

import { Navbar } from '../components/Navbar';
import { useCheckoutByIdQuery } from '../generated/graphql';
import { useLocalStorage } from '../lib/hooks';

const Cart: React.VFC = ({}) => {
  const [token] = useLocalStorage('token', '');
  const { data, loading, error } = useCheckoutByIdQuery({
    fetchPolicy: 'network-only',
    // skip:
    variables: { checkoutId: token }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const products = (data.checkout?.lines || []).map(_ => _.variant.product);

    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="py-10">
          <header className="mb-4">
            <div className="max-w-7xl mx-auto px-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Cart</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-3 gap-8">
                <section className="col-span-2">
                  <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                    {products.map((product, idx) => (
                      <li key={idx} className="flex py-6 sm:py-10">
                        <div className="flex-shrink-0 bg-white">
                          <img
                            src={product.thumbnail.url}
                            className="w-48 h-48 border object-center object-cover"
                          />
                        </div>

                        <div className="ml-8 flex-1 flex flex-col justify-center">
                          <div>
                            <div className="flex justify-between sm:grid sm:grid-cols-2">
                              <div className="pr-6">
                                <h3 className="text-xl font-bold">
                                  <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                                    {product.name}
                                  </a>
                                </h3>

                                <button
                                  type="button"
                                  className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:ml-0 sm:mt-3"
                                >
                                  <span>Remove</span>
                                </button>
                              </div>

                              <p className="text-sm font-medium text-gray-900 text-right">{product.price}</p>
                            </div>

                            <div className="mt-4 flex items-center sm:block sm:absolute sm:top-0 sm:left-1/2 sm:mt-0">
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="summary-heading" className="">
                  <div className="bg-gray-50 rounded px-4 py-6 sm:p-6 lg:p-8">
                    <h2 id="summary-heading" className="sr-only">
                      Order summary
                    </h2>

                    <div className="flow-root">
                      <dl className="-my-4 text-sm divide-y divide-gray-200">
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-gray-600">Subtotal</dt>
                          <dd className="font-medium text-gray-900">$99.00</dd>
                        </div>
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-gray-600">Shipping</dt>
                          <dd className="font-medium text-gray-900">$5.00</dd>
                        </div>
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-gray-600">Tax</dt>
                          <dd className="font-medium text-gray-900">$8.32</dd>
                        </div>
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-base font-medium text-gray-900">Order total</dt>
                          <dd className="text-base font-medium text-gray-900">$112.32</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-10">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                    >
                      Checkout
                    </button>
                  </div>

                  <div className="mt-6 text-sm text-center text-gray-500">
                    <p>
                      or{' '}
                      <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>

          </main>

        </div>
      </div>
    )
  }

  return null;
}

export default Cart;







