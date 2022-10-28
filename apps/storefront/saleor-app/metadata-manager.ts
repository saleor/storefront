import { MetadataEntry, MetadataManager } from "@saleor/app-sdk/settings-manager";
import { Client } from "urql";

import {
  FetchAppDetailsDocument,
  FetchAppDetailsQuery,
  UpdateAppMetadataDocument,
} from "../saleor/api";

// Function is using urql graphql client to fetch all available metadata.
// Before returning query result, we are transforming response to list of objects with key and value fields
// which can be used by the manager.
// Result of this query is cached by the manager.
export async function fetchAllMetadata(client: Client): Promise<MetadataEntry[]> {
  const { error, data } = await client
    .query<FetchAppDetailsQuery>(FetchAppDetailsDocument, {})
    .toPromise();

  if (error) {
    console.debug("Error during fetching the metadata: ", error);
    return [];
  }

  return data?.app?.metadata.map((md) => ({ key: md.key, value: md.value })) || [];
}

// Mutate function takes urql client and metadata entries, and construct mutation to the API.
// Before data are send, additional query for required App ID is made.
// The manager will use updated entries returned by this mutation to update it's cache.
export async function mutateMetadata(client: Client, metadata: MetadataEntry[]) {
  // to update the metadata, ID is required
  const { error: idQueryError, data: idQueryData } = await client
    .query(FetchAppDetailsDocument, {})
    .toPromise();

  if (idQueryError) {
    console.debug("Could not fetch the app id: ", idQueryError);
    throw new Error(
      "Could not fetch the app id. Please check if auth data for the client are valid."
    );
  }

  const appId = idQueryData?.app?.id;

  if (!appId) {
    console.debug("Missing app id");
    throw new Error("Could not fetch the app ID");
  }

  const { error: mutationError, data: mutationData } = await client
    .mutation(UpdateAppMetadataDocument, {
      id: appId,
      input: metadata,
    })
    .toPromise();

  if (mutationError) {
    console.debug("Mutation error: ", mutationError);
    throw new Error(`Mutation error: ${mutationError.message}`);
  }

  return (
    mutationData?.updateMetadata?.item?.metadata.map((md) => ({
      key: md.key,
      value: md.value,
    })) || []
  );
}

export const createSettingsManager = (client: Client) => {
  // EncryptedMetadataManager gives you interface to manipulate metadata and cache values in memory.
  // We recommend it for production, because all values are encrypted.
  // If your use case require plain text values, you can use MetadataManager.
  return new MetadataManager({
    // Secret key should be randomly created for production and set as environment variable
    fetchMetadata: () => fetchAllMetadata(client),
    mutateMetadata: (metadata) => mutateMetadata(client, metadata),
  });
};
