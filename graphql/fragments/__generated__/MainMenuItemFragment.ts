import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type MainMenuItemFragmentFragment = { __typename?: 'MenuItem', name: string, children?: Array<{ __typename?: 'MenuItem', name: string, category?: { __typename?: 'Category', slug: string } | null | undefined, collection?: { __typename?: 'Collection', slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, title: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, slug: string, created: any, content?: any | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export const MainMenuItemFragmentFragmentDoc = gql`
    fragment MainMenuItemFragment on MenuItem {
  name
  children {
    name
    category {
      slug
    }
    collection {
      slug
    }
    page {
      id
      title
      seoTitle
      seoDescription
      slug
      created
      content
    }
  }
}
    `;