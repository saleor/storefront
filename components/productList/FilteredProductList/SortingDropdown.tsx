import { Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Fragment } from "react";

import { OrderDirection, ProductOrderField } from "@/saleor/api";

import { UrlSorting } from "./attributes";

export interface SortingOption {
  label: string;
  field?: ProductOrderField;
  direction?: OrderDirection;
  chosen: boolean;
}

export interface SortingDropdownProps {
  optionToggle: (field?: ProductOrderField, direction?: OrderDirection) => void;
  chosen: UrlSorting | null;
}

export function SortingDropdown({ optionToggle, chosen }: SortingDropdownProps) {
  const options: SortingOption[] = [
    { label: "Popularity", chosen: false },
    { label: "Name ascending", field: "NAME", direction: "ASC", chosen: false },
    { label: "Name descending", field: "NAME", direction: "DESC", chosen: false },
  ];

  let isChosenSet = false;
  for (const option of options) {
    if (option.field === chosen?.field && option.direction === chosen?.direction) {
      option.chosen = true;
      isChosenSet = true;
      break;
    }
  }
  if (!isChosenSet) {
    options[0].chosen = true;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-left px-2 py-2 text-sm font-medium  hover:bg-opacity-30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          Sort by
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 " aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="focus:outline-none absolute right-0 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          {options?.map((option) => (
            <Menu.Item key={option.label}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => optionToggle(option.field, option.direction)}
                  className={clsx(
                    active ? "border-brand text-brand" : "border-transparent text-gray-900",
                    "group flex w-full items-center px-2 py-2 text-sm border-2"
                  )}
                >
                  {option.label}
                  {option.chosen && (
                    <CheckIcon className="ml-2 -mr-1 h-5 w-3 " aria-hidden="true" />
                  )}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default SortingDropdown;
