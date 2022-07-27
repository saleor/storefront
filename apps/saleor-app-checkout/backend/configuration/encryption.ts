import { serverEnvVars } from "@/saleor-app-checkout/constants";
import { SettingValue } from "@/saleor-app-checkout/types/api";
import CryptoJS from "crypto-js";
import invariant from "ts-invariant";

export const obfuscateValue = (value: string) => {
  const unobfuscatedLength = Math.min(4, value.length - 4);

  // if value is 4 characters or less, obfuscate entire value
  if (unobfuscatedLength <= 0) {
    return "••••";
  }

  const unobfuscatedValue = value.slice(-unobfuscatedLength);

  return "••••" + " " + unobfuscatedValue;
};

export const encryptSetting = (settingValue: string): SettingValue => {
  invariant(
    serverEnvVars.settingsEncryptionSecret,
    "Cannot encrypt settings when SETTINGS_ENCRYPTION_SECRET is not configured"
  );
  return {
    encrypted: true,
    value:
      CryptoJS.AES.encrypt(settingValue, serverEnvVars.settingsEncryptionSecret).toString() || "",
  };
};

export const decryptSetting = (settingValue: SettingValue, obfuscateEncryptedData: boolean) => {
  invariant(
    serverEnvVars.settingsEncryptionSecret,
    "Cannot decrypt settings when SETTINGS_ENCRYPTION_SECRET is not configured"
  );
  const decrypted =
    CryptoJS.AES.decrypt(settingValue.value, serverEnvVars.settingsEncryptionSecret).toString(
      CryptoJS.enc.Utf8
    ) || "";

  if (obfuscateEncryptedData) {
    return obfuscateValue(decrypted);
  }

  return decrypted;
};
