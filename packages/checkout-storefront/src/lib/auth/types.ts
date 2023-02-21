export type Fetch = typeof fetch;

export interface TokenCreateVariables {
  email: string;
  password: string;
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

export interface TokenRefreshVariables {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  data: {
    tokenRefresh: {
      token: string | undefined;
      errors: any[];
    };
  };
}

export interface PasswordResetVariables {
  email: string;
  password: string;
  token: string;
}

export interface PasswordResetResponse {
  data: {
    setPassword: {
      token: string | undefined;
      refreshToken: string | undefined;
      errors: any[];
    };
  };
}

export interface CustomerDetachVariables {
  checkoutId: string;
}

export interface CustomerDetachResponse {
  data: {
    checkoutCustomerDetach: {
      errors: any[];
    };
  };
}
