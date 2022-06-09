import { mapEdgesToItems } from "@/lib/maps";
import { translate } from "@/lib/translations";
import { AttributeFilterFragment } from "@/saleor/api";

import { FilterDropdownOption } from "./FilterDropdown";
import { FilterPill } from "./FilterPills";

export interface UrlFilter {
  slug: string;
  values: string[];
}

export const getPillsData = (
  urlFilters: UrlFilter[],
  attributeFiltersData: AttributeFilterFragment[]
): FilterPill[] =>
  urlFilters.reduce((result: FilterPill[], filter: UrlFilter) => {
    const choiceAttribute = attributeFiltersData.find((attr) => attr.slug === filter.slug);
    const attrName = choiceAttribute ? choiceAttribute.name : filter.slug;
    const newPills = filter.values.map((value) => {
      const attrChoice = choiceAttribute?.choices?.edges.find(
        (choice) => choice.node.slug === value
      );
      const choiceName = attrChoice?.node.name || value;
      return {
        label: `${attrName}: ${choiceName}`,
        choiceSlug: value,
        attributeSlug: filter.slug,
      };
    });
    return [...result, ...newPills];
  }, []);

export const getFilterOptions = (
  attribute: AttributeFilterFragment,
  appliedFilters: FilterPill[]
): FilterDropdownOption[] => {
  const choices = mapEdgesToItems(attribute.choices);

  return choices.map((choice) => ({
    chosen: !!appliedFilters.find(
      (pill) => pill.attributeSlug === attribute.slug && pill.choiceSlug === choice.slug
    ),
    id: choice.id,
    label: translate(choice, "name") || choice.id,
    slug: choice.slug || choice.id,
  }));
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
