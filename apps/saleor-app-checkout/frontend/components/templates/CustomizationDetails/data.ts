import { unflattenSettings } from "@/saleor-app-checkout/frontend/utils";
import { CustomizationSettingsValues } from "@/saleor-app-checkout/types/api";
import { useEffect, useState } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";
import { Customization, CustomizationID } from "types/common";

export const getFormDefaultValues = (
  options: Customization<CustomizationID>[]
): CustomizationSettingsValues =>
  options.reduce(
    (settingsGroup, option) => ({
      ...settingsGroup,
      [option.id]: option.settings.reduce(
        (values, setting) => ({
          ...values,
          [setting.id]: setting.value,
        }),
        {}
      ),
    }),
    {} as CustomizationSettingsValues
  );

export const useSettingsFromValues = (
  options: Customization<CustomizationID>[],
  watch: UseFormWatch<FieldValues>
) => {
  const [previewSettings, setPreviewSettings] =
    useState<CustomizationSettingsValues>(getFormDefaultValues(options));

  useEffect(() => {
    setPreviewSettings(getFormDefaultValues(options));
  }, [options]);

  useEffect(() => {
    const subscription = watch((flattenedSettings) => {
      const updatedSettings = unflattenSettings(
        "customizations",
        flattenedSettings,
        options
      ) as CustomizationSettingsValues;

      setPreviewSettings(updatedSettings);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return previewSettings;
};

export const isValidHttpUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
