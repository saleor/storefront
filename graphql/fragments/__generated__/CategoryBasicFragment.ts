import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type CategoryBasicFragmentFragment = { __typename?: 'Category', id: string, name: string, slug: string };

export const CategoryBasicFragmentFragmentDoc = gql`
    fragment CategoryBasicFragment on Category {
  id
  name
  slug
}
    `;