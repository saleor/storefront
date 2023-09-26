import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import * as Checkout from "@/lib/checkout";
import { USDollarFormatter } from "@/lib";

export const metadata = {
  title: "Shopping Cart · Saleor Storefront",
};

export default async function Page() {
  const checkoutId = cookies().get("checkoutId")?.value || "";

  const checkout = await Checkout.find(checkoutId);
  const lines = checkout ? checkout.lines : [];

  async function performCheckout() {
    "use server";

    // TODO

    redirect("/checkout");
  }

  return (
    <section className="max-w-7xl mx-auto p-8">
      <h1 className="mt-8 text-3xl font-bold text-gray-900">Your Shopping Cart</h1>

      <form className="mt-12">
        <div>
          <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
            {lines.map((item) => (
              <li key={item.id} className="flex py-4">
                <div className="flex-shrink-0 bg-slate-50 rounded-md border">
                  {item.variant?.product?.thumbnail?.url && (
                    <Image
                      src={item.variant?.product?.thumbnail?.url}
                      alt="image"
                      width={200}
                      height={200}
                      className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col relative ml-4 justify-center">
                  <div>
                    <div className="flex justify-between">
                      <div className="">
                        <h3 className="font-medium text-gray-700">{item.variant?.product?.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.variant?.product?.category?.name}
                        </p>
                      </div>

                      <p className="text-right font-semibold text-gray-900 p-4">
                        {USDollarFormatter.format(item.totalPrice.gross.amount || 0)}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-bold">{item.quantity}</div>
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
                <p className="mt-1 text-sm text-gray-500">
                  Shipping will be calculated in the next step
                </p>
              </div>
              <div className="font-medium text-gray-900">
                {USDollarFormatter.format(checkout?.totalPrice.gross.amount || 0)}
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-3">
            <div></div>

            <button
              formAction={performCheckout}
              className="w-full border border-transparent rounded bg-slate-600 px-6 py-3 font-medium text-gray-50 hover:bg-slate-500"
            >
              Checkout
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
