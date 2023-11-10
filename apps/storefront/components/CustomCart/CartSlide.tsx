import { Transition } from "@headlessui/react";
import { useEffect, Fragment, useRef } from "react";
import { invariant } from "@apollo/client/utilities/globals";
import Link from "next/link";

import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { useRegions } from "@/components/RegionsProvider";

import usePaths from "@/lib/paths";
import EmptyCart from "@/components/CustomCart/EmptyCart";

import { CartItem } from "./CartItem";
import { Container } from "@mantine/core";
import { XIcon } from "@heroicons/react/solid";

interface CartSlideProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export const CartSlide = ({ isOpen = false, setIsOpen }: CartSlideProps) => {
  const paths = usePaths();
  const { checkout } = useCheckout();
  const { currentLocale, currentChannel, formatPrice } = useRegions();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = ({ target }: MouseEvent) => {
      if (target instanceof Node && ref.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const saleorApiUrl = process.env.NEXT_PUBLIC_API_URI;
  invariant(saleorApiUrl, "Missing NEXT_PUBLIC_API_URI");

  const domain = new URL(saleorApiUrl).hostname;
  const checkoutParams = checkout
    ? new URLSearchParams({
        checkout: checkout.id,
        locale: currentLocale,
        channel: currentChannel.slug,
        saleorApiUrl,
        domain,
      })
    : new URLSearchParams();

  const externalCheckoutUrl = checkout ? `/checkout/?${checkoutParams.toString()}` : "#";

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transform transition ease-in-out duration-300"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transform transition ease-in-out duration-300"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      <div
        className="fixed top-0 min-h-screen justify-end right-0 z-[999] h-[100%] w-[100%] md:w-[75%] lg:w-[50%] xl:w-[25%] overflow-none bg-white shadow-lg focus:outline-none sm:text-sm flex overflow-y-auto flex-col"
        ref={ref}
      >
        <main className="flex min-h-[355px] h-[100%] right-0 flex-col">
          <div className="flex justify-between items-center p-6 z-10 bg-white border-b border-1 border-gray-300 sticky top-0">
            <h3 className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-tight md:max-w-full uppercase">
              Koszyk
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="focus:outline-none text-black hover:text-white group text-sm  hover:bg-black hover:rounded-full p-1 transition-all duration-300"
            >
              <XIcon className="xs:h-6 xl:h-8" />
            </button>
          </div>
          {checkout?.lines.length ? (
            <>
              <Container className="mb-auto w-full">
                {checkout?.lines.map((line) => (
                  <CartItem key={line.id} line={line} />
                ))}
              </Container>
              <div className="flex flex-col gap-6 px-8 bg-gray-100 py-6 sticky bottom-0">
                <div className="flex flex-col gap-6 justify-between">
                  <div className="flex flex-row justify-between">
                    <p className="xs:text-base md:text-md uppercase">Suma częściowa</p>
                    <p className="xs:text-base md:text-md font-bold">
                      {formatPrice(checkout?.subtotalPrice.net)}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p className="xs:text-base md:text-md uppercase">Suma</p>
                    <p className="xs:text-base md:text-md font-bold">
                      {formatPrice(checkout?.totalPrice.gross)}
                    </p>
                  </div>
                </div>
                <div className="w-[100%] border-b-2" />
                <div className="flex flex-col gap-3 items-center w-full">
                  <div className="flex justify-center w-full">
                    <Link
                      href={paths.cart.$url()}
                      className="text-2xl md:text-3xl border-black border-2 bg-transparent hover:border-black hover:bg-black hover:text-white transition
             text-black font-bold py-4 px-8 rounded-full w-full text-center"
                    >
                      Mój koszyk
                    </Link>
                  </div>
                  <div className="flex justify-center w-full">
                    <Link
                      href={externalCheckoutUrl}
                      className="text-2xl md:text-3xl border-brand border-2 bg-brand hover:border-brand hover:bg-white hover:text-brand transition
             text-white font-bold py-4 px-8 rounded-full w-full text-center"
                    >
                      Kontynuuj do kasy
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="container flex items-start justify-start p-6">
              <EmptyCart paths={paths} />
            </div>
          )}
        </main>
      </div>
    </Transition>
  );
};
