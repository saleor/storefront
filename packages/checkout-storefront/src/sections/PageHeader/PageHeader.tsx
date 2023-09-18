import { LanguageSelect } from "@/checkout-storefront/sections/PageHeader/LanguageSelect";
import { CheckoutHeaderBar } from "@saleor/ui-kit";
import { headerMessages } from "../../sections/PageHeader/messages";
import { useFormattedMessages } from "../../hooks/useFormattedMessages";
import usePaths from "@/checkout-storefront/lib/paths";
import { useRouter } from "next/router";

export const PageHeader = () => {
  const storefrontName = process.env.NEXT_PUBLIC_STOREFRONT_NAME as string;
  const formatMessage = useFormattedMessages();
  const backMessage = formatMessage(headerMessages.goBackToCart);
  const paths = usePaths();
  const router = useRouter();

  return (
    <div className="page-header">
      <CheckoutHeaderBar
        storefrontName={storefrontName}
        destinationLink={() => router.push(paths.cart.$url())}
        backMessage={backMessage}
      />
      <LanguageSelect />
    </div>
  );
};
