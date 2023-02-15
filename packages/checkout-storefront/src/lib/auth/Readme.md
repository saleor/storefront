# Authentication flow

## SaleorAuthClient

Most of the authentication flow is managed to by a vanilla JS class SaleorAuthClient. You can create an instance providing a couple of props:

```javascript
interface SaleorAuthClientProps {
  saleorApiUrl: string;
  onAuthRefresh?: (isAuthenticating: boolean) => void;
  storage?: Storage;
}
```

`saleorApiUrl` is required so the auth module can refresh access token on its own.

### Providing authenticated fetch to a graphql client

The class provdies an `fetchWithAuth` method, that can be passed down to a graphql client of choice:

```javascript
const { authFetch } = new SaleorAuthClient(clientProps);

createClient({
  ...clientOptions,
  fetch: authFetch,
});
```

### Using saleor auth client hook

We want to have an `isAuthenticating` prop that'll cause rerenders. On top of that, because the client sets event listeners on the window, we need to remove those once we're done. Hence we're proving an `useSaleorAuthClient` hook that does exactly that. It takes up the same props as `SaleorAuthClient` and returns the instance of SaleorAuthClient along with isAuthenticating prop.

```javascript
const { client, isAuthenticating } = useSaleorAuthClient({
  saleorApiUrl: "https://master.staging.saleor.cloud",
  storage: window.localStorage,
});
```

### Using saleor auth provider

The hook is supposed to be used only in the root of your project. If you'd like to access the client methods or isAuthenticating prop down the tree without extensive prop drilling, you can use `SaleorAuthProvider` passing it down the return value of useSaleorAuthClient hook.

```jsx
const saleorAuthClientData = useSaleorAuthClient(authClientProps)

<SaleorAuthProvider {...saleorAuthClientData}>
    {...}
</SaleorAuthProvider>
```

The provider also equips you with `useSaleorAuthContext` hook

```javascript
const { isAuthenticating } = useSaleorAuthContext();
```

### Using saleor auth change hook

Once the successful sign in or sign out happens, as well as failed authentication (for e.g when refresh token is expired and there's no way to obtain a new access token from the api) you'll probably want to trigger some actions. Hence we're provided a `useAuthChange` hook that'll listen to storage changes and trigger callbacks.

```javascript
  useAuthChange({
    onSignedOut: () => { /* client invalidate some queries */},
    onSignedIn: () => { /* client invalidate some queries  */}
    },
  });
```

## Usage with Urql

Once an authentication change happens, you might want to refetch some of your queries. Because Urql doesn't provide a direct way to invalidate cache manually, we're following urql's [proposed approach](https://github.com/urql-graphql/urql/issues/297#issuecomment-501646761) of installing a new instance of the client in place of the old one. We have a hook for that called `useUrqlClient` that takes Urql `ClientOptions` as an only argument and returns the current `client` and `resetClient` function:

```javascript
const { client, resetClient } = useUrqlClient({
  url: saleorApiUrl,
  fetch: saleorAuthClient.fetchWithAuth,
  // other client props
});
```

Then, you'll want to pass the `resetClient` function to the useAuthChange hook

```javascript
useAuthChange({
  storage,
  onSignedOut: () => resetClient(),
  onSignedIn: () => resetClient(),
});
```

## How to put it all together?

Example with Urql:

```jsx
export const App = () => {
  const { saleorApiUrl } = getQueryParams();
  const { locale, messages } = useLocale();
  const saleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl,
    storage: localStorage,
  });

  const { saleorAuthClient } = saleorAuthClientProps;

  const { client: urqlClient, resetClient } = useUrqlClient({
    suspense: true,
    requestPolicy: "cache-first",
    url: saleorApiUrl,
    fetch: saleorAuthClient.fetchWithAuth,
  });

  useAuthChange({
    onSignedOut: () => resetClient(),
    onSignedIn: () => resetClient(),
  });

  return (
    <SaleorAuthProvider {...saleorAuthClientProps}>
      <UrqlProvider value={urqlClient}>
        <Home />
      </UrqlProvider>
    </SaleorAuthProvider>
  );
};
```
