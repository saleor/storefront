import { useFormattedMessages } from "@hooks/useFormattedMessages";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { SaleorLogo } from "@images";
import { Title } from "@components/Title";

export const PageNotFound = () => {
  const formatMessage = useFormattedMessages();

  // eslint-disable-next-line no-restricted-globals
  const goBack = () => history.back();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pt-12">
      <div className="w-full flex justify-center">
        <img src={SaleorLogo} alt="logo" className="logo" />
      </div>
      <div className="h-full flex flex-col items-center justify-center mb-22">
        <Title className="text-center">{formatMessage("problemTitle")}</Title>
        <Text className="mb-6 max-w-85 text-center">
          {formatMessage("problemDescription")}
        </Text>
        <Button
          ariaLabel={formatMessage("goBackToStoreLabel")}
          onClick={goBack}
          variant="secondary"
          title={formatMessage("goBackToStore")}
        />
      </div>
    </div>
  );
};
