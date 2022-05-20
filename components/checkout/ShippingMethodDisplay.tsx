import { translate } from "@/lib/translations";
import { DeliveryMethodFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";

export interface ShippingMethodDisplayProps {
  method: DeliveryMethodFragment;
}

export function ShippingMethodDisplay({ method }: ShippingMethodDisplayProps) {
  const { formatPrice } = useRegions();
  return (
    <div>
      <div className="mt-6 text-base font-medium text-gray-900">{translate(method, "name")}</div>
      <div className="mt-1 flex items-center text-sm text-gray-500">
        {method.minimumDeliveryDays || 2}-{method.maximumDeliveryDays || 14} business days
      </div>
      <div className="mt-6 text-sm font-medium text-gray-900">{formatPrice(method.price)}</div>
    </div>
  );
}

export default ShippingMethodDisplay;
