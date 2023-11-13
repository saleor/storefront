import messages from "@/components/translations";
import { OrderDirection, ProductOrderField } from "@/saleor/api";
import { useIntl } from "react-intl";

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

export const useSortingOptions = (chosenSorting: UrlSorting | null) => {
  const t = useIntl();

  const getSortingOptions = () => {
    const options: SortingOption[] = [
      {
        label: t.formatMessage(messages.popularity),
        field: "RATING",
        direction: "DESC",
        chosen: false,
      },
      {
        label: t.formatMessage(messages.priceMinMax),
        field: "PRICE",
        direction: "ASC",
        chosen: false,
      },
      {
        label: t.formatMessage(messages.priceMaxMin),
        field: "PRICE",
        direction: "DESC",
        chosen: false,
      },
      {
        label: t.formatMessage(messages.nameAscending),
        field: "NAME",
        direction: "ASC",
        chosen: false,
      },
      {
        label: t.formatMessage(messages.nameDescending),
        field: "NAME",
        direction: "DESC",
        chosen: false,
      },
      {
        label: t.formatMessage(messages.updatedAscending),
        field: "DATE",
        direction: "ASC",
        chosen: false,
      },
      {
        label: t.formatMessage(messages.updatedDescending),
        field: "DATE",
        direction: "DESC",
        chosen: false,
      },
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
  return getSortingOptions();
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

export const generateProductEndings = (count: number) => {
  if (count === 1) {
    return `1 produkt`;
  } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return `${count} produkty`;
  } else {
    return `${count} produktów`;
  }
};
