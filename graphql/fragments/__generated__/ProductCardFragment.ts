import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { ImageFragmentFragmentDoc } from './ImageFragment';
import { PriceFragmentFragmentDoc } from './PriceFragment';
export type ProductCardFragmentFragment = { __typename?: 'Product', id: string, slug: string, name: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, category?: { __typename?: 'Category', name: string } | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', onSale?: boolean | null | undefined, priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, stop?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined };

export const ProductCardFragmentFragmentDoc = gql`
    fragment ProductCardFragment on Product {
  id
  slug
  name
  thumbnail {
    ...ImageFragment
  }
  category {
    name
  }
  pricing {
    onSale
    priceRange {
      start {
        gross {
          ...PriceFragment
        }
      }
      stop {
        gross {
          ...PriceFragment
        }
      }
    }
  }
}
    ${ImageFragmentFragmentDoc}
${PriceFragmentFragmentDoc}`;