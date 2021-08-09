export const Products = /* GraphQL */`
  query Products($before: String, $after: String) {
    products(first: 4, channel: "default-channel", after: $after, before: $before) {
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
      thumbnail {
        url
      }
      category {
        name
      }
    }
  }
`;
