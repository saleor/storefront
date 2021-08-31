import { CheckoutSidebar, CheckoutForm } from "@/components";
import { useCheckoutByTokenQuery } from "@/saleor/api";
import { useLocalStorage } from "react-use";

export default function CheckoutPage() {
  const [token] = useLocalStorage("token");
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
  );
}
