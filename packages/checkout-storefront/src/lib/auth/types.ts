export type Fetch = typeof fetch;

export interface TokenRefreshResponse {
  data: {
    tokenRefresh: {
      token: string | undefined;
      errors: any[];
    };
  };
}

export interface TokenCreateResponse {
  data: {
    tokenCreate: {
      token: string | undefined;
      refreshToken: string | undefined;
      errors: any[];
    };
  };
}
