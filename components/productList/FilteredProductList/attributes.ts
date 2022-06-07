import { AttributeFilterFragment } from "@/saleor/api";

import { FilterPill } from "./FilterPills";

export interface UrlFilter {
  slug: string;
  values: string[];
}

export const getPillsData = (
  filters: UrlFilter[],
  attributeFiltersData: AttributeFilterFragment[]
) => {
  const pills: FilterPill[] = [];
  for (const filter of filters) {
    const choiceAttribute = attributeFiltersData.find(
      (attribute) => attribute.slug === filter.slug
    );
    const attrName = choiceAttribute ? choiceAttribute.name : filter.slug;
    for (const value of filter.values) {
      let choiceName = value;
      if (choiceAttribute) {
        const attrChoice = choiceAttribute.choices?.edges.find(
          (choice) => choice.node.slug === value
        );
        if (attrChoice?.node.name) {
          choiceName = attrChoice.node.name;
        }
      }
      pills.push({
        label: `${attrName}: ${choiceName}`,
        choiceSlug: value,
        attributeSlug: filter.slug,
      });
    }
  }
  return pills;
};

export const parseQueryAttributeFilters = (query: string): UrlFilter[] => {
  const filters: UrlFilter[] = [];
  query.split(";").map((attributeWithValues) => {
    const splitted = attributeWithValues.split(".");
    const attributeFilter = { slug: splitted[0], values: splitted.slice(1) };
    if (attributeFilter.values.length > 0) {
      filters.push(attributeFilter);
    }
  });
  return filters;
};

export const serializeQueryAttributeFilters = (values: UrlFilter[]): string =>
  values.map((value) => [value.slug, ...value.values].join(".")).join(";");
