import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { PriceFragmentFragmentDoc } from './PriceFragment';
export type OrderDetailsFragmentFragment = { __typename?: 'Order', id: string, token: string, created: any, number?: string | null | undefined, status: Types.OrderStatus, total: { __typename?: 'TaxedMoney', currency: string, gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } };

export const OrderDetailsFragmentFragmentDoc = gql`
    fragment OrderDetailsFragment on Order {
  id
  token
  created
  number
  status
  total {
    currency
    gross {
      ...PriceFragment
    }
    net {
      ...PriceFragment
    }
  }
}
    ${PriceFragmentFragmentDoc}`;