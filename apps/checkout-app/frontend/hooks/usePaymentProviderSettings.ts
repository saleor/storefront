import { usePrivateMetadataQuery } from "@graphql";
import { useAuthData } from "./useAuthData";

export const usePaymentProviderSettings = () => {
  const { app } = useAuthData();
  const [metadataQuery] = usePrivateMetadataQuery({
    variables: {
      id: app,
    },
  });

  // TODO: map metadata to settings values
  return metadataQuery.data?.app?.privateMetadata || [];
};
