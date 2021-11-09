import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { CategoryBasicFragmentFragmentDoc } from './CategoryBasicFragment';
import { ImageFragmentFragmentDoc } from './ImageFragment';
export type CategoryDetailsFragmentFragment = { __typename?: 'Category', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: any | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, ancestors?: { __typename?: 'CategoryCountableConnection', edges: Array<{ __typename?: 'CategoryCountableEdge', node: { __typename?: 'Category', id: string, name: string, slug: string } }> } | null | undefined };

export const CategoryDetailsFragmentFragmentDoc = gql`
    fragment CategoryDetailsFragment on Category {
  id
  ...CategoryBasicFragment
  seoTitle
  seoDescription
  description
  backgroundImage {
    ...ImageFragment
  }
  ancestors(first: 5) {
    edges {
      node {
        ...CategoryBasicFragment
      }
    }
  }
}
    ${CategoryBasicFragmentFragmentDoc}
${ImageFragmentFragmentDoc}`;