import {
  defaultPrivateSettings,
  defaultPublicSettings,
} from "@/config/defaults";
import { mapPrivateSettingsToMetadata } from "@/backend/configuration/mapPrivateSettingsToMetadata";
import { mapPublicSettingsToMetadata } from "@/frontend/misc/mapPublicSettingsToMetadata";
import { PublicSettingsValues } from "@/types/api";

describe("/utils/frontend/misc/mapSettingsToMetadata", () => {
  it("maps settings to public metadata", async () => {
    const settingsValues: PublicSettingsValues = {
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

    const mappedMetadata = mapPublicSettingsToMetadata(settingsValues);

    const expectedMetadata: Array<{
      key: string;
      value: string;
    }> = [
      {
        key: "customizations",
        value:
          '{"branding":{"buttonBgColorPrimary":"#fff","buttonBgColorHover":"#fff","borderColorPrimary":"#FAFAFA","errorColor":"#B65757","successColor":"#2C9B2A","buttonTextColor":"#ffffff","textColor":"#000000","logoUrl":""},"productSettings":{"lowStockThreshold":""}}',
      },
      {
        key: "channelActivePaymentProviders",
        value: "{}",
      },
    ];

    expect(mappedMetadata).toEqual(expectedMetadata);
  });

  it("maps settings to private metadata", async () => {
    const settingsValues = {
      ...defaultPrivateSettings,
      paymentProviders: {
        ...defaultPrivateSettings.paymentProviders,
        adyen: {
          clientKey: "adyen_unencrypted_key",
          merchantAccount: "adyen_unencrypted_value",
          supportedCurrencies: "USD,EUR",
          apiKey: "api_unecrypted_value",
        },
      },
    };

    const mappedMetadata = mapPrivateSettingsToMetadata(settingsValues);

    const providersMetadata = mappedMetadata.find(
      (metadata) => metadata.key === "paymentProviders"
    )?.value;

    // These metadata are private and encrypted
    expect(providersMetadata).not.toContain(
      settingsValues.paymentProviders.adyen.apiKey
    );

    // These metadata are public and unencrypted
    expect(providersMetadata).toContain(
      settingsValues.paymentProviders.adyen.clientKey
    );
    expect(providersMetadata).toContain(
      settingsValues.paymentProviders.adyen.merchantAccount
    );
    expect(providersMetadata).toContain(
      settingsValues.paymentProviders.adyen.supportedCurrencies
    );
  });
});
