import { useFormattedMessages } from "@hooks/useFormattedMessages";
import { Text } from "@components/Text";
import { Button } from "@components/Button";
import { TextInput } from "@components/TextInput";

export const Contact = () => {
  const formatMessage = useFormattedMessages();

  return (
    <div>
      <div className="flex flex-row justify-between items-baseline">
        <Text variant="title">{formatMessage("contact")}</Text>
        <div className="flex flex-row">
          <Text color="secondary" className="mr-2">
            {formatMessage("haveAccount")}
          </Text>
          <Button variant="tertiary" title={formatMessage("signIn")} />
        </div>
      </div>
      {/* @ts-ignore TMP */}
      <TextInput label="Email address" className="mt-4" />
    </div>
  );
};
