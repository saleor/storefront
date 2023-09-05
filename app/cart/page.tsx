import { CheckoutFindDocument } from "@/gql/graphql";
import { cookies } from "next/headers";
import Image from 'next/image';
import { execute } from "../../lib";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'My Page Title',
};

export default async function Page() {
  const cart = cookies().get('cart')?.value;

  const { checkout } = cart ? await execute(CheckoutFindDocument, {
    variables: {
      token: cart,
    },
    cache: 'no-store',
  }) : { checkout: { lines: [] } };

  async function performCheckout() {
    'use server';

    redirect('/checkout');
  }

  return (
    <section className="max-w-7xl mx-auto p-8">
      <h1 className="mt-8 text-3xl font-bold text-gray-900">Your Shopping Cart</h1>

      <form className="mt-12">
        <div>
          <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
            {checkout?.lines.map((item) => (
              <li key={item.id} className="flex py-4">
                <div className="flex-shrink-0 bg-slate-50 rounded-md border">
                  <Image
                    src={item.variant?.product?.thumbnail?.url || ''}
                    // src={`/${item.product?.id}.png`}
                    alt="image"
                    width={200}
                    height={200}
                    className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                  />
                </div>

                <div className="flex flex-1 flex-col relative ml-4 justify-center">
                  <div>
                    <div className="flex justify-between">
                      <div className="">
                        <h3 className="font-medium text-gray-700">
                          {item.variant?.product?.name}
                        </h3>
                        {/* <p className="mt-1 text-sm text-gray-500">{item.variant?.product?.categories[0].name}</p> */}
                      </div>

                      {/* <p className="text-right font-semibold text-gray-900 p-4">{USDollarFormatter.format((item.product?.price || 0) / 100 * item.quantity)}</p> */}
                    </div>

                    <div className="mt-4">
                      {/* <div className="text-sm font-bold">{item.quantity}</div> */}
                      {/* <RemoveButton id={item.id} /> */}
                    </div>

                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <div className="border rounded bg-slate-50 px-4 py-2">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-gray-900 font-semibold">Your Total</div>
                <p className="mt-1 text-sm text-gray-500">Shipping will be calculated in the next step</p>
              </div>
              {/* <div className="font-medium text-gray-900">{USDollarFormatter.format(((order?.orderItems || []).reduce((saved, current) => saved + current.total, 0) || 0) / 100)}</div> */}
            </div>
          </div>
          <div className="mt-10 grid grid-cols-3">
            <div></div>

            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button formAction={performCheckout}
              className="w-full border border-transparent rounded bg-slate-600 px-6 py-3 font-medium text-gray-50 hover:bg-slate-500"
            >
              Checkout
            </button>
          </div>

        </div>
      </form>
    </section>
  )
}
