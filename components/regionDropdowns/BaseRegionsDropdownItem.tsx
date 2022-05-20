import { Menu } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React from "react";

interface BaseRegionsDropdownItemProps {
  label: string;
  chosen: boolean;
  onClick: () => void;
}

export function BaseRegionsDropdownItem({ label, chosen, onClick }: BaseRegionsDropdownItemProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          onClick={onClick}
          className={clsx(
            active ? "border-brand text-brand" : "border-transparent text-gray-900",
            "group px-2 py-2 text-sm border-2 w-full"
          )}
        >
          <div className="flex gap-2">
            <div className="grow w-max text-left">{label}</div>

            <div className="h-5 w-3">
              {chosen && <CheckIcon className="ml-2 -mr-1  h-5 w-3" aria-hidden="true" />}
            </div>
          </div>
        </button>
      )}
    </Menu.Item>
  );
}

export default BaseRegionsDropdownItem;
