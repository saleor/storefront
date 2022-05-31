import { useQueryState } from "next-usequerystate";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { useDebounce } from "react-use";

import { Layout, ProductCollection } from "@/components";
import { messages } from "@/components/translations";
import { ProductFilterInput } from "@/saleor/api";

function SearchPage() {
  const t = useIntl();
  const [searchQuery, setSearchQuery] = useQueryState("q");
  const [debouncedFilter, setDebouncedFilter] = React.useState<ProductFilterInput>({});

  useDebounce(
    () => {
      if (searchQuery) {
        setDebouncedFilter({ search: searchQuery });
      } else {
        setDebouncedFilter({});
      }
    },
    1000,
    [searchQuery]
  );

  return (
    <main className="container w-full px-8 mt-5">
      <p className="font-semibold text-xl mb-5">{t.formatMessage(messages.searchHeader)}</p>
      <input
        className="w-full md:w-96 mb-10 block border-gray-300 rounded-md shadow-sm text-md"
        type="text"
        value={searchQuery || ""}
        placeholder={t.formatMessage(messages.searchFieldPlaceholder)}
        onChange={(e) => setSearchQuery(e.target.value, { scroll: false, shallow: true })}
      />
      <ProductCollection filter={debouncedFilter} />
    </main>
  );
}

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SearchPage;
