import PaymentProviderDetails from "@templates/PaymentProviderDetails";
import { usePaymentProviderSettings } from "api/app/api";
import { useRouter } from "next/router";

export default function PaymentProvider() {
  const router = useRouter();
  const { paymentProviderId, channelId } = router.query;

  const paymentProviders = usePaymentProviderSettings();
  const paymentProvider = paymentProviders.find(
    (paymentMethod) => paymentMethod.id === paymentProviderId
  );

  return (
    <PaymentProviderDetails
      selectedPaymentProvider={paymentProvider}
      channelId={channelId?.toString()}
    />
  );
}
