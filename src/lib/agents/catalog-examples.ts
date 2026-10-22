/** Small public queries, validated against the configured Saleor schema and exercised anonymously. */
export const catalogSearchQuery = `query AgentSearch($channel: String!, $search: String, $after: String) {
  products(first: 10, after: $after, channel: $channel, filter: { search: $search }) {
    edges {
      node {
        id name slug isAvailable
        pricing { priceRange { start { gross { amount currency } } } }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

export const catalogProductQuery = `query AgentProduct($channel: String!, $id: ID!, $after: String) {
  product(id: $id, channel: $channel) {
    id name slug description isAvailable
    productVariants(first: 50, after: $after) {
      edges {
        node {
          id name sku quantityAvailable
          attributes { attribute { name } values { name } }
          pricing { price { gross { amount currency } } }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;
