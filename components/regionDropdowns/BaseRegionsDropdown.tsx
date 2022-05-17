import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import React from "react";

interface BaseRegionsDropdownProps {
  label: string;
  children?: React.ReactNode;
}

export function BaseRegionsDropdown({ label, children }: BaseRegionsDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-left px-2 py-2 text-md font-extrabold text-gray-400  hover:bg-opacity-30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {label}
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 " aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="focus:outline-none absolute -translate-y-full right-0 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default BaseRegionsDropdown;
