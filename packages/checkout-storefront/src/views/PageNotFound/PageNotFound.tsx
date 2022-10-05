import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { Text } from "@saleor/ui-kit";
import { Button } from "@/checkout-storefront/components/Button";
import { SaleorLogo } from "@/checkout-storefront/images";
import { Title } from "@/checkout-storefront/components/Title";
import { FallbackProps } from "react-error-boundary";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { messages } from "@/checkout-storefront/views/PageNotFound/messages";
import {
  messages as emptyCartMessages,
  labels as emptyCartLabels,
} from "@/checkout-storefront/views/EmptyCartPage/messages";

export const PageNotFound = ({ error }: Partial<FallbackProps>) => {
  console.error(error);
  const formatMessage = useFormattedMessages();

  // eslint-disable-next-line no-restricted-globals
  const goBack = () => history.back();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pt-12">
      <div className="w-full flex justify-center">
        <img src={getSvgSrc(SaleorLogo)} alt="logo" className="logo" />
      </div>
      <div className="h-full flex flex-col items-center justify-center mb-22">
        <Title className="text-center">{formatMessage(messages.title)}</Title>
        <Text className="mb-6 max-w-85 text-center">{formatMessage(messages.subtitle)}</Text>
        <Button
          ariaLabel={formatMessage(emptyCartLabels.goBackToStore)}
          onClick={goBack}
          variant="secondary"
          label={formatMessage(emptyCartMessages.goBackToStore)}
        />
      </div>
    </div>
  );
};
