import { dataExtensions } from "@/config/data-extensions";
import type { CacheProfile } from "./cache/manifest";

/**
 * Fork extension records, merged into the manifest, webhook map, and operation registry.
 * The core directory does not contain merchant-specific profiles.
 */
export const extensionCacheProfiles = dataExtensions.profiles as Record<string, CacheProfile>;

export const extensionWebhookScopes = dataExtensions.webhookScopes;

export const extensionOperations = dataExtensions.operations;
