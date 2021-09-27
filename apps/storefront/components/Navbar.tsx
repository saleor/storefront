import React from "react";
import Link from "next/link";
import { useAuthState } from "@saleor/sdk";
import { ShoppingBagIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useLocalStorage } from "react-use";

import { useCheckoutByTokenQuery } from "@/saleor/api";
import { CHECKOUT_TOKEN } from "@/lib/const";

export const Navbar: React.VFC = ({}) => {
  const [checkoutToken] = useLocalStorage(CHECKOUT_TOKEN);
  const { authenticated, user } = useAuthState();
  const { data } = useCheckoutByTokenQuery({
    variables: { checkoutToken },
    skip: !checkoutToken,
  });

  const counter = data?.checkout?.lines?.length || 0;

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between h-16">
          <Link href="/">
            <a>
              <img className="block h-16 w-auto" src="/saleor.svg" alt="" />
            </a>
          </Link>
          <div className="flex space-x-8">
            <Link href="/cart">
              <a className="group -m-2 p-2 flex items-center">
                <ShoppingBagIcon
                  className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                  {counter}
                </span>
              </a>
            </Link>
            {!authenticated && (
              <Link href="/login">
                <a className="group -m-2 p-2 flex items-center">
                  <UserCircleIcon
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    Log in
                  </span>
                </a>
              </Link>
            )}
            {authenticated && (
              <Link href="/account">
                <a className="group -m-2 p-2 flex items-center">
                  <UserCircleIcon
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {user?.email}
                  </span>
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
