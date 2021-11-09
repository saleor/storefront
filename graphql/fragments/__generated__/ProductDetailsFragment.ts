import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CategoryBasicFragmentFragmentDoc } from './CategoryBasicFragment';
import { PriceFragmentFragmentDoc } from './PriceFragment';
import { ProductMediaFragmentFragmentDoc } from './ProductMediaFragment';
import { ImageFragmentFragmentDoc } from './ImageFragment';
export type ProductDetailsFragmentFragment = { __typename?: 'Product', id: string, name: string, slug: string, description?: any | null | undefined, seoDescription?: string | null | undefined, seoTitle?: string | null | undefined, isAvailableForPurchase?: boolean | null | undefined, category?: { __typename?: 'Category', name: string, id: string, slug: string } | null | undefined, variants?: Array<{ __typename?: 'ProductVariant', id: string, name: string, quantityAvailable: number } | null | undefined> | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: Types.ProductMediaType }> | null | undefined, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined };

export const ProductDetailsFragmentFragmentDoc = gql`
    fragment ProductDetailsFragment on Product {
  id
  name
  slug
  description
  seoDescription
  seoTitle
  isAvailableForPurchase
  category {
    ...CategoryBasicFragment
  }
  variants {
    id
    name
    quantityAvailable
  }
  pricing {
    priceRange {
      start {
        gross {
          ...PriceFragment
        }
      }
    }
  }
  media {
    ...ProductMediaFragment
  }
  thumbnail {
    ...ImageFragment
  }
  category {
    name
  }
}
    ${CategoryBasicFragmentFragmentDoc}
${PriceFragmentFragmentDoc}
${ProductMediaFragmentFragmentDoc}
${ImageFragmentFragmentDoc}`;