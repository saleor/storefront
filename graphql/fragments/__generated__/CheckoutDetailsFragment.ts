import * as Types from '../../types.generated';

import { gql } from '@apollo/client';
import { AddressDetailsFragmentFragmentDoc } from './AdressDetailsFragment';
import { DeliveryMethodFragmentFragmentDoc } from './DeliveryMethodFragment';
import { PriceFragmentFragmentDoc } from './PriceFragment';
import { CheckoutLineDetailsFragmentFragmentDoc } from './CheckoutLineDetailsFragment';
export type CheckoutDetailsFragmentFragment = { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined };

export const CheckoutDetailsFragmentFragmentDoc = gql`
    fragment CheckoutDetailsFragment on Checkout {
  id
  token
  email
  billingAddress {
    ...AddressDetailsFragment
  }
  shippingAddress {
    ...AddressDetailsFragment
  }
  shippingMethod {
    ...DeliveryMethodFragment
  }
  isShippingRequired
  availableShippingMethods {
    ...DeliveryMethodFragment
  }
  availablePaymentGateways {
    id
    name
    config {
      field
      value
    }
  }
  lines {
    ...CheckoutLineDetailsFragment
  }
  discount {
    ...PriceFragment
  }
  discountName
  subtotalPrice {
    net {
      ...PriceFragment
    }
    tax {
      ...PriceFragment
    }
  }
  shippingPrice {
    gross {
      ...PriceFragment
    }
  }
  totalPrice {
    gross {
      ...PriceFragment
    }
  }
}
    ${AddressDetailsFragmentFragmentDoc}
${DeliveryMethodFragmentFragmentDoc}
${CheckoutLineDetailsFragmentFragmentDoc}
${PriceFragmentFragmentDoc}`;