import React from "react";

import {
  CategoryDetailsFragment,
  CollectionDetailsFragment,
} from "@/saleor/api";

import { RichText } from "./RichText";

export interface PageHeroProps {
  entity: CollectionDetailsFragment | CategoryDetailsFragment;
}

export const PageHero = ({ entity }: PageHeroProps) => {
  const style: React.CSSProperties = {};
  if (!!entity.backgroundImage?.url) {
    style.backgroundImage = `url(${entity.backgroundImage?.url})`;
  }

  return (
    <div
      className="container mx-auto bg-gray-400 h-96 rounded-md flex items-center"
      style={style}
    >
      <div className="sm:ml-20 text-gray-50 text-center sm:text-left">
        <h1 className="text-5xl font-bold mb-4">{entity.name}</h1>

        <p className="text-lg inline-block sm:block">
          {!!entity.description && (
            <RichText jsonStringData={entity.description} />
          )}
        </p>
      </div>
    </div>
  );
};

export default PageHero;
