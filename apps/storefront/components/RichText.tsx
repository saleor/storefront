import Blocks from "editorjs-blocks-react-renderer";
import React from "react";

export interface RichTextProps {
  jsonStringData?: string;
}

export const RichText: React.VFC<RichTextProps> = ({ jsonStringData }) => {
  if (!jsonStringData) {
    return null;
  }
  let data;
  try {
    data = JSON.parse(jsonStringData);
  } catch (e) {
    console.error("Rich text data are not valid JSONString.");
    return null;
  }
  if (!data.time || !data.version || !data.blocks.length) {
    console.error("Rich text data not in the EditorJS format.");
    return null;
  }
  return (
    <article className="prose lg:prose-s">
      <Blocks data={data} />
    </article>
  );
};

export default RichText;
