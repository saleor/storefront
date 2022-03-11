import { useRouter } from "next/router";
import { Card, CardContent, Typography } from "@material-ui/core";
import { PaymentProvider, PaymentProviderID } from "types";
import { paymentProviders } from "consts";
import SettingList from "@elements/SettingList";
import VerticalSpacer from "@elements/VerticalSpacer";
import { channelListPath, channelPath, paymentProviderPath } from "routes";
import { FormattedMessage, useIntl } from "react-intl";
import { messages } from "./messages";
import { sectionMessages } from "@misc/commonMessages";
import AppLayout from "@elements/AppLayout";

interface PaymentProviderDetailsProps {
  selectedPaymentProvider?: PaymentProvider<PaymentProviderID>;
  channelId?: string;
}

const PaymentProviderDetails: React.FC<PaymentProviderDetailsProps> = ({
  selectedPaymentProvider,
  channelId,
}) => {
  const router = useRouter();
  const intl = useIntl();

  const onBackClick = () => {
    if (channelId) {
      router.push({
        pathname: channelPath,
        query: {
          channelId: channelId,
        },
      });
    } else {
      router.push(channelListPath);
    }
  };

  const onPaymentProviderClick = (
    paymentProvider: PaymentProvider<PaymentProviderID>
  ) => {
    if (channelId) {
      router.push({
        pathname: paymentProviderPath,
        query: {
          paymentProviderId: paymentProvider.id,
          channelId,
        },
      });
    } else {
      router.push({
        pathname: paymentProviderPath,
        query: {
          paymentProviderId: paymentProvider.id,
        },
      });
    }
  };

  return (
    <AppLayout
      title={intl.formatMessage(sectionMessages.settings)}
      onBackClick={onBackClick}
      items={paymentProviders}
      selectedItem={selectedPaymentProvider}
      onItemClick={onPaymentProviderClick}
    >
      <Card>
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage {...messages.paymentProviderSettings} />
          </Typography>
          <VerticalSpacer />
          <SettingList settings={selectedPaymentProvider.settings} />
        </CardContent>
      </Card>
    </AppLayout>
  );
};
export default PaymentProviderDetails;
