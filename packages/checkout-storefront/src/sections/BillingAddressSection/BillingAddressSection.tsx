import { Checkbox } from "@/checkout-storefront/components/Checkbox";
import {
  AddressFragment,
  useCheckoutBillingAddressUpdateMutation,
  useUserQuery,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useAuthState } from "@saleor/sdk";
import { GuestAddressSection } from "../GuestAddressSection/GuestAddressSection";
import { AddressFormData, UserAddressFormData } from "../../components/AddressForm/types";
import { UserAddressSection } from "../UserAddressSection/UserAddressSection";
import {
  getAddressVlidationRulesVariables,
  getAddressInputData,
} from "@/checkout-storefront/lib/utils";
import { billingMessages } from "./messages";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useSetBillingSameAsShipping } from "@/checkout-storefront/sections/BillingAddressSection/useSetBillingSameAsShipping";
import { omit } from "lodash-es";

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
  const errorProps = useErrors<UserAddressFormData>();
  const { setApiErrors } = errorProps;

  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const handleSubmit = useSubmit<AddressFormData, typeof checkoutBillingAddressUpdate>({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    formDataParse: ({ autoSave, languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      billingAddress: getAddressInputData(omit(rest, "channel")),
      validationRules: getAddressVlidationRulesVariables(autoSave),
    }),
    onError: setApiErrors,
  });

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
            <GuestAddressSection
              {...errorProps}
              type="BILLING"
              checkAddressAvailability={false}
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
