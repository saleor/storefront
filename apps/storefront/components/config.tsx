import { gql } from "@apollo/client";

export const PageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    startCursor
    endCursor
  }
`;

export const ProductPaths = gql`
  query ProductPaths($after: String) {
    products(first: 50, channel: "default-channel", after: $after) {
      edges {
        cursor
        node {
          id
        }
      }
    }
  }
`;

export const Products = gql`
  ${PageInfoFragment}
  query Products($before: String, $after: String) {
    products(
      first: 8
      channel: "default-channel"
      after: $after
      before: $before
    ) {
      edges {
        cursor
        node {
          id
          name
          thumbnail {
            url
          }
          category {
            name
          }
          variants {
            id
            name
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                }
              }
              stop {
                gross {
                  amount
                }
              }
            }
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const TShirtProducts = gql`
  query TShirtProducts {
    products(
      first: 12
      channel: "default-channel"
      filter: { search: "t-shirt" }
    ) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          category {
            name
          }
        }
      }
    }
  }
`;

export const FilterProducts = gql`
  query FilterProducts($filter: ProductFilterInput!, $sortBy: ProductOrder) {
    products(
      first: 12
      channel: "default-channel"
      filter: $filter
      sortBy: $sortBy
    ) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          category {
            name
          }
        }
      }
    }
  }
`;

export const ProductByID = gql`
  query ProductByID($id: ID!) {
    product(id: $id, channel: "default-channel") {
      id
      name
      description
      category {
        name
      }
      variants {
        id
        name
      }
      pricing {
        priceRange {
          start {
            gross {
              amount
            }
          }
        }
      }
      media {
        url
      }
      thumbnail {
        url
      }
      category {
        name
      }
    }
  }
`;

export const CreateCheckout = gql`
  mutation CreateCheckout {
    checkoutCreate(
      input: {
        channel: "default-channel"
        email: "customer@example.com"
        lines: []
      }
    ) {
      checkout {
        id
        token
      }
      errors {
        field
        code
      }
    }
  }
`;

export const AddProductToCheckout = gql`
  mutation AddProductToCheckout($checkoutId: UUID!, $variantId: ID!) {
    checkoutLinesAdd(
      token: $checkoutId
      lines: [{ quantity: 1, variantId: $variantId }]
    ) {
      checkout {
        lines {
          id
          quantity
        }
        totalPrice {
          gross {
            currency
            amount
          }
        }
      }
      errors {
        message
      }
    }
  }
`;

export const RemoveProductFromCheckout = gql`
  mutation RemoveProductFromCheckout($checkoutId: UUID!, $lineId: ID!) {
    checkoutLineDelete(token: $checkoutId, lineId: $lineId) {
      checkout {
        lines {
          id
          variant {
            id
          }
          quantity
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CheckoutDetailsFragment = gql`
  fragment CheckoutDetailsFragment on Checkout {
    lines {
      id
      variant {
        product {
          name
          thumbnail {
            url
          }
        }
        name
      }
    }
    subtotalPrice {
      net {
        amount
      }
      tax {
        amount
      }
    }
    shippingPrice {
      gross {
        amount
      }
    }
    totalPrice {
      gross {
        amount
      }
    }
  }
`;

export const CheckoutByID = gql`
  ${CheckoutDetailsFragment}
  query CheckoutByID($checkoutId: UUID!) {
    checkout(token: $checkoutId) {
      ...CheckoutDetailsFragment
    }
  }
`;
