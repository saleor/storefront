import { defaultPrivateSettings } from "@/saleor-app-checkout/config/defaults";
import createSafeContext from "@/saleor-app-checkout/frontend/misc/createSafeContext";
import { PrivateSettingsValues } from "@/saleor-app-checkout/types/api";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

interface PrivateSettingsProviderContext {
  privateSettings: PrivateSettingsValues<"unencrypted">;
  setPrivateSettings: Dispatch<SetStateAction<PrivateSettingsValues<"unencrypted">>>;
}

export const [usePrivateSettingsContext, Provider] =
  createSafeContext<PrivateSettingsProviderContext>();

const PrivateSettingsProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [privateSettings, setPrivateSettings] = useState(defaultPrivateSettings);

  return (
    <Provider
      value={{
        privateSettings,
        setPrivateSettings,
      }}
      {...props}
    />
  );
};
export default PrivateSettingsProvider;
