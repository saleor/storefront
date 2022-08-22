import Blocks from "editorjs-blocks-react-renderer";
import React from "react";

import { parseEditorJSData } from "@/lib/util";

export interface RichTextProps {
  jsonStringData?: string;
}

export const RichText = ({ jsonStringData }: RichTextProps) => {
  const data = parseEditorJSData(jsonStringData);
  if (!data) {
    return null;
  }

  return (
    <article className="prose-2xl">
      <Blocks data={data} />
    </article>
  );
};

export default RichText;
