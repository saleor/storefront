import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type ImageFragmentFragment = { __typename?: 'Image', url: string, alt?: string | null | undefined };

export const ImageFragmentFragmentDoc = gql`
    fragment ImageFragment on Image {
  url
  alt
}
    `;