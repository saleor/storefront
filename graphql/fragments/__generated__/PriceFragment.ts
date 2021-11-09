import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type PriceFragmentFragment = { __typename?: 'Money', currency: string, amount: number, localizedAmount: string };

export const PriceFragmentFragmentDoc = gql`
    fragment PriceFragment on Money {
  currency
  amount
  localizedAmount @client
}
    `;