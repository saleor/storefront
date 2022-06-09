import { Switch } from "@headlessui/react";
import clsx from "clsx";

export interface StockToggleProps {
  enabled: boolean;
  onChange: (checked: boolean) => void;
}

export function StockToggle({ enabled, onChange }: StockToggleProps) {
  return (
    <div className="inline-block py-2 px-2">
      <Switch.Group>
        <Switch
          checked={enabled}
          onChange={onChange}
          className="bg-transparent relative inline-flex items-center h-4 rounded-3xl w-[2.7rem] transition-colors border-[1.5px] border-gray-200 bg-white"
        >
          <span
            className={clsx(
              enabled ? "translate-x-3 bg-gray-400" : "translate-x-1 bg-gray-200",
              "inline-block w-2 h-2 transform rounded-full transition-transform"
            )}
          />
        </Switch>
        <Switch.Label className="ml-2 text-base">In stock</Switch.Label>
      </Switch.Group>
    </div>
  );
}

export default StockToggle;
