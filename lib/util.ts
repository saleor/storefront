import { DataProp } from "editorjs-blocks-react-renderer";

import { DEFAULT_LOCALE } from "@/lib/regions";

export const formatAsMoney = (amount = 0, currency = "USD", locale = DEFAULT_LOCALE) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

// Returns true for non nullable values
export function notNullable<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const parseEditorJSData = (jsonStringData?: string): DataProp | null => {
  if (!jsonStringData) {
    return null;
  }
  let data;
  try {
    data = JSON.parse(jsonStringData);
  } catch (e) {
    return null;
  }

  if (!data.blocks?.length) {
    // No data to render
    return null;
  }

  // Path for compatibility with data from older version od EditorJS
  if (!data.time) {
    data.time = Date.now().toString();
  }
  if (!data.version) {
    data.version = "2.22.2";
  }

  return data;
};
