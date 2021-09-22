import { CheckoutSidebar, CheckoutForm } from "@/components";
import BaseSeo from "@/components/seo/BaseSeo";
import { CHECKOUT_TOKEN } from "@/lib/const";
import { useCheckoutByTokenQuery } from "@/saleor/api";
import { useLocalStorage } from "react-use";

export default function CheckoutPage() {
  const [token] = useLocalStorage(CHECKOUT_TOKEN);
  const {
    data: checkoutData,
    loading,
    error,
  } = useCheckoutByTokenQuery({
    fetchPolicy: "network-only",
    variables: { checkoutToken: token },
    skip: !token,
  });
  const checkout = checkoutData?.checkout;
  return (
    <>
      <BaseSeo title="Checkout - Saleor Tutorial" />
      <main className="min-h-screen overflow-hidden flex">
        {!checkout ? (
          <p>No checkout</p>
        ) : (
          <>
            <CheckoutForm checkout={checkout} />
            <CheckoutSidebar />
          </>
        )}
      </main>
    </>
  );
}
