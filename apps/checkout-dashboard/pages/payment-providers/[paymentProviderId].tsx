import PaymentProviderDetails from "@templates/PaymentProviderDetails";
import { getPaymentProviderSettings } from "api/app";
import { UnknownSettingsValues } from "types/api";
import { useRouter } from "next/router";

export default function PaymentProvider() {
  const router = useRouter();
  const { paymentProviderId, channelId } = router.query;

  const paymentProviders = getPaymentProviderSettings();
  const paymentProvider = paymentProviders.find(
    (paymentMethod) => paymentMethod.id === paymentProviderId
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (data: UnknownSettingsValues) => {
    console.log(data);
  };

  return (
    <PaymentProviderDetails
      selectedPaymentProvider={paymentProvider}
      channelId={channelId?.toString()}
      disabled={false}
      saveButtonBarState="default"
      onCanel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
}
