import { queryTypes, TransitionOptions, useQueryState } from "next-usequerystate";
import { useEffect, useState } from "react";

import { ProductCollection } from "@/components/ProductCollection";
import { translate } from "@/lib/translations";
import {
  AttributeFilterFragment,
  OrderDirection,
  ProductFilterInput,
  ProductOrderField,
} from "@/saleor/api";

import {
  getFilterOptions,
  getPillsData,
  parseQueryAttributeFilters,
  serializeQueryAttributeFilters,
  UrlFilter,
} from "./attributes";
import { FilterDropdown } from "./FilterDropdown";
import { FilterPill, FilterPills } from "./FilterPills";
import { parseQuerySort, serializeQuerySort, UrlSorting } from "./sorting";
import { SortingDropdown } from "./SortingDropdown";
import { StockToggle } from "./StockToggle";

export interface FilteredProductListProps {
  attributeFiltersData: AttributeFilterFragment[];
  collectionIDs?: string[];
  categoryIDs?: string[];
}

export interface Filters {
  sortBy: string;
  attributes: Record<string, Array<string>>;
}

export function FilteredProductList({
  attributeFiltersData,
  collectionIDs,
  categoryIDs,
}: FilteredProductListProps) {
  const [queryFilters, setQueryFilters] = useQueryState("filters", {
    parse: parseQueryAttributeFilters,
    serialize: serializeQueryAttributeFilters,
    defaultValue: [],
  });

  const [itemsCounter, setItemsCounter] = useState(0);

  const [sortByQuery, setSortByQuery] = useQueryState("sortBy", {});

  const sortBy = parseQuerySort(sortByQuery);
  const setSortBy = (
    value: UrlSorting | undefined | null,
    transitionOptions?: TransitionOptions | undefined
  ) => setSortByQuery(serializeQuerySort(value), transitionOptions);

  const [inStockFilter, setInStockFilter] = useQueryState(
    "inStock",
    queryTypes.boolean.withDefault(false)
  );

  const [productsFilter, setProductsFilter] = useState<ProductFilterInput>();

  const pills: FilterPill[] = getPillsData(queryFilters, attributeFiltersData);

  useEffect(() => {
    setProductsFilter({
      attributes: queryFilters.filter((filter) => filter.values?.length),
      ...(categoryIDs?.length && { categories: categoryIDs }),
      ...(collectionIDs?.length && { collections: collectionIDs }),
      ...(inStockFilter && { stockAvailability: "IN_STOCK" }),
    });
    // Eslint does not recognize stringified queryFilters, so we have to ignore it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inStockFilter, JSON.stringify(queryFilters), categoryIDs, collectionIDs]);

  const removeAttributeFilter = (attributeSlug: string, choiceSlug: string) => {
    const newFilters = queryFilters.reduce((result: UrlFilter[], filter: UrlFilter) => {
      if (filter.slug !== attributeSlug) {
        return [...result, filter];
      }
      const newFilterValues = filter.values.filter((value) => value !== choiceSlug);
      if (newFilterValues?.length) {
        return [...result, { ...filter, values: newFilterValues }];
      }
      return result;
    }, []);

    return setQueryFilters(newFilters.length ? newFilters : null, {
      scroll: false,
      shallow: true,
    });
  };

  const addAttributeFilter = (attributeSlug: string, choiceSlug: string) => {
    const isFilterAlreadyApplied = !!pills.find(
      (pill) => pill.attributeSlug === attributeSlug && pill.choiceSlug === choiceSlug
    );
    if (isFilterAlreadyApplied) {
      return removeAttributeFilter(attributeSlug, choiceSlug);
    }

    // if attribute was not used before, add it
    const existingFilter = queryFilters.find((filter) => filter.slug === attributeSlug);
    if (!existingFilter) {
      return setQueryFilters([...queryFilters, { slug: attributeSlug, values: [choiceSlug] }], {
        scroll: false,
        shallow: true,
      });
    }

    // if its already here, modify values list
    existingFilter.values = [...existingFilter.values, choiceSlug];
    return setQueryFilters(queryFilters, {
      scroll: false,
      shallow: true,
    });
  };

  const clearFilters = async () => {
    // await required when multiple query changes are applied at once
    await setQueryFilters(null, {
      scroll: false,
      shallow: true,
    });
    await setInStockFilter(null, {
      scroll: false,
      shallow: true,
    });
  };

  if (!productsFilter) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col divide-y">
        <div className="flex items-center">
          <div className="flex-grow">
            {attributeFiltersData.map((attribute) => (
              <FilterDropdown
                key={attribute.id}
                label={translate(attribute, "name") || ""}
                optionToggle={addAttributeFilter}
                attributeSlug={attribute.slug!}
                options={getFilterOptions(attribute, pills)}
              />
            ))}
            <SortingDropdown
              optionToggle={(field?: ProductOrderField, direction?: OrderDirection) => {
                return setSortBy(field && direction ? { field, direction } : null, {
                  scroll: false,
                  shallow: true,
                });
              }}
              chosen={sortBy}
            />
            <StockToggle
              enabled={inStockFilter}
              onChange={(value: boolean) =>
                setInStockFilter(!!value || null, {
                  scroll: false,
                  shallow: true,
                })
              }
            />
          </div>
          <div className="flex-none text-main-2 text-base">
            <div>{itemsCounter} items</div>
          </div>
        </div>
        {pills.length > 0 && (
          <FilterPills
            pills={pills}
            onClearFilters={clearFilters}
            onRemoveAttribute={removeAttributeFilter}
          />
        )}
      </div>

      <div className="mt-4">
        <ProductCollection
          filter={productsFilter}
          sortBy={sortBy || undefined}
          setCounter={setItemsCounter}
          perPage={40}
        />
      </div>
    </>
  );
}

export default FilteredProductList;
