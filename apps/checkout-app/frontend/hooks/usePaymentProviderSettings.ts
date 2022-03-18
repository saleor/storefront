import { useMetadataQuery } from "@graphql";

export const usePaymentProviderSettings = () => {
  const [metadataQuery] = useMetadataQuery({
    variables: {
      id: process.env.NEXT_PUBLIC_APP_ID,
    },
  });

  // TODO: map metadata to settings values
  return metadataQuery.data?.app?.privateMetadata || [];
};
