import { CategoryDetailsFragment } from "@/saleor/api";
import Blocks, { DataProp } from "editorjs-blocks-react-renderer";
import React, { ReactElement } from "react";
import RichText from "./RichText";

export interface CategoryHeroProps {
  category: CategoryDetailsFragment;
}

export const CategoryHero: React.VFC<CategoryHeroProps> = ({ category }) => {
  const style: React.CSSProperties = {};
  if (!!category.backgroundImage?.url) {
    style.backgroundImage = `url(${category.backgroundImage?.url})`;
  }

  return (
    <div
      className="container mx-auto bg-gray-400 h-96 rounded-md flex items-center"
      style={style}
    >
      <div className="sm:ml-20 text-gray-50 text-center sm:text-left">
        <h1 className="text-5xl font-bold mb-4">{category.name}</h1>

        <p className="text-lg inline-block sm:block">
          {!!category.description && (
            <RichText jsonStringData={category.description} />
          )}
        </p>
      </div>
    </div>
  );
};

export default CategoryHero;
