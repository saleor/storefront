import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type ProductMediaFragmentFragment = { __typename?: 'ProductMedia', url: string, alt: string, type: Types.ProductMediaType };

export const ProductMediaFragmentFragmentDoc = gql`
    fragment ProductMediaFragment on ProductMedia {
  url
  alt
  type
}
    `;