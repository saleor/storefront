# Authentication flow

## SaleorAuthClient

Most of the authentication flow is managed to by a vanilla JS class SaleorAuthClient. You can create an instance providing a couple of props:

```javascript
interface SaleorAuthClientProps {
  saleorApiUrl: string;
  onAuthRefresh?: (isAuthenticating: boolean) => void;
  storage: Storage;
}
```

`saleorApiUrl` is required so the auth module can refresh access token on its own.

## How do I tell my graphql client to use authentication?

SaleorAuthClient class provdies an `fetchWithAuth` method, that you should pass to your graphql client. That'll ensure that once user signs in, every request will be authenticated.

```javascript
const { authFetch } = new SaleorAuthClient(clientProps);

createClient({
  ...clientOptions,
  fetch: authFetch,
});
```

## How do I tell React that the authentication is happening?

#### **`useSaleorAuthClient({ saleorApiUrl, storage, onAuthRefresh }: UseSaleorAuthClientProps) => SaleorAuthClientProps`**

On top of taking part in react component lifecycle, because the client sets event listeners on the window, we need to remove those once we're done. Hence we're proving an `useSaleorAuthClient` hook that does exactly that. It takes up the same props as `SaleorAuthClient` and returns the instance of SaleorAuthClient along with isAuthenticating prop.

```javascript
const { saleorAuthClient, isAuthenticating } = useSaleorAuthClient({
  saleorApiUrl: "https://master.staging.saleor.cloud",
  storage: window.localStorage,
});
```

## How do I use the auth without prop drilling?

#### **`SaleorAuthProvider({ saleorAuthClient, isAuthenticating, children }: PropsWithChildren<UseSaleorAuthClient>) => JSX.Element`**

The hook is supposed to be used only in the root of your project. If you'd like to access the client methods or isAuthenticating prop down the tree without extensive prop drilling, you can use `SaleorAuthProvider` passing it down the return value of useSaleorAuthClient hook.

```jsx
const saleorAuthClientData = useSaleorAuthClient(authClientProps)

<SaleorAuthProvider {...saleorAuthClientData}>
    {...}
</SaleorAuthProvider>
```

---

#### **`useSaleorAuthContext() => SaleorAuthContextConsumerProps`**

The provider also equips you with `useSaleorAuthContext` hook

```javascript
const { isAuthenticating, signIn, signOut, checkoutSignOut } = useSaleorAuthContext();
```

## How do I tell my graphql client to refresh queries on signIn / signOut?

#### **`useAuthChange({ onSignedIn, onSignedOut }: UseAuthChangeProps) => void`**

Once the successful sign in or sign out happens, as well as failed authentication (for e.g when refresh token is expired and there's no way to obtain a new access token from the api) you'll probably want to trigger some actions. Hence we're provided a `useAuthChange` hook that'll listen to storage changes and trigger callbacks.

```javascript
  useAuthChange({
    onSignedOut: () => { /* client invalidate some queries */},
    onSignedIn: () => { /* client invalidate some queries  */}
    },
  });
```

## How do I sign in?

#### **`SaleorAuthClient.signIn: ({ email, password }: TokenCreateVariables) => Promise<TokenCreateResponse>`**

SaleorAuthClient returns a `signIn` method. You can also access it via the **useSaleorAuthContext** hook.

```javascript
const { signIn } = useSaleorAuthContext();

const response = await signIn({
  email: "example@mail.com",
  passowrd: "password",
});
```

## How do I sign out?

#### **`SaleorAuthClient.signOut: () => void`**

This method will remove access and refresh tokens from SaleorAuthClient state and storage. It'll also trigger sign out event, which in turn will trigger [onSignOut method of useAuthChange hook](#how-do-i-tell-my-graphql-client-to-refresh-queries-on-signin--signout)

```javascript
const { signOut } = useSaleorAuthContext();

signOut();
```

⚠️ For checkout sign out see [signing out in checkout](#how-do-i-sign-out-in-checkout)

## How do I sign out in checkout?

#### **`SaleorAuthClient.checkoutSignOut: ({ checkoutId }: CustomerDetachVariables) => Promise<CustomerDetachResponse>`**

On top of the regular sign out login, in checkout we need to start signing out process with detaching customer from checkout. Since detach requires a signed in user, it'll happen first and removing tokens from state / storage will only happen if the mutation returned success:

```javascript
const { checkoutSignOut } = useSaleorAuthContext();

const response = await checkoutSignOut({ checkoutId: checkout.id });
```

## How does auth handle resetting password?

#### **`SaleorAuthClient.resetPassword: ({ email, password, token }: PasswordResetVariables) => Promise<PasswordResetResponse>`**

SaleorAuthClient class provides you with a reset password method. If the reset password mutation is successful, it'll log you in automatically just like after a regular sign in. The [onSignIn method of useAuthChange hook](#how-do-i-tell-my-graphql-client-to-refresh-queries-on-signin--signout) will also be triggered.

```javascript
const { resetPassword } = useSaleorAuthContext();

const response = await resetPassword({
  email: "example@mail.com",
  password: "newPassword",
  token: "apiToken",
});
```

## How do I use this with Urql?

Once an authentication change happens, you might want to refetch some of your queries. Because Urql doesn't provide a direct way to invalidate cache manually, we're following urql's [proposed approach](https://github.com/urql-graphql/urql/issues/297#issuecomment-501646761) of installing a new instance of the client in place of the old one. We have a hook for that called `useUrqlClient` that takes Urql `ClientOptions` as an only argument and returns the current `urqlClient` and `resetClient` function:

```javascript
const { urqlClient, resetClient } = useUrqlClient({
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

### How to put it all together?

```jsx
export const App = () => {
  const { saleorApiUrl } = getQueryParams();
  const { locale, messages } = useLocale();
  const saleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl,
    storage: localStorage,
  });

  const { saleorAuthClient } = saleorAuthClientProps;

  const { urqlClient, resetClient } = useUrqlClient({
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

### How do I use it with Apollo?

We have a hook for that called useApolloClient that authenticated fetch as its only argument and returns the current client and resetClient function

```javascript
const { apolloClient, resetClient } = useApolloClient(saleorAuthClient.fetchWithAuth);
```

Becasue we're using the client to also retrieve unauthenticated data in SSR, we separated them into two - one for SSR, that can be used outside of React flow, and the other returned by our hook.

```javascript
export const staticApolloClient = new ApolloClient({
  link: createHttpLink({ uri: API_URI }),
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: true,
});

export const useApolloClient = (fetchWithAuth: Fetch) => {
  const httpLink = createHttpLink({
    uri: API_URI,
    fetch: fetchWithAuth,
  });

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({ typePolicies }),
      }),
    []
  );

  return { apolloClient, resetClient: () => apolloClient.resetStore() };
};
```

Once you get the client with authenticated fetch, you'll want to pass the `resetClient` function to the useAuthChange hook

```javascript
useAuthChange({
  storage,
  onSignedOut: () => resetClient(),
  onSignedIn: () => resetClient(),
});
```

```jsx
export const App = () => {
  const { saleorApiUrl } = getQueryParams();
  const saleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl,
    storage: localStorage,
  });

  const { saleorAuthClient } = saleorAuthClientProps;

  const { apolloClient, resetClient } = useApolloClient(saleorAuthClient.fetchWithAuth);

  useAuthChange({
    onSignedOut: () => resetClient(),
    onSignedIn: () => resetClient(),
  });

  return (
    <SaleorAuthProvider {...saleorAuthClientProps}>
      <ApolloProvider value={apolloClient}>
        <Home />
      </ApolloProvider>
    </SaleorAuthProvider>
  );
};
```
