import { RefreshIcon } from "@heroicons/react/outline";

export function Spinner() {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
      <RefreshIcon className="animate-spin w-8 h-8" data-testid="spinner" />
    </div>
  );
}

export default Spinner;
