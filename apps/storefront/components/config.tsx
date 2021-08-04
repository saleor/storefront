export const LatestProducts = /* GraphQL */`
  query LatestProducts {
    products(first: 12, channel: "default-channel") {
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
