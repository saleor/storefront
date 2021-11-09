import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { ProductCardFragmentFragmentDoc } from '../../fragments/__generated__/ProductCardFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ProductCollectionQueryVariables = Types.Exact<{
  before?: Types.Maybe<Types.Scalars['String']>;
  after?: Types.Maybe<Types.Scalars['String']>;
  filter?: Types.Maybe<Types.ProductFilterInput>;
}>;


export type ProductCollectionQuery = { __typename?: 'Query', products?: { __typename?: 'ProductCountableConnection', totalCount?: number | null | undefined, edges: Array<{ __typename?: 'ProductCountableEdge', cursor: string, node: { __typename?: 'Product', id: string, slug: string, name: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, category?: { __typename?: 'Category', name: string } | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', onSale?: boolean | null | undefined, priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, stop?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined };


export const ProductCollectionDocument = gql`
    query ProductCollection($before: String, $after: String, $filter: ProductFilterInput) {
  products(
    first: 4
    channel: "default-channel"
    after: $after
    before: $before
    filter: $filter
  ) {
    totalCount
    edges {
      cursor
      node {
        ...ProductCardFragment
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    ${ProductCardFragmentFragmentDoc}`;

/**
 * __useProductCollectionQuery__
 *
 * To run a query within a React component, call `useProductCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductCollectionQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useProductCollectionQuery(baseOptions?: Apollo.QueryHookOptions<ProductCollectionQuery, ProductCollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductCollectionQuery, ProductCollectionQueryVariables>(ProductCollectionDocument, options);
      }
export function useProductCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductCollectionQuery, ProductCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductCollectionQuery, ProductCollectionQueryVariables>(ProductCollectionDocument, options);
        }
export type ProductCollectionQueryHookResult = ReturnType<typeof useProductCollectionQuery>;
export type ProductCollectionLazyQueryHookResult = ReturnType<typeof useProductCollectionLazyQuery>;
export type ProductCollectionQueryResult = Apollo.QueryResult<ProductCollectionQuery, ProductCollectionQueryVariables>;