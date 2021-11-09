import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
export type AddressDetailsFragmentFragment = { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } };

export const AddressDetailsFragmentFragmentDoc = gql`
    fragment AddressDetailsFragment on Address {
  id
  phone
  firstName
  lastName
  streetAddress1
  city
  postalCode
  isDefaultBillingAddress
  isDefaultShippingAddress
  country {
    code
    country
  }
}
    `;