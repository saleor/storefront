import AppNavigation from "@/saleor-app-checkout/frontend/components/elements/AppNavigation";
import VerticalSpacer from "@/saleor-app-checkout/frontend/components/elements/VerticalSpacer";
import { Typography } from "@material-ui/core";
import { Alert } from "@saleor/macaw-ui";
import { useIntl } from "react-intl";
import { messages } from "./messages";

interface ErrorDetailsProps {
  error: string;
}

const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error }) => {
  const intl = useIntl();

  return (
    <>
      <AppNavigation />
      <VerticalSpacer />
      <Alert title={intl.formatMessage(messages.somethingWentWrong)} variant="error" close={false}>
        <Typography>{error}</Typography>
      </Alert>
    </>
  );
};
export default ErrorDetails;
