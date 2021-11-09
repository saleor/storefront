import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type CollectionBasicFragmentFragment = { __typename?: 'Collection', id: string, name: string, slug: string };

export const CollectionBasicFragmentFragmentDoc = gql`
    fragment CollectionBasicFragment on Collection {
  id
  name
  slug
}
    `;