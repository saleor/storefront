export const Products = /* GraphQL */`
  query Products($before: String, $after: String) {
    products(first: 8, channel: "default-channel", after: $after, before: $before) {
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
    }
  }
`;

export const TShirtProducts = /* GraphQL */`
  query TShirtProducts {
    products(first: 12, channel: "default-channel", filter: { search: "t-shirt" }) {
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

export const FilterProducts = /* GraphQL */`
  query FilterProducts($filter: ProductFilterInput!, $sortBy: ProductOrder) {
    products(first: 12, channel: "default-channel", filter: $filter, sortBy: $sortBy) {
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

export const ProductByID = /* GraphQL */`
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

export const CreateCheckout = /* GraphQL */`
  mutation CreateCheckout {
    checkoutCreate(
      input: {
        channel: "default-channel",
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


export const AddProductToCheckout = /* GraphQL */`
  mutation AddProductToCheckout($checkoutId: UUID!, $variantId: ID!) {
    checkoutLinesAdd(
      token: $checkoutId,
      lines: [{ quantity: 1, variantId: $variantId }]
    ) {
      checkout {
        lines{
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

export const CheckoutByID = /* GraphQL */`
  query CheckoutByID($checkoutId: UUID!) {
    checkout(token: $checkoutId) {
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
  }
`;
