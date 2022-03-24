import Link from "next/link";
import React from "react";
import { useIntl } from "react-intl";
import { UrlObject } from "url";

import { usePaths } from "@/lib/paths";
import { translate } from "@/lib/translations";
import { HomepageBlockFragment, ProductFilterInput } from "@/saleor/api";

import { ProductCollection } from "../ProductCollection";
import { RichText } from "../RichText";
import { messages } from "../translations";

export interface HomepageBlockProps {
  menuItem: HomepageBlockFragment;
}

export const HomepageBlock = ({ menuItem }: HomepageBlockProps) => {
  const paths = usePaths();
  const t = useIntl();
  const filter: ProductFilterInput = {};
  if (!!menuItem.page?.id) {
    const content = translate(menuItem.page!, "content");
    return (
      <div className="pb-10">
        {content && <RichText jsonStringData={content} />}
      </div>
    );
  }
  let link: UrlObject = {};
  if (!!menuItem.category?.id) {
    filter.categories = [menuItem.category?.id];
    link = paths.category._slug(menuItem.category.slug).$url();
  }
  if (!!menuItem.collection?.id) {
    filter.collections = [menuItem.collection?.id];
    link = paths.collection._slug(menuItem.collection.slug).$url();
  }
  return (
    <div className="pb-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 pb-4">
        {translate(menuItem, "name")}
      </h1>
      <ProductCollection filter={filter} allowMore={false} />
      <div className="flex flex-row-reverse p-4">
        <Link href={link}>
          <a>
            <p>{t.formatMessage(messages.more)}</p>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomepageBlock;
