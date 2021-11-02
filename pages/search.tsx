import { useQueryState } from "next-usequerystate";
import React from "react";
import { useDebounce } from "react-use";

import { BaseTemplate, ProductCollection } from "@/components";
import { ProductFilterInput } from "@/saleor/api";

const SearchPage = () => {
  const [filter, setFilter] = useQueryState("search");
  const [debouncedFilter, setDebouncedFilter] =
    React.useState<ProductFilterInput>({ search: filter });

  const [] = useDebounce(
    () => {
      setDebouncedFilter({ search: filter });
    },
    1000,
    [filter]
  );

  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto w-full px-8 mt-5">
        <p className="font-semibold text-2xl mb-5">Search</p>
        <input
          className="md:w-96 mb-10 block border-gray-300 rounded-md shadow-sm sm:text-sm"
          type="text"
          placeholder="Search..."
          onChange={(e) => setFilter(e.target.value)}
        />
        <ProductCollection filter={debouncedFilter} />
      </main>
    </BaseTemplate>
  );
};

export default SearchPage;
