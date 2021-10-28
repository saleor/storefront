import { DeliveryMethodFragment } from "@/saleor/api";

export interface ShippingMethodDisplayProps {
  method: DeliveryMethodFragment;
}

export const ShippingMethodDisplay = ({
  method,
}: ShippingMethodDisplayProps) => {
  return (
    <div>
      <div className="mt-6 text-sm font-medium text-gray-900">
        {method.name}
      </div>
      <div className="mt-1 flex items-center text-sm text-gray-500">
        {method.minimumDeliveryDays || 2}-{method.maximumDeliveryDays || 14}{" "}
        business days
      </div>
      <div className="mt-6 text-sm font-medium text-gray-900">
        {method.price?.localizedAmount}
      </div>
    </div>
  );
};

export default ShippingMethodDisplay;
