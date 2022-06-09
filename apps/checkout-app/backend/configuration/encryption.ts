import { serverEnvVars } from "@/checkout-app/constants";
import { SettingValue } from "@/checkout-app/types/api";
import CryptoJS from "crypto-js";

export const obfuscateValue = (value: string) => {
  const unobfuscatedLength = Math.min(4, value.length - 4);

  // if value is 4 characters or less, obfuscate entire value
  if (unobfuscatedLength <= 0) {
    return "****";
  }

  const unobfuscatedValue = value.slice(-unobfuscatedLength);

  return "****" + " " + unobfuscatedValue;
};

export const encryptSetting = (settingValue: string): SettingValue => ({
  encrypted: true,
  value:
    CryptoJS.AES.encrypt(
      settingValue,
      serverEnvVars.settingsEncryptionSecret
    ).toString() || "",
});

export const decryptSetting = (
  settingValue: SettingValue,
  obfuscateEncryptedData: boolean
) => {
  const decrypted =
    CryptoJS.AES.decrypt(
      settingValue.value,
      serverEnvVars.settingsEncryptionSecret
    ).toString(CryptoJS.enc.Utf8) || "";

  if (obfuscateEncryptedData) {
    return obfuscateValue(decrypted);
  }

  return decrypted;
};
