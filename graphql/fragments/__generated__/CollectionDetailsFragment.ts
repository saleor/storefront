import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CollectionBasicFragmentFragmentDoc } from './CollectionBasicFragment';
import { ImageFragmentFragmentDoc } from './ImageFragment';
export type CollectionDetailsFragmentFragment = { __typename?: 'Collection', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: any | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined };

export const CollectionDetailsFragmentFragmentDoc = gql`
    fragment CollectionDetailsFragment on Collection {
  id
  ...CollectionBasicFragment
  seoTitle
  seoDescription
  description
  backgroundImage {
    ...ImageFragment
  }
}
    ${CollectionBasicFragmentFragmentDoc}
${ImageFragmentFragmentDoc}`;