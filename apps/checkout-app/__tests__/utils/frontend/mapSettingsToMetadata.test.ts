import {
  defaultPrivateSettings,
  defaultPublicSettings,
} from "@/config/defaults";
import { mapPrivateSettingsToMetadata } from "@/backend/configuration/mapPrivateSettingsToMetadata";
import { mapPublicSettingsToMetadata } from "@/frontend/misc/mapPublicSettingsToMetadata";
import { PrivateSettingsValues, PublicSettingsValues } from "@/types/api";

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
    const settingsValues: PrivateSettingsValues<"unencrypted"> = {
      ...defaultPrivateSettings,
      paymentProviders: {
        ...defaultPrivateSettings.paymentProviders,
        adyen: {
          clientKey: "adyen_unencrypted_key",
          merchantAccount: "adyen_unencrypted_value",
          supportedCurrencies: "USD,EUR",
        },
      },
    };

    const mappedMetadata = mapPrivateSettingsToMetadata(settingsValues);

    const providersMetadata = mappedMetadata.find(
      (metadata) => metadata.key === "paymentProviders"
    )?.value;

    expect(providersMetadata).not.toContain(
      settingsValues.paymentProviders.adyen.clientKey
    );
    expect(providersMetadata).not.toContain(
      settingsValues.paymentProviders.adyen.merchantAccount
    );
    expect(providersMetadata).toContain(
      settingsValues.paymentProviders.adyen.supportedCurrencies
    );
  });
});
