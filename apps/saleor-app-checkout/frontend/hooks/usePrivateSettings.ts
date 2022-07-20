import { usePrivateSettingsContext } from "../components/elements/PrivateSettingsProvider";

export const usePrivateSettings = () => {
  const app = usePrivateSettingsContext();

  return app;
};
