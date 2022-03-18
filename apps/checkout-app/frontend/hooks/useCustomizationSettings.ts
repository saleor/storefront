import { useMetadataQuery } from "@graphql";

export const useCustomizationSettings = () => {
  const [metadataQuery] = useMetadataQuery({
    variables: {
      id: process.env.NEXT_PUBLIC_PP_ID,
    },
  });

  // TODO: map metadata to settings values
  return metadataQuery.data?.app?.privateMetadata || [];
};
