import { OrderDirection, ProductOrderField } from "@/saleor/api";

export interface UrlSorting {
  field: ProductOrderField;
  direction: OrderDirection;
}

export interface SortingOption {
  label: string;
  field?: ProductOrderField;
  direction?: OrderDirection;
  chosen: boolean;
}

export const getSortingOptions = (chosenSorting: UrlSorting | null) => {
  const options: SortingOption[] = [
    { label: "Popularity", chosen: false },
    { label: "Name ascending", field: "NAME", direction: "ASC", chosen: false },
    { label: "Name descending", field: "NAME", direction: "DESC", chosen: false },
  ];

  let isChosenSet = false;
  for (const option of options) {
    if (option.field === chosenSorting?.field && option.direction === chosenSorting?.direction) {
      option.chosen = true;
      isChosenSet = true;
      break;
    }
  }
  if (!isChosenSet) {
    options[0].chosen = true;
  }
  return options;
};

export const parseQuerySort = (query: string | null): UrlSorting | null => {
  if (!query) {
    return null;
  }
  const [field, direction] = query.split("_");
  if (!field || !direction) {
    return null;
  }
  const sorting: UrlSorting = {
    field: field as ProductOrderField,
    direction: direction as OrderDirection,
  };

  return sorting;
};

export const serializeQuerySort = (value?: UrlSorting | null) => {
  if (value?.direction && value?.field) {
    return `${value.field}_${value.direction}`;
  }
  return null;
};
