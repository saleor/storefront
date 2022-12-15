import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import { AddressFragment, useUserQuery } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import { GuestAddressSection } from "../GuestAddressSection/GuestAddressSection";
import { UserAddressSection } from "../UserAddressSection/UserAddressSection";
import { billingMessages } from "./messages";
import { useSetBillingSameAsShipping } from "@/checkout-storefront/hooks/useBillingSameAsShippingForm";
import { GuestBillingAddressForm } from "@/checkout-storefront/sections/BillingAddressSection/GuestBillingAddressForm";

export const BillingAddressSection = () => {
  const formatMessage = useFormattedMessages();
  const { user: authUser } = useAuthState();
  const {
    checkout: { isShippingRequired, billingAddress },
  } = useCheckout();

  const [{ data }] = useUserQuery({
    pause: !authUser?.id,
  });

  const user = data?.me;
  const addresses = user?.addresses;

  const { isBillingSameAsShipping, setIsBillingSameAsShipping, passDefaultFormDataAddress } =
    useSetBillingSameAsShipping({
      handleSubmit,
    });

  return (
    <div className="mt-2">
      {isShippingRequired && (
        <Checkbox
          classNames={{ container: "!mb-0" }}
          value="useShippingAsBilling"
          checked={isBillingSameAsShipping}
          onChange={setIsBillingSameAsShipping}
          label={formatMessage(billingMessages.useShippingAsBilling)}
          data-testid={"useShippingAsBillingCheckbox"}
        />
      )}
      {!isBillingSameAsShipping && (
        <div className="mt-4" data-testid="billingAddressSection">
          {authUser ? (
            <UserAddressSection
              {...errorProps}
              title={formatMessage(billingMessages.billingAddress)}
              type="BILLING"
              onAddressSelect={handleSubmit}
              addresses={addresses as AddressFragment[]}
              defaultAddress={user?.defaultBillingAddress}
            />
          ) : (
            <GuestBillingAddressForm
              defaultAddress={passDefaultFormDataAddress ? billingAddress : undefined}
              title={formatMessage(billingMessages.billingAddress)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};
