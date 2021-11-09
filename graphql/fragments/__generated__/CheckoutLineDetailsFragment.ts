import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { PriceFragmentFragmentDoc } from './PriceFragment';
import { ImageFragmentFragmentDoc } from './ImageFragment';
export type CheckoutLineDetailsFragmentFragment = { __typename?: 'CheckoutLine', id: string, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } };

export const CheckoutLineDetailsFragmentFragmentDoc = gql`
    fragment CheckoutLineDetailsFragment on CheckoutLine {
  id
  totalPrice {
    gross {
      ...PriceFragment
    }
  }
  variant {
    id
    product {
      id
      name
      slug
      thumbnail {
        ...ImageFragment
      }
    }
    pricing {
      price {
        gross {
          ...PriceFragment
        }
      }
    }
    name
  }
}
    ${PriceFragmentFragmentDoc}
${ImageFragmentFragmentDoc}`;