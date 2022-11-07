import { FileUploadMutation } from "@/saleor-app-checkout/graphql";
import {
  CustomizationSettingsFiles,
  CustomizationSettingsValues,
} from "@/saleor-app-checkout/types/api";
import { merge, reduce } from "lodash-es";
import { OperationResult } from "urql";

type UploadFileFunction = (variables: {
  file: any;
}) => Promise<OperationResult<FileUploadMutation>>;

type FileSetting = {
  [x: string]: File;
};

const uploadSettingFile = async (setting: FileSetting, uploadFile: UploadFileFunction) => {
  const settingIdx = Object.keys(setting)[0];
  const uploadFileResult = await uploadFile({
    file: setting[settingIdx],
  });
  if (uploadFileResult.data?.fileUpload) {
    return {
      [settingIdx]: uploadFileResult.data.fileUpload?.uploadedFile?.url,
    };
  }
  return {
    [settingIdx]: undefined,
  };
};

const mapSettingsObjectToArray = (
  settingList?: Partial<CustomizationSettingsFiles[keyof CustomizationSettingsFiles]>
) =>
  reduce(
    settingList,
    (settingsUrls, settingFile, settingIdx) => {
      if (settingFile) {
        return [
          ...settingsUrls,
          {
            [settingIdx]: settingFile,
          },
        ];
      }
      return settingsUrls;
    },
    [] as FileSetting[]
  );

export const uploadSettingsFiles = async ({
  data,
  dataFiles,
  uploadFile,
}: {
  data: CustomizationSettingsValues;
  dataFiles?: CustomizationSettingsFiles;
  uploadFile: UploadFileFunction;
}) => {
  if (!dataFiles) {
    return data;
  }

  return reduce(
    dataFiles,
    async (settings, subSettings, idx) => {
      const uploadedSettings = await settings;
      const uploadedSubSettings = await Promise.all(
        mapSettingsObjectToArray(subSettings).map((setting) =>
          uploadSettingFile(setting, uploadFile)
        )
      );

      return {
        ...uploadedSettings,
        [idx]: merge({}, ...uploadedSubSettings),
      };
    },
    Promise.resolve(data)
  );
};
