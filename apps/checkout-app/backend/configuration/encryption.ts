import { serverEnvVars } from "@/constants";
import { SettingValue } from "@/types/api";
import CryptoJS from "crypto-js";

export const encryptSetting = (settingValue: string): SettingValue => ({
  encrypted: true,
  value:
    CryptoJS.AES.encrypt(
      settingValue,
      serverEnvVars.settingsEncryptionSecret
    ).toString() || "",
});

export const decryptSetting = (settingValue: SettingValue) =>
  CryptoJS.AES.decrypt(
    settingValue.value,
    serverEnvVars.settingsEncryptionSecret
  ).toString(CryptoJS.enc.Utf8) || "";
