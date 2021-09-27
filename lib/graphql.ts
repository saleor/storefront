import { typePolicies } from "./typePolicies";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://vercel.saleor.cloud/graphql/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = "";
  if (process.browser) {
    // Client-side-only code
    token = localStorage.getItem("saleorAuthToken") || "";
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: typeof window === "undefined",
});

export default apolloClient;
