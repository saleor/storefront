import { defaultPrivateSettings } from "@/config/defaults";
import createSafeContext from "@/frontend/misc/createSafeContext";
import { PrivateSettingsValues } from "@/types/api";
import { Dispatch, SetStateAction, useState } from "react";

interface PrivateSettingsProviderContext {
  privateSettings: PrivateSettingsValues<"unencrypted">;
  setPrivateSettings: Dispatch<
    SetStateAction<PrivateSettingsValues<"unencrypted">>
  >;
}

export const [usePrivateSettingsContext, Provider] =
  createSafeContext<PrivateSettingsProviderContext>();

const PrivateSettingsProvider: React.FC = (props) => {
  const [privateSettings, setPrivateSettings] = useState(
    defaultPrivateSettings
  );

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
