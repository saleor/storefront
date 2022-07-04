import { Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Fragment } from "react";

export interface FilterDropdownOption {
  id: string;
  label: string;
  slug: string;
  chosen: boolean;
}

export interface FilterDropdownProps {
  label: string;
  options?: FilterDropdownOption[];
  attributeSlug: string;
  optionToggle: (attributeSlug: string, choiceSlug: string) => void;
}

export function FilterDropdown({
  label,
  attributeSlug,
  optionToggle,
  options,
}: FilterDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="inline-flex w-full justify-left px-2 py-2 text-base font-medium  hover:bg-opacity-30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          data-testid={`filterAttribute${label}`}
        >
          {label}
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
        <Menu.Items className="focus:outline-none absolute left-0 w-56 origin-top-right  bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          {options?.map((option) => (
            <Menu.Item key={option.id}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => optionToggle(attributeSlug, option.slug)}
                  className={clsx(
                    active ? "border-brand text-brand" : "border-transparent text-gray-900",
                    "group flex w-full items-center px-2 py-2 text-base border-2"
                  )}
                  data-testid={`filterAttributeValue${option.label}`}
                >
                  <div className="flex-grow text-left">{option.label}</div>
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

export default FilterDropdown;
