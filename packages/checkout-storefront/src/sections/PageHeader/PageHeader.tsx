import { SaleorLogo } from "@/checkout-storefront/images";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { LanguageSelect } from "@/checkout-storefront/sections/PageHeader/LanguageSelect";
import { CheckoutHeaderBar } from "@saleor/ui-kit";
import { headerMessages } from "../../sections/PageHeader/messages";
import { useFormattedMessages } from "../../hooks/useFormattedMessages";

export const PageHeader = () => {
  const storefrontUrl: string = process.env.NEXT_PUBLIC_STOREFRONT_URL!;
  const storefrontName: string = process.env.NEXT_PUBLIC_STOREFRONT_NAME!;
  const formatMessage = useFormattedMessages();
  const backMessage = formatMessage(headerMessages.goBackToCart);

  return (
    <div className="page-header">
      {/* <img src={getSvgSrc(SaleorLogo)} alt="logo" className="logo" /> */}
      <CheckoutHeaderBar
        storefrontName={storefrontName}
        destinationLink={storefrontUrl}
        backMessage={backMessage}
      />
      <LanguageSelect />
    </div>
  );
};
