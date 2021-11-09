import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { ProductDetailsFragmentFragmentDoc } from '../../fragments/__generated__/ProductDetailsFragment';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ProductBySlugQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;


export type ProductBySlugQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, slug: string, description?: any | null | undefined, seoDescription?: string | null | undefined, seoTitle?: string | null | undefined, isAvailableForPurchase?: boolean | null | undefined, category?: { __typename?: 'Category', name: string, id: string, slug: string } | null | undefined, variants?: Array<{ __typename?: 'ProductVariant', id: string, name: string, quantityAvailable: number } | null | undefined> | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: Types.ProductMediaType }> | null | undefined, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined } | null | undefined };


export const ProductBySlugDocument = gql`
    query ProductBySlug($slug: String!) {
  product(slug: $slug, channel: "default-channel") {
    ...ProductDetailsFragment
  }
}
    ${ProductDetailsFragmentFragmentDoc}`;

/**
 * __useProductBySlugQuery__
 *
 * To run a query within a React component, call `useProductBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useProductBySlugQuery(baseOptions: Apollo.QueryHookOptions<ProductBySlugQuery, ProductBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductBySlugQuery, ProductBySlugQueryVariables>(ProductBySlugDocument, options);
      }
export function useProductBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductBySlugQuery, ProductBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductBySlugQuery, ProductBySlugQueryVariables>(ProductBySlugDocument, options);
        }
export type ProductBySlugQueryHookResult = ReturnType<typeof useProductBySlugQuery>;
export type ProductBySlugLazyQueryHookResult = ReturnType<typeof useProductBySlugLazyQuery>;
export type ProductBySlugQueryResult = Apollo.QueryResult<ProductBySlugQuery, ProductBySlugQueryVariables>;