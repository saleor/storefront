import {
  defaultPrivateSettings,
  defaultPublicSettings,
} from "@/config/defaults";
import { mapPrivateMetadataToSettings } from "@/backend/configuration/mapPrivateMetadataToSettings";
import { mapPublicMetadataToSettings } from "@/frontend/misc/mapPublicMetadataToSettings";
import { MetadataItemFragment } from "@/graphql";
import { PrivateSettingsValues, PublicSettingsValues } from "@/types/api";

describe("/utils/frontend/misc/mapMetadataToSettings", () => {
  it("maps public metadata to settings", async () => {
    const metadata: MetadataItemFragment[] = [
      {
        key: "customizations",
        value:
          '{"branding":{"buttonBgColorPrimary":"#fff","buttonBgColorHover":"#fff"}}',
      },
    ];

    const mergedSettings = mapPublicMetadataToSettings(metadata);

    const expectedSettings: PublicSettingsValues = {
      ...defaultPublicSettings,
      customizations: {
        ...defaultPublicSettings.customizations,
        branding: {
          ...defaultPublicSettings.customizations.branding,
          buttonBgColorPrimary: "#fff",
          buttonBgColorHover: "#fff",
        },
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
  });

  it("maps private metadata to settings", async () => {
    const metadata: MetadataItemFragment[] = [
      {
        key: "paymentProviders",
        value:
          '{"mollie":{"partnerId":{"encrypted":false,"value":"some_not_encrypted_id"},"liveApiKey":{"encrypted":true,"value":"U2FsdGVkX18zfzUyZy2f00/5BoS3s3WtAOo7wY0yELlwuW6hX0R/zCn/ppPnsBRk"}}}',
      },
    ];

    const mergedSettings = mapPrivateMetadataToSettings(metadata);

    const expectedSettings: PrivateSettingsValues<"unencrypted"> = {
      ...defaultPrivateSettings,
      paymentProviders: {
        adyen: {},
        mollie: {
          partnerId: "some_not_encrypted_id",
          liveApiKey: "some_decrypted_key",
        },
      },
    };

    expect(mergedSettings).toEqual(expectedSettings);
  });
});
