import { ChipButton } from "@saleor/ui-kit";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";

import { usePaths } from "@/lib/paths";
import { translate } from "@/lib/translations";
import { CategoryDetailsFragment, CollectionDetailsFragment } from "@/saleor/api";

import { Box } from "../Box";
import { RichText } from "../RichText";

export interface PageHeroProps {
  entity: CollectionDetailsFragment & CategoryDetailsFragment;
}

export function PageHero({ entity }: PageHeroProps) {
  const paths = usePaths();
  const router = useRouter();
  const description = translate(entity, "description");
  const subcategories = entity.children?.edges?.map((edge) => edge.node) || [];

  const navigateToCategory = (categorySlug: string) => {
    router.push(paths.category._slug(categorySlug).$url());
  };

  return (
    <Box>
      <div className="sm:ml-20 sm:text-left">
        <h1 className="text-5xl font-bold mb-4">{translate(entity, "name")}</h1>

        {description && (
          <div className="text-lg inline-block sm:block">
            <RichText jsonStringData={description} />
          </div>
        )}
        <div className={clsx(!subcategories.length && "hidden", "flex gap-2 flex-wrap")}>
          {subcategories.map((subcategory) => (
            <ChipButton
              key={subcategory.id}
              label={subcategory.name}
              onClick={() => {
                navigateToCategory(subcategory.slug);
              }}
            />
          ))}
        </div>
      </div>
    </Box>
  );
}

export default PageHero;
