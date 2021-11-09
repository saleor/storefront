import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type MenuItemFragmentFragment = { __typename?: 'MenuItem', id: string, name: string, category?: { __typename?: 'Category', id: string, slug: string } | null | undefined, collection?: { __typename?: 'Collection', id: string, slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, slug: string, content?: any | null | undefined } | null | undefined };

export const MenuItemFragmentFragmentDoc = gql`
    fragment MenuItemFragment on MenuItem {
  id
  name
  category {
    id
    slug
  }
  collection {
    id
    slug
  }
  page {
    id
    slug
    content
  }
}
    `;