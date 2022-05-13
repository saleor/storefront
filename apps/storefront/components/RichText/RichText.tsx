import Blocks from "editorjs-blocks-react-renderer";
import React from "react";

export interface RichTextProps {
  jsonStringData?: string;
}

export function RichText({ jsonStringData }: RichTextProps) {
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

  return (
    <article className="prose-2xl">
      <Blocks data={data} />
    </article>
  );
}

export default RichText;
