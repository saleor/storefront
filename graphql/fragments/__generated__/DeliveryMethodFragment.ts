import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { PriceFragmentFragmentDoc } from './PriceFragment';
export type DeliveryMethodFragmentFragment = { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined };

export const DeliveryMethodFragmentFragmentDoc = gql`
    fragment DeliveryMethodFragment on ShippingMethod {
  id
  name
  price {
    ...PriceFragment
  }
  minimumDeliveryDays
  maximumDeliveryDays
}
    ${PriceFragmentFragmentDoc}`;