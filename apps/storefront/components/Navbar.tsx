import React from 'react';
import Link from 'next/link';

import clsx from 'clsx';
import { ShoppingBagIcon } from '@heroicons/react/outline'

const navigation = [
]

export const Navbar: React.VFC = ({ }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto shadow-sm px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/">
              <a><img className="block h-16 w-auto" src="/saleor.svg" alt="" /></a>
            </Link>
            {navigation.map((item, idx) => (
              <Link href="/" key={idx}>
                <a
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    item.current
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'inline-flex items-center px-2 border-b-2 text-sm font-medium'
                  )}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
          <div className="flex space-x-8">
            <Link href="/cart">
              <a className="group -m-2 p-2 flex items-center">
                <ShoppingBagIcon
                  className="flex-shink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                <span className="sr-only">items in cart, view bag</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
