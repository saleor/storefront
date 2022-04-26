// THIS FILE IS GENERATED WITH `pnpm generate`
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
  JSONString: string;
  /**
   * Positive Decimal scalar implementation.
   *
   * Should be used in places where value must be positive.
   */
  PositiveDecimal: any;
  UUID: string;
  /** Variables of this type must be set to null in mutations. They will be replaced with a filename from a following multipart part containing a binary file. See: https://github.com/jaydenseric/graphql-multipart-request-spec. */
  Upload: any;
  WeightScalar: any;
  /** _Any value scalar as defined by Federation spec. */
  _Any: any;
};

/** Create a new address for the customer. */
export type AccountAddressCreate = {
  __typename?: 'AccountAddressCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was created. */
  user?: Maybe<User>;
};

/** Delete an address of the logged-in user. */
export type AccountAddressDelete = {
  __typename?: 'AccountAddressDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was deleted. */
  user?: Maybe<User>;
};

/** Updates an address of the logged-in user. */
export type AccountAddressUpdate = {
  __typename?: 'AccountAddressUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user object for which the address was edited. */
  user?: Maybe<User>;
};

/** Remove user account. */
export type AccountDelete = {
  __typename?: 'AccountDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

export type AccountError = {
  __typename?: 'AccountError';
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
  /** The error code. */
  code: AccountErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type AccountErrorCode =
  | 'ACCOUNT_NOT_CONFIRMED'
  | 'ACTIVATE_OWN_ACCOUNT'
  | 'ACTIVATE_SUPERUSER_ACCOUNT'
  | 'CHANNEL_INACTIVE'
  | 'DEACTIVATE_OWN_ACCOUNT'
  | 'DEACTIVATE_SUPERUSER_ACCOUNT'
  | 'DELETE_NON_STAFF_USER'
  | 'DELETE_OWN_ACCOUNT'
  | 'DELETE_STAFF_ACCOUNT'
  | 'DELETE_SUPERUSER_ACCOUNT'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INACTIVE'
  | 'INVALID'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_PASSWORD'
  | 'JWT_DECODE_ERROR'
  | 'JWT_INVALID_CSRF_TOKEN'
  | 'JWT_INVALID_TOKEN'
  | 'JWT_MISSING_TOKEN'
  | 'JWT_SIGNATURE_EXPIRED'
  | 'LEFT_NOT_MANAGEABLE_PERMISSION'
  | 'MISSING_CHANNEL_SLUG'
  | 'NOT_FOUND'
  | 'OUT_OF_SCOPE_GROUP'
  | 'OUT_OF_SCOPE_PERMISSION'
  | 'OUT_OF_SCOPE_USER'
  | 'PASSWORD_ENTIRELY_NUMERIC'
  | 'PASSWORD_TOO_COMMON'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_TOO_SIMILAR'
  | 'REQUIRED'
  | 'UNIQUE';

export type AccountInput = {
  /** Billing address of the customer. */
  defaultBillingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: InputMaybe<AddressInput>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
};

/** Register a new user. */
export type AccountRegister = {
  __typename?: 'AccountRegister';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** Informs whether users need to confirm their email address. */
  requiresConfirmation?: Maybe<Scalars['Boolean']>;
  user?: Maybe<User>;
};

export type AccountRegisterInput = {
  /** Slug of a channel which will be used to notify users. Optional when only one channel exists. */
  channel?: InputMaybe<Scalars['String']>;
  /** The email address of the user. */
  email: Scalars['String'];
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** User public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** Password. */
  password: Scalars['String'];
  /** Base of frontend URL that will be needed to create confirmation URL. */
  redirectUrl?: InputMaybe<Scalars['String']>;
};

/** Sends an email with the account removal link for the logged-in user. */
export type AccountRequestDeletion = {
  __typename?: 'AccountRequestDeletion';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Sets a default address for the authenticated user. */
export type AccountSetDefaultAddress = {
  __typename?: 'AccountSetDefaultAddress';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** Updates the account of the logged-in user. */
export type AccountUpdate = {
  __typename?: 'AccountUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

/** Represents user address data. */
export type Address = Node & {
  __typename?: 'Address';
  city: Scalars['String'];
  cityArea: Scalars['String'];
  companyName: Scalars['String'];
  /** Shop's default country. */
  country: CountryDisplay;
  countryArea: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  /** Address is user's default billing address. */
  isDefaultBillingAddress?: Maybe<Scalars['Boolean']>;
  /** Address is user's default shipping address. */
  isDefaultShippingAddress?: Maybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  streetAddress1: Scalars['String'];
  streetAddress2: Scalars['String'];
};

/** Creates user address. */
export type AddressCreate = {
  __typename?: 'AddressCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was created. */
  user?: Maybe<User>;
};

/** Deletes an address. */
export type AddressDelete = {
  __typename?: 'AddressDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was deleted. */
  user?: Maybe<User>;
};

export type AddressInput = {
  /** City. */
  city?: InputMaybe<Scalars['String']>;
  /** District. */
  cityArea?: InputMaybe<Scalars['String']>;
  /** Company or organization. */
  companyName?: InputMaybe<Scalars['String']>;
  /** Country. */
  country?: InputMaybe<CountryCode>;
  /** State or province. */
  countryArea?: InputMaybe<Scalars['String']>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** Phone number. */
  phone?: InputMaybe<Scalars['String']>;
  /** Postal code. */
  postalCode?: InputMaybe<Scalars['String']>;
  /** Address. */
  streetAddress1?: InputMaybe<Scalars['String']>;
  /** Address. */
  streetAddress2?: InputMaybe<Scalars['String']>;
};

/** Sets a default address for the given user. */
export type AddressSetDefault = {
  __typename?: 'AddressSetDefault';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** An enumeration. */
export type AddressTypeEnum =
  | 'BILLING'
  | 'SHIPPING';

/** Updates an address. */
export type AddressUpdate = {
  __typename?: 'AddressUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user object for which the address was edited. */
  user?: Maybe<User>;
};

export type AddressValidationData = {
  __typename?: 'AddressValidationData';
  addressFormat?: Maybe<Scalars['String']>;
  addressLatinFormat?: Maybe<Scalars['String']>;
  allowedFields?: Maybe<Array<Maybe<Scalars['String']>>>;
  cityAreaChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  cityAreaType?: Maybe<Scalars['String']>;
  cityChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  cityType?: Maybe<Scalars['String']>;
  countryAreaChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  countryAreaType?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  postalCodeExamples?: Maybe<Array<Maybe<Scalars['String']>>>;
  postalCodeMatchers?: Maybe<Array<Maybe<Scalars['String']>>>;
  postalCodePrefix?: Maybe<Scalars['String']>;
  postalCodeType?: Maybe<Scalars['String']>;
  requiredFields?: Maybe<Array<Maybe<Scalars['String']>>>;
  upperFields?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Represents allocation. */
export type Allocation = Node & {
  __typename?: 'Allocation';
  id: Scalars['ID'];
  /** Quantity allocated for orders. */
  quantity: Scalars['Int'];
  /** The warehouse were items were allocated. */
  warehouse: Warehouse;
};

/** Represents app data. */
export type App = Node & ObjectWithMetadata & {
  __typename?: 'App';
  /** Description of this app. */
  aboutApp?: Maybe<Scalars['String']>;
  /** JWT token used to authenticate by thridparty app. */
  accessToken?: Maybe<Scalars['String']>;
  /** Url to iframe with the app. */
  appUrl?: Maybe<Scalars['String']>;
  /** Url to iframe with the configuration for the app. */
  configurationUrl?: Maybe<Scalars['String']>;
  /** The date and time when the app was created. */
  created?: Maybe<Scalars['DateTime']>;
  /** Description of the data privacy defined for this app. */
  dataPrivacy?: Maybe<Scalars['String']>;
  /** Url to details about the privacy policy on the app owner page. */
  dataPrivacyUrl?: Maybe<Scalars['String']>;
  /** New in Saleor 3.1. App's dashboard extensions. Note: this feature is in a preview state and can be subject to changes at later point. */
  extensions: Array<AppExtension>;
  /** Homepage of the app. */
  homepageUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Determine if app will be set active or not. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Name of the app. */
  name?: Maybe<Scalars['String']>;
  /** List of the app's permissions. */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Support page for the app. */
  supportUrl?: Maybe<Scalars['String']>;
  /** Last 4 characters of the tokens. */
  tokens?: Maybe<Array<Maybe<AppToken>>>;
  /** Type of the app. */
  type?: Maybe<AppTypeEnum>;
  /** Version number of the app. */
  version?: Maybe<Scalars['String']>;
  /** List of webhooks assigned to this app. */
  webhooks?: Maybe<Array<Maybe<Webhook>>>;
};

/** Activate the app. */
export type AppActivate = {
  __typename?: 'AppActivate';
  app?: Maybe<App>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

export type AppCountableConnection = {
  __typename?: 'AppCountableConnection';
  edges: Array<AppCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AppCountableEdge = {
  __typename?: 'AppCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: App;
};

/** Creates a new app. */
export type AppCreate = {
  __typename?: 'AppCreate';
  app?: Maybe<App>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  /** The newly created authentication token. */
  authToken?: Maybe<Scalars['String']>;
  errors: Array<AppError>;
};

/** Deactivate the app. */
export type AppDeactivate = {
  __typename?: 'AppDeactivate';
  app?: Maybe<App>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

/** Deletes an app. */
export type AppDelete = {
  __typename?: 'AppDelete';
  app?: Maybe<App>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

/** Delete failed installation. */
export type AppDeleteFailedInstallation = {
  __typename?: 'AppDeleteFailedInstallation';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
  errors: Array<AppError>;
};

export type AppError = {
  __typename?: 'AppError';
  /** The error code. */
  code: AppErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of permissions which causes the error. */
  permissions?: Maybe<Array<PermissionEnum>>;
};

/** An enumeration. */
export type AppErrorCode =
  | 'FORBIDDEN'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'INVALID_MANIFEST_FORMAT'
  | 'INVALID_PERMISSION'
  | 'INVALID_STATUS'
  | 'INVALID_URL_FORMAT'
  | 'MANIFEST_URL_CANT_CONNECT'
  | 'NOT_FOUND'
  | 'OUT_OF_SCOPE_APP'
  | 'OUT_OF_SCOPE_PERMISSION'
  | 'REQUIRED'
  | 'UNIQUE';

/** Represents app data. */
export type AppExtension = Node & {
  __typename?: 'AppExtension';
  /** JWT token used to authenticate by thridparty app extension. */
  accessToken?: Maybe<Scalars['String']>;
  app: App;
  id: Scalars['ID'];
  /** Label of the extension to show in the dashboard. */
  label: Scalars['String'];
  /** Place where given extension will be mounted. */
  mount: AppExtensionMountEnum;
  /** List of the app extension's permissions. */
  permissions: Array<Permission>;
  /** Type of way how app extension will be opened. */
  target: AppExtensionTargetEnum;
  /** URL of a view where extension's iframe is placed. */
  url: Scalars['String'];
};

export type AppExtensionCountableConnection = {
  __typename?: 'AppExtensionCountableConnection';
  edges: Array<AppExtensionCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AppExtensionCountableEdge = {
  __typename?: 'AppExtensionCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: AppExtension;
};

export type AppExtensionFilterInput = {
  mount?: InputMaybe<Array<InputMaybe<AppExtensionMountEnum>>>;
  target?: InputMaybe<AppExtensionTargetEnum>;
};

/** All places where app extension can be mounted. */
export type AppExtensionMountEnum =
  | 'NAVIGATION_CATALOG'
  | 'NAVIGATION_CUSTOMERS'
  | 'NAVIGATION_DISCOUNTS'
  | 'NAVIGATION_ORDERS'
  | 'NAVIGATION_PAGES'
  | 'NAVIGATION_TRANSLATIONS'
  | 'PRODUCT_DETAILS_MORE_ACTIONS'
  | 'PRODUCT_OVERVIEW_CREATE'
  | 'PRODUCT_OVERVIEW_MORE_ACTIONS';

/**
 * All available ways of opening an app extension.
 *
 *     POPUP - app's extension will be mounted as a popup window
 *     APP_PAGE - redirect to app's page
 *
 */
export type AppExtensionTargetEnum =
  | 'APP_PAGE'
  | 'POPUP';

/** Fetch and validate manifest. */
export type AppFetchManifest = {
  __typename?: 'AppFetchManifest';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  manifest?: Maybe<Manifest>;
};

export type AppFilterInput = {
  isActive?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<AppTypeEnum>;
};

export type AppInput = {
  /** Name of the app. */
  name?: InputMaybe<Scalars['String']>;
  /** List of permission code names to assign to this app. */
  permissions?: InputMaybe<Array<InputMaybe<PermissionEnum>>>;
};

/** Install new app by using app manifest. */
export type AppInstall = {
  __typename?: 'AppInstall';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
  errors: Array<AppError>;
};

export type AppInstallInput = {
  /** Determine if app will be set active or not. */
  activateAfterInstallation?: InputMaybe<Scalars['Boolean']>;
  /** Name of the app to install. */
  appName?: InputMaybe<Scalars['String']>;
  /** Url to app's manifest in JSON format. */
  manifestUrl?: InputMaybe<Scalars['String']>;
  /** List of permission code names to assign to this app. */
  permissions?: InputMaybe<Array<InputMaybe<PermissionEnum>>>;
};

/** Represents ongoing installation of app. */
export type AppInstallation = Job & Node & {
  __typename?: 'AppInstallation';
  appName: Scalars['String'];
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  manifestUrl: Scalars['String'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** Job status. */
  status: JobStatusEnum;
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
};

export type AppManifestExtension = {
  __typename?: 'AppManifestExtension';
  /** Label of the extension to show in the dashboard. */
  label: Scalars['String'];
  /** Place where given extension will be mounted. */
  mount: AppExtensionMountEnum;
  /** List of the app extension's permissions. */
  permissions: Array<Permission>;
  /** Type of way how app extension will be opened. */
  target: AppExtensionTargetEnum;
  /** URL of a view where extension's iframe is placed. */
  url: Scalars['String'];
};

/** Retry failed installation of new app. */
export type AppRetryInstall = {
  __typename?: 'AppRetryInstall';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
  errors: Array<AppError>;
};

export type AppSortField =
  /** Sort apps by creation date. */
  | 'CREATION_DATE'
  /** Sort apps by name. */
  | 'NAME';

export type AppSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort apps by the selected field. */
  field: AppSortField;
};

/** Represents token data. */
export type AppToken = Node & {
  __typename?: 'AppToken';
  /** Last 4 characters of the token. */
  authToken?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Name of the authenticated token. */
  name?: Maybe<Scalars['String']>;
};

/** Creates a new token. */
export type AppTokenCreate = {
  __typename?: 'AppTokenCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  appToken?: Maybe<AppToken>;
  /** The newly created authentication token. */
  authToken?: Maybe<Scalars['String']>;
  errors: Array<AppError>;
};

/** Deletes an authentication token assigned to app. */
export type AppTokenDelete = {
  __typename?: 'AppTokenDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  appToken?: Maybe<AppToken>;
  errors: Array<AppError>;
};

export type AppTokenInput = {
  /** ID of app. */
  app: Scalars['ID'];
  /** Name of the token. */
  name?: InputMaybe<Scalars['String']>;
};

/** Verify provided app token. */
export type AppTokenVerify = {
  __typename?: 'AppTokenVerify';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  /** Determine if token is valid or not. */
  valid: Scalars['Boolean'];
};

/** Enum determining type of your App. */
export type AppTypeEnum =
  /** Local Saleor App. The app is fully manageable from dashboard. You can change assigned permissions, add webhooks, or authentication token */
  | 'LOCAL'
  /** Third party external App. Installation is fully automated. Saleor uses a defined App manifest to gather all required information. */
  | 'THIRDPARTY';

/** Updates an existing app. */
export type AppUpdate = {
  __typename?: 'AppUpdate';
  app?: Maybe<App>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

/** An enumeration. */
export type AreaUnitsEnum =
  | 'SQ_CM'
  | 'SQ_FT'
  | 'SQ_INCH'
  | 'SQ_KM'
  | 'SQ_M'
  | 'SQ_YD';

/** Assigns storefront's navigation menus. */
export type AssignNavigation = {
  __typename?: 'AssignNavigation';
  errors: Array<MenuError>;
  /** Assigned navigation menu. */
  menu?: Maybe<Menu>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

/** New in Saleor 3.1. Represents assigned attribute to variant with variant selection attached. */
export type AssignedVariantAttribute = {
  __typename?: 'AssignedVariantAttribute';
  /** Attribute assigned to variant. */
  attribute: Attribute;
  /** Determines, whether assigned attribute is allowed for variant selection. Supported variant types for variant selection are: ['dropdown', 'boolean', 'swatch', 'numeric'] */
  variantSelection: Scalars['Boolean'];
};

/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type Attribute = Node & ObjectWithMetadata & {
  __typename?: 'Attribute';
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid: Scalars['Boolean'];
  /** List of attribute's values. */
  choices?: Maybe<AttributeValueCountableConnection>;
  /** The entity type which can be used as a reference. */
  entityType?: Maybe<AttributeEntityTypeEnum>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard: Scalars['Boolean'];
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront: Scalars['Boolean'];
  id: Scalars['ID'];
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: Maybe<AttributeInputTypeEnum>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Name of an attribute displayed in the interface. */
  name?: Maybe<Scalars['String']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  productTypes: ProductTypeCountableConnection;
  productVariantTypes: ProductTypeCountableConnection;
  /** Internal representation of an attribute name. */
  slug?: Maybe<Scalars['String']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition: Scalars['Int'];
  /** Returns translated attribute fields for the given language code. */
  translation?: Maybe<AttributeTranslation>;
  /** The attribute type. */
  type?: Maybe<AttributeTypeEnum>;
  /** The unit of attribute values. */
  unit?: Maybe<MeasurementUnitsEnum>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired: Scalars['Boolean'];
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront: Scalars['Boolean'];
  /** Flag indicating that attribute has predefined choices. */
  withChoices: Scalars['Boolean'];
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeChoicesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AttributeValueFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<AttributeChoicesSortingInput>;
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeProductTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeProductVariantTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes attributes. */
export type AttributeBulkDelete = {
  __typename?: 'AttributeBulkDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<AttributeError>;
};

export type AttributeChoicesSortField =
  /** Sort attribute choice by name. */
  | 'NAME'
  /** Sort attribute choice by slug. */
  | 'SLUG';

export type AttributeChoicesSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attribute choices by the selected field. */
  field: AttributeChoicesSortField;
};

export type AttributeCountableConnection = {
  __typename?: 'AttributeCountableConnection';
  edges: Array<AttributeCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AttributeCountableEdge = {
  __typename?: 'AttributeCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Attribute;
};

/** Creates an attribute. */
export type AttributeCreate = {
  __typename?: 'AttributeCreate';
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

export type AttributeCreateInput = {
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
  /** The entity type which can be used as a reference. */
  entityType?: InputMaybe<AttributeEntityTypeEnum>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront?: InputMaybe<Scalars['Boolean']>;
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: InputMaybe<AttributeInputTypeEnum>;
  /** Whether the attribute is for variants only. */
  isVariantOnly?: InputMaybe<Scalars['Boolean']>;
  /** Name of an attribute displayed in the interface. */
  name: Scalars['String'];
  /** Internal representation of an attribute name. */
  slug?: InputMaybe<Scalars['String']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition?: InputMaybe<Scalars['Int']>;
  /** The attribute type. */
  type: AttributeTypeEnum;
  /** The unit of attribute values. */
  unit?: InputMaybe<MeasurementUnitsEnum>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired?: InputMaybe<Scalars['Boolean']>;
  /** List of attribute's values. */
  values?: InputMaybe<Array<InputMaybe<AttributeValueCreateInput>>>;
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront?: InputMaybe<Scalars['Boolean']>;
};

/** Deletes an attribute. */
export type AttributeDelete = {
  __typename?: 'AttributeDelete';
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

/** An enumeration. */
export type AttributeEntityTypeEnum =
  | 'PAGE'
  | 'PRODUCT';

export type AttributeError = {
  __typename?: 'AttributeError';
  /** The error code. */
  code: AttributeErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type AttributeErrorCode =
  | 'ALREADY_EXISTS'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type AttributeFilterInput = {
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
  /**
   * Specifies the channel by which the data should be filtered.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  filterableInDashboard?: InputMaybe<Scalars['Boolean']>;
  filterableInStorefront?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  inCategory?: InputMaybe<Scalars['ID']>;
  inCollection?: InputMaybe<Scalars['ID']>;
  isVariantOnly?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<AttributeTypeEnum>;
  valueRequired?: InputMaybe<Scalars['Boolean']>;
  visibleInStorefront?: InputMaybe<Scalars['Boolean']>;
};

export type AttributeInput = {
  /** The boolean value of the attribute. */
  boolean?: InputMaybe<Scalars['Boolean']>;
  /** The date range that the returned values should be in. */
  date?: InputMaybe<DateRangeInput>;
  /** The date time range that the returned values should be in. */
  dateTime?: InputMaybe<DateTimeRangeInput>;
  /** Internal representation of an attribute name. */
  slug: Scalars['String'];
  /** Internal representation of a value (unique per attribute). */
  values?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** The range that the returned values should be in. */
  valuesRange?: InputMaybe<IntRangeInput>;
};

/** An enumeration. */
export type AttributeInputTypeEnum =
  | 'BOOLEAN'
  | 'DATE'
  | 'DATE_TIME'
  | 'DROPDOWN'
  | 'FILE'
  | 'MULTISELECT'
  | 'NUMERIC'
  | 'REFERENCE'
  | 'RICH_TEXT'
  | 'SWATCH';

/** Reorder the values of an attribute. */
export type AttributeReorderValues = {
  __typename?: 'AttributeReorderValues';
  /** Attribute from which values are reordered. */
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

export type AttributeSortField =
  /** Sort attributes based on whether they can be displayed or not in a product grid. */
  | 'AVAILABLE_IN_GRID'
  /** Sort attributes by the filterable in dashboard flag */
  | 'FILTERABLE_IN_DASHBOARD'
  /** Sort attributes by the filterable in storefront flag */
  | 'FILTERABLE_IN_STOREFRONT'
  /** Sort attributes by the variant only flag */
  | 'IS_VARIANT_ONLY'
  /** Sort attributes by name */
  | 'NAME'
  /** Sort attributes by slug */
  | 'SLUG'
  /** Sort attributes by their position in storefront */
  | 'STOREFRONT_SEARCH_POSITION'
  /** Sort attributes by the value required flag */
  | 'VALUE_REQUIRED'
  /** Sort attributes by visibility in the storefront */
  | 'VISIBLE_IN_STOREFRONT';

export type AttributeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attributes by the selected field. */
  field: AttributeSortField;
};

export type AttributeTranslatableContent = Node & {
  __typename?: 'AttributeTranslatableContent';
  /**
   * Custom attribute of a product.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  attribute?: Maybe<Attribute>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Returns translated attribute fields for the given language code. */
  translation?: Maybe<AttributeTranslation>;
};


export type AttributeTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for an attribute. */
export type AttributeTranslate = {
  __typename?: 'AttributeTranslate';
  attribute?: Maybe<Attribute>;
  errors: Array<TranslationError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type AttributeTranslation = Node & {
  __typename?: 'AttributeTranslation';
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
};

/** An enumeration. */
export type AttributeTypeEnum =
  | 'PAGE_TYPE'
  | 'PRODUCT_TYPE';

/** Updates attribute. */
export type AttributeUpdate = {
  __typename?: 'AttributeUpdate';
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

export type AttributeUpdateInput = {
  /** New values to be created for this attribute. */
  addValues?: InputMaybe<Array<InputMaybe<AttributeValueUpdateInput>>>;
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute is for variants only. */
  isVariantOnly?: InputMaybe<Scalars['Boolean']>;
  /** Name of an attribute displayed in the interface. */
  name?: InputMaybe<Scalars['String']>;
  /** IDs of values to be removed from this attribute. */
  removeValues?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Internal representation of an attribute name. */
  slug?: InputMaybe<Scalars['String']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition?: InputMaybe<Scalars['Int']>;
  /** The unit of attribute values. */
  unit?: InputMaybe<MeasurementUnitsEnum>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired?: InputMaybe<Scalars['Boolean']>;
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront?: InputMaybe<Scalars['Boolean']>;
};

/** Represents a value of an attribute. */
export type AttributeValue = Node & {
  __typename?: 'AttributeValue';
  /** Represents the boolean value of the attribute value. */
  boolean?: Maybe<Scalars['Boolean']>;
  /** Represents the date value of the attribute value. */
  date?: Maybe<Scalars['Date']>;
  /** Represents the date time value of the attribute value. */
  dateTime?: Maybe<Scalars['DateTime']>;
  /** Represents file URL and content type (if attribute value is a file). */
  file?: Maybe<File>;
  id: Scalars['ID'];
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: Maybe<AttributeInputTypeEnum>;
  /** Name of a value displayed in the interface. */
  name?: Maybe<Scalars['String']>;
  /** The ID of the attribute reference. */
  reference?: Maybe<Scalars['ID']>;
  /** Represents the text (JSON) of the attribute value. */
  richText?: Maybe<Scalars['JSONString']>;
  /** Internal representation of a value (unique per attribute). */
  slug?: Maybe<Scalars['String']>;
  /** Returns translated attribute value fields for the given language code. */
  translation?: Maybe<AttributeValueTranslation>;
  /** Represent value of the attribute value (e.g. color values for swatch attributes). */
  value?: Maybe<Scalars['String']>;
};


/** Represents a value of an attribute. */
export type AttributeValueTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes values of attributes. */
export type AttributeValueBulkDelete = {
  __typename?: 'AttributeValueBulkDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<AttributeError>;
};

export type AttributeValueCountableConnection = {
  __typename?: 'AttributeValueCountableConnection';
  edges: Array<AttributeValueCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AttributeValueCountableEdge = {
  __typename?: 'AttributeValueCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: AttributeValue;
};

/** Creates a value for an attribute. */
export type AttributeValueCreate = {
  __typename?: 'AttributeValueCreate';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
  errors: Array<AttributeError>;
};

export type AttributeValueCreateInput = {
  /** File content type. */
  contentType?: InputMaybe<Scalars['String']>;
  /** URL of the file attribute. Every time, a new value is created. */
  fileUrl?: InputMaybe<Scalars['String']>;
  /** Name of a value displayed in the interface. */
  name: Scalars['String'];
  /** Represents the text (JSON) of the attribute value. */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Represent value of the attribute value (e.g. color values for swatch attributes). */
  value?: InputMaybe<Scalars['String']>;
};

/** Deletes a value of an attribute. */
export type AttributeValueDelete = {
  __typename?: 'AttributeValueDelete';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
  errors: Array<AttributeError>;
};

export type AttributeValueFilterInput = {
  search?: InputMaybe<Scalars['String']>;
};

export type AttributeValueInput = {
  /** Represents the boolean value of the attribute value. */
  boolean?: InputMaybe<Scalars['Boolean']>;
  /** File content type. */
  contentType?: InputMaybe<Scalars['String']>;
  /** Represents the date value of the attribute value. */
  date?: InputMaybe<Scalars['Date']>;
  /** Represents the date time value of the attribute value. */
  dateTime?: InputMaybe<Scalars['DateTime']>;
  /** URL of the file attribute. Every time, a new value is created. */
  file?: InputMaybe<Scalars['String']>;
  /** ID of the selected attribute. */
  id?: InputMaybe<Scalars['ID']>;
  /** List of entity IDs that will be used as references. */
  references?: InputMaybe<Array<Scalars['ID']>>;
  /** Text content in JSON format. */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** The value or slug of an attribute to resolve. If the passed value is non-existent, it will be created. */
  values?: InputMaybe<Array<Scalars['String']>>;
};

export type AttributeValueTranslatableContent = Node & {
  __typename?: 'AttributeValueTranslatableContent';
  /**
   * Represents a value of an attribute.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  attributeValue?: Maybe<AttributeValue>;
  id: Scalars['ID'];
  name: Scalars['String'];
  richText?: Maybe<Scalars['JSONString']>;
  /** Returns translated attribute value fields for the given language code. */
  translation?: Maybe<AttributeValueTranslation>;
};


export type AttributeValueTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for an attribute value. */
export type AttributeValueTranslate = {
  __typename?: 'AttributeValueTranslate';
  attributeValue?: Maybe<AttributeValue>;
  errors: Array<TranslationError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type AttributeValueTranslation = Node & {
  __typename?: 'AttributeValueTranslation';
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
  richText?: Maybe<Scalars['JSONString']>;
};

export type AttributeValueTranslationInput = {
  name?: InputMaybe<Scalars['String']>;
  richText?: InputMaybe<Scalars['JSONString']>;
};

/** Updates value of an attribute. */
export type AttributeValueUpdate = {
  __typename?: 'AttributeValueUpdate';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  attributeErrors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
  errors: Array<AttributeError>;
};

export type AttributeValueUpdateInput = {
  /** File content type. */
  contentType?: InputMaybe<Scalars['String']>;
  /** URL of the file attribute. Every time, a new value is created. */
  fileUrl?: InputMaybe<Scalars['String']>;
  /** Name of a value displayed in the interface. */
  name?: InputMaybe<Scalars['String']>;
  /** Represents the text (JSON) of the attribute value. */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Represent value of the attribute value (e.g. color values for swatch attributes). */
  value?: InputMaybe<Scalars['String']>;
};

export type BulkAttributeValueInput = {
  /** The boolean value of an attribute to resolve. If the passed value is non-existent, it will be created. */
  boolean?: InputMaybe<Scalars['Boolean']>;
  /** ID of the selected attribute. */
  id?: InputMaybe<Scalars['ID']>;
  /** The value or slug of an attribute to resolve. If the passed value is non-existent, it will be created. */
  values?: InputMaybe<Array<Scalars['String']>>;
};

export type BulkProductError = {
  __typename?: 'BulkProductError';
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of channel IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: ProductErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** Index of an input list item that caused the error. */
  index?: Maybe<Scalars['Int']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
  /** List of warehouse IDs which causes the error. */
  warehouses?: Maybe<Array<Scalars['ID']>>;
};

export type BulkStockError = {
  __typename?: 'BulkStockError';
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: ProductErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** Index of an input list item that caused the error. */
  index?: Maybe<Scalars['Int']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
};

export type CardInput = {
  /** Payment method nonce, a token returned by the appropriate provider's SDK. */
  code: Scalars['String'];
  /** Card security code. */
  cvc?: InputMaybe<Scalars['String']>;
  /** Information about currency and amount. */
  money: MoneyInput;
};

export type CatalogueInput = {
  /** Categories related to the discount. */
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Collections related to the discount. */
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Products related to the discount. */
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** New in Saleor 3.1. Product variant related to the discount. */
  variants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type Category = Node & ObjectWithMetadata & {
  __typename?: 'Category';
  /** List of ancestors of the category. */
  ancestors?: Maybe<CategoryCountableConnection>;
  backgroundImage?: Maybe<Image>;
  /** List of children of the category. */
  children?: Maybe<CategoryCountableConnection>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the category (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  level: Scalars['Int'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  parent?: Maybe<Category>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of products in the category. */
  products?: Maybe<ProductCountableConnection>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  /** Returns translated category fields for the given language code. */
  translation?: Maybe<CategoryTranslation>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryAncestorsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryBackgroundImageArgs = {
  size?: InputMaybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryChildrenArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes categories. */
export type CategoryBulkDelete = {
  __typename?: 'CategoryBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type CategoryCountableConnection = {
  __typename?: 'CategoryCountableConnection';
  edges: Array<CategoryCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CategoryCountableEdge = {
  __typename?: 'CategoryCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Category;
};

/** Creates a new category. */
export type CategoryCreate = {
  __typename?: 'CategoryCreate';
  category?: Maybe<Category>;
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Deletes a category. */
export type CategoryDelete = {
  __typename?: 'CategoryDelete';
  category?: Maybe<Category>;
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type CategoryFilterInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
};

export type CategoryInput = {
  /** Background image file. */
  backgroundImage?: InputMaybe<Scalars['Upload']>;
  /** Alt text for a product media. */
  backgroundImageAlt?: InputMaybe<Scalars['String']>;
  /** Category description (JSON). */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Category name. */
  name?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Category slug. */
  slug?: InputMaybe<Scalars['String']>;
};

export type CategorySortField =
  /** Sort categories by name. */
  | 'NAME'
  /** Sort categories by product count. */
  | 'PRODUCT_COUNT'
  /** Sort categories by subcategory count. */
  | 'SUBCATEGORY_COUNT';

export type CategorySortingInput = {
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort categories by the selected field. */
  field: CategorySortField;
};

export type CategoryTranslatableContent = Node & {
  __typename?: 'CategoryTranslatableContent';
  /**
   * Represents a single category of products.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  category?: Maybe<Category>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the category (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  /** Returns translated category fields for the given language code. */
  translation?: Maybe<CategoryTranslation>;
};


export type CategoryTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a category. */
export type CategoryTranslate = {
  __typename?: 'CategoryTranslate';
  category?: Maybe<Category>;
  errors: Array<TranslationError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type CategoryTranslation = Node & {
  __typename?: 'CategoryTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the product (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
};

/** Updates a category. */
export type CategoryUpdate = {
  __typename?: 'CategoryUpdate';
  category?: Maybe<Category>;
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Represents channel. */
export type Channel = Node & {
  __typename?: 'Channel';
  currencyCode: Scalars['String'];
  /** New in Saleor 3.1. Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry: CountryDisplay;
  /** Whether a channel has associated orders. */
  hasOrders: Scalars['Boolean'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

/** Activate a channel. */
export type ChannelActivate = {
  __typename?: 'ChannelActivate';
  /** Activated channel. */
  channel?: Maybe<Channel>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

/** Creates new channel. */
export type ChannelCreate = {
  __typename?: 'ChannelCreate';
  channel?: Maybe<Channel>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

export type ChannelCreateInput = {
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /** Currency of the channel. */
  currencyCode: Scalars['String'];
  /** New in Saleor 3.1. Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry: CountryCode;
  /** isActive flag. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Name of the channel. */
  name: Scalars['String'];
  /** Slug of the channel. */
  slug: Scalars['String'];
};

/** Deactivate a channel. */
export type ChannelDeactivate = {
  __typename?: 'ChannelDeactivate';
  /** Deactivated channel. */
  channel?: Maybe<Channel>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

/** Delete a channel. Orders associated with the deleted channel will be moved to the target channel. Checkouts, product availability, and pricing will be removed. */
export type ChannelDelete = {
  __typename?: 'ChannelDelete';
  channel?: Maybe<Channel>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

export type ChannelDeleteInput = {
  /** ID of channel to migrate orders from origin channel. */
  channelId: Scalars['ID'];
};

export type ChannelError = {
  __typename?: 'ChannelError';
  /** The error code. */
  code: ChannelErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of shipping zone IDs which causes the error. */
  shippingZones?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type ChannelErrorCode =
  | 'ALREADY_EXISTS'
  | 'CHANNELS_CURRENCY_MUST_BE_THE_SAME'
  | 'CHANNEL_WITH_ORDERS'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

/** Update a channel. */
export type ChannelUpdate = {
  __typename?: 'ChannelUpdate';
  channel?: Maybe<Channel>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

export type ChannelUpdateInput = {
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /** New in Saleor 3.1. Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry?: InputMaybe<CountryCode>;
  /** isActive flag. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Name of the channel. */
  name?: InputMaybe<Scalars['String']>;
  /** List of shipping zones to unassign from the channel. */
  removeShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /** Slug of the channel. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Checkout object. */
export type Checkout = Node & ObjectWithMetadata & {
  __typename?: 'Checkout';
  /** New in Saleor 3.1. Collection points that can be used for this order. Note: this feature is in a preview state and can be subject to changes at later point. */
  availableCollectionPoints: Array<Warehouse>;
  /** List of available payment gateways. */
  availablePaymentGateways: Array<PaymentGateway>;
  /**
   * Shipping methods that can be used with this checkout.
   * @deprecated This field will be removed in Saleor 4.0. Use `shippingMethods` instead.
   */
  availableShippingMethods: Array<Maybe<ShippingMethod>>;
  billingAddress?: Maybe<Address>;
  channel: Channel;
  created: Scalars['DateTime'];
  /** New in Saleor 3.1. The delivery method selected for this checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
  deliveryMethod?: Maybe<DeliveryMethod>;
  discount?: Maybe<Money>;
  discountName?: Maybe<Scalars['String']>;
  /** Email of a customer. */
  email?: Maybe<Scalars['String']>;
  /** List of gift cards associated with this checkout. */
  giftCards?: Maybe<Array<Maybe<GiftCard>>>;
  id: Scalars['ID'];
  /** Returns True, if checkout requires shipping. */
  isShippingRequired: Scalars['Boolean'];
  /** Checkout language code. */
  languageCode: LanguageCodeEnum;
  lastChange: Scalars['DateTime'];
  /** A list of checkout lines, each containing information about an item in the checkout. */
  lines?: Maybe<Array<Maybe<CheckoutLine>>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  note: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** The number of items purchased. */
  quantity: Scalars['Int'];
  shippingAddress?: Maybe<Address>;
  /**
   * The shipping method related with checkout.
   * @deprecated This field will be removed in Saleor 4.0. Use `deliveryMethod` instead.
   */
  shippingMethod?: Maybe<ShippingMethod>;
  /** Shipping methods that can be used with this checkout. */
  shippingMethods: Array<Maybe<ShippingMethod>>;
  /** The price of the shipping, with all the taxes included. */
  shippingPrice?: Maybe<TaxedMoney>;
  /** New in Saleor 3.1. Date when oldest stock reservation for this checkout  expires or null if no stock is reserved. */
  stockReservationExpires?: Maybe<Scalars['DateTime']>;
  /** The price of the checkout before shipping, with taxes included. */
  subtotalPrice?: Maybe<TaxedMoney>;
  /** The checkout's token. */
  token: Scalars['UUID'];
  /** The sum of the the checkout line prices, with all the taxes,shipping costs, and discounts included. */
  totalPrice?: Maybe<TaxedMoney>;
  translatedDiscountName?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  voucherCode?: Maybe<Scalars['String']>;
};

/** Adds a gift card or a voucher to a checkout. */
export type CheckoutAddPromoCode = {
  __typename?: 'CheckoutAddPromoCode';
  /** The checkout with the added gift card or voucher. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Update billing address in the existing checkout. */
export type CheckoutBillingAddressUpdate = {
  __typename?: 'CheckoutBillingAddressUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Completes the checkout. As a result a new order is created and a payment charge is made. This action requires a successful payment before it can be performed. In case additional confirmation step as 3D secure is required confirmationNeeded flag will be set to True and no order created until payment is confirmed with second call of this mutation. */
export type CheckoutComplete = {
  __typename?: 'CheckoutComplete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  /** Confirmation data used to process additional authorization steps. */
  confirmationData?: Maybe<Scalars['JSONString']>;
  /** Set to true if payment needs to be confirmed before checkout is complete. */
  confirmationNeeded: Scalars['Boolean'];
  errors: Array<CheckoutError>;
  /** Placed order. */
  order?: Maybe<Order>;
};

export type CheckoutCountableConnection = {
  __typename?: 'CheckoutCountableConnection';
  edges: Array<CheckoutCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CheckoutCountableEdge = {
  __typename?: 'CheckoutCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Checkout;
};

/** Create a new checkout. */
export type CheckoutCreate = {
  __typename?: 'CheckoutCreate';
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  /**
   * Whether the checkout was created or the current active one was returned. Refer to checkoutLinesAdd and checkoutLinesUpdate to merge a cart with an active checkout.
   * @deprecated This field will be removed in Saleor 4.0. Always returns `true`.
   */
  created?: Maybe<Scalars['Boolean']>;
  errors: Array<CheckoutError>;
};

export type CheckoutCreateInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** Slug of a channel in which to create a checkout. */
  channel?: InputMaybe<Scalars['String']>;
  /** The customer's email address. */
  email?: InputMaybe<Scalars['String']>;
  /** Checkout language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** A list of checkout lines, each containing information about an item in the checkout. */
  lines: Array<InputMaybe<CheckoutLineInput>>;
  /** The mailing address to where the checkout will be shipped. Note: the address will be ignored if the checkout doesn't contain shippable items. */
  shippingAddress?: InputMaybe<AddressInput>;
};

/** Sets the customer as the owner of the checkout. */
export type CheckoutCustomerAttach = {
  __typename?: 'CheckoutCustomerAttach';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Removes the user assigned as the owner of the checkout. */
export type CheckoutCustomerDetach = {
  __typename?: 'CheckoutCustomerDetach';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** New in Saleor 3.1. Updates the delivery method (shipping method or pick up point) of the checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
export type CheckoutDeliveryMethodUpdate = {
  __typename?: 'CheckoutDeliveryMethodUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  errors: Array<CheckoutError>;
};

/** Updates email address in the existing checkout object. */
export type CheckoutEmailUpdate = {
  __typename?: 'CheckoutEmailUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

export type CheckoutError = {
  __typename?: 'CheckoutError';
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
  /** The error code. */
  code: CheckoutErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** List of line Ids which cause the error. */
  lines?: Maybe<Array<Scalars['ID']>>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of varint IDs which causes the error. */
  variants?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type CheckoutErrorCode =
  | 'BILLING_ADDRESS_NOT_SET'
  | 'CHANNEL_INACTIVE'
  | 'CHECKOUT_NOT_FULLY_PAID'
  | 'DELIVERY_METHOD_NOT_APPLICABLE'
  | 'EMAIL_NOT_SET'
  | 'GIFT_CARD_NOT_APPLICABLE'
  | 'GRAPHQL_ERROR'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID'
  | 'INVALID_SHIPPING_METHOD'
  | 'MISSING_CHANNEL_SLUG'
  | 'NOT_FOUND'
  | 'NO_LINES'
  | 'PAYMENT_ERROR'
  | 'PRODUCT_NOT_PUBLISHED'
  | 'PRODUCT_UNAVAILABLE_FOR_PURCHASE'
  | 'QUANTITY_GREATER_THAN_LIMIT'
  | 'REQUIRED'
  | 'SHIPPING_ADDRESS_NOT_SET'
  | 'SHIPPING_METHOD_NOT_APPLICABLE'
  | 'SHIPPING_METHOD_NOT_SET'
  | 'SHIPPING_NOT_REQUIRED'
  | 'TAX_ERROR'
  | 'UNAVAILABLE_VARIANT_IN_CHANNEL'
  | 'UNIQUE'
  | 'VOUCHER_NOT_APPLICABLE'
  | 'ZERO_QUANTITY';

export type CheckoutFilterInput = {
  channels?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  created?: InputMaybe<DateRangeInput>;
  customer?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
};

/** Update language code in the existing checkout. */
export type CheckoutLanguageCodeUpdate = {
  __typename?: 'CheckoutLanguageCodeUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Represents an item in the checkout. */
export type CheckoutLine = Node & {
  __typename?: 'CheckoutLine';
  id: Scalars['ID'];
  quantity: Scalars['Int'];
  /** Indicates whether the item need to be delivered. */
  requiresShipping?: Maybe<Scalars['Boolean']>;
  /** The sum of the checkout line price, taxes and discounts. */
  totalPrice?: Maybe<TaxedMoney>;
  variant: ProductVariant;
};

export type CheckoutLineCountableConnection = {
  __typename?: 'CheckoutLineCountableConnection';
  edges: Array<CheckoutLineCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CheckoutLineCountableEdge = {
  __typename?: 'CheckoutLineCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: CheckoutLine;
};

/** Deletes a CheckoutLine. */
export type CheckoutLineDelete = {
  __typename?: 'CheckoutLineDelete';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

export type CheckoutLineInput = {
  /** The number of items purchased. */
  quantity: Scalars['Int'];
  /** ID of the product variant. */
  variantId: Scalars['ID'];
};

/** Adds a checkout line to the existing checkout.If line was already in checkout, its quantity will be increased. */
export type CheckoutLinesAdd = {
  __typename?: 'CheckoutLinesAdd';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Deletes checkout lines. */
export type CheckoutLinesDelete = {
  __typename?: 'CheckoutLinesDelete';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  errors: Array<CheckoutError>;
};

/** Updates checkout line in the existing checkout. */
export type CheckoutLinesUpdate = {
  __typename?: 'CheckoutLinesUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Create a new payment for given checkout. */
export type CheckoutPaymentCreate = {
  __typename?: 'CheckoutPaymentCreate';
  /** Related checkout object. */
  checkout?: Maybe<Checkout>;
  errors: Array<PaymentError>;
  /** A newly created payment. */
  payment?: Maybe<Payment>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  paymentErrors: Array<PaymentError>;
};

/** Remove a gift card or a voucher from a checkout. */
export type CheckoutRemovePromoCode = {
  __typename?: 'CheckoutRemovePromoCode';
  /** The checkout with the removed gift card or voucher. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Update shipping address in the existing checkout. */
export type CheckoutShippingAddressUpdate = {
  __typename?: 'CheckoutShippingAddressUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Updates the shipping method of the checkout. */
export type CheckoutShippingMethodUpdate = {
  __typename?: 'CheckoutShippingMethodUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

export type CheckoutSortField =
  /** Sort checkouts by creation date. */
  | 'CREATION_DATE'
  /** Sort checkouts by customer. */
  | 'CUSTOMER'
  /** Sort checkouts by payment. */
  | 'PAYMENT';

export type CheckoutSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort checkouts by the selected field. */
  field: CheckoutSortField;
};

export type ChoiceValue = {
  __typename?: 'ChoiceValue';
  raw?: Maybe<Scalars['String']>;
  verbose?: Maybe<Scalars['String']>;
};

/** Represents a collection of products. */
export type Collection = Node & ObjectWithMetadata & {
  __typename?: 'Collection';
  backgroundImage?: Maybe<Image>;
  /** Channel given to retrieve this collection. Also used by federation gateway to resolve this object in a federated query. */
  channel?: Maybe<Scalars['String']>;
  /** List of channels in which the collection is available. */
  channelListings?: Maybe<Array<CollectionChannelListing>>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the collection (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of products in this collection. */
  products?: Maybe<ProductCountableConnection>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  /** Returns translated collection fields for the given language code. */
  translation?: Maybe<CollectionTranslation>;
};


/** Represents a collection of products. */
export type CollectionBackgroundImageArgs = {
  size?: InputMaybe<Scalars['Int']>;
};


/** Represents a collection of products. */
export type CollectionProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProductFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ProductOrder>;
};


/** Represents a collection of products. */
export type CollectionTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Adds products to a collection. */
export type CollectionAddProducts = {
  __typename?: 'CollectionAddProducts';
  /** Collection to which products will be added. */
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

/** Deletes collections. */
export type CollectionBulkDelete = {
  __typename?: 'CollectionBulkDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<CollectionError>;
};

/** Represents collection channel listing. */
export type CollectionChannelListing = Node & {
  __typename?: 'CollectionChannelListing';
  channel: Channel;
  id: Scalars['ID'];
  isPublished: Scalars['Boolean'];
  publicationDate?: Maybe<Scalars['Date']>;
};

export type CollectionChannelListingError = {
  __typename?: 'CollectionChannelListingError';
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: ProductErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
};

/** Manage collection's availability in channels. */
export type CollectionChannelListingUpdate = {
  __typename?: 'CollectionChannelListingUpdate';
  /** An updated collection instance. */
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionChannelListingErrors: Array<CollectionChannelListingError>;
  errors: Array<CollectionChannelListingError>;
};

export type CollectionChannelListingUpdateInput = {
  /** List of channels to which the collection should be assigned. */
  addChannels?: InputMaybe<Array<PublishableChannelListingInput>>;
  /** List of channels from which the collection should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

export type CollectionCountableConnection = {
  __typename?: 'CollectionCountableConnection';
  edges: Array<CollectionCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CollectionCountableEdge = {
  __typename?: 'CollectionCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Collection;
};

/** Creates a new collection. */
export type CollectionCreate = {
  __typename?: 'CollectionCreate';
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

export type CollectionCreateInput = {
  /** Background image file. */
  backgroundImage?: InputMaybe<Scalars['Upload']>;
  /** Alt text for an image. */
  backgroundImageAlt?: InputMaybe<Scalars['String']>;
  /** Description of the collection (JSON). */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Informs whether a collection is published. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Name of the collection. */
  name?: InputMaybe<Scalars['String']>;
  /** List of products to be added to the collection. */
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: InputMaybe<Scalars['Date']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Slug of the collection. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Deletes a collection. */
export type CollectionDelete = {
  __typename?: 'CollectionDelete';
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

export type CollectionError = {
  __typename?: 'CollectionError';
  /** The error code. */
  code: CollectionErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of products IDs which causes the error. */
  products?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type CollectionErrorCode =
  | 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type CollectionFilterInput = {
  /**
   * Specifies the channel by which the data should be filtered.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  published?: InputMaybe<CollectionPublished>;
  search?: InputMaybe<Scalars['String']>;
};

export type CollectionInput = {
  /** Background image file. */
  backgroundImage?: InputMaybe<Scalars['Upload']>;
  /** Alt text for an image. */
  backgroundImageAlt?: InputMaybe<Scalars['String']>;
  /** Description of the collection (JSON). */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Informs whether a collection is published. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Name of the collection. */
  name?: InputMaybe<Scalars['String']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: InputMaybe<Scalars['Date']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Slug of the collection. */
  slug?: InputMaybe<Scalars['String']>;
};

export type CollectionPublished =
  | 'HIDDEN'
  | 'PUBLISHED';

/** Remove products from a collection. */
export type CollectionRemoveProducts = {
  __typename?: 'CollectionRemoveProducts';
  /** Collection from which products will be removed. */
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

/** Reorder the products of a collection. */
export type CollectionReorderProducts = {
  __typename?: 'CollectionReorderProducts';
  /** Collection from which products are reordered. */
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

export type CollectionSortField =
  /** Sort collections by availability. */
  | 'AVAILABILITY'
  /** Sort collections by name. */
  | 'NAME'
  /** Sort collections by product count. */
  | 'PRODUCT_COUNT'
  /** Sort collections by publication date. */
  | 'PUBLICATION_DATE';

export type CollectionSortingInput = {
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort collections by the selected field. */
  field: CollectionSortField;
};

export type CollectionTranslatableContent = Node & {
  __typename?: 'CollectionTranslatableContent';
  /**
   * Represents a collection of products.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  collection?: Maybe<Collection>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the collection (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  /** Returns translated collection fields for the given language code. */
  translation?: Maybe<CollectionTranslation>;
};


export type CollectionTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a collection. */
export type CollectionTranslate = {
  __typename?: 'CollectionTranslate';
  collection?: Maybe<Collection>;
  errors: Array<TranslationError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type CollectionTranslation = Node & {
  __typename?: 'CollectionTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the product (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
};

/** Updates a collection. */
export type CollectionUpdate = {
  __typename?: 'CollectionUpdate';
  collection?: Maybe<Collection>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

/** Stores information about a single configuration field. */
export type ConfigurationItem = {
  __typename?: 'ConfigurationItem';
  /** Help text for the field. */
  helpText?: Maybe<Scalars['String']>;
  /** Label for the field. */
  label?: Maybe<Scalars['String']>;
  /** Name of the field. */
  name: Scalars['String'];
  /** Type of the field. */
  type?: Maybe<ConfigurationTypeFieldEnum>;
  /** Current value of the field. */
  value?: Maybe<Scalars['String']>;
};

export type ConfigurationItemInput = {
  /** Name of the field to update. */
  name: Scalars['String'];
  /** Value of the given field to update. */
  value?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export type ConfigurationTypeFieldEnum =
  | 'BOOLEAN'
  | 'MULTILINE'
  | 'OUTPUT'
  | 'PASSWORD'
  | 'SECRET'
  | 'SECRETMULTILINE'
  | 'STRING';

/** Confirm user account with token sent by email during registration. */
export type ConfirmAccount = {
  __typename?: 'ConfirmAccount';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An activated user account. */
  user?: Maybe<User>;
};

/** Confirm the email change of the logged-in user. */
export type ConfirmEmailChange = {
  __typename?: 'ConfirmEmailChange';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** A user instance with a new email. */
  user?: Maybe<User>;
};

/** An enumeration. */
export type CountryCode =
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AI'
  | 'AL'
  | 'AM'
  | 'AO'
  | 'AQ'
  | 'AR'
  | 'AS'
  | 'AT'
  | 'AU'
  | 'AW'
  | 'AX'
  | 'AZ'
  | 'BA'
  | 'BB'
  | 'BD'
  | 'BE'
  | 'BF'
  | 'BG'
  | 'BH'
  | 'BI'
  | 'BJ'
  | 'BL'
  | 'BM'
  | 'BN'
  | 'BO'
  | 'BQ'
  | 'BR'
  | 'BS'
  | 'BT'
  | 'BV'
  | 'BW'
  | 'BY'
  | 'BZ'
  | 'CA'
  | 'CC'
  | 'CD'
  | 'CF'
  | 'CG'
  | 'CH'
  | 'CI'
  | 'CK'
  | 'CL'
  | 'CM'
  | 'CN'
  | 'CO'
  | 'CR'
  | 'CU'
  | 'CV'
  | 'CW'
  | 'CX'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DJ'
  | 'DK'
  | 'DM'
  | 'DO'
  | 'DZ'
  | 'EC'
  | 'EE'
  | 'EG'
  | 'EH'
  | 'ER'
  | 'ES'
  | 'ET'
  | 'EU'
  | 'FI'
  | 'FJ'
  | 'FK'
  | 'FM'
  | 'FO'
  | 'FR'
  | 'GA'
  | 'GB'
  | 'GD'
  | 'GE'
  | 'GF'
  | 'GG'
  | 'GH'
  | 'GI'
  | 'GL'
  | 'GM'
  | 'GN'
  | 'GP'
  | 'GQ'
  | 'GR'
  | 'GS'
  | 'GT'
  | 'GU'
  | 'GW'
  | 'GY'
  | 'HK'
  | 'HM'
  | 'HN'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IL'
  | 'IM'
  | 'IN'
  | 'IO'
  | 'IQ'
  | 'IR'
  | 'IS'
  | 'IT'
  | 'JE'
  | 'JM'
  | 'JO'
  | 'JP'
  | 'KE'
  | 'KG'
  | 'KH'
  | 'KI'
  | 'KM'
  | 'KN'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KY'
  | 'KZ'
  | 'LA'
  | 'LB'
  | 'LC'
  | 'LI'
  | 'LK'
  | 'LR'
  | 'LS'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'LY'
  | 'MA'
  | 'MC'
  | 'MD'
  | 'ME'
  | 'MF'
  | 'MG'
  | 'MH'
  | 'MK'
  | 'ML'
  | 'MM'
  | 'MN'
  | 'MO'
  | 'MP'
  | 'MQ'
  | 'MR'
  | 'MS'
  | 'MT'
  | 'MU'
  | 'MV'
  | 'MW'
  | 'MX'
  | 'MY'
  | 'MZ'
  | 'NA'
  | 'NC'
  | 'NE'
  | 'NF'
  | 'NG'
  | 'NI'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NR'
  | 'NU'
  | 'NZ'
  | 'OM'
  | 'PA'
  | 'PE'
  | 'PF'
  | 'PG'
  | 'PH'
  | 'PK'
  | 'PL'
  | 'PM'
  | 'PN'
  | 'PR'
  | 'PS'
  | 'PT'
  | 'PW'
  | 'PY'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'RU'
  | 'RW'
  | 'SA'
  | 'SB'
  | 'SC'
  | 'SD'
  | 'SE'
  | 'SG'
  | 'SH'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SL'
  | 'SM'
  | 'SN'
  | 'SO'
  | 'SR'
  | 'SS'
  | 'ST'
  | 'SV'
  | 'SX'
  | 'SY'
  | 'SZ'
  | 'TC'
  | 'TD'
  | 'TF'
  | 'TG'
  | 'TH'
  | 'TJ'
  | 'TK'
  | 'TL'
  | 'TM'
  | 'TN'
  | 'TO'
  | 'TR'
  | 'TT'
  | 'TV'
  | 'TW'
  | 'TZ'
  | 'UA'
  | 'UG'
  | 'UM'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VA'
  | 'VC'
  | 'VE'
  | 'VG'
  | 'VI'
  | 'VN'
  | 'VU'
  | 'WF'
  | 'WS'
  | 'YE'
  | 'YT'
  | 'ZA'
  | 'ZM'
  | 'ZW';

export type CountryDisplay = {
  __typename?: 'CountryDisplay';
  /** Country code. */
  code: Scalars['String'];
  /** Country name. */
  country: Scalars['String'];
  /** Country tax. */
  vat?: Maybe<Vat>;
};

export type CountryFilterInput = {
  /** Boolean for filtering countries by having shipping zone assigned.If 'true', return countries with shipping zone assigned.If 'false', return countries without any shipping zone assigned.If the argument is not provided (null), return all countries. */
  attachedToShippingZones?: InputMaybe<Scalars['Boolean']>;
};

/** Create JWT token. */
export type CreateToken = {
  __typename?: 'CreateToken';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** CSRF token required to re-generate access token. */
  csrfToken?: Maybe<Scalars['String']>;
  errors: Array<AccountError>;
  /** JWT refresh token, required to re-generate access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** JWT token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
};

export type CreditCard = {
  __typename?: 'CreditCard';
  /** Card brand. */
  brand: Scalars['String'];
  /** Two-digit number representing the card’s expiration month. */
  expMonth?: Maybe<Scalars['Int']>;
  /** Four-digit number representing the card’s expiration year. */
  expYear?: Maybe<Scalars['Int']>;
  /** First 4 digits of the card number. */
  firstDigits?: Maybe<Scalars['String']>;
  /** Last 4 digits of the card number. */
  lastDigits: Scalars['String'];
};

/** Deletes customers. */
export type CustomerBulkDelete = {
  __typename?: 'CustomerBulkDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<AccountError>;
};

/** Creates a new customer. */
export type CustomerCreate = {
  __typename?: 'CustomerCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

/** Deletes a customer. */
export type CustomerDelete = {
  __typename?: 'CustomerDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

/** History log of the customer. */
export type CustomerEvent = Node & {
  __typename?: 'CustomerEvent';
  /** App that performed the action. */
  app?: Maybe<App>;
  /** Number of objects concerned by the event. */
  count?: Maybe<Scalars['Int']>;
  /** Date when event happened at in ISO 8601 format. */
  date?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** Content of the event. */
  message?: Maybe<Scalars['String']>;
  /** The concerned order. */
  order?: Maybe<Order>;
  /** The concerned order line. */
  orderLine?: Maybe<OrderLine>;
  /** Customer event type. */
  type?: Maybe<CustomerEventsEnum>;
  /** User who performed the action. */
  user?: Maybe<User>;
};

/** An enumeration. */
export type CustomerEventsEnum =
  | 'ACCOUNT_CREATED'
  | 'CUSTOMER_DELETED'
  | 'DIGITAL_LINK_DOWNLOADED'
  | 'EMAIL_ASSIGNED'
  | 'EMAIL_CHANGED'
  | 'EMAIL_CHANGED_REQUEST'
  | 'NAME_ASSIGNED'
  | 'NOTE_ADDED'
  | 'NOTE_ADDED_TO_ORDER'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'PASSWORD_RESET_LINK_SENT'
  | 'PLACED_ORDER';

export type CustomerFilterInput = {
  dateJoined?: InputMaybe<DateRangeInput>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  numberOfOrders?: InputMaybe<IntRangeInput>;
  placedOrders?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

export type CustomerInput = {
  /** Billing address of the customer. */
  defaultBillingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: InputMaybe<AddressInput>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
};

/** Updates an existing customer. */
export type CustomerUpdate = {
  __typename?: 'CustomerUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

export type DateRangeInput = {
  /** Start date. */
  gte?: InputMaybe<Scalars['Date']>;
  /** End date. */
  lte?: InputMaybe<Scalars['Date']>;
};

export type DateTimeRangeInput = {
  /** Start date. */
  gte?: InputMaybe<Scalars['DateTime']>;
  /** End date. */
  lte?: InputMaybe<Scalars['DateTime']>;
};

/** Deactivate all JWT tokens of the currently authenticated user. */
export type DeactivateAllUserTokens = {
  __typename?: 'DeactivateAllUserTokens';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Delete metadata of an object. */
export type DeleteMetadata = {
  __typename?: 'DeleteMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  metadataErrors: Array<MetadataError>;
};

/** Delete object's private metadata. */
export type DeletePrivateMetadata = {
  __typename?: 'DeletePrivateMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  metadataErrors: Array<MetadataError>;
};

/** New in Saleor 3.1. Represents a delivery method chosen for the checkout. `Warehouse` type is used when checkout is marked as "click and collect" and `ShippingMethod` otherwise. Note: this feature is in a preview state and can be subject to changes at later point. */
export type DeliveryMethod = ShippingMethod | Warehouse;

export type DigitalContent = Node & ObjectWithMetadata & {
  __typename?: 'DigitalContent';
  automaticFulfillment: Scalars['Boolean'];
  contentFile: Scalars['String'];
  id: Scalars['ID'];
  maxDownloads?: Maybe<Scalars['Int']>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Product variant assigned to digital content. */
  productVariant: ProductVariant;
  urlValidDays?: Maybe<Scalars['Int']>;
  /** List of URLs for the digital variant. */
  urls?: Maybe<Array<Maybe<DigitalContentUrl>>>;
  useDefaultSettings: Scalars['Boolean'];
};

export type DigitalContentCountableConnection = {
  __typename?: 'DigitalContentCountableConnection';
  edges: Array<DigitalContentCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type DigitalContentCountableEdge = {
  __typename?: 'DigitalContentCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: DigitalContent;
};

/** Create new digital content. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type DigitalContentCreate = {
  __typename?: 'DigitalContentCreate';
  content?: Maybe<DigitalContent>;
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  variant?: Maybe<ProductVariant>;
};

/** Remove digital content assigned to given variant. */
export type DigitalContentDelete = {
  __typename?: 'DigitalContentDelete';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  variant?: Maybe<ProductVariant>;
};

export type DigitalContentInput = {
  /** Overwrite default automatic_fulfillment setting for variant. */
  automaticFulfillment?: InputMaybe<Scalars['Boolean']>;
  /** Determines how many times a download link can be accessed by a customer. */
  maxDownloads?: InputMaybe<Scalars['Int']>;
  /** Determines for how many days a download link is active since it was generated. */
  urlValidDays?: InputMaybe<Scalars['Int']>;
  /** Use default digital content settings for this product. */
  useDefaultSettings: Scalars['Boolean'];
};

/** Update digital content. */
export type DigitalContentUpdate = {
  __typename?: 'DigitalContentUpdate';
  content?: Maybe<DigitalContent>;
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  variant?: Maybe<ProductVariant>;
};

export type DigitalContentUploadInput = {
  /** Overwrite default automatic_fulfillment setting for variant. */
  automaticFulfillment?: InputMaybe<Scalars['Boolean']>;
  /** Represents an file in a multipart request. */
  contentFile: Scalars['Upload'];
  /** Determines how many times a download link can be accessed by a customer. */
  maxDownloads?: InputMaybe<Scalars['Int']>;
  /** Determines for how many days a download link is active since it was generated. */
  urlValidDays?: InputMaybe<Scalars['Int']>;
  /** Use default digital content settings for this product. */
  useDefaultSettings: Scalars['Boolean'];
};

export type DigitalContentUrl = Node & {
  __typename?: 'DigitalContentUrl';
  content: DigitalContent;
  created: Scalars['DateTime'];
  downloadNum: Scalars['Int'];
  id: Scalars['ID'];
  /** UUID of digital content. */
  token: Scalars['UUID'];
  /** URL for digital content. */
  url?: Maybe<Scalars['String']>;
};

/** Generate new URL to digital content. */
export type DigitalContentUrlCreate = {
  __typename?: 'DigitalContentUrlCreate';
  digitalContentUrl?: Maybe<DigitalContentUrl>;
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type DigitalContentUrlCreateInput = {
  /** Digital content ID which URL will belong to. */
  content: Scalars['ID'];
};

export type DiscountError = {
  __typename?: 'DiscountError';
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: DiscountErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of products IDs which causes the error. */
  products?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type DiscountErrorCode =
  | 'ALREADY_EXISTS'
  | 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type DiscountStatusEnum =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'SCHEDULED';

export type DiscountValueTypeEnum =
  | 'FIXED'
  | 'PERCENTAGE';

/** An enumeration. */
export type DistanceUnitsEnum =
  | 'CM'
  | 'FT'
  | 'INCH'
  | 'KM'
  | 'M'
  | 'YD';

/** Represents shop's domain. */
export type Domain = {
  __typename?: 'Domain';
  /** The host name of the domain. */
  host: Scalars['String'];
  /** Inform if SSL is enabled. */
  sslEnabled: Scalars['Boolean'];
  /** Shop's absolute URL. */
  url: Scalars['String'];
};

/** Deletes draft orders. */
export type DraftOrderBulkDelete = {
  __typename?: 'DraftOrderBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<OrderError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Completes creating an order. */
export type DraftOrderComplete = {
  __typename?: 'DraftOrderComplete';
  errors: Array<OrderError>;
  /** Completed order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Creates a new draft order. */
export type DraftOrderCreate = {
  __typename?: 'DraftOrderCreate';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type DraftOrderCreateInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** ID of the channel associated with the order. */
  channelId?: InputMaybe<Scalars['ID']>;
  /** A note from a customer. Visible by customers in the order summary. */
  customerNote?: InputMaybe<Scalars['String']>;
  /** Discount amount for the order. */
  discount?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Variant line input consisting of variant ID and quantity of products. */
  lines?: InputMaybe<Array<InputMaybe<OrderLineCreateInput>>>;
  /** URL of a view where users should be redirected to see the order details. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
  /** Shipping address of the customer. */
  shippingAddress?: InputMaybe<AddressInput>;
  /** ID of a selected shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
  /** Customer associated with the draft order. */
  user?: InputMaybe<Scalars['ID']>;
  /** Email address of the customer. */
  userEmail?: InputMaybe<Scalars['String']>;
  /** ID of the voucher associated with the order. */
  voucher?: InputMaybe<Scalars['ID']>;
};

/** Deletes a draft order. */
export type DraftOrderDelete = {
  __typename?: 'DraftOrderDelete';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type DraftOrderInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** ID of the channel associated with the order. */
  channelId?: InputMaybe<Scalars['ID']>;
  /** A note from a customer. Visible by customers in the order summary. */
  customerNote?: InputMaybe<Scalars['String']>;
  /** Discount amount for the order. */
  discount?: InputMaybe<Scalars['PositiveDecimal']>;
  /** URL of a view where users should be redirected to see the order details. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
  /** Shipping address of the customer. */
  shippingAddress?: InputMaybe<AddressInput>;
  /** ID of a selected shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
  /** Customer associated with the draft order. */
  user?: InputMaybe<Scalars['ID']>;
  /** Email address of the customer. */
  userEmail?: InputMaybe<Scalars['String']>;
  /** ID of the voucher associated with the order. */
  voucher?: InputMaybe<Scalars['ID']>;
};

/** Deletes order lines. */
export type DraftOrderLinesBulkDelete = {
  __typename?: 'DraftOrderLinesBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<OrderError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Updates a draft order. */
export type DraftOrderUpdate = {
  __typename?: 'DraftOrderUpdate';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Event delivery. */
export type EventDelivery = Node & {
  __typename?: 'EventDelivery';
  /** Event delivery attempts. */
  attempts?: Maybe<EventDeliveryAttemptCountableConnection>;
  createdAt: Scalars['DateTime'];
  /** Webhook event type. */
  eventType: WebhookEventTypeEnum;
  id: Scalars['ID'];
  /** Event payload. */
  payload?: Maybe<Scalars['String']>;
  /** Event delivery status. */
  status: EventDeliveryStatusEnum;
};


/** Event delivery. */
export type EventDeliveryAttemptsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<EventDeliveryAttemptSortingInput>;
};

/** Event delivery attempts. */
export type EventDeliveryAttempt = Node & {
  __typename?: 'EventDeliveryAttempt';
  /** Event delivery creation date and time. */
  createdAt: Scalars['DateTime'];
  duration?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  requestHeaders?: Maybe<Scalars['String']>;
  response?: Maybe<Scalars['String']>;
  responseHeaders?: Maybe<Scalars['String']>;
  /** Event delivery status. */
  status: EventDeliveryStatusEnum;
  taskId?: Maybe<Scalars['String']>;
};

export type EventDeliveryAttemptCountableConnection = {
  __typename?: 'EventDeliveryAttemptCountableConnection';
  edges: Array<EventDeliveryAttemptCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type EventDeliveryAttemptCountableEdge = {
  __typename?: 'EventDeliveryAttemptCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: EventDeliveryAttempt;
};

export type EventDeliveryAttemptSortField =
  /** Sort event delivery attempts by created at. */
  | 'CREATED_AT';

export type EventDeliveryAttemptSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attempts by the selected field. */
  field: EventDeliveryAttemptSortField;
};

export type EventDeliveryCountableConnection = {
  __typename?: 'EventDeliveryCountableConnection';
  edges: Array<EventDeliveryCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type EventDeliveryCountableEdge = {
  __typename?: 'EventDeliveryCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: EventDelivery;
};

export type EventDeliveryFilterInput = {
  eventType?: InputMaybe<WebhookEventTypeEnum>;
  status?: InputMaybe<EventDeliveryStatusEnum>;
};

/** Retries event delivery. */
export type EventDeliveryRetry = {
  __typename?: 'EventDeliveryRetry';
  /** Event delivery. */
  delivery?: Maybe<EventDelivery>;
  errors: Array<WebhookError>;
};

export type EventDeliverySortField =
  /** Sort event deliveries by created at. */
  | 'CREATED_AT';

export type EventDeliverySortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort deliveries by the selected field. */
  field: EventDeliverySortField;
};

export type EventDeliveryStatusEnum =
  | 'FAILED'
  | 'PENDING'
  | 'SUCCESS';

export type ExportError = {
  __typename?: 'ExportError';
  /** The error code. */
  code: ExportErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type ExportErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED';

/** History log of export file. */
export type ExportEvent = Node & {
  __typename?: 'ExportEvent';
  /** App which performed the action. */
  app?: Maybe<App>;
  /** Date when event happened at in ISO 8601 format. */
  date: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Content of the event. */
  message: Scalars['String'];
  /** Export event type. */
  type: ExportEventsEnum;
  /** User who performed the action. */
  user?: Maybe<User>;
};

/** An enumeration. */
export type ExportEventsEnum =
  | 'EXPORTED_FILE_SENT'
  | 'EXPORT_DELETED'
  | 'EXPORT_FAILED'
  | 'EXPORT_FAILED_INFO_SENT'
  | 'EXPORT_PENDING'
  | 'EXPORT_SUCCESS';

/** Represents a job data of exported file. */
export type ExportFile = Job & Node & {
  __typename?: 'ExportFile';
  app?: Maybe<App>;
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** List of events associated with the export. */
  events?: Maybe<Array<ExportEvent>>;
  id: Scalars['ID'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** Job status. */
  status: JobStatusEnum;
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
  /** The URL of field to download. */
  url?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type ExportFileCountableConnection = {
  __typename?: 'ExportFileCountableConnection';
  edges: Array<ExportFileCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ExportFileCountableEdge = {
  __typename?: 'ExportFileCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ExportFile;
};

export type ExportFileFilterInput = {
  app?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<DateTimeRangeInput>;
  status?: InputMaybe<JobStatusEnum>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
  user?: InputMaybe<Scalars['String']>;
};

export type ExportFileSortField =
  | 'CREATED_AT'
  | 'LAST_MODIFIED_AT'
  | 'STATUS'
  | 'UPDATED_AT';

export type ExportFileSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort export file by the selected field. */
  field: ExportFileSortField;
};

/** New in Saleor 3.1. Export gift cards to csv file. Note: this feature is in a preview state and can be subject to changes at later point. */
export type ExportGiftCards = {
  __typename?: 'ExportGiftCards';
  errors: Array<ExportError>;
  /** The newly created export file job which is responsible for export data. */
  exportFile?: Maybe<ExportFile>;
};

export type ExportGiftCardsInput = {
  /** Type of exported file. */
  fileType: FileTypesEnum;
  /** Filtering options for gift cards. */
  filter?: InputMaybe<GiftCardFilterInput>;
  /** List of gift cards IDs to export. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Determine which gift cards should be exported. */
  scope: ExportScope;
};

export type ExportInfoInput = {
  /** List of attribute ids witch should be exported. */
  attributes?: InputMaybe<Array<Scalars['ID']>>;
  /** List of channels ids which should be exported. */
  channels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of product fields witch should be exported. */
  fields?: InputMaybe<Array<ProductFieldEnum>>;
  /** List of warehouse ids witch should be exported. */
  warehouses?: InputMaybe<Array<Scalars['ID']>>;
};

/** Export products to csv file. */
export type ExportProducts = {
  __typename?: 'ExportProducts';
  errors: Array<ExportError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  exportErrors: Array<ExportError>;
  /** The newly created export file job which is responsible for export data. */
  exportFile?: Maybe<ExportFile>;
};

export type ExportProductsInput = {
  /** Input with info about fields which should be exported. */
  exportInfo?: InputMaybe<ExportInfoInput>;
  /** Type of exported file. */
  fileType: FileTypesEnum;
  /** Filtering options for products. */
  filter?: InputMaybe<ProductFilterInput>;
  /** List of products IDs to export. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Determine which products should be exported. */
  scope: ExportScope;
};

export type ExportScope =
  /** Export all products. */
  | 'ALL'
  /** Export the filtered products. */
  | 'FILTER'
  /** Export products with given ids. */
  | 'IDS';

export type ExternalAuthentication = {
  __typename?: 'ExternalAuthentication';
  /** ID of external authentication plugin. */
  id: Scalars['String'];
  /** Name of external authentication plugin. */
  name?: Maybe<Scalars['String']>;
};

/** Prepare external authentication url for user by custom plugin. */
export type ExternalAuthenticationUrl = {
  __typename?: 'ExternalAuthenticationUrl';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** The data returned by authentication plugin. */
  authenticationData?: Maybe<Scalars['JSONString']>;
  errors: Array<AccountError>;
};

/** Logout user by custom plugin. */
export type ExternalLogout = {
  __typename?: 'ExternalLogout';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** The data returned by authentication plugin. */
  logoutData?: Maybe<Scalars['JSONString']>;
};

export type ExternalNotificationError = {
  __typename?: 'ExternalNotificationError';
  /** The error code. */
  code: ExternalNotificationErrorCodes;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type ExternalNotificationErrorCodes =
  | 'CHANNEL_INACTIVE'
  | 'INVALID_MODEL_TYPE'
  | 'NOT_FOUND'
  | 'REQUIRED';

/** New in Saleor 3.1. Trigger sending a notification with the notify plugin method. Serializes nodes provided as ids parameter and includes this data in the notification payload. */
export type ExternalNotificationTrigger = {
  __typename?: 'ExternalNotificationTrigger';
  errors: Array<ExternalNotificationError>;
};

export type ExternalNotificationTriggerInput = {
  /** External event type. This field is passed to a plugin as an event type. */
  externalEventType: Scalars['String'];
  /** Additional payload that will be merged with the one based on the bussines object ID. */
  extraPayload?: InputMaybe<Scalars['JSONString']>;
  /** The list of customers or orders node IDs that will be serialized and included in the notification payload. */
  ids: Array<InputMaybe<Scalars['ID']>>;
};

/** Obtain external access tokens for user by custom plugin. */
export type ExternalObtainAccessTokens = {
  __typename?: 'ExternalObtainAccessTokens';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** CSRF token required to re-generate external access token. */
  csrfToken?: Maybe<Scalars['String']>;
  errors: Array<AccountError>;
  /** The refresh token, required to re-generate external access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** The token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
};

/** Refresh user's access by custom plugin. */
export type ExternalRefresh = {
  __typename?: 'ExternalRefresh';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** CSRF token required to re-generate external access token. */
  csrfToken?: Maybe<Scalars['String']>;
  errors: Array<AccountError>;
  /** The refresh token, required to re-generate external access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** The token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
};

/** Verify external authentication data by plugin. */
export type ExternalVerify = {
  __typename?: 'ExternalVerify';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** Determine if authentication data is valid or not. */
  isValid: Scalars['Boolean'];
  /** User assigned to data. */
  user?: Maybe<User>;
  /** External data. */
  verifyData?: Maybe<Scalars['JSONString']>;
};

export type File = {
  __typename?: 'File';
  /** Content type of the file. */
  contentType?: Maybe<Scalars['String']>;
  /** The URL of the file. */
  url: Scalars['String'];
};

/** An enumeration. */
export type FileTypesEnum =
  | 'CSV'
  | 'XLSX';

/** Upload a file. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type FileUpload = {
  __typename?: 'FileUpload';
  errors: Array<UploadError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  uploadErrors: Array<UploadError>;
  uploadedFile?: Maybe<File>;
};

/** Represents order fulfillment. */
export type Fulfillment = Node & ObjectWithMetadata & {
  __typename?: 'Fulfillment';
  created: Scalars['DateTime'];
  fulfillmentOrder: Scalars['Int'];
  id: Scalars['ID'];
  /** List of lines for the fulfillment. */
  lines?: Maybe<Array<Maybe<FulfillmentLine>>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  status: FulfillmentStatus;
  /** User-friendly fulfillment status. */
  statusDisplay?: Maybe<Scalars['String']>;
  trackingNumber: Scalars['String'];
  /** Warehouse from fulfillment was fulfilled. */
  warehouse?: Maybe<Warehouse>;
};

/** New in Saleor 3.1. Approve existing fulfillment. */
export type FulfillmentApprove = {
  __typename?: 'FulfillmentApprove';
  errors: Array<OrderError>;
  /** An approved fulfillment. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was approved. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Cancels existing fulfillment and optionally restocks items. */
export type FulfillmentCancel = {
  __typename?: 'FulfillmentCancel';
  errors: Array<OrderError>;
  /** A canceled fulfillment. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was cancelled. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type FulfillmentCancelInput = {
  /** ID of a warehouse where items will be restocked. Optional when fulfillment is in WAITING_FOR_APPROVAL state. */
  warehouseId?: InputMaybe<Scalars['ID']>;
};

/** Represents line of the fulfillment. */
export type FulfillmentLine = Node & {
  __typename?: 'FulfillmentLine';
  id: Scalars['ID'];
  orderLine?: Maybe<OrderLine>;
  quantity: Scalars['Int'];
};

/** Refund products. */
export type FulfillmentRefundProducts = {
  __typename?: 'FulfillmentRefundProducts';
  errors: Array<OrderError>;
  /** A refunded fulfillment. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was refunded. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Return products. */
export type FulfillmentReturnProducts = {
  __typename?: 'FulfillmentReturnProducts';
  errors: Array<OrderError>;
  /** Order which fulfillment was returned. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
  /** A replace fulfillment. */
  replaceFulfillment?: Maybe<Fulfillment>;
  /** A draft order which was created for products with replace flag. */
  replaceOrder?: Maybe<Order>;
  /** A return fulfillment. */
  returnFulfillment?: Maybe<Fulfillment>;
};

/** An enumeration. */
export type FulfillmentStatus =
  | 'CANCELED'
  | 'FULFILLED'
  | 'REFUNDED'
  | 'REFUNDED_AND_RETURNED'
  | 'REPLACED'
  | 'RETURNED'
  | 'WAITING_FOR_APPROVAL';

/** Updates a fulfillment for an order. */
export type FulfillmentUpdateTracking = {
  __typename?: 'FulfillmentUpdateTracking';
  errors: Array<OrderError>;
  /** A fulfillment with updated tracking. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order for which fulfillment was updated. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type FulfillmentUpdateTrackingInput = {
  /** If true, send an email notification to the customer. */
  notifyCustomer?: InputMaybe<Scalars['Boolean']>;
  /** Fulfillment tracking number. */
  trackingNumber?: InputMaybe<Scalars['String']>;
};

/** Payment gateway client configuration key and value pair. */
export type GatewayConfigLine = {
  __typename?: 'GatewayConfigLine';
  /** Gateway config key. */
  field: Scalars['String'];
  /** Gateway config value for key. */
  value?: Maybe<Scalars['String']>;
};

/** A gift card is a prepaid electronic payment card accepted in stores. They can be used during checkout by providing a valid gift card codes. */
export type GiftCard = Node & ObjectWithMetadata & {
  __typename?: 'GiftCard';
  /** New in Saleor 3.1. App which created the gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  app?: Maybe<App>;
  /** New in Saleor 3.1. Slug of the channel where the gift card was bought. Note: this feature is in a preview state and can be subject to changes at later point. */
  boughtInChannel?: Maybe<Scalars['String']>;
  /** Gift card code. Can be fetched by staff member with manage gift card permission when gift card wasn't used yet and by the gift card owner. */
  code: Scalars['String'];
  created: Scalars['DateTime'];
  /** New in Saleor 3.1. The user who bought or issued a gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  createdBy?: Maybe<User>;
  /** New in Saleor 3.1. Email address of the user who bought or issued gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  createdByEmail?: Maybe<Scalars['String']>;
  currentBalance?: Maybe<Money>;
  /** Code in format which allows displaying in a user interface. */
  displayCode: Scalars['String'];
  /**
   * End date of gift card.
   * @deprecated This field will be removed in Saleor 4.0. Use `expiryDate` field instead.
   */
  endDate?: Maybe<Scalars['DateTime']>;
  /** New in Saleor 3.1. List of events associated with the gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  events: Array<GiftCardEvent>;
  expiryDate?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  initialBalance?: Maybe<Money>;
  isActive: Scalars['Boolean'];
  /** Last 4 characters of gift card code. */
  last4CodeChars: Scalars['String'];
  lastUsedOn?: Maybe<Scalars['DateTime']>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** New in Saleor 3.1. Related gift card product. Note: this feature is in a preview state and can be subject to changes at later point. */
  product?: Maybe<Product>;
  /**
   * Start date of gift card.
   * @deprecated This field will be removed in Saleor 4.0.
   */
  startDate?: Maybe<Scalars['DateTime']>;
  /** New in Saleor 3.1. The gift card tag. Note: this feature is in a preview state and can be subject to changes at later point. */
  tags: Array<GiftCardTag>;
  /** New in Saleor 3.1. The customer who used a gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  usedBy?: Maybe<User>;
  /** New in Saleor 3.1. Email address of the customer who used a gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  usedByEmail?: Maybe<Scalars['String']>;
  /**
   * The customer who bought a gift card.
   * @deprecated This field will be removed in Saleor 4.0. Use `createdBy` field instead.
   */
  user?: Maybe<User>;
};


/** A gift card is a prepaid electronic payment card accepted in stores. They can be used during checkout by providing a valid gift card codes. */
export type GiftCardEventsArgs = {
  filter?: InputMaybe<GiftCardEventFilterInput>;
};

/** Activate a gift card. */
export type GiftCardActivate = {
  __typename?: 'GiftCardActivate';
  errors: Array<GiftCardError>;
  /** Activated gift card. */
  giftCard?: Maybe<GiftCard>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  giftCardErrors: Array<GiftCardError>;
};

/** New in Saleor 3.1. Adds note to the gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardAddNote = {
  __typename?: 'GiftCardAddNote';
  errors: Array<GiftCardError>;
  /** Gift card note created. */
  event?: Maybe<GiftCardEvent>;
  /** Gift card with the note added. */
  giftCard?: Maybe<GiftCard>;
};

export type GiftCardAddNoteInput = {
  /** Note message. */
  message: Scalars['String'];
};

/** New in Saleor 3.1. Activate gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardBulkActivate = {
  __typename?: 'GiftCardBulkActivate';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<GiftCardError>;
};

/** New in Saleor 3.1. Create gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardBulkCreate = {
  __typename?: 'GiftCardBulkCreate';
  /** Returns how many objects were created. */
  count: Scalars['Int'];
  errors: Array<GiftCardError>;
  /** List of created gift cards. */
  giftCards: Array<GiftCard>;
};

export type GiftCardBulkCreateInput = {
  /** Balance of the gift card. */
  balance: PriceInput;
  /** The number of cards to issue. */
  count: Scalars['Int'];
  /** The gift card expiry date. */
  expiryDate?: InputMaybe<Scalars['Date']>;
  /** Determine if gift card is active. */
  isActive: Scalars['Boolean'];
  /** The gift card tags. */
  tags?: InputMaybe<Array<Scalars['String']>>;
};

/** New in Saleor 3.1. Deactivate gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardBulkDeactivate = {
  __typename?: 'GiftCardBulkDeactivate';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<GiftCardError>;
};

/** New in Saleor 3.1. Delete gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardBulkDelete = {
  __typename?: 'GiftCardBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<GiftCardError>;
};

export type GiftCardCountableConnection = {
  __typename?: 'GiftCardCountableConnection';
  edges: Array<GiftCardCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type GiftCardCountableEdge = {
  __typename?: 'GiftCardCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: GiftCard;
};

/** Creates a new gift card. */
export type GiftCardCreate = {
  __typename?: 'GiftCardCreate';
  errors: Array<GiftCardError>;
  giftCard?: Maybe<GiftCard>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  giftCardErrors: Array<GiftCardError>;
};

export type GiftCardCreateInput = {
  /** New in Saleor 3.1. The gift card tags to add. Note: this feature is in a preview state and can be subject to changes at later point. */
  addTags?: InputMaybe<Array<Scalars['String']>>;
  /** Balance of the gift card. */
  balance: PriceInput;
  /** New in Saleor 3.1. Slug of a channel from which the email should be sent. Note: this feature is in a preview state and can be subject to changes at later point. */
  channel?: InputMaybe<Scalars['String']>;
  /**
   * Code to use the gift card.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. The code is now auto generated.
   */
  code?: InputMaybe<Scalars['String']>;
  /**
   * End date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `expiryDate` from `expirySettings` instead.
   */
  endDate?: InputMaybe<Scalars['Date']>;
  /** New in Saleor 3.1. The gift card expiry date. Note: this feature is in a preview state and can be subject to changes at later point. */
  expiryDate?: InputMaybe<Scalars['Date']>;
  /** New in Saleor 3.1. Determine if gift card is active. Note: this feature is in a preview state and can be subject to changes at later point. */
  isActive: Scalars['Boolean'];
  /** New in Saleor 3.1. The gift card note from the staff member. Note: this feature is in a preview state and can be subject to changes at later point. */
  note?: InputMaybe<Scalars['String']>;
  /**
   * Start date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  startDate?: InputMaybe<Scalars['Date']>;
  /** Email of the customer to whom gift card will be sent. */
  userEmail?: InputMaybe<Scalars['String']>;
};

/** Deactivate a gift card. */
export type GiftCardDeactivate = {
  __typename?: 'GiftCardDeactivate';
  errors: Array<GiftCardError>;
  /** Deactivated gift card. */
  giftCard?: Maybe<GiftCard>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  giftCardErrors: Array<GiftCardError>;
};

/** New in Saleor 3.1. Delete gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardDelete = {
  __typename?: 'GiftCardDelete';
  errors: Array<GiftCardError>;
  giftCard?: Maybe<GiftCard>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  giftCardErrors: Array<GiftCardError>;
};

export type GiftCardError = {
  __typename?: 'GiftCardError';
  /** The error code. */
  code: GiftCardErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of tag values that cause the error. */
  tags?: Maybe<Array<Scalars['String']>>;
};

/** An enumeration. */
export type GiftCardErrorCode =
  | 'ALREADY_EXISTS'
  | 'DUPLICATED_INPUT_ITEM'
  | 'EXPIRED_GIFT_CARD'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

/** New in Saleor 3.1. History log of the gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardEvent = Node & {
  __typename?: 'GiftCardEvent';
  /** App that performed the action. */
  app?: Maybe<App>;
  /** The gift card balance. */
  balance?: Maybe<GiftCardEventBalance>;
  /** Date when event happened at in ISO 8601 format. */
  date?: Maybe<Scalars['DateTime']>;
  /** Email of the customer. */
  email?: Maybe<Scalars['String']>;
  /** The gift card expiry date. */
  expiryDate?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  /** Content of the event. */
  message?: Maybe<Scalars['String']>;
  /** Previous gift card expiry date. */
  oldExpiryDate?: Maybe<Scalars['Date']>;
  /** The list of old gift card tags. */
  oldTags?: Maybe<Array<Scalars['String']>>;
  /** The order ID where gift card was used or bought. */
  orderId?: Maybe<Scalars['ID']>;
  /** User-friendly number of an order where gift card was used or bought. */
  orderNumber?: Maybe<Scalars['String']>;
  /** The list of gift card tags. */
  tags?: Maybe<Array<Scalars['String']>>;
  /** Gift card event type. */
  type?: Maybe<GiftCardEventsEnum>;
  /** User who performed the action. */
  user?: Maybe<User>;
};

export type GiftCardEventBalance = {
  __typename?: 'GiftCardEventBalance';
  /** Current balance of the gift card. */
  currentBalance: Money;
  /** Initial balance of the gift card. */
  initialBalance?: Maybe<Money>;
  /** Previous current balance of the gift card. */
  oldCurrentBalance?: Maybe<Money>;
  /** Previous initial balance of the gift card. */
  oldInitialBalance?: Maybe<Money>;
};

export type GiftCardEventFilterInput = {
  orders?: InputMaybe<Array<Scalars['ID']>>;
  type?: InputMaybe<GiftCardEventsEnum>;
};

/** An enumeration. */
export type GiftCardEventsEnum =
  | 'ACTIVATED'
  | 'BALANCE_RESET'
  | 'BOUGHT'
  | 'DEACTIVATED'
  | 'EXPIRY_DATE_UPDATED'
  | 'ISSUED'
  | 'NOTE_ADDED'
  | 'RESENT'
  | 'SENT_TO_CUSTOMER'
  | 'TAGS_UPDATED'
  | 'UPDATED'
  | 'USED_IN_ORDER';

export type GiftCardFilterInput = {
  code?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  currentBalance?: InputMaybe<PriceRangeInput>;
  initialBalance?: InputMaybe<PriceRangeInput>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  used?: InputMaybe<Scalars['Boolean']>;
  usedBy?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** New in Saleor 3.1. Resend a gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardResend = {
  __typename?: 'GiftCardResend';
  errors: Array<GiftCardError>;
  /** Gift card which has been sent. */
  giftCard?: Maybe<GiftCard>;
};

export type GiftCardResendInput = {
  /** Slug of a channel from which the email should be sent. */
  channel: Scalars['String'];
  /** Email to which gift card should be send. */
  email?: InputMaybe<Scalars['String']>;
  /** ID of a gift card to resend. */
  id: Scalars['ID'];
};

/** Gift card related settings from site settings. */
export type GiftCardSettings = {
  __typename?: 'GiftCardSettings';
  /** The gift card expiry period settings. */
  expiryPeriod?: Maybe<TimePeriod>;
  /** The gift card expiry type settings. */
  expiryType: GiftCardSettingsExpiryTypeEnum;
};

export type GiftCardSettingsError = {
  __typename?: 'GiftCardSettingsError';
  /** The error code. */
  code: GiftCardSettingsErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type GiftCardSettingsErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'REQUIRED';

/** An enumeration. */
export type GiftCardSettingsExpiryTypeEnum =
  | 'EXPIRY_PERIOD'
  | 'NEVER_EXPIRE';

/** Update gift card settings. */
export type GiftCardSettingsUpdate = {
  __typename?: 'GiftCardSettingsUpdate';
  errors: Array<GiftCardSettingsError>;
  /** Gift card settings. */
  giftCardSettings?: Maybe<GiftCardSettings>;
};

export type GiftCardSettingsUpdateInput = {
  /** Defines gift card expiry period. */
  expiryPeriod?: InputMaybe<TimePeriodInputType>;
  /** Defines gift card default expiry settings. */
  expiryType?: InputMaybe<GiftCardSettingsExpiryTypeEnum>;
};

export type GiftCardSortField =
  /** Sort orders by current balance. */
  | 'CURRENT_BALANCE'
  /** Sort orders by product. */
  | 'PRODUCT'
  /** Sort orders by used by. */
  | 'USED_BY';

export type GiftCardSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort gift cards by the selected field. */
  field: GiftCardSortField;
};

/** New in Saleor 3.1. The gift card tag. Note: this feature is in a preview state and can be subject to changes at later point. */
export type GiftCardTag = Node & {
  __typename?: 'GiftCardTag';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GiftCardTagCountableConnection = {
  __typename?: 'GiftCardTagCountableConnection';
  edges: Array<GiftCardTagCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type GiftCardTagCountableEdge = {
  __typename?: 'GiftCardTagCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: GiftCardTag;
};

export type GiftCardTagFilterInput = {
  search?: InputMaybe<Scalars['String']>;
};

/** Update a gift card. */
export type GiftCardUpdate = {
  __typename?: 'GiftCardUpdate';
  errors: Array<GiftCardError>;
  giftCard?: Maybe<GiftCard>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  giftCardErrors: Array<GiftCardError>;
};

export type GiftCardUpdateInput = {
  /** New in Saleor 3.1. The gift card tags to add. Note: this feature is in a preview state and can be subject to changes at later point. */
  addTags?: InputMaybe<Array<Scalars['String']>>;
  /** New in Saleor 3.1. The gift card balance amount. Note: this feature is in a preview state and can be subject to changes at later point. */
  balanceAmount?: InputMaybe<Scalars['PositiveDecimal']>;
  /**
   * End date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `expiryDate` from `expirySettings` instead.
   */
  endDate?: InputMaybe<Scalars['Date']>;
  /** New in Saleor 3.1. The gift card expiry date. Note: this feature is in a preview state and can be subject to changes at later point. */
  expiryDate?: InputMaybe<Scalars['Date']>;
  /** New in Saleor 3.1. The gift card tags to remove. Note: this feature is in a preview state and can be subject to changes at later point. */
  removeTags?: InputMaybe<Array<Scalars['String']>>;
  /**
   * Start date of the gift card in ISO 8601 format.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  startDate?: InputMaybe<Scalars['Date']>;
};

/** Represents permission group data. */
export type Group = Node & {
  __typename?: 'Group';
  id: Scalars['ID'];
  name: Scalars['String'];
  /** List of group permissions */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** True, if the currently authenticated user has rights to manage a group. */
  userCanManage: Scalars['Boolean'];
  /** List of group users */
  users?: Maybe<Array<Maybe<User>>>;
};

export type GroupCountableConnection = {
  __typename?: 'GroupCountableConnection';
  edges: Array<GroupCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type GroupCountableEdge = {
  __typename?: 'GroupCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Group;
};

/** Represents an image. */
export type Image = {
  __typename?: 'Image';
  /** Alt text for an image. */
  alt?: Maybe<Scalars['String']>;
  /** The URL of the image. */
  url: Scalars['String'];
};

export type IntRangeInput = {
  /** Value greater than or equal to. */
  gte?: InputMaybe<Scalars['Int']>;
  /** Value less than or equal to. */
  lte?: InputMaybe<Scalars['Int']>;
};

/** Represents an Invoice. */
export type Invoice = Job & Node & ObjectWithMetadata & {
  __typename?: 'Invoice';
  createdAt: Scalars['DateTime'];
  externalUrl?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  number?: Maybe<Scalars['String']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Job status. */
  status: JobStatusEnum;
  updatedAt: Scalars['DateTime'];
  /** URL to download an invoice. */
  url?: Maybe<Scalars['String']>;
};

/** Creates a ready to send invoice. */
export type InvoiceCreate = {
  __typename?: 'InvoiceCreate';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  invoiceErrors: Array<InvoiceError>;
};

export type InvoiceCreateInput = {
  /** Invoice number. */
  number: Scalars['String'];
  /** URL of an invoice to download. */
  url: Scalars['String'];
};

/** Deletes an invoice. */
export type InvoiceDelete = {
  __typename?: 'InvoiceDelete';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  invoiceErrors: Array<InvoiceError>;
};

export type InvoiceError = {
  __typename?: 'InvoiceError';
  /** The error code. */
  code: InvoiceErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type InvoiceErrorCode =
  | 'EMAIL_NOT_SET'
  | 'INVALID_STATUS'
  | 'NOT_FOUND'
  | 'NOT_READY'
  | 'NO_INVOICE_PLUGIN'
  | 'NUMBER_NOT_SET'
  | 'REQUIRED'
  | 'URL_NOT_SET';

/** Request an invoice for the order using plugin. */
export type InvoiceRequest = {
  __typename?: 'InvoiceRequest';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  invoiceErrors: Array<InvoiceError>;
  /** Order related to an invoice. */
  order?: Maybe<Order>;
};

/** Requests deletion of an invoice. */
export type InvoiceRequestDelete = {
  __typename?: 'InvoiceRequestDelete';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  invoiceErrors: Array<InvoiceError>;
};

/** Send an invoice notification to the customer. */
export type InvoiceSendNotification = {
  __typename?: 'InvoiceSendNotification';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  invoiceErrors: Array<InvoiceError>;
};

/** Updates an invoice. */
export type InvoiceUpdate = {
  __typename?: 'InvoiceUpdate';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  invoiceErrors: Array<InvoiceError>;
};

export type Job = {
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** Job status. */
  status: JobStatusEnum;
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
};

/** An enumeration. */
export type JobStatusEnum =
  | 'DELETED'
  | 'FAILED'
  | 'PENDING'
  | 'SUCCESS';

/** An enumeration. */
export type LanguageCodeEnum =
  | 'AF'
  | 'AF_NA'
  | 'AF_ZA'
  | 'AGQ'
  | 'AGQ_CM'
  | 'AK'
  | 'AK_GH'
  | 'AM'
  | 'AM_ET'
  | 'AR'
  | 'AR_AE'
  | 'AR_BH'
  | 'AR_DJ'
  | 'AR_DZ'
  | 'AR_EG'
  | 'AR_EH'
  | 'AR_ER'
  | 'AR_IL'
  | 'AR_IQ'
  | 'AR_JO'
  | 'AR_KM'
  | 'AR_KW'
  | 'AR_LB'
  | 'AR_LY'
  | 'AR_MA'
  | 'AR_MR'
  | 'AR_OM'
  | 'AR_PS'
  | 'AR_QA'
  | 'AR_SA'
  | 'AR_SD'
  | 'AR_SO'
  | 'AR_SS'
  | 'AR_SY'
  | 'AR_TD'
  | 'AR_TN'
  | 'AR_YE'
  | 'AS'
  | 'ASA'
  | 'ASA_TZ'
  | 'AST'
  | 'AST_ES'
  | 'AS_IN'
  | 'AZ'
  | 'AZ_CYRL'
  | 'AZ_CYRL_AZ'
  | 'AZ_LATN'
  | 'AZ_LATN_AZ'
  | 'BAS'
  | 'BAS_CM'
  | 'BE'
  | 'BEM'
  | 'BEM_ZM'
  | 'BEZ'
  | 'BEZ_TZ'
  | 'BE_BY'
  | 'BG'
  | 'BG_BG'
  | 'BM'
  | 'BM_ML'
  | 'BN'
  | 'BN_BD'
  | 'BN_IN'
  | 'BO'
  | 'BO_CN'
  | 'BO_IN'
  | 'BR'
  | 'BRX'
  | 'BRX_IN'
  | 'BR_FR'
  | 'BS'
  | 'BS_CYRL'
  | 'BS_CYRL_BA'
  | 'BS_LATN'
  | 'BS_LATN_BA'
  | 'CA'
  | 'CA_AD'
  | 'CA_ES'
  | 'CA_ES_VALENCIA'
  | 'CA_FR'
  | 'CA_IT'
  | 'CCP'
  | 'CCP_BD'
  | 'CCP_IN'
  | 'CE'
  | 'CEB'
  | 'CEB_PH'
  | 'CE_RU'
  | 'CGG'
  | 'CGG_UG'
  | 'CHR'
  | 'CHR_US'
  | 'CKB'
  | 'CKB_IQ'
  | 'CKB_IR'
  | 'CS'
  | 'CS_CZ'
  | 'CU'
  | 'CU_RU'
  | 'CY'
  | 'CY_GB'
  | 'DA'
  | 'DAV'
  | 'DAV_KE'
  | 'DA_DK'
  | 'DA_GL'
  | 'DE'
  | 'DE_AT'
  | 'DE_BE'
  | 'DE_CH'
  | 'DE_DE'
  | 'DE_IT'
  | 'DE_LI'
  | 'DE_LU'
  | 'DJE'
  | 'DJE_NE'
  | 'DSB'
  | 'DSB_DE'
  | 'DUA'
  | 'DUA_CM'
  | 'DYO'
  | 'DYO_SN'
  | 'DZ'
  | 'DZ_BT'
  | 'EBU'
  | 'EBU_KE'
  | 'EE'
  | 'EE_GH'
  | 'EE_TG'
  | 'EL'
  | 'EL_CY'
  | 'EL_GR'
  | 'EN'
  | 'EN_AE'
  | 'EN_AG'
  | 'EN_AI'
  | 'EN_AS'
  | 'EN_AT'
  | 'EN_AU'
  | 'EN_BB'
  | 'EN_BE'
  | 'EN_BI'
  | 'EN_BM'
  | 'EN_BS'
  | 'EN_BW'
  | 'EN_BZ'
  | 'EN_CA'
  | 'EN_CC'
  | 'EN_CH'
  | 'EN_CK'
  | 'EN_CM'
  | 'EN_CX'
  | 'EN_CY'
  | 'EN_DE'
  | 'EN_DG'
  | 'EN_DK'
  | 'EN_DM'
  | 'EN_ER'
  | 'EN_FI'
  | 'EN_FJ'
  | 'EN_FK'
  | 'EN_FM'
  | 'EN_GB'
  | 'EN_GD'
  | 'EN_GG'
  | 'EN_GH'
  | 'EN_GI'
  | 'EN_GM'
  | 'EN_GU'
  | 'EN_GY'
  | 'EN_HK'
  | 'EN_IE'
  | 'EN_IL'
  | 'EN_IM'
  | 'EN_IN'
  | 'EN_IO'
  | 'EN_JE'
  | 'EN_JM'
  | 'EN_KE'
  | 'EN_KI'
  | 'EN_KN'
  | 'EN_KY'
  | 'EN_LC'
  | 'EN_LR'
  | 'EN_LS'
  | 'EN_MG'
  | 'EN_MH'
  | 'EN_MO'
  | 'EN_MP'
  | 'EN_MS'
  | 'EN_MT'
  | 'EN_MU'
  | 'EN_MW'
  | 'EN_MY'
  | 'EN_NA'
  | 'EN_NF'
  | 'EN_NG'
  | 'EN_NL'
  | 'EN_NR'
  | 'EN_NU'
  | 'EN_NZ'
  | 'EN_PG'
  | 'EN_PH'
  | 'EN_PK'
  | 'EN_PN'
  | 'EN_PR'
  | 'EN_PW'
  | 'EN_RW'
  | 'EN_SB'
  | 'EN_SC'
  | 'EN_SD'
  | 'EN_SE'
  | 'EN_SG'
  | 'EN_SH'
  | 'EN_SI'
  | 'EN_SL'
  | 'EN_SS'
  | 'EN_SX'
  | 'EN_SZ'
  | 'EN_TC'
  | 'EN_TK'
  | 'EN_TO'
  | 'EN_TT'
  | 'EN_TV'
  | 'EN_TZ'
  | 'EN_UG'
  | 'EN_UM'
  | 'EN_US'
  | 'EN_VC'
  | 'EN_VG'
  | 'EN_VI'
  | 'EN_VU'
  | 'EN_WS'
  | 'EN_ZA'
  | 'EN_ZM'
  | 'EN_ZW'
  | 'EO'
  | 'ES'
  | 'ES_AR'
  | 'ES_BO'
  | 'ES_BR'
  | 'ES_BZ'
  | 'ES_CL'
  | 'ES_CO'
  | 'ES_CR'
  | 'ES_CU'
  | 'ES_DO'
  | 'ES_EA'
  | 'ES_EC'
  | 'ES_ES'
  | 'ES_GQ'
  | 'ES_GT'
  | 'ES_HN'
  | 'ES_IC'
  | 'ES_MX'
  | 'ES_NI'
  | 'ES_PA'
  | 'ES_PE'
  | 'ES_PH'
  | 'ES_PR'
  | 'ES_PY'
  | 'ES_SV'
  | 'ES_US'
  | 'ES_UY'
  | 'ES_VE'
  | 'ET'
  | 'ET_EE'
  | 'EU'
  | 'EU_ES'
  | 'EWO'
  | 'EWO_CM'
  | 'FA'
  | 'FA_AF'
  | 'FA_IR'
  | 'FF'
  | 'FF_ADLM'
  | 'FF_ADLM_BF'
  | 'FF_ADLM_CM'
  | 'FF_ADLM_GH'
  | 'FF_ADLM_GM'
  | 'FF_ADLM_GN'
  | 'FF_ADLM_GW'
  | 'FF_ADLM_LR'
  | 'FF_ADLM_MR'
  | 'FF_ADLM_NE'
  | 'FF_ADLM_NG'
  | 'FF_ADLM_SL'
  | 'FF_ADLM_SN'
  | 'FF_LATN'
  | 'FF_LATN_BF'
  | 'FF_LATN_CM'
  | 'FF_LATN_GH'
  | 'FF_LATN_GM'
  | 'FF_LATN_GN'
  | 'FF_LATN_GW'
  | 'FF_LATN_LR'
  | 'FF_LATN_MR'
  | 'FF_LATN_NE'
  | 'FF_LATN_NG'
  | 'FF_LATN_SL'
  | 'FF_LATN_SN'
  | 'FI'
  | 'FIL'
  | 'FIL_PH'
  | 'FI_FI'
  | 'FO'
  | 'FO_DK'
  | 'FO_FO'
  | 'FR'
  | 'FR_BE'
  | 'FR_BF'
  | 'FR_BI'
  | 'FR_BJ'
  | 'FR_BL'
  | 'FR_CA'
  | 'FR_CD'
  | 'FR_CF'
  | 'FR_CG'
  | 'FR_CH'
  | 'FR_CI'
  | 'FR_CM'
  | 'FR_DJ'
  | 'FR_DZ'
  | 'FR_FR'
  | 'FR_GA'
  | 'FR_GF'
  | 'FR_GN'
  | 'FR_GP'
  | 'FR_GQ'
  | 'FR_HT'
  | 'FR_KM'
  | 'FR_LU'
  | 'FR_MA'
  | 'FR_MC'
  | 'FR_MF'
  | 'FR_MG'
  | 'FR_ML'
  | 'FR_MQ'
  | 'FR_MR'
  | 'FR_MU'
  | 'FR_NC'
  | 'FR_NE'
  | 'FR_PF'
  | 'FR_PM'
  | 'FR_RE'
  | 'FR_RW'
  | 'FR_SC'
  | 'FR_SN'
  | 'FR_SY'
  | 'FR_TD'
  | 'FR_TG'
  | 'FR_TN'
  | 'FR_VU'
  | 'FR_WF'
  | 'FR_YT'
  | 'FUR'
  | 'FUR_IT'
  | 'FY'
  | 'FY_NL'
  | 'GA'
  | 'GA_GB'
  | 'GA_IE'
  | 'GD'
  | 'GD_GB'
  | 'GL'
  | 'GL_ES'
  | 'GSW'
  | 'GSW_CH'
  | 'GSW_FR'
  | 'GSW_LI'
  | 'GU'
  | 'GUZ'
  | 'GUZ_KE'
  | 'GU_IN'
  | 'GV'
  | 'GV_IM'
  | 'HA'
  | 'HAW'
  | 'HAW_US'
  | 'HA_GH'
  | 'HA_NE'
  | 'HA_NG'
  | 'HE'
  | 'HE_IL'
  | 'HI'
  | 'HI_IN'
  | 'HR'
  | 'HR_BA'
  | 'HR_HR'
  | 'HSB'
  | 'HSB_DE'
  | 'HU'
  | 'HU_HU'
  | 'HY'
  | 'HY_AM'
  | 'IA'
  | 'ID'
  | 'ID_ID'
  | 'IG'
  | 'IG_NG'
  | 'II'
  | 'II_CN'
  | 'IS'
  | 'IS_IS'
  | 'IT'
  | 'IT_CH'
  | 'IT_IT'
  | 'IT_SM'
  | 'IT_VA'
  | 'JA'
  | 'JA_JP'
  | 'JGO'
  | 'JGO_CM'
  | 'JMC'
  | 'JMC_TZ'
  | 'JV'
  | 'JV_ID'
  | 'KA'
  | 'KAB'
  | 'KAB_DZ'
  | 'KAM'
  | 'KAM_KE'
  | 'KA_GE'
  | 'KDE'
  | 'KDE_TZ'
  | 'KEA'
  | 'KEA_CV'
  | 'KHQ'
  | 'KHQ_ML'
  | 'KI'
  | 'KI_KE'
  | 'KK'
  | 'KKJ'
  | 'KKJ_CM'
  | 'KK_KZ'
  | 'KL'
  | 'KLN'
  | 'KLN_KE'
  | 'KL_GL'
  | 'KM'
  | 'KM_KH'
  | 'KN'
  | 'KN_IN'
  | 'KO'
  | 'KOK'
  | 'KOK_IN'
  | 'KO_KP'
  | 'KO_KR'
  | 'KS'
  | 'KSB'
  | 'KSB_TZ'
  | 'KSF'
  | 'KSF_CM'
  | 'KSH'
  | 'KSH_DE'
  | 'KS_ARAB'
  | 'KS_ARAB_IN'
  | 'KU'
  | 'KU_TR'
  | 'KW'
  | 'KW_GB'
  | 'KY'
  | 'KY_KG'
  | 'LAG'
  | 'LAG_TZ'
  | 'LB'
  | 'LB_LU'
  | 'LG'
  | 'LG_UG'
  | 'LKT'
  | 'LKT_US'
  | 'LN'
  | 'LN_AO'
  | 'LN_CD'
  | 'LN_CF'
  | 'LN_CG'
  | 'LO'
  | 'LO_LA'
  | 'LRC'
  | 'LRC_IQ'
  | 'LRC_IR'
  | 'LT'
  | 'LT_LT'
  | 'LU'
  | 'LUO'
  | 'LUO_KE'
  | 'LUY'
  | 'LUY_KE'
  | 'LU_CD'
  | 'LV'
  | 'LV_LV'
  | 'MAI'
  | 'MAI_IN'
  | 'MAS'
  | 'MAS_KE'
  | 'MAS_TZ'
  | 'MER'
  | 'MER_KE'
  | 'MFE'
  | 'MFE_MU'
  | 'MG'
  | 'MGH'
  | 'MGH_MZ'
  | 'MGO'
  | 'MGO_CM'
  | 'MG_MG'
  | 'MI'
  | 'MI_NZ'
  | 'MK'
  | 'MK_MK'
  | 'ML'
  | 'ML_IN'
  | 'MN'
  | 'MNI'
  | 'MNI_BENG'
  | 'MNI_BENG_IN'
  | 'MN_MN'
  | 'MR'
  | 'MR_IN'
  | 'MS'
  | 'MS_BN'
  | 'MS_ID'
  | 'MS_MY'
  | 'MS_SG'
  | 'MT'
  | 'MT_MT'
  | 'MUA'
  | 'MUA_CM'
  | 'MY'
  | 'MY_MM'
  | 'MZN'
  | 'MZN_IR'
  | 'NAQ'
  | 'NAQ_NA'
  | 'NB'
  | 'NB_NO'
  | 'NB_SJ'
  | 'ND'
  | 'NDS'
  | 'NDS_DE'
  | 'NDS_NL'
  | 'ND_ZW'
  | 'NE'
  | 'NE_IN'
  | 'NE_NP'
  | 'NL'
  | 'NL_AW'
  | 'NL_BE'
  | 'NL_BQ'
  | 'NL_CW'
  | 'NL_NL'
  | 'NL_SR'
  | 'NL_SX'
  | 'NMG'
  | 'NMG_CM'
  | 'NN'
  | 'NNH'
  | 'NNH_CM'
  | 'NN_NO'
  | 'NUS'
  | 'NUS_SS'
  | 'NYN'
  | 'NYN_UG'
  | 'OM'
  | 'OM_ET'
  | 'OM_KE'
  | 'OR'
  | 'OR_IN'
  | 'OS'
  | 'OS_GE'
  | 'OS_RU'
  | 'PA'
  | 'PA_ARAB'
  | 'PA_ARAB_PK'
  | 'PA_GURU'
  | 'PA_GURU_IN'
  | 'PCM'
  | 'PCM_NG'
  | 'PL'
  | 'PL_PL'
  | 'PRG'
  | 'PS'
  | 'PS_AF'
  | 'PS_PK'
  | 'PT'
  | 'PT_AO'
  | 'PT_BR'
  | 'PT_CH'
  | 'PT_CV'
  | 'PT_GQ'
  | 'PT_GW'
  | 'PT_LU'
  | 'PT_MO'
  | 'PT_MZ'
  | 'PT_PT'
  | 'PT_ST'
  | 'PT_TL'
  | 'QU'
  | 'QU_BO'
  | 'QU_EC'
  | 'QU_PE'
  | 'RM'
  | 'RM_CH'
  | 'RN'
  | 'RN_BI'
  | 'RO'
  | 'ROF'
  | 'ROF_TZ'
  | 'RO_MD'
  | 'RO_RO'
  | 'RU'
  | 'RU_BY'
  | 'RU_KG'
  | 'RU_KZ'
  | 'RU_MD'
  | 'RU_RU'
  | 'RU_UA'
  | 'RW'
  | 'RWK'
  | 'RWK_TZ'
  | 'RW_RW'
  | 'SAH'
  | 'SAH_RU'
  | 'SAQ'
  | 'SAQ_KE'
  | 'SAT'
  | 'SAT_OLCK'
  | 'SAT_OLCK_IN'
  | 'SBP'
  | 'SBP_TZ'
  | 'SD'
  | 'SD_ARAB'
  | 'SD_ARAB_PK'
  | 'SD_DEVA'
  | 'SD_DEVA_IN'
  | 'SE'
  | 'SEH'
  | 'SEH_MZ'
  | 'SES'
  | 'SES_ML'
  | 'SE_FI'
  | 'SE_NO'
  | 'SE_SE'
  | 'SG'
  | 'SG_CF'
  | 'SHI'
  | 'SHI_LATN'
  | 'SHI_LATN_MA'
  | 'SHI_TFNG'
  | 'SHI_TFNG_MA'
  | 'SI'
  | 'SI_LK'
  | 'SK'
  | 'SK_SK'
  | 'SL'
  | 'SL_SI'
  | 'SMN'
  | 'SMN_FI'
  | 'SN'
  | 'SN_ZW'
  | 'SO'
  | 'SO_DJ'
  | 'SO_ET'
  | 'SO_KE'
  | 'SO_SO'
  | 'SQ'
  | 'SQ_AL'
  | 'SQ_MK'
  | 'SQ_XK'
  | 'SR'
  | 'SR_CYRL'
  | 'SR_CYRL_BA'
  | 'SR_CYRL_ME'
  | 'SR_CYRL_RS'
  | 'SR_CYRL_XK'
  | 'SR_LATN'
  | 'SR_LATN_BA'
  | 'SR_LATN_ME'
  | 'SR_LATN_RS'
  | 'SR_LATN_XK'
  | 'SU'
  | 'SU_LATN'
  | 'SU_LATN_ID'
  | 'SV'
  | 'SV_AX'
  | 'SV_FI'
  | 'SV_SE'
  | 'SW'
  | 'SW_CD'
  | 'SW_KE'
  | 'SW_TZ'
  | 'SW_UG'
  | 'TA'
  | 'TA_IN'
  | 'TA_LK'
  | 'TA_MY'
  | 'TA_SG'
  | 'TE'
  | 'TEO'
  | 'TEO_KE'
  | 'TEO_UG'
  | 'TE_IN'
  | 'TG'
  | 'TG_TJ'
  | 'TH'
  | 'TH_TH'
  | 'TI'
  | 'TI_ER'
  | 'TI_ET'
  | 'TK'
  | 'TK_TM'
  | 'TO'
  | 'TO_TO'
  | 'TR'
  | 'TR_CY'
  | 'TR_TR'
  | 'TT'
  | 'TT_RU'
  | 'TWQ'
  | 'TWQ_NE'
  | 'TZM'
  | 'TZM_MA'
  | 'UG'
  | 'UG_CN'
  | 'UK'
  | 'UK_UA'
  | 'UR'
  | 'UR_IN'
  | 'UR_PK'
  | 'UZ'
  | 'UZ_ARAB'
  | 'UZ_ARAB_AF'
  | 'UZ_CYRL'
  | 'UZ_CYRL_UZ'
  | 'UZ_LATN'
  | 'UZ_LATN_UZ'
  | 'VAI'
  | 'VAI_LATN'
  | 'VAI_LATN_LR'
  | 'VAI_VAII'
  | 'VAI_VAII_LR'
  | 'VI'
  | 'VI_VN'
  | 'VO'
  | 'VUN'
  | 'VUN_TZ'
  | 'WAE'
  | 'WAE_CH'
  | 'WO'
  | 'WO_SN'
  | 'XH'
  | 'XH_ZA'
  | 'XOG'
  | 'XOG_UG'
  | 'YAV'
  | 'YAV_CM'
  | 'YI'
  | 'YO'
  | 'YO_BJ'
  | 'YO_NG'
  | 'YUE'
  | 'YUE_HANS'
  | 'YUE_HANS_CN'
  | 'YUE_HANT'
  | 'YUE_HANT_HK'
  | 'ZGH'
  | 'ZGH_MA'
  | 'ZH'
  | 'ZH_HANS'
  | 'ZH_HANS_CN'
  | 'ZH_HANS_HK'
  | 'ZH_HANS_MO'
  | 'ZH_HANS_SG'
  | 'ZH_HANT'
  | 'ZH_HANT_HK'
  | 'ZH_HANT_MO'
  | 'ZH_HANT_TW'
  | 'ZU'
  | 'ZU_ZA';

export type LanguageDisplay = {
  __typename?: 'LanguageDisplay';
  /** ISO 639 representation of the language name. */
  code: LanguageCodeEnum;
  /** Full name of the language. */
  language: Scalars['String'];
};

export type LimitInfo = {
  __typename?: 'LimitInfo';
  /** Defines the allowed maximum resource usage, null means unlimited. */
  allowedUsage: Limits;
  /** Defines the current resource usage. */
  currentUsage: Limits;
};

export type Limits = {
  __typename?: 'Limits';
  channels?: Maybe<Scalars['Int']>;
  orders?: Maybe<Scalars['Int']>;
  productVariants?: Maybe<Scalars['Int']>;
  staffUsers?: Maybe<Scalars['Int']>;
  warehouses?: Maybe<Scalars['Int']>;
};

/** The manifest definition. */
export type Manifest = {
  __typename?: 'Manifest';
  about?: Maybe<Scalars['String']>;
  appUrl?: Maybe<Scalars['String']>;
  configurationUrl?: Maybe<Scalars['String']>;
  dataPrivacy?: Maybe<Scalars['String']>;
  dataPrivacyUrl?: Maybe<Scalars['String']>;
  extensions: Array<AppManifestExtension>;
  homepageUrl?: Maybe<Scalars['String']>;
  identifier: Scalars['String'];
  name: Scalars['String'];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  supportUrl?: Maybe<Scalars['String']>;
  tokenTargetUrl?: Maybe<Scalars['String']>;
  version: Scalars['String'];
};

export type Margin = {
  __typename?: 'Margin';
  start?: Maybe<Scalars['Int']>;
  stop?: Maybe<Scalars['Int']>;
};

/** An enumeration. */
export type MeasurementUnitsEnum =
  | 'ACRE_FT'
  | 'ACRE_IN'
  | 'CM'
  | 'CUBIC_CENTIMETER'
  | 'CUBIC_DECIMETER'
  | 'CUBIC_FOOT'
  | 'CUBIC_INCH'
  | 'CUBIC_METER'
  | 'CUBIC_MILLIMETER'
  | 'CUBIC_YARD'
  | 'FL_OZ'
  | 'FT'
  | 'G'
  | 'INCH'
  | 'KG'
  | 'KM'
  | 'LB'
  | 'LITER'
  | 'M'
  | 'OZ'
  | 'PINT'
  | 'QT'
  | 'SQ_CM'
  | 'SQ_FT'
  | 'SQ_INCH'
  | 'SQ_KM'
  | 'SQ_M'
  | 'SQ_YD'
  | 'TONNE'
  | 'YD';

/** Represents a single menu - an object that is used to help navigate through the store. */
export type Menu = Node & ObjectWithMetadata & {
  __typename?: 'Menu';
  id: Scalars['ID'];
  items?: Maybe<Array<Maybe<MenuItem>>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  slug: Scalars['String'];
};

/** Deletes menus. */
export type MenuBulkDelete = {
  __typename?: 'MenuBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<MenuError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

export type MenuCountableConnection = {
  __typename?: 'MenuCountableConnection';
  edges: Array<MenuCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type MenuCountableEdge = {
  __typename?: 'MenuCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Menu;
};

/** Creates a new Menu. */
export type MenuCreate = {
  __typename?: 'MenuCreate';
  errors: Array<MenuError>;
  menu?: Maybe<Menu>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

export type MenuCreateInput = {
  /** List of menu items. */
  items?: InputMaybe<Array<InputMaybe<MenuItemInput>>>;
  /** Name of the menu. */
  name: Scalars['String'];
  /** Slug of the menu. Will be generated if not provided. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Deletes a menu. */
export type MenuDelete = {
  __typename?: 'MenuDelete';
  errors: Array<MenuError>;
  menu?: Maybe<Menu>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

export type MenuError = {
  __typename?: 'MenuError';
  /** The error code. */
  code: MenuErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type MenuErrorCode =
  | 'CANNOT_ASSIGN_NODE'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'INVALID_MENU_ITEM'
  | 'NOT_FOUND'
  | 'NO_MENU_ITEM_PROVIDED'
  | 'REQUIRED'
  | 'TOO_MANY_MENU_ITEMS'
  | 'UNIQUE';

export type MenuFilterInput = {
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MenuInput = {
  /** Name of the menu. */
  name?: InputMaybe<Scalars['String']>;
  /** Slug of the menu. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Represents a single item of the related menu. Can store categories, collection or pages. */
export type MenuItem = Node & ObjectWithMetadata & {
  __typename?: 'MenuItem';
  category?: Maybe<Category>;
  children?: Maybe<Array<Maybe<MenuItem>>>;
  collection?: Maybe<Collection>;
  id: Scalars['ID'];
  level: Scalars['Int'];
  menu: Menu;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  page?: Maybe<Page>;
  parent?: Maybe<MenuItem>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Returns translated menu item fields for the given language code. */
  translation?: Maybe<MenuItemTranslation>;
  /** URL to the menu item. */
  url?: Maybe<Scalars['String']>;
};


/** Represents a single item of the related menu. Can store categories, collection or pages. */
export type MenuItemTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes menu items. */
export type MenuItemBulkDelete = {
  __typename?: 'MenuItemBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<MenuError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

export type MenuItemCountableConnection = {
  __typename?: 'MenuItemCountableConnection';
  edges: Array<MenuItemCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type MenuItemCountableEdge = {
  __typename?: 'MenuItemCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: MenuItem;
};

/** Creates a new menu item. */
export type MenuItemCreate = {
  __typename?: 'MenuItemCreate';
  errors: Array<MenuError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export type MenuItemCreateInput = {
  /** Category to which item points. */
  category?: InputMaybe<Scalars['ID']>;
  /** Collection to which item points. */
  collection?: InputMaybe<Scalars['ID']>;
  /** Menu to which item belongs. */
  menu: Scalars['ID'];
  /** Name of the menu item. */
  name: Scalars['String'];
  /** Page to which item points. */
  page?: InputMaybe<Scalars['ID']>;
  /** ID of the parent menu. If empty, menu will be top level menu. */
  parent?: InputMaybe<Scalars['ID']>;
  /** URL of the pointed item. */
  url?: InputMaybe<Scalars['String']>;
};

/** Deletes a menu item. */
export type MenuItemDelete = {
  __typename?: 'MenuItemDelete';
  errors: Array<MenuError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export type MenuItemFilterInput = {
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
};

export type MenuItemInput = {
  /** Category to which item points. */
  category?: InputMaybe<Scalars['ID']>;
  /** Collection to which item points. */
  collection?: InputMaybe<Scalars['ID']>;
  /** Name of the menu item. */
  name?: InputMaybe<Scalars['String']>;
  /** Page to which item points. */
  page?: InputMaybe<Scalars['ID']>;
  /** URL of the pointed item. */
  url?: InputMaybe<Scalars['String']>;
};

/** Moves items of menus. */
export type MenuItemMove = {
  __typename?: 'MenuItemMove';
  errors: Array<MenuError>;
  /** Assigned menu to move within. */
  menu?: Maybe<Menu>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

export type MenuItemMoveInput = {
  /** The menu item ID to move. */
  itemId: Scalars['ID'];
  /** ID of the parent menu. If empty, menu will be top level menu. */
  parentId?: InputMaybe<Scalars['ID']>;
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type MenuItemSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort menu items by the selected field. */
  field: MenuItemsSortField;
};

export type MenuItemTranslatableContent = Node & {
  __typename?: 'MenuItemTranslatableContent';
  id: Scalars['ID'];
  /**
   * Represents a single item of the related menu. Can store categories, collection or pages.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  menuItem?: Maybe<MenuItem>;
  name: Scalars['String'];
  /** Returns translated menu item fields for the given language code. */
  translation?: Maybe<MenuItemTranslation>;
};


export type MenuItemTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a menu item. */
export type MenuItemTranslate = {
  __typename?: 'MenuItemTranslate';
  errors: Array<TranslationError>;
  menuItem?: Maybe<MenuItem>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type MenuItemTranslation = Node & {
  __typename?: 'MenuItemTranslation';
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
};

/** Updates a menu item. */
export type MenuItemUpdate = {
  __typename?: 'MenuItemUpdate';
  errors: Array<MenuError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export type MenuItemsSortField =
  /** Sort menu items by name. */
  | 'NAME';

export type MenuSortField =
  /** Sort menus by items count. */
  | 'ITEMS_COUNT'
  /** Sort menus by name. */
  | 'NAME';

export type MenuSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort menus by the selected field. */
  field: MenuSortField;
};

/** Updates a menu. */
export type MenuUpdate = {
  __typename?: 'MenuUpdate';
  errors: Array<MenuError>;
  menu?: Maybe<Menu>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  menuErrors: Array<MenuError>;
};

export type MetadataError = {
  __typename?: 'MetadataError';
  /** The error code. */
  code: MetadataErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type MetadataErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'NOT_UPDATED'
  | 'REQUIRED';

export type MetadataFilter = {
  /** Key of a metadata item. */
  key: Scalars['String'];
  /** Value of a metadata item. */
  value?: InputMaybe<Scalars['String']>;
};

export type MetadataInput = {
  /** Key of a metadata item. */
  key: Scalars['String'];
  /** Value of a metadata item. */
  value: Scalars['String'];
};

export type MetadataItem = {
  __typename?: 'MetadataItem';
  /** Key of a metadata item. */
  key: Scalars['String'];
  /** Value of a metadata item. */
  value: Scalars['String'];
};

/** Represents amount of money in specific currency. */
export type Money = {
  __typename?: 'Money';
  /** Amount of money. */
  amount: Scalars['Float'];
  /** Currency code. */
  currency: Scalars['String'];
};

export type MoneyInput = {
  /** Amount of money. */
  amount: Scalars['PositiveDecimal'];
  /** Currency code. */
  currency: Scalars['String'];
};

/** Represents a range of amounts of money. */
export type MoneyRange = {
  __typename?: 'MoneyRange';
  /** Lower bound of a price range. */
  start?: Maybe<Money>;
  /** Upper bound of a price range. */
  stop?: Maybe<Money>;
};

export type MoveProductInput = {
  /** The ID of the product to move. */
  productId: Scalars['ID'];
  /** The relative sorting position of the product (from -inf to +inf) starting from the first given product's actual position.1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new address for the customer. */
  accountAddressCreate?: Maybe<AccountAddressCreate>;
  /** Delete an address of the logged-in user. */
  accountAddressDelete?: Maybe<AccountAddressDelete>;
  /** Updates an address of the logged-in user. */
  accountAddressUpdate?: Maybe<AccountAddressUpdate>;
  /** Remove user account. */
  accountDelete?: Maybe<AccountDelete>;
  /** Register a new user. */
  accountRegister?: Maybe<AccountRegister>;
  /** Sends an email with the account removal link for the logged-in user. */
  accountRequestDeletion?: Maybe<AccountRequestDeletion>;
  /** Sets a default address for the authenticated user. */
  accountSetDefaultAddress?: Maybe<AccountSetDefaultAddress>;
  /** Updates the account of the logged-in user. */
  accountUpdate?: Maybe<AccountUpdate>;
  /** Creates user address. */
  addressCreate?: Maybe<AddressCreate>;
  /** Deletes an address. */
  addressDelete?: Maybe<AddressDelete>;
  /** Sets a default address for the given user. */
  addressSetDefault?: Maybe<AddressSetDefault>;
  /** Updates an address. */
  addressUpdate?: Maybe<AddressUpdate>;
  /** Activate the app. */
  appActivate?: Maybe<AppActivate>;
  /** Creates a new app. */
  appCreate?: Maybe<AppCreate>;
  /** Deactivate the app. */
  appDeactivate?: Maybe<AppDeactivate>;
  /** Deletes an app. */
  appDelete?: Maybe<AppDelete>;
  /** Delete failed installation. */
  appDeleteFailedInstallation?: Maybe<AppDeleteFailedInstallation>;
  /** Fetch and validate manifest. */
  appFetchManifest?: Maybe<AppFetchManifest>;
  /** Install new app by using app manifest. */
  appInstall?: Maybe<AppInstall>;
  /** Retry failed installation of new app. */
  appRetryInstall?: Maybe<AppRetryInstall>;
  /** Creates a new token. */
  appTokenCreate?: Maybe<AppTokenCreate>;
  /** Deletes an authentication token assigned to app. */
  appTokenDelete?: Maybe<AppTokenDelete>;
  /** Verify provided app token. */
  appTokenVerify?: Maybe<AppTokenVerify>;
  /** Updates an existing app. */
  appUpdate?: Maybe<AppUpdate>;
  /** Assigns storefront's navigation menus. */
  assignNavigation?: Maybe<AssignNavigation>;
  /** Add shipping zone to given warehouse. */
  assignWarehouseShippingZone?: Maybe<WarehouseShippingZoneAssign>;
  /** Deletes attributes. */
  attributeBulkDelete?: Maybe<AttributeBulkDelete>;
  /** Creates an attribute. */
  attributeCreate?: Maybe<AttributeCreate>;
  /** Deletes an attribute. */
  attributeDelete?: Maybe<AttributeDelete>;
  /** Reorder the values of an attribute. */
  attributeReorderValues?: Maybe<AttributeReorderValues>;
  /** Creates/updates translations for an attribute. */
  attributeTranslate?: Maybe<AttributeTranslate>;
  /** Updates attribute. */
  attributeUpdate?: Maybe<AttributeUpdate>;
  /** Deletes values of attributes. */
  attributeValueBulkDelete?: Maybe<AttributeValueBulkDelete>;
  /** Creates a value for an attribute. */
  attributeValueCreate?: Maybe<AttributeValueCreate>;
  /** Deletes a value of an attribute. */
  attributeValueDelete?: Maybe<AttributeValueDelete>;
  /** Creates/updates translations for an attribute value. */
  attributeValueTranslate?: Maybe<AttributeValueTranslate>;
  /** Updates value of an attribute. */
  attributeValueUpdate?: Maybe<AttributeValueUpdate>;
  /** Deletes categories. */
  categoryBulkDelete?: Maybe<CategoryBulkDelete>;
  /** Creates a new category. */
  categoryCreate?: Maybe<CategoryCreate>;
  /** Deletes a category. */
  categoryDelete?: Maybe<CategoryDelete>;
  /** Creates/updates translations for a category. */
  categoryTranslate?: Maybe<CategoryTranslate>;
  /** Updates a category. */
  categoryUpdate?: Maybe<CategoryUpdate>;
  /** Activate a channel. */
  channelActivate?: Maybe<ChannelActivate>;
  /** Creates new channel. */
  channelCreate?: Maybe<ChannelCreate>;
  /** Deactivate a channel. */
  channelDeactivate?: Maybe<ChannelDeactivate>;
  /** Delete a channel. Orders associated with the deleted channel will be moved to the target channel. Checkouts, product availability, and pricing will be removed. */
  channelDelete?: Maybe<ChannelDelete>;
  /** Update a channel. */
  channelUpdate?: Maybe<ChannelUpdate>;
  /** Adds a gift card or a voucher to a checkout. */
  checkoutAddPromoCode?: Maybe<CheckoutAddPromoCode>;
  /** Update billing address in the existing checkout. */
  checkoutBillingAddressUpdate?: Maybe<CheckoutBillingAddressUpdate>;
  /** Completes the checkout. As a result a new order is created and a payment charge is made. This action requires a successful payment before it can be performed. In case additional confirmation step as 3D secure is required confirmationNeeded flag will be set to True and no order created until payment is confirmed with second call of this mutation. */
  checkoutComplete?: Maybe<CheckoutComplete>;
  /** Create a new checkout. */
  checkoutCreate?: Maybe<CheckoutCreate>;
  /** Sets the customer as the owner of the checkout. */
  checkoutCustomerAttach?: Maybe<CheckoutCustomerAttach>;
  /** Removes the user assigned as the owner of the checkout. */
  checkoutCustomerDetach?: Maybe<CheckoutCustomerDetach>;
  /** New in Saleor 3.1. Updates the delivery method (shipping method or pick up point) of the checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
  checkoutDeliveryMethodUpdate?: Maybe<CheckoutDeliveryMethodUpdate>;
  /** Updates email address in the existing checkout object. */
  checkoutEmailUpdate?: Maybe<CheckoutEmailUpdate>;
  /** Update language code in the existing checkout. */
  checkoutLanguageCodeUpdate?: Maybe<CheckoutLanguageCodeUpdate>;
  /**
   * Deletes a CheckoutLine.
   * @deprecated DEPRECATED: Will be removed in Saleor 4.0. Use `checkoutLinesDelete` instead.
   */
  checkoutLineDelete?: Maybe<CheckoutLineDelete>;
  /** Adds a checkout line to the existing checkout.If line was already in checkout, its quantity will be increased. */
  checkoutLinesAdd?: Maybe<CheckoutLinesAdd>;
  /** Deletes checkout lines. */
  checkoutLinesDelete?: Maybe<CheckoutLinesDelete>;
  /** Updates checkout line in the existing checkout. */
  checkoutLinesUpdate?: Maybe<CheckoutLinesUpdate>;
  /** Create a new payment for given checkout. */
  checkoutPaymentCreate?: Maybe<CheckoutPaymentCreate>;
  /** Remove a gift card or a voucher from a checkout. */
  checkoutRemovePromoCode?: Maybe<CheckoutRemovePromoCode>;
  /** Update shipping address in the existing checkout. */
  checkoutShippingAddressUpdate?: Maybe<CheckoutShippingAddressUpdate>;
  /**
   * Updates the shipping method of the checkout.
   * @deprecated This field will be removed in Saleor 4.0. Use `checkoutDeliveryMethodUpdate` instead.
   */
  checkoutShippingMethodUpdate?: Maybe<CheckoutShippingMethodUpdate>;
  /** Adds products to a collection. */
  collectionAddProducts?: Maybe<CollectionAddProducts>;
  /** Deletes collections. */
  collectionBulkDelete?: Maybe<CollectionBulkDelete>;
  /** Manage collection's availability in channels. */
  collectionChannelListingUpdate?: Maybe<CollectionChannelListingUpdate>;
  /** Creates a new collection. */
  collectionCreate?: Maybe<CollectionCreate>;
  /** Deletes a collection. */
  collectionDelete?: Maybe<CollectionDelete>;
  /** Remove products from a collection. */
  collectionRemoveProducts?: Maybe<CollectionRemoveProducts>;
  /** Reorder the products of a collection. */
  collectionReorderProducts?: Maybe<CollectionReorderProducts>;
  /** Creates/updates translations for a collection. */
  collectionTranslate?: Maybe<CollectionTranslate>;
  /** Updates a collection. */
  collectionUpdate?: Maybe<CollectionUpdate>;
  /** Confirm user account with token sent by email during registration. */
  confirmAccount?: Maybe<ConfirmAccount>;
  /** Confirm the email change of the logged-in user. */
  confirmEmailChange?: Maybe<ConfirmEmailChange>;
  /** Creates new warehouse. */
  createWarehouse?: Maybe<WarehouseCreate>;
  /** Deletes customers. */
  customerBulkDelete?: Maybe<CustomerBulkDelete>;
  /** Creates a new customer. */
  customerCreate?: Maybe<CustomerCreate>;
  /** Deletes a customer. */
  customerDelete?: Maybe<CustomerDelete>;
  /** Updates an existing customer. */
  customerUpdate?: Maybe<CustomerUpdate>;
  /** Delete metadata of an object. */
  deleteMetadata?: Maybe<DeleteMetadata>;
  /** Delete object's private metadata. */
  deletePrivateMetadata?: Maybe<DeletePrivateMetadata>;
  /** Deletes selected warehouse. */
  deleteWarehouse?: Maybe<WarehouseDelete>;
  /** Create new digital content. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  digitalContentCreate?: Maybe<DigitalContentCreate>;
  /** Remove digital content assigned to given variant. */
  digitalContentDelete?: Maybe<DigitalContentDelete>;
  /** Update digital content. */
  digitalContentUpdate?: Maybe<DigitalContentUpdate>;
  /** Generate new URL to digital content. */
  digitalContentUrlCreate?: Maybe<DigitalContentUrlCreate>;
  /** Deletes draft orders. */
  draftOrderBulkDelete?: Maybe<DraftOrderBulkDelete>;
  /** Completes creating an order. */
  draftOrderComplete?: Maybe<DraftOrderComplete>;
  /** Creates a new draft order. */
  draftOrderCreate?: Maybe<DraftOrderCreate>;
  /** Deletes a draft order. */
  draftOrderDelete?: Maybe<DraftOrderDelete>;
  /**
   * Deletes order lines.
   * @deprecated This field will be removed in Saleor 4.0.
   */
  draftOrderLinesBulkDelete?: Maybe<DraftOrderLinesBulkDelete>;
  /** Updates a draft order. */
  draftOrderUpdate?: Maybe<DraftOrderUpdate>;
  /** Retries event delivery. */
  eventDeliveryRetry?: Maybe<EventDeliveryRetry>;
  /** New in Saleor 3.1. Export gift cards to csv file. Note: this feature is in a preview state and can be subject to changes at later point. */
  exportGiftCards?: Maybe<ExportGiftCards>;
  /** Export products to csv file. */
  exportProducts?: Maybe<ExportProducts>;
  /** Prepare external authentication url for user by custom plugin. */
  externalAuthenticationUrl?: Maybe<ExternalAuthenticationUrl>;
  /** Logout user by custom plugin. */
  externalLogout?: Maybe<ExternalLogout>;
  /** New in Saleor 3.1. Trigger sending a notification with the notify plugin method. Serializes nodes provided as ids parameter and includes this data in the notification payload. */
  externalNotificationTrigger?: Maybe<ExternalNotificationTrigger>;
  /** Obtain external access tokens for user by custom plugin. */
  externalObtainAccessTokens?: Maybe<ExternalObtainAccessTokens>;
  /** Refresh user's access by custom plugin. */
  externalRefresh?: Maybe<ExternalRefresh>;
  /** Verify external authentication data by plugin. */
  externalVerify?: Maybe<ExternalVerify>;
  /** Upload a file. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  fileUpload?: Maybe<FileUpload>;
  /** Activate a gift card. */
  giftCardActivate?: Maybe<GiftCardActivate>;
  /** New in Saleor 3.1. Adds note to the gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardAddNote?: Maybe<GiftCardAddNote>;
  /** New in Saleor 3.1. Activate gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardBulkActivate?: Maybe<GiftCardBulkActivate>;
  /** New in Saleor 3.1. Create gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardBulkCreate?: Maybe<GiftCardBulkCreate>;
  /** New in Saleor 3.1. Deactivate gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardBulkDeactivate?: Maybe<GiftCardBulkDeactivate>;
  /** New in Saleor 3.1. Delete gift cards. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardBulkDelete?: Maybe<GiftCardBulkDelete>;
  /** Creates a new gift card. */
  giftCardCreate?: Maybe<GiftCardCreate>;
  /** Deactivate a gift card. */
  giftCardDeactivate?: Maybe<GiftCardDeactivate>;
  /** New in Saleor 3.1. Delete gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardDelete?: Maybe<GiftCardDelete>;
  /** New in Saleor 3.1. Resend a gift card. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardResend?: Maybe<GiftCardResend>;
  /** Update gift card settings. */
  giftCardSettingsUpdate?: Maybe<GiftCardSettingsUpdate>;
  /** Update a gift card. */
  giftCardUpdate?: Maybe<GiftCardUpdate>;
  /** Creates a ready to send invoice. */
  invoiceCreate?: Maybe<InvoiceCreate>;
  /** Deletes an invoice. */
  invoiceDelete?: Maybe<InvoiceDelete>;
  /** Request an invoice for the order using plugin. */
  invoiceRequest?: Maybe<InvoiceRequest>;
  /** Requests deletion of an invoice. */
  invoiceRequestDelete?: Maybe<InvoiceRequestDelete>;
  /** Send an invoice notification to the customer. */
  invoiceSendNotification?: Maybe<InvoiceSendNotification>;
  /** Updates an invoice. */
  invoiceUpdate?: Maybe<InvoiceUpdate>;
  /** Deletes menus. */
  menuBulkDelete?: Maybe<MenuBulkDelete>;
  /** Creates a new Menu. */
  menuCreate?: Maybe<MenuCreate>;
  /** Deletes a menu. */
  menuDelete?: Maybe<MenuDelete>;
  /** Deletes menu items. */
  menuItemBulkDelete?: Maybe<MenuItemBulkDelete>;
  /** Creates a new menu item. */
  menuItemCreate?: Maybe<MenuItemCreate>;
  /** Deletes a menu item. */
  menuItemDelete?: Maybe<MenuItemDelete>;
  /** Moves items of menus. */
  menuItemMove?: Maybe<MenuItemMove>;
  /** Creates/updates translations for a menu item. */
  menuItemTranslate?: Maybe<MenuItemTranslate>;
  /** Updates a menu item. */
  menuItemUpdate?: Maybe<MenuItemUpdate>;
  /** Updates a menu. */
  menuUpdate?: Maybe<MenuUpdate>;
  /** Adds note to the order. */
  orderAddNote?: Maybe<OrderAddNote>;
  /** Cancels orders. */
  orderBulkCancel?: Maybe<OrderBulkCancel>;
  /** Cancel an order. */
  orderCancel?: Maybe<OrderCancel>;
  /** Capture an order. */
  orderCapture?: Maybe<OrderCapture>;
  /** Confirms an unconfirmed order by changing status to unfulfilled. */
  orderConfirm?: Maybe<OrderConfirm>;
  /** Note: this feature is in a preview state and can be subject to changes at later point. Create new order from existing checkout. */
  orderCreateFromCheckout?: Maybe<OrderCreateFromCheckout>;
  /** Adds discount to the order. */
  orderDiscountAdd?: Maybe<OrderDiscountAdd>;
  /** Remove discount from the order. */
  orderDiscountDelete?: Maybe<OrderDiscountDelete>;
  /** Update discount for the order. */
  orderDiscountUpdate?: Maybe<OrderDiscountUpdate>;
  /** Creates new fulfillments for an order. */
  orderFulfill?: Maybe<OrderFulfill>;
  /** New in Saleor 3.1. Approve existing fulfillment. */
  orderFulfillmentApprove?: Maybe<FulfillmentApprove>;
  /** Cancels existing fulfillment and optionally restocks items. */
  orderFulfillmentCancel?: Maybe<FulfillmentCancel>;
  /** Refund products. */
  orderFulfillmentRefundProducts?: Maybe<FulfillmentRefundProducts>;
  /** Return products. */
  orderFulfillmentReturnProducts?: Maybe<FulfillmentReturnProducts>;
  /** Updates a fulfillment for an order. */
  orderFulfillmentUpdateTracking?: Maybe<FulfillmentUpdateTracking>;
  /** Deletes an order line from an order. */
  orderLineDelete?: Maybe<OrderLineDelete>;
  /** Remove discount applied to the order line. */
  orderLineDiscountRemove?: Maybe<OrderLineDiscountRemove>;
  /** Update discount for the order line. */
  orderLineDiscountUpdate?: Maybe<OrderLineDiscountUpdate>;
  /** Updates an order line of an order. */
  orderLineUpdate?: Maybe<OrderLineUpdate>;
  /** Create order lines for an order. */
  orderLinesCreate?: Maybe<OrderLinesCreate>;
  /** Mark order as manually paid. */
  orderMarkAsPaid?: Maybe<OrderMarkAsPaid>;
  /** Refund an order. */
  orderRefund?: Maybe<OrderRefund>;
  /** Update shop order settings. */
  orderSettingsUpdate?: Maybe<OrderSettingsUpdate>;
  /** Updates an order. */
  orderUpdate?: Maybe<OrderUpdate>;
  /** Updates a shipping method of the order. Requires shipping method ID to update, when null is passed then currently assigned shipping method is removed. */
  orderUpdateShipping?: Maybe<OrderUpdateShipping>;
  /** Void an order. */
  orderVoid?: Maybe<OrderVoid>;
  /** Assign attributes to a given page type. */
  pageAttributeAssign?: Maybe<PageAttributeAssign>;
  /** Unassign attributes from a given page type. */
  pageAttributeUnassign?: Maybe<PageAttributeUnassign>;
  /** Deletes pages. */
  pageBulkDelete?: Maybe<PageBulkDelete>;
  /** Publish pages. */
  pageBulkPublish?: Maybe<PageBulkPublish>;
  /** Creates a new page. */
  pageCreate?: Maybe<PageCreate>;
  /** Deletes a page. */
  pageDelete?: Maybe<PageDelete>;
  /** Reorder page attribute values. */
  pageReorderAttributeValues?: Maybe<PageReorderAttributeValues>;
  /** Creates/updates translations for a page. */
  pageTranslate?: Maybe<PageTranslate>;
  /** Delete page types. */
  pageTypeBulkDelete?: Maybe<PageTypeBulkDelete>;
  /** Create a new page type. */
  pageTypeCreate?: Maybe<PageTypeCreate>;
  /** Delete a page type. */
  pageTypeDelete?: Maybe<PageTypeDelete>;
  /** Reorder the attributes of a page type. */
  pageTypeReorderAttributes?: Maybe<PageTypeReorderAttributes>;
  /** Update page type. */
  pageTypeUpdate?: Maybe<PageTypeUpdate>;
  /** Updates an existing page. */
  pageUpdate?: Maybe<PageUpdate>;
  /** Change the password of the logged in user. */
  passwordChange?: Maybe<PasswordChange>;
  /** Captures the authorized payment amount. */
  paymentCapture?: Maybe<PaymentCapture>;
  /** Check payment balance. */
  paymentCheckBalance?: Maybe<PaymentCheckBalance>;
  /** Note: this feature is in a preview state and can be subject to changes at later point. Create payment for checkout or order. */
  paymentCreate?: Maybe<PaymentCreate>;
  /** Initializes payment process when it is required by gateway. */
  paymentInitialize?: Maybe<PaymentInitialize>;
  /** Refunds the captured payment amount. */
  paymentRefund?: Maybe<PaymentRefund>;
  /** Note: this feature is in a preview state and can be subject to changes at later point. Create payment for checkout or order. */
  paymentUpdate?: Maybe<PaymentUpdate>;
  /** Voids the authorized payment. */
  paymentVoid?: Maybe<PaymentVoid>;
  /** Create new permission group. */
  permissionGroupCreate?: Maybe<PermissionGroupCreate>;
  /** Delete permission group. */
  permissionGroupDelete?: Maybe<PermissionGroupDelete>;
  /** Update permission group. */
  permissionGroupUpdate?: Maybe<PermissionGroupUpdate>;
  /** Update plugin configuration. */
  pluginUpdate?: Maybe<PluginUpdate>;
  /** Assign attributes to a given product type. */
  productAttributeAssign?: Maybe<ProductAttributeAssign>;
  /** New in Saleor 3.1. Update attributes assigned to product variant for given product type. */
  productAttributeAssignmentUpdate?: Maybe<ProductAttributeAssignmentUpdate>;
  /** Un-assign attributes from a given product type. */
  productAttributeUnassign?: Maybe<ProductAttributeUnassign>;
  /** Deletes products. */
  productBulkDelete?: Maybe<ProductBulkDelete>;
  /** Manage product's availability in channels. */
  productChannelListingUpdate?: Maybe<ProductChannelListingUpdate>;
  /** Creates a new product. */
  productCreate?: Maybe<ProductCreate>;
  /** Deletes a product. */
  productDelete?: Maybe<ProductDelete>;
  /** Deletes product media. */
  productMediaBulkDelete?: Maybe<ProductMediaBulkDelete>;
  /** Create a media object (image or video URL) associated with product. For image, this mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  productMediaCreate?: Maybe<ProductMediaCreate>;
  /** Deletes a product media. */
  productMediaDelete?: Maybe<ProductMediaDelete>;
  /** Changes ordering of the product media. */
  productMediaReorder?: Maybe<ProductMediaReorder>;
  /** Updates a product media. */
  productMediaUpdate?: Maybe<ProductMediaUpdate>;
  /** Reorder product attribute values. */
  productReorderAttributeValues?: Maybe<ProductReorderAttributeValues>;
  /** Creates/updates translations for a product. */
  productTranslate?: Maybe<ProductTranslate>;
  /** Deletes product types. */
  productTypeBulkDelete?: Maybe<ProductTypeBulkDelete>;
  /** Creates a new product type. */
  productTypeCreate?: Maybe<ProductTypeCreate>;
  /** Deletes a product type. */
  productTypeDelete?: Maybe<ProductTypeDelete>;
  /** Reorder the attributes of a product type. */
  productTypeReorderAttributes?: Maybe<ProductTypeReorderAttributes>;
  /** Updates an existing product type. */
  productTypeUpdate?: Maybe<ProductTypeUpdate>;
  /** Updates an existing product. */
  productUpdate?: Maybe<ProductUpdate>;
  /** Creates product variants for a given product. */
  productVariantBulkCreate?: Maybe<ProductVariantBulkCreate>;
  /** Deletes product variants. */
  productVariantBulkDelete?: Maybe<ProductVariantBulkDelete>;
  /** Manage product variant prices in channels. */
  productVariantChannelListingUpdate?: Maybe<ProductVariantChannelListingUpdate>;
  /** Creates a new variant for a product. */
  productVariantCreate?: Maybe<ProductVariantCreate>;
  /** Deletes a product variant. */
  productVariantDelete?: Maybe<ProductVariantDelete>;
  /** New in Saleor 3.1. Deactivates product variant preorder. It changes all preorder allocation into regular allocation. Note: this feature is in a preview state and can be subject to changes at later point. */
  productVariantPreorderDeactivate?: Maybe<ProductVariantPreorderDeactivate>;
  /** Reorder the variants of a product. Mutation updates updated_at on product and triggers PRODUCT_UPDATED webhook. */
  productVariantReorder?: Maybe<ProductVariantReorder>;
  /** Reorder product variant attribute values. */
  productVariantReorderAttributeValues?: Maybe<ProductVariantReorderAttributeValues>;
  /** Set default variant for a product. Mutation triggers PRODUCT_UPDATED webhook. */
  productVariantSetDefault?: Maybe<ProductVariantSetDefault>;
  /** Creates stocks for product variant. */
  productVariantStocksCreate?: Maybe<ProductVariantStocksCreate>;
  /** Delete stocks from product variant. */
  productVariantStocksDelete?: Maybe<ProductVariantStocksDelete>;
  /** Update stocks for product variant. */
  productVariantStocksUpdate?: Maybe<ProductVariantStocksUpdate>;
  /** Creates/updates translations for a product variant. */
  productVariantTranslate?: Maybe<ProductVariantTranslate>;
  /** Updates an existing variant for product. */
  productVariantUpdate?: Maybe<ProductVariantUpdate>;
  /** Request email change of the logged in user. */
  requestEmailChange?: Maybe<RequestEmailChange>;
  /** Sends an email with the account password modification link. */
  requestPasswordReset?: Maybe<RequestPasswordReset>;
  /** Deletes sales. */
  saleBulkDelete?: Maybe<SaleBulkDelete>;
  /** Adds products, categories, collections to a voucher. */
  saleCataloguesAdd?: Maybe<SaleAddCatalogues>;
  /** Removes products, categories, collections from a sale. */
  saleCataloguesRemove?: Maybe<SaleRemoveCatalogues>;
  /** Manage sale's availability in channels. */
  saleChannelListingUpdate?: Maybe<SaleChannelListingUpdate>;
  /** Creates a new sale. */
  saleCreate?: Maybe<SaleCreate>;
  /** Deletes a sale. */
  saleDelete?: Maybe<SaleDelete>;
  /** Creates/updates translations for a sale. */
  saleTranslate?: Maybe<SaleTranslate>;
  /** Updates a sale. */
  saleUpdate?: Maybe<SaleUpdate>;
  /** Sets the user's password from the token sent by email using the RequestPasswordReset mutation. */
  setPassword?: Maybe<SetPassword>;
  /** Manage shipping method's availability in channels. */
  shippingMethodChannelListingUpdate?: Maybe<ShippingMethodChannelListingUpdate>;
  /** Deletes shipping prices. */
  shippingPriceBulkDelete?: Maybe<ShippingPriceBulkDelete>;
  /** Creates a new shipping price. */
  shippingPriceCreate?: Maybe<ShippingPriceCreate>;
  /** Deletes a shipping price. */
  shippingPriceDelete?: Maybe<ShippingPriceDelete>;
  /** Exclude products from shipping price. */
  shippingPriceExcludeProducts?: Maybe<ShippingPriceExcludeProducts>;
  /** Remove product from excluded list for shipping price. */
  shippingPriceRemoveProductFromExclude?: Maybe<ShippingPriceRemoveProductFromExclude>;
  /** Creates/updates translations for a shipping method. */
  shippingPriceTranslate?: Maybe<ShippingPriceTranslate>;
  /** Updates a new shipping price. */
  shippingPriceUpdate?: Maybe<ShippingPriceUpdate>;
  /** Deletes shipping zones. */
  shippingZoneBulkDelete?: Maybe<ShippingZoneBulkDelete>;
  /** Creates a new shipping zone. */
  shippingZoneCreate?: Maybe<ShippingZoneCreate>;
  /** Deletes a shipping zone. */
  shippingZoneDelete?: Maybe<ShippingZoneDelete>;
  /** Updates a new shipping zone. */
  shippingZoneUpdate?: Maybe<ShippingZoneUpdate>;
  /** Update the shop's address. If the `null` value is passed, the currently selected address will be deleted. */
  shopAddressUpdate?: Maybe<ShopAddressUpdate>;
  /** Updates site domain of the shop. */
  shopDomainUpdate?: Maybe<ShopDomainUpdate>;
  /** Fetch tax rates. */
  shopFetchTaxRates?: Maybe<ShopFetchTaxRates>;
  /** Creates/updates translations for shop settings. */
  shopSettingsTranslate?: Maybe<ShopSettingsTranslate>;
  /** Updates shop settings. */
  shopSettingsUpdate?: Maybe<ShopSettingsUpdate>;
  /** Deletes staff users. */
  staffBulkDelete?: Maybe<StaffBulkDelete>;
  /** Creates a new staff user. */
  staffCreate?: Maybe<StaffCreate>;
  /** Deletes a staff user. */
  staffDelete?: Maybe<StaffDelete>;
  /** Creates a new staff notification recipient. */
  staffNotificationRecipientCreate?: Maybe<StaffNotificationRecipientCreate>;
  /** Delete staff notification recipient. */
  staffNotificationRecipientDelete?: Maybe<StaffNotificationRecipientDelete>;
  /** Updates a staff notification recipient. */
  staffNotificationRecipientUpdate?: Maybe<StaffNotificationRecipientUpdate>;
  /** Updates an existing staff user. */
  staffUpdate?: Maybe<StaffUpdate>;
  /** Create JWT token. */
  tokenCreate?: Maybe<CreateToken>;
  /** Refresh JWT token. Mutation tries to take refreshToken from the input.If it fails it will try to take refreshToken from the http-only cookie -refreshToken. csrfToken is required when refreshToken is provided as a cookie. */
  tokenRefresh?: Maybe<RefreshToken>;
  /** Verify JWT token. */
  tokenVerify?: Maybe<VerifyToken>;
  /** Deactivate all JWT tokens of the currently authenticated user. */
  tokensDeactivateAll?: Maybe<DeactivateAllUserTokens>;
  /** Remove shipping zone from given warehouse. */
  unassignWarehouseShippingZone?: Maybe<WarehouseShippingZoneUnassign>;
  /** Updates metadata of an object. */
  updateMetadata?: Maybe<UpdateMetadata>;
  /** Updates private metadata of an object. */
  updatePrivateMetadata?: Maybe<UpdatePrivateMetadata>;
  /** Updates given warehouse. */
  updateWarehouse?: Maybe<WarehouseUpdate>;
  /** Deletes a user avatar. Only for staff members. */
  userAvatarDelete?: Maybe<UserAvatarDelete>;
  /** Create a user avatar. Only for staff members. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  userAvatarUpdate?: Maybe<UserAvatarUpdate>;
  /** Activate or deactivate users. */
  userBulkSetActive?: Maybe<UserBulkSetActive>;
  /** Assign an media to a product variant. */
  variantMediaAssign?: Maybe<VariantMediaAssign>;
  /** Unassign an media from a product variant. */
  variantMediaUnassign?: Maybe<VariantMediaUnassign>;
  /** Deletes vouchers. */
  voucherBulkDelete?: Maybe<VoucherBulkDelete>;
  /** Adds products, categories, collections to a voucher. */
  voucherCataloguesAdd?: Maybe<VoucherAddCatalogues>;
  /** Removes products, categories, collections from a voucher. */
  voucherCataloguesRemove?: Maybe<VoucherRemoveCatalogues>;
  /** Manage voucher's availability in channels. */
  voucherChannelListingUpdate?: Maybe<VoucherChannelListingUpdate>;
  /** Creates a new voucher. */
  voucherCreate?: Maybe<VoucherCreate>;
  /** Deletes a voucher. */
  voucherDelete?: Maybe<VoucherDelete>;
  /** Creates/updates translations for a voucher. */
  voucherTranslate?: Maybe<VoucherTranslate>;
  /** Updates a voucher. */
  voucherUpdate?: Maybe<VoucherUpdate>;
  /** Creates a new webhook subscription. */
  webhookCreate?: Maybe<WebhookCreate>;
  /** Deletes a webhook subscription. */
  webhookDelete?: Maybe<WebhookDelete>;
  /** Updates a webhook subscription. */
  webhookUpdate?: Maybe<WebhookUpdate>;
};


export type MutationAccountAddressCreateArgs = {
  input: AddressInput;
  type?: InputMaybe<AddressTypeEnum>;
};


export type MutationAccountAddressDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAccountAddressUpdateArgs = {
  id: Scalars['ID'];
  input: AddressInput;
};


export type MutationAccountDeleteArgs = {
  token: Scalars['String'];
};


export type MutationAccountRegisterArgs = {
  input: AccountRegisterInput;
};


export type MutationAccountRequestDeletionArgs = {
  channel?: InputMaybe<Scalars['String']>;
  redirectUrl: Scalars['String'];
};


export type MutationAccountSetDefaultAddressArgs = {
  id: Scalars['ID'];
  type: AddressTypeEnum;
};


export type MutationAccountUpdateArgs = {
  input: AccountInput;
};


export type MutationAddressCreateArgs = {
  input: AddressInput;
  userId: Scalars['ID'];
};


export type MutationAddressDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAddressSetDefaultArgs = {
  addressId: Scalars['ID'];
  type: AddressTypeEnum;
  userId: Scalars['ID'];
};


export type MutationAddressUpdateArgs = {
  id: Scalars['ID'];
  input: AddressInput;
};


export type MutationAppActivateArgs = {
  id: Scalars['ID'];
};


export type MutationAppCreateArgs = {
  input: AppInput;
};


export type MutationAppDeactivateArgs = {
  id: Scalars['ID'];
};


export type MutationAppDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAppDeleteFailedInstallationArgs = {
  id: Scalars['ID'];
};


export type MutationAppFetchManifestArgs = {
  manifestUrl: Scalars['String'];
};


export type MutationAppInstallArgs = {
  input: AppInstallInput;
};


export type MutationAppRetryInstallArgs = {
  activateAfterInstallation?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};


export type MutationAppTokenCreateArgs = {
  input: AppTokenInput;
};


export type MutationAppTokenDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAppTokenVerifyArgs = {
  token: Scalars['String'];
};


export type MutationAppUpdateArgs = {
  id: Scalars['ID'];
  input: AppInput;
};


export type MutationAssignNavigationArgs = {
  menu?: InputMaybe<Scalars['ID']>;
  navigationType: NavigationType;
};


export type MutationAssignWarehouseShippingZoneArgs = {
  id: Scalars['ID'];
  shippingZoneIds: Array<Scalars['ID']>;
};


export type MutationAttributeBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationAttributeCreateArgs = {
  input: AttributeCreateInput;
};


export type MutationAttributeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAttributeReorderValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<InputMaybe<ReorderInput>>;
};


export type MutationAttributeTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationAttributeUpdateArgs = {
  id: Scalars['ID'];
  input: AttributeUpdateInput;
};


export type MutationAttributeValueBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationAttributeValueCreateArgs = {
  attribute: Scalars['ID'];
  input: AttributeValueCreateInput;
};


export type MutationAttributeValueDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAttributeValueTranslateArgs = {
  id: Scalars['ID'];
  input: AttributeValueTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationAttributeValueUpdateArgs = {
  id: Scalars['ID'];
  input: AttributeValueUpdateInput;
};


export type MutationCategoryBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationCategoryCreateArgs = {
  input: CategoryInput;
  parent?: InputMaybe<Scalars['ID']>;
};


export type MutationCategoryDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCategoryTranslateArgs = {
  id: Scalars['ID'];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationCategoryUpdateArgs = {
  id: Scalars['ID'];
  input: CategoryInput;
};


export type MutationChannelActivateArgs = {
  id: Scalars['ID'];
};


export type MutationChannelCreateArgs = {
  input: ChannelCreateInput;
};


export type MutationChannelDeactivateArgs = {
  id: Scalars['ID'];
};


export type MutationChannelDeleteArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<ChannelDeleteInput>;
};


export type MutationChannelUpdateArgs = {
  id: Scalars['ID'];
  input: ChannelUpdateInput;
};


export type MutationCheckoutAddPromoCodeArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  promoCode: Scalars['String'];
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutBillingAddressUpdateArgs = {
  billingAddress: AddressInput;
  checkoutId?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutCompleteArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  paymentData?: InputMaybe<Scalars['JSONString']>;
  redirectUrl?: InputMaybe<Scalars['String']>;
  storeSource?: InputMaybe<Scalars['Boolean']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutCreateArgs = {
  input: CheckoutCreateInput;
};


export type MutationCheckoutCustomerAttachArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  customerId?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutCustomerDetachArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutDeliveryMethodUpdateArgs = {
  deliveryMethodId?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutEmailUpdateArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  email: Scalars['String'];
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutLanguageCodeUpdateArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  languageCode: LanguageCodeEnum;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutLineDeleteArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  lineId?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutLinesAddArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  lines: Array<InputMaybe<CheckoutLineInput>>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutLinesDeleteArgs = {
  linesIds: Array<InputMaybe<Scalars['ID']>>;
  token: Scalars['UUID'];
};


export type MutationCheckoutLinesUpdateArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  lines: Array<InputMaybe<CheckoutLineInput>>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutPaymentCreateArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  input: PaymentInput;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutRemovePromoCodeArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  promoCode?: InputMaybe<Scalars['String']>;
  promoCodeId?: InputMaybe<Scalars['ID']>;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutShippingAddressUpdateArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  shippingAddress: AddressInput;
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCheckoutShippingMethodUpdateArgs = {
  checkoutId?: InputMaybe<Scalars['ID']>;
  shippingMethodId: Scalars['ID'];
  token?: InputMaybe<Scalars['UUID']>;
};


export type MutationCollectionAddProductsArgs = {
  collectionId: Scalars['ID'];
  products: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationCollectionBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationCollectionChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: CollectionChannelListingUpdateInput;
};


export type MutationCollectionCreateArgs = {
  input: CollectionCreateInput;
};


export type MutationCollectionDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCollectionRemoveProductsArgs = {
  collectionId: Scalars['ID'];
  products: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationCollectionReorderProductsArgs = {
  collectionId: Scalars['ID'];
  moves: Array<InputMaybe<MoveProductInput>>;
};


export type MutationCollectionTranslateArgs = {
  id: Scalars['ID'];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationCollectionUpdateArgs = {
  id: Scalars['ID'];
  input: CollectionInput;
};


export type MutationConfirmAccountArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};


export type MutationConfirmEmailChangeArgs = {
  channel?: InputMaybe<Scalars['String']>;
  token: Scalars['String'];
};


export type MutationCreateWarehouseArgs = {
  input: WarehouseCreateInput;
};


export type MutationCustomerBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationCustomerCreateArgs = {
  input: UserCreateInput;
};


export type MutationCustomerDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCustomerUpdateArgs = {
  id: Scalars['ID'];
  input: CustomerInput;
};


export type MutationDeleteMetadataArgs = {
  id: Scalars['ID'];
  keys: Array<Scalars['String']>;
};


export type MutationDeletePrivateMetadataArgs = {
  id: Scalars['ID'];
  keys: Array<Scalars['String']>;
};


export type MutationDeleteWarehouseArgs = {
  id: Scalars['ID'];
};


export type MutationDigitalContentCreateArgs = {
  input: DigitalContentUploadInput;
  variantId: Scalars['ID'];
};


export type MutationDigitalContentDeleteArgs = {
  variantId: Scalars['ID'];
};


export type MutationDigitalContentUpdateArgs = {
  input: DigitalContentInput;
  variantId: Scalars['ID'];
};


export type MutationDigitalContentUrlCreateArgs = {
  input: DigitalContentUrlCreateInput;
};


export type MutationDraftOrderBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDraftOrderCompleteArgs = {
  id: Scalars['ID'];
};


export type MutationDraftOrderCreateArgs = {
  input: DraftOrderCreateInput;
};


export type MutationDraftOrderDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationDraftOrderLinesBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDraftOrderUpdateArgs = {
  id: Scalars['ID'];
  input: DraftOrderInput;
};


export type MutationEventDeliveryRetryArgs = {
  id: Scalars['ID'];
};


export type MutationExportGiftCardsArgs = {
  input: ExportGiftCardsInput;
};


export type MutationExportProductsArgs = {
  input: ExportProductsInput;
};


export type MutationExternalAuthenticationUrlArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationExternalLogoutArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationExternalNotificationTriggerArgs = {
  channel: Scalars['String'];
  input: ExternalNotificationTriggerInput;
  pluginId?: InputMaybe<Scalars['String']>;
};


export type MutationExternalObtainAccessTokensArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationExternalRefreshArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationExternalVerifyArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationFileUploadArgs = {
  file: Scalars['Upload'];
};


export type MutationGiftCardActivateArgs = {
  id: Scalars['ID'];
};


export type MutationGiftCardAddNoteArgs = {
  id: Scalars['ID'];
  input: GiftCardAddNoteInput;
};


export type MutationGiftCardBulkActivateArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationGiftCardBulkCreateArgs = {
  input: GiftCardBulkCreateInput;
};


export type MutationGiftCardBulkDeactivateArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationGiftCardBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationGiftCardCreateArgs = {
  input: GiftCardCreateInput;
};


export type MutationGiftCardDeactivateArgs = {
  id: Scalars['ID'];
};


export type MutationGiftCardDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationGiftCardResendArgs = {
  input: GiftCardResendInput;
};


export type MutationGiftCardSettingsUpdateArgs = {
  input: GiftCardSettingsUpdateInput;
};


export type MutationGiftCardUpdateArgs = {
  id: Scalars['ID'];
  input: GiftCardUpdateInput;
};


export type MutationInvoiceCreateArgs = {
  input: InvoiceCreateInput;
  orderId: Scalars['ID'];
};


export type MutationInvoiceDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationInvoiceRequestArgs = {
  number?: InputMaybe<Scalars['String']>;
  orderId: Scalars['ID'];
};


export type MutationInvoiceRequestDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationInvoiceSendNotificationArgs = {
  id: Scalars['ID'];
};


export type MutationInvoiceUpdateArgs = {
  id: Scalars['ID'];
  input: UpdateInvoiceInput;
};


export type MutationMenuBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationMenuCreateArgs = {
  input: MenuCreateInput;
};


export type MutationMenuDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationMenuItemBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationMenuItemCreateArgs = {
  input: MenuItemCreateInput;
};


export type MutationMenuItemDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationMenuItemMoveArgs = {
  menu: Scalars['ID'];
  moves: Array<InputMaybe<MenuItemMoveInput>>;
};


export type MutationMenuItemTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationMenuItemUpdateArgs = {
  id: Scalars['ID'];
  input: MenuItemInput;
};


export type MutationMenuUpdateArgs = {
  id: Scalars['ID'];
  input: MenuInput;
};


export type MutationOrderAddNoteArgs = {
  input: OrderAddNoteInput;
  order: Scalars['ID'];
};


export type MutationOrderBulkCancelArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationOrderCancelArgs = {
  id: Scalars['ID'];
};


export type MutationOrderCaptureArgs = {
  amount: Scalars['PositiveDecimal'];
  id: Scalars['ID'];
};


export type MutationOrderConfirmArgs = {
  id: Scalars['ID'];
};


export type MutationOrderCreateFromCheckoutArgs = {
  id: Scalars['ID'];
  removeCheckout?: InputMaybe<Scalars['Boolean']>;
};


export type MutationOrderDiscountAddArgs = {
  input: OrderDiscountCommonInput;
  orderId: Scalars['ID'];
};


export type MutationOrderDiscountDeleteArgs = {
  discountId: Scalars['ID'];
};


export type MutationOrderDiscountUpdateArgs = {
  discountId: Scalars['ID'];
  input: OrderDiscountCommonInput;
};


export type MutationOrderFulfillArgs = {
  input: OrderFulfillInput;
  order?: InputMaybe<Scalars['ID']>;
};


export type MutationOrderFulfillmentApproveArgs = {
  allowStockToBeExceeded?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  notifyCustomer: Scalars['Boolean'];
};


export type MutationOrderFulfillmentCancelArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<FulfillmentCancelInput>;
};


export type MutationOrderFulfillmentRefundProductsArgs = {
  input: OrderRefundProductsInput;
  order: Scalars['ID'];
};


export type MutationOrderFulfillmentReturnProductsArgs = {
  input: OrderReturnProductsInput;
  order: Scalars['ID'];
};


export type MutationOrderFulfillmentUpdateTrackingArgs = {
  id: Scalars['ID'];
  input: FulfillmentUpdateTrackingInput;
};


export type MutationOrderLineDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationOrderLineDiscountRemoveArgs = {
  orderLineId: Scalars['ID'];
};


export type MutationOrderLineDiscountUpdateArgs = {
  input: OrderDiscountCommonInput;
  orderLineId: Scalars['ID'];
};


export type MutationOrderLineUpdateArgs = {
  id: Scalars['ID'];
  input: OrderLineInput;
};


export type MutationOrderLinesCreateArgs = {
  id: Scalars['ID'];
  input: Array<InputMaybe<OrderLineCreateInput>>;
};


export type MutationOrderMarkAsPaidArgs = {
  id: Scalars['ID'];
  transactionReference?: InputMaybe<Scalars['String']>;
};


export type MutationOrderRefundArgs = {
  amount: Scalars['PositiveDecimal'];
  id: Scalars['ID'];
};


export type MutationOrderSettingsUpdateArgs = {
  input: OrderSettingsUpdateInput;
};


export type MutationOrderUpdateArgs = {
  id: Scalars['ID'];
  input: OrderUpdateInput;
};


export type MutationOrderUpdateShippingArgs = {
  input: OrderUpdateShippingInput;
  order: Scalars['ID'];
};


export type MutationOrderVoidArgs = {
  id: Scalars['ID'];
};


export type MutationPageAttributeAssignArgs = {
  attributeIds: Array<Scalars['ID']>;
  pageTypeId: Scalars['ID'];
};


export type MutationPageAttributeUnassignArgs = {
  attributeIds: Array<Scalars['ID']>;
  pageTypeId: Scalars['ID'];
};


export type MutationPageBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationPageBulkPublishArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
  isPublished: Scalars['Boolean'];
};


export type MutationPageCreateArgs = {
  input: PageCreateInput;
};


export type MutationPageDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationPageReorderAttributeValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<InputMaybe<ReorderInput>>;
  pageId: Scalars['ID'];
};


export type MutationPageTranslateArgs = {
  id: Scalars['ID'];
  input: PageTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationPageTypeBulkDeleteArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationPageTypeCreateArgs = {
  input: PageTypeCreateInput;
};


export type MutationPageTypeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationPageTypeReorderAttributesArgs = {
  moves: Array<ReorderInput>;
  pageTypeId: Scalars['ID'];
};


export type MutationPageTypeUpdateArgs = {
  id?: InputMaybe<Scalars['ID']>;
  input: PageTypeUpdateInput;
};


export type MutationPageUpdateArgs = {
  id: Scalars['ID'];
  input: PageInput;
};


export type MutationPasswordChangeArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationPaymentCaptureArgs = {
  amount?: InputMaybe<Scalars['PositiveDecimal']>;
  paymentId: Scalars['ID'];
};


export type MutationPaymentCheckBalanceArgs = {
  input: PaymentCheckBalanceInput;
};


export type MutationPaymentCreateArgs = {
  id: Scalars['ID'];
  payment: PaymentCreateInput;
  transaction?: InputMaybe<TransactionInput>;
};


export type MutationPaymentInitializeArgs = {
  channel?: InputMaybe<Scalars['String']>;
  gateway: Scalars['String'];
  paymentData?: InputMaybe<Scalars['JSONString']>;
};


export type MutationPaymentRefundArgs = {
  amount?: InputMaybe<Scalars['PositiveDecimal']>;
  paymentId: Scalars['ID'];
};


export type MutationPaymentUpdateArgs = {
  id: Scalars['ID'];
  payment?: InputMaybe<PaymentUpdateInput>;
  transaction?: InputMaybe<TransactionInput>;
};


export type MutationPaymentVoidArgs = {
  paymentId: Scalars['ID'];
};


export type MutationPermissionGroupCreateArgs = {
  input: PermissionGroupCreateInput;
};


export type MutationPermissionGroupDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationPermissionGroupUpdateArgs = {
  id: Scalars['ID'];
  input: PermissionGroupUpdateInput;
};


export type MutationPluginUpdateArgs = {
  channelId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  input: PluginUpdateInput;
};


export type MutationProductAttributeAssignArgs = {
  operations: Array<InputMaybe<ProductAttributeAssignInput>>;
  productTypeId: Scalars['ID'];
};


export type MutationProductAttributeAssignmentUpdateArgs = {
  operations: Array<InputMaybe<ProductAttributeAssignmentUpdateInput>>;
  productTypeId: Scalars['ID'];
};


export type MutationProductAttributeUnassignArgs = {
  attributeIds: Array<InputMaybe<Scalars['ID']>>;
  productTypeId: Scalars['ID'];
};


export type MutationProductBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationProductChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: ProductChannelListingUpdateInput;
};


export type MutationProductCreateArgs = {
  input: ProductCreateInput;
};


export type MutationProductDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductMediaBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationProductMediaCreateArgs = {
  input: ProductMediaCreateInput;
};


export type MutationProductMediaDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductMediaReorderArgs = {
  mediaIds: Array<InputMaybe<Scalars['ID']>>;
  productId: Scalars['ID'];
};


export type MutationProductMediaUpdateArgs = {
  id: Scalars['ID'];
  input: ProductMediaUpdateInput;
};


export type MutationProductReorderAttributeValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<InputMaybe<ReorderInput>>;
  productId: Scalars['ID'];
};


export type MutationProductTranslateArgs = {
  id: Scalars['ID'];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationProductTypeBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationProductTypeCreateArgs = {
  input: ProductTypeInput;
};


export type MutationProductTypeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductTypeReorderAttributesArgs = {
  moves: Array<InputMaybe<ReorderInput>>;
  productTypeId: Scalars['ID'];
  type: ProductAttributeType;
};


export type MutationProductTypeUpdateArgs = {
  id: Scalars['ID'];
  input: ProductTypeInput;
};


export type MutationProductUpdateArgs = {
  id: Scalars['ID'];
  input: ProductInput;
};


export type MutationProductVariantBulkCreateArgs = {
  product: Scalars['ID'];
  variants: Array<InputMaybe<ProductVariantBulkCreateInput>>;
};


export type MutationProductVariantBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationProductVariantChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: Array<ProductVariantChannelListingAddInput>;
};


export type MutationProductVariantCreateArgs = {
  input: ProductVariantCreateInput;
};


export type MutationProductVariantDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductVariantPreorderDeactivateArgs = {
  id: Scalars['ID'];
};


export type MutationProductVariantReorderArgs = {
  moves: Array<InputMaybe<ReorderInput>>;
  productId: Scalars['ID'];
};


export type MutationProductVariantReorderAttributeValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<InputMaybe<ReorderInput>>;
  variantId: Scalars['ID'];
};


export type MutationProductVariantSetDefaultArgs = {
  productId: Scalars['ID'];
  variantId: Scalars['ID'];
};


export type MutationProductVariantStocksCreateArgs = {
  stocks: Array<StockInput>;
  variantId: Scalars['ID'];
};


export type MutationProductVariantStocksDeleteArgs = {
  variantId: Scalars['ID'];
  warehouseIds?: InputMaybe<Array<Scalars['ID']>>;
};


export type MutationProductVariantStocksUpdateArgs = {
  stocks: Array<StockInput>;
  variantId: Scalars['ID'];
};


export type MutationProductVariantTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationProductVariantUpdateArgs = {
  id: Scalars['ID'];
  input: ProductVariantInput;
};


export type MutationRequestEmailChangeArgs = {
  channel?: InputMaybe<Scalars['String']>;
  newEmail: Scalars['String'];
  password: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationRequestPasswordResetArgs = {
  channel?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationSaleBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationSaleCataloguesAddArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationSaleCataloguesRemoveArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationSaleChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: SaleChannelListingInput;
};


export type MutationSaleCreateArgs = {
  input: SaleInput;
};


export type MutationSaleDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSaleTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationSaleUpdateArgs = {
  id: Scalars['ID'];
  input: SaleInput;
};


export type MutationSetPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationShippingMethodChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: ShippingMethodChannelListingInput;
};


export type MutationShippingPriceBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationShippingPriceCreateArgs = {
  input: ShippingPriceInput;
};


export type MutationShippingPriceDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationShippingPriceExcludeProductsArgs = {
  id: Scalars['ID'];
  input: ShippingPriceExcludeProductsInput;
};


export type MutationShippingPriceRemoveProductFromExcludeArgs = {
  id: Scalars['ID'];
  products: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationShippingPriceTranslateArgs = {
  id: Scalars['ID'];
  input: ShippingPriceTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationShippingPriceUpdateArgs = {
  id: Scalars['ID'];
  input: ShippingPriceInput;
};


export type MutationShippingZoneBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationShippingZoneCreateArgs = {
  input: ShippingZoneCreateInput;
};


export type MutationShippingZoneDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationShippingZoneUpdateArgs = {
  id: Scalars['ID'];
  input: ShippingZoneUpdateInput;
};


export type MutationShopAddressUpdateArgs = {
  input?: InputMaybe<AddressInput>;
};


export type MutationShopDomainUpdateArgs = {
  input?: InputMaybe<SiteDomainInput>;
};


export type MutationShopSettingsTranslateArgs = {
  input: ShopSettingsTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationShopSettingsUpdateArgs = {
  input: ShopSettingsInput;
};


export type MutationStaffBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationStaffCreateArgs = {
  input: StaffCreateInput;
};


export type MutationStaffDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationStaffNotificationRecipientCreateArgs = {
  input: StaffNotificationRecipientInput;
};


export type MutationStaffNotificationRecipientDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationStaffNotificationRecipientUpdateArgs = {
  id: Scalars['ID'];
  input: StaffNotificationRecipientInput;
};


export type MutationStaffUpdateArgs = {
  id: Scalars['ID'];
  input: StaffUpdateInput;
};


export type MutationTokenCreateArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationTokenRefreshArgs = {
  csrfToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type MutationTokenVerifyArgs = {
  token: Scalars['String'];
};


export type MutationUnassignWarehouseShippingZoneArgs = {
  id: Scalars['ID'];
  shippingZoneIds: Array<Scalars['ID']>;
};


export type MutationUpdateMetadataArgs = {
  id: Scalars['ID'];
  input: Array<MetadataInput>;
};


export type MutationUpdatePrivateMetadataArgs = {
  id: Scalars['ID'];
  input: Array<MetadataInput>;
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID'];
  input: WarehouseUpdateInput;
};


export type MutationUserAvatarUpdateArgs = {
  image: Scalars['Upload'];
};


export type MutationUserBulkSetActiveArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
  isActive: Scalars['Boolean'];
};


export type MutationVariantMediaAssignArgs = {
  mediaId: Scalars['ID'];
  variantId: Scalars['ID'];
};


export type MutationVariantMediaUnassignArgs = {
  mediaId: Scalars['ID'];
  variantId: Scalars['ID'];
};


export type MutationVoucherBulkDeleteArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationVoucherCataloguesAddArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationVoucherCataloguesRemoveArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationVoucherChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: VoucherChannelListingInput;
};


export type MutationVoucherCreateArgs = {
  input: VoucherInput;
};


export type MutationVoucherDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationVoucherTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationVoucherUpdateArgs = {
  id: Scalars['ID'];
  input: VoucherInput;
};


export type MutationWebhookCreateArgs = {
  input: WebhookCreateInput;
};


export type MutationWebhookDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationWebhookUpdateArgs = {
  id: Scalars['ID'];
  input: WebhookUpdateInput;
};

export type NameTranslationInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type NavigationType =
  /** Main storefront navigation. */
  | 'MAIN'
  /** Secondary storefront navigation. */
  | 'SECONDARY';

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type ObjectWithMetadata = {
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
};

/** Represents an order in the shop. */
export type Order = Node & ObjectWithMetadata & {
  __typename?: 'Order';
  /** This field will be removed in Saleor 4.0. Use actions on order.payments. List of actions that can be performed in the current state of an order. */
  actions: Array<Maybe<OrderAction>>;
  /** New in Saleor 3.1. Collection points that can be used for this order. Note: this feature is in a preview state and can be subject to changes at later point. */
  availableCollectionPoints: Array<Warehouse>;
  /**
   * Shipping methods that can be used with this order.
   * @deprecated Use `shippingMethods`, this field will be removed in 4.0
   */
  availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  billingAddress?: Maybe<Address>;
  /** Informs whether a draft order can be finalized(turned into a regular order). */
  canFinalize: Scalars['Boolean'];
  channel: Channel;
  collectionPointName?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  customerNote: Scalars['String'];
  /** New in Saleor 3.1. The delivery method selected for this checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
  deliveryMethod?: Maybe<DeliveryMethod>;
  /**
   * Returns applied discount.
   * @deprecated This field will be removed in Saleor 4.0. Use the `discounts` field instead.
   */
  discount?: Maybe<Money>;
  /**
   * Discount name.
   * @deprecated This field will be removed in Saleor 4.0. Use the `discounts` field instead.
   */
  discountName?: Maybe<Scalars['String']>;
  /** List of all discounts assigned to the order. */
  discounts?: Maybe<Array<OrderDiscount>>;
  displayGrossPrices: Scalars['Boolean'];
  /** List of errors that occurred during order validation. */
  errors: Array<OrderError>;
  /** List of events associated with the order. */
  events?: Maybe<Array<Maybe<OrderEvent>>>;
  /** List of shipments for the order. */
  fulfillments: Array<Maybe<Fulfillment>>;
  /** List of user gift cards. */
  giftCards?: Maybe<Array<Maybe<GiftCard>>>;
  id: Scalars['ID'];
  /** List of order invoices. */
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  /** Informs if an order is fully paid. */
  isPaid: Scalars['Boolean'];
  /** Returns True, if order requires shipping. */
  isShippingRequired: Scalars['Boolean'];
  /** @deprecated This field will be removed in Saleor 4.0. Use the `languageCodeEnum` field to fetch the language code.  */
  languageCode: Scalars['String'];
  /** Order language code. */
  languageCodeEnum: LanguageCodeEnum;
  /** List of order lines. */
  lines: Array<Maybe<OrderLine>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** User-friendly number of an order. */
  number?: Maybe<Scalars['String']>;
  /** The order origin. */
  origin: OrderOriginEnum;
  /** The ID of the order that was the base for this order. */
  original?: Maybe<Scalars['ID']>;
  /** Internal payment status. */
  paymentStatus: PaymentChargeStatusEnum;
  /** User-friendly payment status. */
  paymentStatusDisplay: Scalars['String'];
  /** List of payments for the order. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  redirectUrl?: Maybe<Scalars['String']>;
  shippingAddress?: Maybe<Address>;
  /**
   * Shipping method for this order.
   * @deprecated This field will be removed in Saleor 4.0. Use `deliveryMethod` instead.
   */
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethodName?: Maybe<Scalars['String']>;
  /** Shipping methods related to this order. */
  shippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  /** Total price of shipping. */
  shippingPrice: TaxedMoney;
  shippingTaxRate: Scalars['Float'];
  status: OrderStatus;
  /** User-friendly order status. */
  statusDisplay?: Maybe<Scalars['String']>;
  /** The sum of line prices not including shipping. */
  subtotal: TaxedMoney;
  token: Scalars['String'];
  /** Total amount of the order. */
  total: TaxedMoney;
  /** Amount authorized for the order. */
  totalAuthorized: Money;
  /** The difference between the paid and the order total amount. */
  totalBalance: Money;
  /** Amount captured by payment. */
  totalCaptured: Money;
  trackingClientId: Scalars['String'];
  /**
   * Translated discount name.
   * @deprecated This field will be removed in Saleor 4.0. Use the `discounts` field instead.
   */
  translatedDiscountName?: Maybe<Scalars['String']>;
  /** Undiscounted total amount of the order. */
  undiscountedTotal: TaxedMoney;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
  /** Email address of the customer. */
  userEmail?: Maybe<Scalars['String']>;
  voucher?: Maybe<Voucher>;
  weight?: Maybe<Weight>;
};

export type OrderAction =
  /** Represents the capture action. */
  | 'CAPTURE'
  /** Represents a mark-as-paid action. */
  | 'MARK_AS_PAID'
  /** Represents a refund action. */
  | 'REFUND'
  /** Represents a void action. */
  | 'VOID';

/** Adds note to the order. */
export type OrderAddNote = {
  __typename?: 'OrderAddNote';
  errors: Array<OrderError>;
  /** Order note created. */
  event?: Maybe<OrderEvent>;
  /** Order with the note added. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderAddNoteInput = {
  /** Note message. */
  message: Scalars['String'];
};

/** Cancels orders. */
export type OrderBulkCancel = {
  __typename?: 'OrderBulkCancel';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<OrderError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Cancel an order. */
export type OrderCancel = {
  __typename?: 'OrderCancel';
  errors: Array<OrderError>;
  /** Canceled order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Capture an order. */
export type OrderCapture = {
  __typename?: 'OrderCapture';
  errors: Array<OrderError>;
  /** Captured order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** Confirms an unconfirmed order by changing status to unfulfilled. */
export type OrderConfirm = {
  __typename?: 'OrderConfirm';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderCountableConnection = {
  __typename?: 'OrderCountableConnection';
  edges: Array<OrderCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrderCountableEdge = {
  __typename?: 'OrderCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Order;
};

/** Note: this feature is in a preview state and can be subject to changes at later point. Create new order from existing checkout. */
export type OrderCreateFromCheckout = {
  __typename?: 'OrderCreateFromCheckout';
  errors: Array<OrderCreateFromCheckoutError>;
  /** Placed order. */
  order?: Maybe<Order>;
};

export type OrderCreateFromCheckoutError = {
  __typename?: 'OrderCreateFromCheckoutError';
  /** The error code. */
  code: OrderCreateFromCheckoutErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** List of line Ids which cause the error. */
  lines?: Maybe<Array<Scalars['ID']>>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of variant IDs which causes the error. */
  variants?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type OrderCreateFromCheckoutErrorCode =
  | 'BILLING_ADDRESS_NOT_SET'
  | 'CHANNEL_INACTIVE'
  | 'EMAIL_NOT_SET'
  | 'GIFT_CARD_NOT_APPLICABLE'
  | 'GRAPHQL_ERROR'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_SHIPPING_METHOD'
  | 'NOT_FOUND'
  | 'NO_LINES'
  | 'SHIPPING_ADDRESS_NOT_SET'
  | 'SHIPPING_METHOD_NOT_SET'
  | 'TAX_ERROR'
  | 'UNAVAILABLE_VARIANT_IN_CHANNEL'
  | 'VOUCHER_NOT_APPLICABLE';

export type OrderDirection =
  /** Specifies an ascending sort order. */
  | 'ASC'
  /** Specifies a descending sort order. */
  | 'DESC';

/** Contains all details related to the applied discount to the order. */
export type OrderDiscount = Node & {
  __typename?: 'OrderDiscount';
  /** Returns amount of discount. */
  amount: Money;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Explanation for the applied discount. */
  reason?: Maybe<Scalars['String']>;
  translatedName?: Maybe<Scalars['String']>;
  type: OrderDiscountType;
  /** Value of the discount. Can store fixed value or percent value */
  value: Scalars['PositiveDecimal'];
  /** Type of the discount: fixed or percent */
  valueType: DiscountValueTypeEnum;
};

/** Adds discount to the order. */
export type OrderDiscountAdd = {
  __typename?: 'OrderDiscountAdd';
  errors: Array<OrderError>;
  /** Order which has been discounted. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderDiscountCommonInput = {
  /** Explanation for the applied discount. */
  reason?: InputMaybe<Scalars['String']>;
  /** Value of the discount. Can store fixed value or percent value */
  value: Scalars['PositiveDecimal'];
  /** Type of the discount: fixed or percent */
  valueType: DiscountValueTypeEnum;
};

/** Remove discount from the order. */
export type OrderDiscountDelete = {
  __typename?: 'OrderDiscountDelete';
  errors: Array<OrderError>;
  /** Order which has removed discount. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** An enumeration. */
export type OrderDiscountType =
  | 'MANUAL'
  | 'VOUCHER';

/** Update discount for the order. */
export type OrderDiscountUpdate = {
  __typename?: 'OrderDiscountUpdate';
  errors: Array<OrderError>;
  /** Order which has been discounted. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderDraftFilterInput = {
  channels?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  created?: InputMaybe<DateRangeInput>;
  customer?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
};

export type OrderError = {
  __typename?: 'OrderError';
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
  /** The error code. */
  code: OrderErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of order line IDs that cause the error. */
  orderLines?: Maybe<Array<Scalars['ID']>>;
  /** List of product variants that are associated with the error */
  variants?: Maybe<Array<Scalars['ID']>>;
  /** Warehouse ID which causes the error. */
  warehouse?: Maybe<Scalars['ID']>;
};

/** An enumeration. */
export type OrderErrorCode =
  | 'BILLING_ADDRESS_NOT_SET'
  | 'CANNOT_CANCEL_FULFILLMENT'
  | 'CANNOT_CANCEL_ORDER'
  | 'CANNOT_DELETE'
  | 'CANNOT_DISCOUNT'
  | 'CANNOT_FULFILL_UNPAID_ORDER'
  | 'CANNOT_REFUND'
  | 'CAPTURE_INACTIVE_PAYMENT'
  | 'CHANNEL_INACTIVE'
  | 'DUPLICATED_INPUT_ITEM'
  | 'FULFILL_ORDER_LINE'
  | 'GIFT_CARD_LINE'
  | 'GRAPHQL_ERROR'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID'
  | 'INVALID_QUANTITY'
  | 'NOT_AVAILABLE_IN_CHANNEL'
  | 'NOT_EDITABLE'
  | 'NOT_FOUND'
  | 'ORDER_NO_SHIPPING_ADDRESS'
  | 'PAYMENT_ERROR'
  | 'PAYMENT_MISSING'
  | 'PRODUCT_NOT_PUBLISHED'
  | 'PRODUCT_UNAVAILABLE_FOR_PURCHASE'
  | 'REQUIRED'
  | 'SHIPPING_METHOD_NOT_APPLICABLE'
  | 'SHIPPING_METHOD_REQUIRED'
  | 'TAX_ERROR'
  | 'UNIQUE'
  | 'VOID_INACTIVE_PAYMENT'
  | 'ZERO_QUANTITY';

/** History log of the order. */
export type OrderEvent = Node & {
  __typename?: 'OrderEvent';
  /** Amount of money. */
  amount?: Maybe<Scalars['Float']>;
  /** App that performed the action. */
  app?: Maybe<App>;
  /** Composed ID of the Fulfillment. */
  composedId?: Maybe<Scalars['String']>;
  /** Date when event happened at in ISO 8601 format. */
  date?: Maybe<Scalars['DateTime']>;
  /** The discount applied to the order. */
  discount?: Maybe<OrderEventDiscountObject>;
  /** Email of the customer. */
  email?: Maybe<Scalars['String']>;
  /** Type of an email sent to the customer. */
  emailType?: Maybe<OrderEventsEmailsEnum>;
  /** The lines fulfilled. */
  fulfilledItems?: Maybe<Array<Maybe<FulfillmentLine>>>;
  id: Scalars['ID'];
  /** Number of an invoice related to the order. */
  invoiceNumber?: Maybe<Scalars['String']>;
  /** The concerned lines. */
  lines?: Maybe<Array<Maybe<OrderEventOrderLineObject>>>;
  /** Content of the event. */
  message?: Maybe<Scalars['String']>;
  /** User-friendly number of an order. */
  orderNumber?: Maybe<Scalars['String']>;
  /** List of oversold lines names. */
  oversoldItems?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The payment gateway of the payment. */
  paymentGateway?: Maybe<Scalars['String']>;
  /** The payment ID from the payment gateway. */
  paymentId?: Maybe<Scalars['String']>;
  /** Number of items. */
  quantity?: Maybe<Scalars['Int']>;
  /** The reference of payment's transaction. */
  reference?: Maybe<Scalars['String']>;
  /** The order which is related to this order. */
  relatedOrder?: Maybe<Order>;
  /** Define if shipping costs were included to the refund. */
  shippingCostsIncluded?: Maybe<Scalars['Boolean']>;
  /** The status of payment's transaction. */
  status?: Maybe<TransactionStatus>;
  /** The transaction reference of captured payment. */
  transactionReference?: Maybe<Scalars['String']>;
  /** Order event type. */
  type?: Maybe<OrderEventsEnum>;
  /** User who performed the action. */
  user?: Maybe<User>;
  /** The warehouse were items were restocked. */
  warehouse?: Maybe<Warehouse>;
};

export type OrderEventCountableConnection = {
  __typename?: 'OrderEventCountableConnection';
  edges: Array<OrderEventCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrderEventCountableEdge = {
  __typename?: 'OrderEventCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: OrderEvent;
};

export type OrderEventDiscountObject = {
  __typename?: 'OrderEventDiscountObject';
  /** Returns amount of discount. */
  amount?: Maybe<Money>;
  /** Returns amount of discount. */
  oldAmount?: Maybe<Money>;
  /** Value of the discount. Can store fixed value or percent value. */
  oldValue?: Maybe<Scalars['PositiveDecimal']>;
  /** Type of the discount: fixed or percent. */
  oldValueType?: Maybe<DiscountValueTypeEnum>;
  /** Explanation for the applied discount. */
  reason?: Maybe<Scalars['String']>;
  /** Value of the discount. Can store fixed value or percent value. */
  value: Scalars['PositiveDecimal'];
  /** Type of the discount: fixed or percent. */
  valueType: DiscountValueTypeEnum;
};

export type OrderEventOrderLineObject = {
  __typename?: 'OrderEventOrderLineObject';
  /** The discount applied to the order line. */
  discount?: Maybe<OrderEventDiscountObject>;
  /** The variant name. */
  itemName?: Maybe<Scalars['String']>;
  /** The order line. */
  orderLine?: Maybe<OrderLine>;
  /** The variant quantity. */
  quantity?: Maybe<Scalars['Int']>;
};

/** An enumeration. */
export type OrderEventsEmailsEnum =
  | 'CONFIRMED'
  | 'DIGITAL_LINKS'
  | 'FULFILLMENT_CONFIRMATION'
  | 'ORDER_CANCEL'
  | 'ORDER_CONFIRMATION'
  | 'ORDER_REFUND'
  | 'PAYMENT_CONFIRMATION'
  | 'SHIPPING_CONFIRMATION'
  | 'TRACKING_UPDATED';

/** An enumeration. */
export type OrderEventsEnum =
  | 'ADDED_PRODUCTS'
  | 'CANCELED'
  | 'CONFIRMED'
  | 'DRAFT_CREATED'
  | 'DRAFT_CREATED_FROM_REPLACE'
  | 'EMAIL_SENT'
  | 'EXTERNAL_SERVICE_NOTIFICATION'
  | 'FULFILLMENT_AWAITS_APPROVAL'
  | 'FULFILLMENT_CANCELED'
  | 'FULFILLMENT_FULFILLED_ITEMS'
  | 'FULFILLMENT_REFUNDED'
  | 'FULFILLMENT_REPLACED'
  | 'FULFILLMENT_RESTOCKED_ITEMS'
  | 'FULFILLMENT_RETURNED'
  | 'INVOICE_GENERATED'
  | 'INVOICE_REQUESTED'
  | 'INVOICE_SENT'
  | 'INVOICE_UPDATED'
  | 'NOTE_ADDED'
  | 'ORDER_DISCOUNT_ADDED'
  | 'ORDER_DISCOUNT_AUTOMATICALLY_UPDATED'
  | 'ORDER_DISCOUNT_DELETED'
  | 'ORDER_DISCOUNT_UPDATED'
  | 'ORDER_FULLY_PAID'
  | 'ORDER_LINE_DISCOUNT_REMOVED'
  | 'ORDER_LINE_DISCOUNT_UPDATED'
  | 'ORDER_LINE_PRODUCT_DELETED'
  | 'ORDER_LINE_VARIANT_DELETED'
  | 'ORDER_MARKED_AS_PAID'
  | 'ORDER_REPLACEMENT_CREATED'
  | 'OTHER'
  | 'OVERSOLD_ITEMS'
  | 'PAYMENT_AUTHORIZED'
  | 'PAYMENT_CAPTURED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REFUNDED'
  | 'PAYMENT_VOIDED'
  | 'PLACED'
  | 'PLACED_FROM_DRAFT'
  | 'REMOVED_PRODUCTS'
  | 'TRACKING_UPDATED'
  | 'UPDATED_ADDRESS';

export type OrderFilterInput = {
  channels?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  created?: InputMaybe<DateRangeInput>;
  customer?: InputMaybe<Scalars['String']>;
  giftCardBought?: InputMaybe<Scalars['Boolean']>;
  giftCardUsed?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isClickAndCollect?: InputMaybe<Scalars['Boolean']>;
  isPreorder?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  paymentStatus?: InputMaybe<Array<InputMaybe<PaymentChargeStatusEnum>>>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<InputMaybe<OrderStatusFilter>>>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

/** Creates new fulfillments for an order. */
export type OrderFulfill = {
  __typename?: 'OrderFulfill';
  errors: Array<OrderError>;
  /** List of created fulfillments. */
  fulfillments?: Maybe<Array<Maybe<Fulfillment>>>;
  /** Fulfilled order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderFulfillInput = {
  /** If true, then allow proceed fulfillment when stock is exceeded. */
  allowStockToBeExceeded?: InputMaybe<Scalars['Boolean']>;
  /** List of items informing how to fulfill the order. */
  lines: Array<OrderFulfillLineInput>;
  /** If true, send an email notification to the customer. */
  notifyCustomer?: InputMaybe<Scalars['Boolean']>;
};

export type OrderFulfillLineInput = {
  /** The ID of the order line. */
  orderLineId?: InputMaybe<Scalars['ID']>;
  /** List of stock items to create. */
  stocks: Array<OrderFulfillStockInput>;
};

export type OrderFulfillStockInput = {
  /** The number of line items to be fulfilled from given warehouse. */
  quantity: Scalars['Int'];
  /** ID of the warehouse from which the item will be fulfilled. */
  warehouse: Scalars['ID'];
};

/** Represents order line of particular order. */
export type OrderLine = Node & {
  __typename?: 'OrderLine';
  /** List of allocations across warehouses. */
  allocations?: Maybe<Array<Allocation>>;
  digitalContentUrl?: Maybe<DigitalContentUrl>;
  id: Scalars['ID'];
  isShippingRequired: Scalars['Boolean'];
  productName: Scalars['String'];
  productSku?: Maybe<Scalars['String']>;
  productVariantId?: Maybe<Scalars['String']>;
  quantity: Scalars['Int'];
  quantityFulfilled: Scalars['Int'];
  /** New in Saleor 3.1. A quantity of items remaining to be fulfilled. */
  quantityToFulfill: Scalars['Int'];
  taxRate: Scalars['Float'];
  /** The main thumbnail for the ordered product. */
  thumbnail?: Maybe<Image>;
  /** Price of the order line. */
  totalPrice: TaxedMoney;
  /** Product name in the customer's language */
  translatedProductName: Scalars['String'];
  /** Variant name in the customer's language */
  translatedVariantName: Scalars['String'];
  /** Price of the single item in the order line without applied an order line discount. */
  undiscountedUnitPrice: TaxedMoney;
  /** The discount applied to the single order line. */
  unitDiscount: Money;
  unitDiscountReason?: Maybe<Scalars['String']>;
  /** Type of the discount: fixed or percent */
  unitDiscountType?: Maybe<DiscountValueTypeEnum>;
  /** Value of the discount. Can store fixed value or percent value */
  unitDiscountValue: Scalars['PositiveDecimal'];
  /** Price of the single item in the order line. */
  unitPrice: TaxedMoney;
  /** A purchased product variant. Note: this field may be null if the variant has been removed from stock at all. */
  variant?: Maybe<ProductVariant>;
  variantName: Scalars['String'];
};


/** Represents order line of particular order. */
export type OrderLineThumbnailArgs = {
  size?: InputMaybe<Scalars['Int']>;
};

export type OrderLineCreateInput = {
  /** Number of variant items ordered. */
  quantity: Scalars['Int'];
  /** Product variant ID. */
  variantId: Scalars['ID'];
};

/** Deletes an order line from an order. */
export type OrderLineDelete = {
  __typename?: 'OrderLineDelete';
  errors: Array<OrderError>;
  /** A related order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
  /** An order line that was deleted. */
  orderLine?: Maybe<OrderLine>;
};

/** Remove discount applied to the order line. */
export type OrderLineDiscountRemove = {
  __typename?: 'OrderLineDiscountRemove';
  errors: Array<OrderError>;
  /** Order which is related to line which has removed discount. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
  /** Order line which has removed discount. */
  orderLine?: Maybe<OrderLine>;
};

/** Update discount for the order line. */
export type OrderLineDiscountUpdate = {
  __typename?: 'OrderLineDiscountUpdate';
  errors: Array<OrderError>;
  /** Order which is related to the discounted line. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
  /** Order line which has been discounted. */
  orderLine?: Maybe<OrderLine>;
};

export type OrderLineInput = {
  /** Number of variant items ordered. */
  quantity: Scalars['Int'];
};

/** Updates an order line of an order. */
export type OrderLineUpdate = {
  __typename?: 'OrderLineUpdate';
  errors: Array<OrderError>;
  /** Related order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
  orderLine?: Maybe<OrderLine>;
};

/** Create order lines for an order. */
export type OrderLinesCreate = {
  __typename?: 'OrderLinesCreate';
  errors: Array<OrderError>;
  /** Related order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
  /** List of added order lines. */
  orderLines?: Maybe<Array<OrderLine>>;
};

/** Mark order as manually paid. */
export type OrderMarkAsPaid = {
  __typename?: 'OrderMarkAsPaid';
  errors: Array<OrderError>;
  /** Order marked as paid. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** An enumeration. */
export type OrderOriginEnum =
  | 'CHECKOUT'
  | 'DRAFT'
  | 'REISSUE';

/** Refund an order. */
export type OrderRefund = {
  __typename?: 'OrderRefund';
  errors: Array<OrderError>;
  /** A refunded order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderRefundFulfillmentLineInput = {
  /** The ID of the fulfillment line to refund. */
  fulfillmentLineId: Scalars['ID'];
  /** The number of items to be refunded. */
  quantity: Scalars['Int'];
};

export type OrderRefundLineInput = {
  /** The ID of the order line to refund. */
  orderLineId: Scalars['ID'];
  /** The number of items to be refunded. */
  quantity: Scalars['Int'];
};

export type OrderRefundProductsInput = {
  /** The total amount of refund when the value is provided manually. */
  amountToRefund?: InputMaybe<Scalars['PositiveDecimal']>;
  /** List of fulfilled lines to refund. */
  fulfillmentLines?: InputMaybe<Array<OrderRefundFulfillmentLineInput>>;
  /** If true, Saleor will refund shipping costs. If amountToRefund is providedincludeShippingCosts will be ignored. */
  includeShippingCosts?: InputMaybe<Scalars['Boolean']>;
  /** List of unfulfilled lines to refund. */
  orderLines?: InputMaybe<Array<OrderRefundLineInput>>;
};

export type OrderReturnFulfillmentLineInput = {
  /** The ID of the fulfillment line to return. */
  fulfillmentLineId: Scalars['ID'];
  /** The number of items to be returned. */
  quantity: Scalars['Int'];
  /** Determines, if the line should be added to replace order. */
  replace?: InputMaybe<Scalars['Boolean']>;
};

export type OrderReturnLineInput = {
  /** The ID of the order line to return. */
  orderLineId: Scalars['ID'];
  /** The number of items to be returned. */
  quantity: Scalars['Int'];
  /** Determines, if the line should be added to replace order. */
  replace?: InputMaybe<Scalars['Boolean']>;
};

export type OrderReturnProductsInput = {
  /** The total amount of refund when the value is provided manually. */
  amountToRefund?: InputMaybe<Scalars['PositiveDecimal']>;
  /** List of fulfilled lines to return. */
  fulfillmentLines?: InputMaybe<Array<OrderReturnFulfillmentLineInput>>;
  /** If true, Saleor will refund shipping costs. If amountToRefund is providedincludeShippingCosts will be ignored. */
  includeShippingCosts?: InputMaybe<Scalars['Boolean']>;
  /** List of unfulfilled lines to return. */
  orderLines?: InputMaybe<Array<OrderReturnLineInput>>;
  /** If true, Saleor will call refund action for all lines. */
  refund?: InputMaybe<Scalars['Boolean']>;
};

/** Order related settings from site settings. */
export type OrderSettings = {
  __typename?: 'OrderSettings';
  automaticallyConfirmAllNewOrders: Scalars['Boolean'];
  automaticallyFulfillNonShippableGiftCard: Scalars['Boolean'];
};

export type OrderSettingsError = {
  __typename?: 'OrderSettingsError';
  /** The error code. */
  code: OrderSettingsErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type OrderSettingsErrorCode =
  | 'INVALID';

/** Update shop order settings. */
export type OrderSettingsUpdate = {
  __typename?: 'OrderSettingsUpdate';
  errors: Array<OrderSettingsError>;
  /** Order settings. */
  orderSettings?: Maybe<OrderSettings>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderSettingsErrors: Array<OrderSettingsError>;
};

export type OrderSettingsUpdateInput = {
  /** When disabled, all new orders from checkout will be marked as unconfirmed. When enabled orders from checkout will become unfulfilled immediately. */
  automaticallyConfirmAllNewOrders?: InputMaybe<Scalars['Boolean']>;
  /** When enabled, all non-shippable gift card orders will be fulfilled automatically. */
  automaticallyFulfillNonShippableGiftCard?: InputMaybe<Scalars['Boolean']>;
};

export type OrderSortField =
  /**
   * Sort orders by creation date.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  | 'CREATED_AT'
  /**
   * Sort orders by creation date.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0.
   */
  | 'CREATION_DATE'
  /** Sort orders by customer. */
  | 'CUSTOMER'
  /** Sort orders by fulfillment status. */
  | 'FULFILLMENT_STATUS'
  /** Sort orders by last modified at. */
  | 'LAST_MODIFIED_AT'
  /** Sort orders by number. */
  | 'NUMBER'
  /** Sort orders by payment. */
  | 'PAYMENT';

export type OrderSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort orders by the selected field. */
  field: OrderSortField;
};

/** An enumeration. */
export type OrderStatus =
  | 'CANCELED'
  | 'DRAFT'
  | 'FULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'PARTIALLY_RETURNED'
  | 'RETURNED'
  | 'UNCONFIRMED'
  | 'UNFULFILLED';

export type OrderStatusFilter =
  | 'CANCELED'
  | 'FULFILLED'
  | 'PARTIALLY_FULFILLED'
  | 'READY_TO_CAPTURE'
  | 'READY_TO_FULFILL'
  | 'UNCONFIRMED'
  | 'UNFULFILLED';

/** Updates an order. */
export type OrderUpdate = {
  __typename?: 'OrderUpdate';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderUpdateInput = {
  /** Billing address of the customer. */
  billingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  shippingAddress?: InputMaybe<AddressInput>;
  /** Email address of the customer. */
  userEmail?: InputMaybe<Scalars['String']>;
};

/** Updates a shipping method of the order. Requires shipping method ID to update, when null is passed then currently assigned shipping method is removed. */
export type OrderUpdateShipping = {
  __typename?: 'OrderUpdateShipping';
  errors: Array<OrderError>;
  /** Order with updated shipping method. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

export type OrderUpdateShippingInput = {
  /** ID of the selected shipping method, pass null to remove currently assigned shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
};

/** Void an order. */
export type OrderVoid = {
  __typename?: 'OrderVoid';
  errors: Array<OrderError>;
  /** A voided order. */
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  orderErrors: Array<OrderError>;
};

/** A static page that can be manually added by a shop operator through the dashboard. */
export type Page = Node & ObjectWithMetadata & {
  __typename?: 'Page';
  /** List of attributes assigned to this product. */
  attributes: Array<SelectedAttribute>;
  /** Content of the page (JSON). */
  content?: Maybe<Scalars['JSONString']>;
  /**
   * Content of the page (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson: Scalars['JSONString'];
  created: Scalars['DateTime'];
  id: Scalars['ID'];
  isPublished: Scalars['Boolean'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  pageType: PageType;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  publicationDate?: Maybe<Scalars['Date']>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  /** Returns translated page fields for the given language code. */
  translation?: Maybe<PageTranslation>;
};


/** A static page that can be manually added by a shop operator through the dashboard. */
export type PageTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Assign attributes to a given page type. */
export type PageAttributeAssign = {
  __typename?: 'PageAttributeAssign';
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
  /** The updated page type. */
  pageType?: Maybe<PageType>;
};

/** Unassign attributes from a given page type. */
export type PageAttributeUnassign = {
  __typename?: 'PageAttributeUnassign';
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
  /** The updated page type. */
  pageType?: Maybe<PageType>;
};

/** Deletes pages. */
export type PageBulkDelete = {
  __typename?: 'PageBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

/** Publish pages. */
export type PageBulkPublish = {
  __typename?: 'PageBulkPublish';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

export type PageCountableConnection = {
  __typename?: 'PageCountableConnection';
  edges: Array<PageCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PageCountableEdge = {
  __typename?: 'PageCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Page;
};

/** Creates a new page. */
export type PageCreate = {
  __typename?: 'PageCreate';
  errors: Array<PageError>;
  page?: Maybe<Page>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

export type PageCreateInput = {
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** Page content in JSON format. */
  content?: InputMaybe<Scalars['JSONString']>;
  /** Determines if page is visible in the storefront. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** ID of the page type that page belongs to. */
  pageType: Scalars['ID'];
  /** Publication date. ISO 8601 standard. */
  publicationDate?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Page internal name. */
  slug?: InputMaybe<Scalars['String']>;
  /** Page title. */
  title?: InputMaybe<Scalars['String']>;
};

/** Deletes a page. */
export type PageDelete = {
  __typename?: 'PageDelete';
  errors: Array<PageError>;
  page?: Maybe<Page>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

export type PageError = {
  __typename?: 'PageError';
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: PageErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type PageErrorCode =
  | 'ATTRIBUTE_ALREADY_ASSIGNED'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type PageFilterInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  pageTypes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PageInput = {
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** Page content in JSON format. */
  content?: InputMaybe<Scalars['JSONString']>;
  /** Determines if page is visible in the storefront. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: InputMaybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Page internal name. */
  slug?: InputMaybe<Scalars['String']>;
  /** Page title. */
  title?: InputMaybe<Scalars['String']>;
};

/** Reorder page attribute values. */
export type PageReorderAttributeValues = {
  __typename?: 'PageReorderAttributeValues';
  errors: Array<PageError>;
  /** Page from which attribute values are reordered. */
  page?: Maybe<Page>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

export type PageSortField =
  /** Sort pages by creation date. */
  | 'CREATION_DATE'
  /** Sort pages by publication date. */
  | 'PUBLICATION_DATE'
  /** Sort pages by slug. */
  | 'SLUG'
  /** Sort pages by title. */
  | 'TITLE'
  /** Sort pages by visibility. */
  | 'VISIBILITY';

export type PageSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort pages by the selected field. */
  field: PageSortField;
};

export type PageTranslatableContent = Node & {
  __typename?: 'PageTranslatableContent';
  /** List of page content attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
  content?: Maybe<Scalars['JSONString']>;
  /**
   * Content of the page (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /**
   * A static page that can be manually added by a shop operator through the dashboard.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  page?: Maybe<Page>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  /** Returns translated page fields for the given language code. */
  translation?: Maybe<PageTranslation>;
};


export type PageTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a page. */
export type PageTranslate = {
  __typename?: 'PageTranslate';
  errors: Array<TranslationError>;
  page?: Maybe<PageTranslatableContent>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type PageTranslation = Node & {
  __typename?: 'PageTranslation';
  content?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the page (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type PageTranslationInput = {
  content?: InputMaybe<Scalars['JSONString']>;
  seoDescription?: InputMaybe<Scalars['String']>;
  seoTitle?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/** Represents a type of page. It defines what attributes are available to pages of this type. */
export type PageType = Node & ObjectWithMetadata & {
  __typename?: 'PageType';
  /** Page attributes of that page type. */
  attributes?: Maybe<Array<Maybe<Attribute>>>;
  /** Attributes that can be assigned to the page type. */
  availableAttributes?: Maybe<AttributeCountableConnection>;
  /** Whether page type has pages assigned. */
  hasPages?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  slug: Scalars['String'];
};


/** Represents a type of page. It defines what attributes are available to pages of this type. */
export type PageTypeAvailableAttributesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AttributeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Delete page types. */
export type PageTypeBulkDelete = {
  __typename?: 'PageTypeBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

export type PageTypeCountableConnection = {
  __typename?: 'PageTypeCountableConnection';
  edges: Array<PageTypeCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PageTypeCountableEdge = {
  __typename?: 'PageTypeCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: PageType;
};

/** Create a new page type. */
export type PageTypeCreate = {
  __typename?: 'PageTypeCreate';
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
  pageType?: Maybe<PageType>;
};

export type PageTypeCreateInput = {
  /** List of attribute IDs to be assigned to the page type. */
  addAttributes?: InputMaybe<Array<Scalars['ID']>>;
  /** Name of the page type. */
  name?: InputMaybe<Scalars['String']>;
  /** Page type slug. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Delete a page type. */
export type PageTypeDelete = {
  __typename?: 'PageTypeDelete';
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
  pageType?: Maybe<PageType>;
};

export type PageTypeFilterInput = {
  search?: InputMaybe<Scalars['String']>;
};

/** Reorder the attributes of a page type. */
export type PageTypeReorderAttributes = {
  __typename?: 'PageTypeReorderAttributes';
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
  /** Page type from which attributes are reordered. */
  pageType?: Maybe<PageType>;
};

export type PageTypeSortField =
  /** Sort page types by name. */
  | 'NAME'
  /** Sort page types by slug. */
  | 'SLUG';

export type PageTypeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort page types by the selected field. */
  field: PageTypeSortField;
};

/** Update page type. */
export type PageTypeUpdate = {
  __typename?: 'PageTypeUpdate';
  errors: Array<PageError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
  pageType?: Maybe<PageType>;
};

export type PageTypeUpdateInput = {
  /** List of attribute IDs to be assigned to the page type. */
  addAttributes?: InputMaybe<Array<Scalars['ID']>>;
  /** Name of the page type. */
  name?: InputMaybe<Scalars['String']>;
  /** List of attribute IDs to be assigned to the page type. */
  removeAttributes?: InputMaybe<Array<Scalars['ID']>>;
  /** Page type slug. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Updates an existing page. */
export type PageUpdate = {
  __typename?: 'PageUpdate';
  errors: Array<PageError>;
  page?: Maybe<Page>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pageErrors: Array<PageError>;
};

/** Change the password of the logged in user. */
export type PasswordChange = {
  __typename?: 'PasswordChange';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** A user instance with a new password. */
  user?: Maybe<User>;
};

/** Represents a payment of a given type. */
export type Payment = Node & ObjectWithMetadata & {
  __typename?: 'Payment';
  /** List of actions that can be performed in the current state of a payment. */
  actions: Array<PaymentActionEnum>;
  /** Total amount authorized for this payment. */
  authorizedAmount: Money;
  /**
   * Maximum amount of money that can be captured.
   * @deprecated This field will be removed in Saleor 4.0. Use new checkout flow.
   */
  availableCaptureAmount?: Maybe<Money>;
  /**
   * Maximum amount of money that can be refunded.
   * @deprecated This field will be removed in Saleor 4.0. Use new checkout flow.
   */
  availableRefundAmount?: Maybe<Money>;
  /** Total amount captured for this payment. */
  capturedAmount: Money;
  /**
   * Internal payment status.
   * @deprecated This field will be removed in Saleor 4.0. Use new checkout flow.
   */
  chargeStatus: PaymentChargeStatusEnum;
  checkout?: Maybe<Checkout>;
  created: Scalars['DateTime'];
  /**
   * The details of the card used for this payment.
   * @deprecated This field will be removed in Saleor 4.0. Use new checkout flow.
   */
  creditCard?: Maybe<CreditCard>;
  /** @deprecated This field will be removed in Saleor 4.0. Use new checkout flow. */
  customerIpAddress?: Maybe<Scalars['String']>;
  /** @deprecated This field will be removed in Saleor 4.0. Use new checkout flow. */
  gateway: Scalars['String'];
  id: Scalars['ID'];
  /** @deprecated This field will be removed in Saleor 4.0. Use new checkout flow. */
  isActive: Scalars['Boolean'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  modified: Scalars['DateTime'];
  order?: Maybe<Order>;
  /** @deprecated This field will be removed in Saleor 4.0. Use new checkout flow. */
  paymentMethodType: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  reference: Scalars['String'];
  /** Total amount refunded for this payment. */
  refundedAmount: Money;
  status: Scalars['String'];
  /** @deprecated This field will be removed in Saleor 4.0. Use new checkout flow. */
  token: Scalars['String'];
  /** Total amount of the payment. */
  total?: Maybe<Money>;
  /**
   * List of all transactions within this payment.
   * @deprecated This field will be removed in Saleor 4.0. Use new checkout flow.
   */
  transactions?: Maybe<Array<Maybe<Transaction>>>;
  type: Scalars['String'];
  /** Total amount voided for this payment. */
  voidedAmount: Money;
};

/**
 * Represents possible actions on payment.
 *
 *     The following actions are possible:
 *     CAPTURE - Represents the capture action.
 *     REFUND - Represents a refund action.
 *     VOID - Represents a void action.
 *     MARK_AS_PAID - This field will be removed in Saleor 4.0. Represents a mark-as-paid
 *     action.
 *
 */
export type PaymentActionEnum =
  | 'CAPTURE'
  | 'MARK_AS_PAID'
  | 'REFUND'
  | 'VOID';

/** Captures the authorized payment amount. */
export type PaymentCapture = {
  __typename?: 'PaymentCapture';
  errors: Array<PaymentError>;
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  paymentErrors: Array<PaymentError>;
};

/** An enumeration. */
export type PaymentChargeStatusEnum =
  | 'CANCELLED'
  | 'FULLY_CHARGED'
  | 'FULLY_REFUNDED'
  | 'NOT_CHARGED'
  | 'PARTIALLY_CHARGED'
  | 'PARTIALLY_REFUNDED'
  | 'PENDING'
  | 'REFUSED';

/** Check payment balance. */
export type PaymentCheckBalance = {
  __typename?: 'PaymentCheckBalance';
  /** Response from the gateway. */
  data?: Maybe<Scalars['JSONString']>;
  errors: Array<PaymentError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  paymentErrors: Array<PaymentError>;
};

export type PaymentCheckBalanceInput = {
  /** Information about card. */
  card: CardInput;
  /** Slug of a channel for which the data should be returned. */
  channel: Scalars['String'];
  /** An ID of a payment gateway to check. */
  gatewayId: Scalars['String'];
  /** Payment method name. */
  method: Scalars['String'];
};

export type PaymentCountableConnection = {
  __typename?: 'PaymentCountableConnection';
  edges: Array<PaymentCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PaymentCountableEdge = {
  __typename?: 'PaymentCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Payment;
};

/** Note: this feature is in a preview state and can be subject to changes at later point. Create payment for checkout or order. */
export type PaymentCreate = {
  __typename?: 'PaymentCreate';
  errors: Array<PaymentCreateError>;
  payment?: Maybe<Payment>;
};

export type PaymentCreateError = {
  __typename?: 'PaymentCreateError';
  /** The error code. */
  code: PaymentCreateErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type PaymentCreateErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INCORRECT_CURRENCY'
  | 'INVALID'
  | 'METADATA_KEY_REQUIRED'
  | 'NOT_FOUND';

export type PaymentCreateInput = {
  /** Amount authorized by this payment. */
  amountAuthorized?: InputMaybe<MoneyInput>;
  /** Amount captured by this payment. */
  amountCaptured?: InputMaybe<MoneyInput>;
  /** Amount refunded by this payment. */
  amountRefunded?: InputMaybe<MoneyInput>;
  /** Amount refunded by this payment. */
  amountVoided?: InputMaybe<MoneyInput>;
  /** List of all possible actions for the payment */
  availableActions?: InputMaybe<Array<PaymentActionEnum>>;
  /** User public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** User public metadata. */
  privateMetadata?: InputMaybe<Array<MetadataInput>>;
  /** Reference of the payment. */
  reference?: InputMaybe<Scalars['String']>;
  /** Status of the payment. */
  status: Scalars['String'];
  /** Payment type used for this payment. */
  type: Scalars['String'];
};

export type PaymentError = {
  __typename?: 'PaymentError';
  /** The error code. */
  code: PaymentErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of varint IDs which causes the error. */
  variants?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type PaymentErrorCode =
  | 'BALANCE_CHECK_ERROR'
  | 'BILLING_ADDRESS_NOT_SET'
  | 'CHANNEL_INACTIVE'
  | 'CHECKOUT_EMAIL_NOT_SET'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'INVALID_SHIPPING_METHOD'
  | 'NOT_FOUND'
  | 'NOT_SUPPORTED_GATEWAY'
  | 'NO_CHECKOUT_LINES'
  | 'PARTIAL_PAYMENT_NOT_ALLOWED'
  | 'PAYMENT_ERROR'
  | 'REQUIRED'
  | 'SHIPPING_ADDRESS_NOT_SET'
  | 'SHIPPING_METHOD_NOT_SET'
  | 'UNAVAILABLE_VARIANT_IN_CHANNEL'
  | 'UNIQUE';

export type PaymentFilterInput = {
  checkouts?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Available payment gateway backend with configuration necessary to setup client. */
export type PaymentGateway = {
  __typename?: 'PaymentGateway';
  /** Payment gateway client configuration. */
  config: Array<GatewayConfigLine>;
  /** Payment gateway supported currencies. */
  currencies: Array<Maybe<Scalars['String']>>;
  /** Payment gateway ID. */
  id: Scalars['ID'];
  /** Payment gateway name. */
  name: Scalars['String'];
};

/** Initializes payment process when it is required by gateway. */
export type PaymentInitialize = {
  __typename?: 'PaymentInitialize';
  errors: Array<PaymentError>;
  initializedPayment?: Maybe<PaymentInitialized>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  paymentErrors: Array<PaymentError>;
};

/** Server-side data generated by a payment gateway. Optional step when the payment provider requires an additional action to initialize payment session. */
export type PaymentInitialized = {
  __typename?: 'PaymentInitialized';
  /** Initialized data by gateway. */
  data?: Maybe<Scalars['JSONString']>;
  /** ID of a payment gateway. */
  gateway: Scalars['String'];
  /** Payment gateway name. */
  name: Scalars['String'];
};

export type PaymentInput = {
  /** Total amount of the transaction, including all taxes and discounts. If no amount is provided, the checkout total will be used. */
  amount?: InputMaybe<Scalars['PositiveDecimal']>;
  /** A gateway to use with that payment. */
  gateway: Scalars['String'];
  /** New in Saleor 3.1. User public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** URL of a storefront view where user should be redirected after requiring additional actions. Payment with additional actions will not be finished if this field is not provided. */
  returnUrl?: InputMaybe<Scalars['String']>;
  /** New in Saleor 3.1. Payment store type. */
  storePaymentMethod?: InputMaybe<StorePaymentMethodEnum>;
  /** Client-side generated payment token, representing customer's billing data in a secure manner. */
  token?: InputMaybe<Scalars['String']>;
};

/** Refunds the captured payment amount. */
export type PaymentRefund = {
  __typename?: 'PaymentRefund';
  errors: Array<PaymentError>;
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  paymentErrors: Array<PaymentError>;
};

/** Represents a payment source stored for user in payment gateway, such as credit card. */
export type PaymentSource = {
  __typename?: 'PaymentSource';
  /** Stored credit card details if available. */
  creditCardInfo?: Maybe<CreditCard>;
  /** Payment gateway name. */
  gateway: Scalars['String'];
  /** New in Saleor 3.1. List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** ID of stored payment method. */
  paymentMethodId?: Maybe<Scalars['String']>;
};

/** Note: this feature is in a preview state and can be subject to changes at later point. Create payment for checkout or order. */
export type PaymentUpdate = {
  __typename?: 'PaymentUpdate';
  errors: Array<PaymentUpdateError>;
  payment?: Maybe<Payment>;
};

export type PaymentUpdateError = {
  __typename?: 'PaymentUpdateError';
  /** The error code. */
  code: PaymentUpdateErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type PaymentUpdateErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INCORRECT_CURRENCY'
  | 'INVALID'
  | 'METADATA_KEY_REQUIRED'
  | 'NOT_FOUND';

export type PaymentUpdateInput = {
  /** Amount authorized by this payment. */
  amountAuthorized?: InputMaybe<MoneyInput>;
  /** Amount captured by this payment. */
  amountCaptured?: InputMaybe<MoneyInput>;
  /** Amount refunded by this payment. */
  amountRefunded?: InputMaybe<MoneyInput>;
  /** Amount refunded by this payment. */
  amountVoided?: InputMaybe<MoneyInput>;
  /** List of all possible actions for the payment */
  availableActions?: InputMaybe<Array<PaymentActionEnum>>;
  /** User public metadata. */
  metadata?: InputMaybe<Array<MetadataInput>>;
  /** User public metadata. */
  privateMetadata?: InputMaybe<Array<MetadataInput>>;
  /** Reference of the payment. */
  reference?: InputMaybe<Scalars['String']>;
  /** Status of the payment. */
  status?: InputMaybe<Scalars['String']>;
  /** Payment type used for this payment. */
  type?: InputMaybe<Scalars['String']>;
};

/** Voids the authorized payment. */
export type PaymentVoid = {
  __typename?: 'PaymentVoid';
  errors: Array<PaymentError>;
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  paymentErrors: Array<PaymentError>;
};

/** Represents a permission object in a friendly form. */
export type Permission = {
  __typename?: 'Permission';
  /** Internal code for permission. */
  code: PermissionEnum;
  /** Describe action(s) allowed to do by permission. */
  name: Scalars['String'];
};

/** An enumeration. */
export type PermissionEnum =
  | 'HANDLE_PAYMENTS'
  | 'IMPERSONATE_USER'
  | 'MANAGE_APPS'
  | 'MANAGE_CHANNELS'
  | 'MANAGE_CHECKOUTS'
  | 'MANAGE_DISCOUNTS'
  | 'MANAGE_GIFT_CARD'
  | 'MANAGE_MENUS'
  | 'MANAGE_ORDERS'
  | 'MANAGE_PAGES'
  | 'MANAGE_PAGE_TYPES_AND_ATTRIBUTES'
  | 'MANAGE_PLUGINS'
  | 'MANAGE_PRODUCTS'
  | 'MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_SHIPPING'
  | 'MANAGE_STAFF'
  | 'MANAGE_TRANSLATIONS'
  | 'MANAGE_USERS';

/** Create new permission group. */
export type PermissionGroupCreate = {
  __typename?: 'PermissionGroupCreate';
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  permissionGroupErrors: Array<PermissionGroupError>;
};

export type PermissionGroupCreateInput = {
  /** List of permission code names to assign to this group. */
  addPermissions?: InputMaybe<Array<PermissionEnum>>;
  /** List of users to assign to this group. */
  addUsers?: InputMaybe<Array<Scalars['ID']>>;
  /** Group name. */
  name: Scalars['String'];
};

/** Delete permission group. */
export type PermissionGroupDelete = {
  __typename?: 'PermissionGroupDelete';
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  permissionGroupErrors: Array<PermissionGroupError>;
};

export type PermissionGroupError = {
  __typename?: 'PermissionGroupError';
  /** The error code. */
  code: PermissionGroupErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of permissions which causes the error. */
  permissions?: Maybe<Array<PermissionEnum>>;
  /** List of user IDs which causes the error. */
  users?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type PermissionGroupErrorCode =
  | 'ASSIGN_NON_STAFF_MEMBER'
  | 'CANNOT_REMOVE_FROM_LAST_GROUP'
  | 'DUPLICATED_INPUT_ITEM'
  | 'LEFT_NOT_MANAGEABLE_PERMISSION'
  | 'OUT_OF_SCOPE_PERMISSION'
  | 'OUT_OF_SCOPE_USER'
  | 'REQUIRED'
  | 'UNIQUE';

export type PermissionGroupFilterInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
};

export type PermissionGroupSortField =
  /** Sort permission group accounts by name. */
  | 'NAME';

export type PermissionGroupSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort permission group by the selected field. */
  field: PermissionGroupSortField;
};

/** Update permission group. */
export type PermissionGroupUpdate = {
  __typename?: 'PermissionGroupUpdate';
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  permissionGroupErrors: Array<PermissionGroupError>;
};

export type PermissionGroupUpdateInput = {
  /** List of permission code names to assign to this group. */
  addPermissions?: InputMaybe<Array<PermissionEnum>>;
  /** List of users to assign to this group. */
  addUsers?: InputMaybe<Array<Scalars['ID']>>;
  /** Group name. */
  name?: InputMaybe<Scalars['String']>;
  /** List of permission code names to unassign from this group. */
  removePermissions?: InputMaybe<Array<PermissionEnum>>;
  /** List of users to unassign from this group. */
  removeUsers?: InputMaybe<Array<Scalars['ID']>>;
};

/** Plugin. */
export type Plugin = {
  __typename?: 'Plugin';
  /** Channel-specific plugin configuration. */
  channelConfigurations: Array<PluginConfiguration>;
  /** Description of the plugin. */
  description: Scalars['String'];
  /** Global configuration of the plugin (not channel-specific). */
  globalConfiguration?: Maybe<PluginConfiguration>;
  /** Identifier of the plugin. */
  id: Scalars['ID'];
  /** Name of the plugin. */
  name: Scalars['String'];
};

/** Stores information about a configuration of plugin. */
export type PluginConfiguration = {
  __typename?: 'PluginConfiguration';
  /** Determines if plugin is active or not. */
  active: Scalars['Boolean'];
  /** The channel to which the plugin configuration is assigned to. */
  channel?: Maybe<Channel>;
  /** Configuration of the plugin. */
  configuration?: Maybe<Array<Maybe<ConfigurationItem>>>;
};

export type PluginConfigurationType =
  | 'GLOBAL'
  | 'PER_CHANNEL';

export type PluginCountableConnection = {
  __typename?: 'PluginCountableConnection';
  edges: Array<PluginCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PluginCountableEdge = {
  __typename?: 'PluginCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Plugin;
};

export type PluginError = {
  __typename?: 'PluginError';
  /** The error code. */
  code: PluginErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type PluginErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'PLUGIN_MISCONFIGURED'
  | 'REQUIRED'
  | 'UNIQUE';

export type PluginFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  statusInChannels?: InputMaybe<PluginStatusInChannelsInput>;
  type?: InputMaybe<PluginConfigurationType>;
};

export type PluginSortField =
  | 'IS_ACTIVE'
  | 'NAME';

export type PluginSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort plugins by the selected field. */
  field: PluginSortField;
};

export type PluginStatusInChannelsInput = {
  active: Scalars['Boolean'];
  channels: Array<Scalars['ID']>;
};

/** Update plugin configuration. */
export type PluginUpdate = {
  __typename?: 'PluginUpdate';
  errors: Array<PluginError>;
  plugin?: Maybe<Plugin>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  pluginsErrors: Array<PluginError>;
};

export type PluginUpdateInput = {
  /** Indicates whether the plugin should be enabled. */
  active?: InputMaybe<Scalars['Boolean']>;
  /** Configuration of the plugin. */
  configuration?: InputMaybe<Array<InputMaybe<ConfigurationItemInput>>>;
};

/** An enumeration. */
export type PostalCodeRuleInclusionTypeEnum =
  | 'EXCLUDE'
  | 'INCLUDE';

/** Represents preorder settings for product variant. */
export type PreorderData = {
  __typename?: 'PreorderData';
  /** Preorder end date. */
  endDate?: Maybe<Scalars['DateTime']>;
  /** Total number of sold product variant during preorder. */
  globalSoldUnits: Scalars['Int'];
  /** The global preorder threshold for product variant. */
  globalThreshold?: Maybe<Scalars['Int']>;
};

export type PreorderSettingsInput = {
  /** The end date for preorder. */
  endDate?: InputMaybe<Scalars['DateTime']>;
  /** The global threshold for preorder variant. */
  globalThreshold?: InputMaybe<Scalars['Int']>;
};

/** Represents preorder variant data for channel. */
export type PreorderThreshold = {
  __typename?: 'PreorderThreshold';
  /** Preorder threshold for product variant in this channel. */
  quantity?: Maybe<Scalars['Int']>;
  /** Number of sold product variant in this channel. */
  soldUnits: Scalars['Int'];
};

export type PriceInput = {
  /** Amount of money. */
  amount: Scalars['PositiveDecimal'];
  /** Currency code. */
  currency: Scalars['String'];
};

export type PriceRangeInput = {
  /** Price greater than or equal to. */
  gte?: InputMaybe<Scalars['Float']>;
  /** Price less than or equal to. */
  lte?: InputMaybe<Scalars['Float']>;
};

/** Represents an individual item for sale in the storefront. */
export type Product = Node & ObjectWithMetadata & {
  __typename?: 'Product';
  /** List of attributes assigned to this product. */
  attributes: Array<SelectedAttribute>;
  /** Date when product is available for purchase. */
  availableForPurchase?: Maybe<Scalars['Date']>;
  category?: Maybe<Category>;
  /** Channel given to retrieve this product. Also used by federation gateway to resolve this object in a federated query. */
  channel?: Maybe<Scalars['String']>;
  /** List of availability in channels for the product. */
  channelListings?: Maybe<Array<ProductChannelListing>>;
  chargeTaxes: Scalars['Boolean'];
  /** List of collections for the product. */
  collections?: Maybe<Array<Maybe<Collection>>>;
  created: Scalars['DateTime'];
  defaultVariant?: Maybe<ProductVariant>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the product (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /**
   * Get a single product image by ID.
   * @deprecated This field will be removed in Saleor 4.0. Use the `mediaById` field instead.
   */
  imageById?: Maybe<ProductImage>;
  /**
   * List of images for the product.
   * @deprecated This field will be removed in Saleor 4.0. Use the `media` field instead.
   */
  images?: Maybe<Array<Maybe<ProductImage>>>;
  /** Whether the product is in stock and visible or not. */
  isAvailable?: Maybe<Scalars['Boolean']>;
  /** Whether the product is available for purchase. */
  isAvailableForPurchase?: Maybe<Scalars['Boolean']>;
  /** List of media for the product. */
  media?: Maybe<Array<ProductMedia>>;
  /** Get a single product media by ID. */
  mediaById?: Maybe<ProductMedia>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** Lists the storefront product's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<ProductPricingInfo>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  productType: ProductType;
  rating?: Maybe<Scalars['Float']>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  /** A type of tax. Assigned by enabled tax gateway */
  taxType?: Maybe<TaxType>;
  /** The main thumbnail for a product. */
  thumbnail?: Maybe<Image>;
  /** Returns translated product fields for the given language code. */
  translation?: Maybe<ProductTranslation>;
  updatedAt: Scalars['DateTime'];
  /** List of variants for the product. */
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
  weight?: Maybe<Weight>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductImageByIdArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductIsAvailableArgs = {
  address?: InputMaybe<AddressInput>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductMediaByIdArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductPricingArgs = {
  address?: InputMaybe<AddressInput>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductThumbnailArgs = {
  size?: InputMaybe<Scalars['Int']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Assign attributes to a given product type. */
export type ProductAttributeAssign = {
  __typename?: 'ProductAttributeAssign';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  /** The updated product type. */
  productType?: Maybe<ProductType>;
};

export type ProductAttributeAssignInput = {
  /** The ID of the attribute to assign. */
  id: Scalars['ID'];
  /** The attribute type to be assigned as. */
  type: ProductAttributeType;
  /** New in Saleor 3.1. Whether attribute is allowed in variant selection. Allowed types are: ['dropdown', 'boolean', 'swatch', 'numeric']. */
  variantSelection?: InputMaybe<Scalars['Boolean']>;
};

/** New in Saleor 3.1. Update attributes assigned to product variant for given product type. */
export type ProductAttributeAssignmentUpdate = {
  __typename?: 'ProductAttributeAssignmentUpdate';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  /** The updated product type. */
  productType?: Maybe<ProductType>;
};

export type ProductAttributeAssignmentUpdateInput = {
  /** The ID of the attribute to assign. */
  id: Scalars['ID'];
  /** New in Saleor 3.1. Whether attribute is allowed in variant selection. Allowed types are: ['dropdown', 'boolean', 'swatch', 'numeric']. */
  variantSelection: Scalars['Boolean'];
};

export type ProductAttributeType =
  | 'PRODUCT'
  | 'VARIANT';

/** Un-assign attributes from a given product type. */
export type ProductAttributeUnassign = {
  __typename?: 'ProductAttributeUnassign';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  /** The updated product type. */
  productType?: Maybe<ProductType>;
};

/** Deletes products. */
export type ProductBulkDelete = {
  __typename?: 'ProductBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Represents product channel listing. */
export type ProductChannelListing = Node & {
  __typename?: 'ProductChannelListing';
  availableForPurchase?: Maybe<Scalars['Date']>;
  channel: Channel;
  /** The price of the cheapest variant (including discounts). */
  discountedPrice?: Maybe<Money>;
  id: Scalars['ID'];
  /** Whether the product is available for purchase. */
  isAvailableForPurchase?: Maybe<Scalars['Boolean']>;
  isPublished: Scalars['Boolean'];
  /** Range of margin percentage value. */
  margin?: Maybe<Margin>;
  /** Lists the storefront product's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<ProductPricingInfo>;
  publicationDate?: Maybe<Scalars['Date']>;
  /** Purchase cost of product. */
  purchaseCost?: Maybe<MoneyRange>;
  visibleInListings: Scalars['Boolean'];
};


/** Represents product channel listing. */
export type ProductChannelListingPricingArgs = {
  address?: InputMaybe<AddressInput>;
};

export type ProductChannelListingAddInput = {
  /** List of variants to which the channel should be assigned. */
  addVariants?: InputMaybe<Array<Scalars['ID']>>;
  /** A start date from which a product will be available for purchase. When not set and isAvailable is set to True, the current day is assumed. */
  availableForPurchaseDate?: InputMaybe<Scalars['Date']>;
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Determine if product should be available for purchase. */
  isAvailableForPurchase?: InputMaybe<Scalars['Boolean']>;
  /** Determines if object is visible to customers. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: InputMaybe<Scalars['Date']>;
  /** List of variants from which the channel should be unassigned. */
  removeVariants?: InputMaybe<Array<Scalars['ID']>>;
  /** Determines if product is visible in product listings (doesn't apply to product collections). */
  visibleInListings?: InputMaybe<Scalars['Boolean']>;
};

export type ProductChannelListingError = {
  __typename?: 'ProductChannelListingError';
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: ProductErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
  /** List of variants IDs which causes the error. */
  variants?: Maybe<Array<Scalars['ID']>>;
};

/** Manage product's availability in channels. */
export type ProductChannelListingUpdate = {
  __typename?: 'ProductChannelListingUpdate';
  errors: Array<ProductChannelListingError>;
  /** An updated product instance. */
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productChannelListingErrors: Array<ProductChannelListingError>;
};

export type ProductChannelListingUpdateInput = {
  /** List of channels from which the product should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of channels to which the product should be assigned or updated. */
  updateChannels?: InputMaybe<Array<ProductChannelListingAddInput>>;
};

export type ProductCountableConnection = {
  __typename?: 'ProductCountableConnection';
  edges: Array<ProductCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductCountableEdge = {
  __typename?: 'ProductCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Product;
};

/** Creates a new product. */
export type ProductCreate = {
  __typename?: 'ProductCreate';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductCreateInput = {
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** ID of the product's category. */
  category?: InputMaybe<Scalars['ID']>;
  /** Determine if taxes are being charged for the product. */
  chargeTaxes?: InputMaybe<Scalars['Boolean']>;
  /** List of IDs of collections that the product belongs to. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /** Product description (JSON). */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Product name. */
  name?: InputMaybe<Scalars['String']>;
  /** ID of the type that product belongs to. */
  productType: Scalars['ID'];
  /** Defines the product rating value. */
  rating?: InputMaybe<Scalars['Float']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Product slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: InputMaybe<Scalars['String']>;
  /** Weight of the Product. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** Deletes a product. */
export type ProductDelete = {
  __typename?: 'ProductDelete';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductError = {
  __typename?: 'ProductError';
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: ProductErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type ProductErrorCode =
  | 'ALREADY_EXISTS'
  | 'ATTRIBUTE_ALREADY_ASSIGNED'
  | 'ATTRIBUTE_CANNOT_BE_ASSIGNED'
  | 'ATTRIBUTE_VARIANTS_DISABLED'
  | 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'NOT_PRODUCTS_IMAGE'
  | 'NOT_PRODUCTS_VARIANT'
  | 'PREORDER_VARIANT_CANNOT_BE_DEACTIVATED'
  | 'PRODUCT_NOT_ASSIGNED_TO_CHANNEL'
  | 'PRODUCT_WITHOUT_CATEGORY'
  | 'REQUIRED'
  | 'UNIQUE'
  | 'UNSUPPORTED_MEDIA_PROVIDER'
  | 'VARIANT_NO_DIGITAL_CONTENT';

export type ProductFieldEnum =
  | 'CATEGORY'
  | 'CHARGE_TAXES'
  | 'COLLECTIONS'
  | 'DESCRIPTION'
  | 'NAME'
  | 'PRODUCT_MEDIA'
  | 'PRODUCT_TYPE'
  | 'PRODUCT_WEIGHT'
  | 'VARIANT_ID'
  | 'VARIANT_MEDIA'
  | 'VARIANT_SKU'
  | 'VARIANT_WEIGHT';

export type ProductFilterInput = {
  attributes?: InputMaybe<Array<InputMaybe<AttributeInput>>>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /**
   * Specifies the channel by which the data should be filtered.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  giftCard?: InputMaybe<Scalars['Boolean']>;
  hasCategory?: InputMaybe<Scalars['Boolean']>;
  hasPreorderedVariants?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isPublished?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  minimalPrice?: InputMaybe<PriceRangeInput>;
  price?: InputMaybe<PriceRangeInput>;
  productTypes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
  stockAvailability?: InputMaybe<StockAvailability>;
  stocks?: InputMaybe<ProductStockFilterInput>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

/** Represents a product image. */
export type ProductImage = {
  __typename?: 'ProductImage';
  /** The alt text of the image. */
  alt?: Maybe<Scalars['String']>;
  /** The ID of the image. */
  id: Scalars['ID'];
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: Maybe<Scalars['Int']>;
  /** The URL of the image. */
  url: Scalars['String'];
};


/** Represents a product image. */
export type ProductImageUrlArgs = {
  size?: InputMaybe<Scalars['Int']>;
};

export type ProductInput = {
  /** List of attributes. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** ID of the product's category. */
  category?: InputMaybe<Scalars['ID']>;
  /** Determine if taxes are being charged for the product. */
  chargeTaxes?: InputMaybe<Scalars['Boolean']>;
  /** List of IDs of collections that the product belongs to. */
  collections?: InputMaybe<Array<Scalars['ID']>>;
  /** Product description (JSON). */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Product name. */
  name?: InputMaybe<Scalars['String']>;
  /** Defines the product rating value. */
  rating?: InputMaybe<Scalars['Float']>;
  /** Search engine optimization fields. */
  seo?: InputMaybe<SeoInput>;
  /** Product slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: InputMaybe<Scalars['String']>;
  /** Weight of the Product. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** Represents a product media. */
export type ProductMedia = Node & {
  __typename?: 'ProductMedia';
  alt: Scalars['String'];
  id: Scalars['ID'];
  oembedData: Scalars['JSONString'];
  sortOrder?: Maybe<Scalars['Int']>;
  type: ProductMediaType;
  /** The URL of the media. */
  url: Scalars['String'];
};


/** Represents a product media. */
export type ProductMediaUrlArgs = {
  size?: InputMaybe<Scalars['Int']>;
};

/** Deletes product media. */
export type ProductMediaBulkDelete = {
  __typename?: 'ProductMediaBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Create a media object (image or video URL) associated with product. For image, this mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type ProductMediaCreate = {
  __typename?: 'ProductMediaCreate';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductMediaCreateInput = {
  /** Alt text for a product media. */
  alt?: InputMaybe<Scalars['String']>;
  /** Represents an image file in a multipart request. */
  image?: InputMaybe<Scalars['Upload']>;
  /** Represents an URL to an external media. */
  mediaUrl?: InputMaybe<Scalars['String']>;
  /** ID of an product. */
  product: Scalars['ID'];
};

/** Deletes a product media. */
export type ProductMediaDelete = {
  __typename?: 'ProductMediaDelete';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Changes ordering of the product media. */
export type ProductMediaReorder = {
  __typename?: 'ProductMediaReorder';
  errors: Array<ProductError>;
  media?: Maybe<Array<ProductMedia>>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** An enumeration. */
export type ProductMediaType =
  | 'IMAGE'
  | 'VIDEO';

/** Updates a product media. */
export type ProductMediaUpdate = {
  __typename?: 'ProductMediaUpdate';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductMediaUpdateInput = {
  /** Alt text for a product media. */
  alt?: InputMaybe<Scalars['String']>;
};

export type ProductOrder = {
  /**
   * Sort product by the selected attribute's values.
   * Note: this doesn't take translations into account yet.
   */
  attributeId?: InputMaybe<Scalars['ID']>;
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort products by the selected field. */
  field?: InputMaybe<ProductOrderField>;
};

export type ProductOrderField =
  /** Sort products by collection. Note: This option is available only for the `Collection.products` query. */
  | 'COLLECTION'
  /** Sort products by update date. */
  | 'DATE'
  /** Sort products by update date. */
  | 'LAST_MODIFIED'
  /** Sort products by update date. */
  | 'LAST_MODIFIED_AT'
  /** Sort products by a minimal price of a product's variant. */
  | 'MINIMAL_PRICE'
  /** Sort products by name. */
  | 'NAME'
  /** Sort products by price. */
  | 'PRICE'
  /** Sort products by publication date. */
  | 'PUBLICATION_DATE'
  /** Sort products by publication status. */
  | 'PUBLISHED'
  /** Sort products by publication date. */
  | 'PUBLISHED_AT'
  /** Sort products by name. */
  | 'RANK'
  /** Sort products by rating. */
  | 'RATING'
  /** Sort products by type. */
  | 'TYPE';

/** Represents availability of a product in the storefront. */
export type ProductPricingInfo = {
  __typename?: 'ProductPricingInfo';
  /** The discount amount if in sale (null otherwise). */
  discount?: Maybe<TaxedMoney>;
  /** The discount amount in the local currency. */
  discountLocalCurrency?: Maybe<TaxedMoney>;
  /** Whether it is in sale or not. */
  onSale?: Maybe<Scalars['Boolean']>;
  /** The discounted price range of the product variants. */
  priceRange?: Maybe<TaxedMoneyRange>;
  /** The discounted price range of the product variants in the local currency. */
  priceRangeLocalCurrency?: Maybe<TaxedMoneyRange>;
  /** The undiscounted price range of the product variants. */
  priceRangeUndiscounted?: Maybe<TaxedMoneyRange>;
};

/** Reorder product attribute values. */
export type ProductReorderAttributeValues = {
  __typename?: 'ProductReorderAttributeValues';
  errors: Array<ProductError>;
  /** Product from which attribute values are reordered. */
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductStockFilterInput = {
  quantity?: InputMaybe<IntRangeInput>;
  warehouseIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type ProductTranslatableContent = Node & {
  __typename?: 'ProductTranslatableContent';
  /** List of product attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the product (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Represents an individual item for sale in the storefront.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  product?: Maybe<Product>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
  /** Returns translated product fields for the given language code. */
  translation?: Maybe<ProductTranslation>;
};


export type ProductTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a product. */
export type ProductTranslate = {
  __typename?: 'ProductTranslate';
  errors: Array<TranslationError>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type ProductTranslation = Node & {
  __typename?: 'ProductTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the product (JSON).
   * @deprecated This field will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  seoTitle?: Maybe<Scalars['String']>;
};

/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductType = Node & ObjectWithMetadata & {
  __typename?: 'ProductType';
  /** New in Saleor 3.1. Variant attributes of that product type with attached variant selection. */
  assignedVariantAttributes?: Maybe<Array<Maybe<AssignedVariantAttribute>>>;
  availableAttributes?: Maybe<AttributeCountableConnection>;
  hasVariants: Scalars['Boolean'];
  id: Scalars['ID'];
  isDigital: Scalars['Boolean'];
  isShippingRequired: Scalars['Boolean'];
  /** The product type kind. */
  kind: ProductTypeKindEnum;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Product attributes of that product type. */
  productAttributes?: Maybe<Array<Maybe<Attribute>>>;
  /**
   * List of products of this type.
   * @deprecated This field will be removed in Saleor 4.0. Use the top-level `products` query with the `productTypes` filter.
   */
  products?: Maybe<ProductCountableConnection>;
  slug: Scalars['String'];
  /** A type of tax. Assigned by enabled tax gateway */
  taxType?: Maybe<TaxType>;
  /**
   * Variant attributes of that product type.
   * @deprecated This field will be removed in Saleor 4.0. Use `assignedVariantAttributes` instead.
   */
  variantAttributes?: Maybe<Array<Maybe<Attribute>>>;
  weight?: Maybe<Weight>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeAssignedVariantAttributesArgs = {
  variantSelection?: InputMaybe<VariantAttributeScope>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeAvailableAttributesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AttributeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeVariantAttributesArgs = {
  variantSelection?: InputMaybe<VariantAttributeScope>;
};

/** Deletes product types. */
export type ProductTypeBulkDelete = {
  __typename?: 'ProductTypeBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductTypeConfigurable =
  | 'CONFIGURABLE'
  | 'SIMPLE';

export type ProductTypeCountableConnection = {
  __typename?: 'ProductTypeCountableConnection';
  edges: Array<ProductTypeCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductTypeCountableEdge = {
  __typename?: 'ProductTypeCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ProductType;
};

/** Creates a new product type. */
export type ProductTypeCreate = {
  __typename?: 'ProductTypeCreate';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

/** Deletes a product type. */
export type ProductTypeDelete = {
  __typename?: 'ProductTypeDelete';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

export type ProductTypeEnum =
  | 'DIGITAL'
  | 'SHIPPABLE';

export type ProductTypeFilterInput = {
  configurable?: InputMaybe<ProductTypeConfigurable>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  kind?: InputMaybe<ProductTypeKindEnum>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  productType?: InputMaybe<ProductTypeEnum>;
  search?: InputMaybe<Scalars['String']>;
};

export type ProductTypeInput = {
  /** Determines if product of this type has multiple variants. This option mainly simplifies product management in the dashboard. There is always at least one variant created under the hood. */
  hasVariants?: InputMaybe<Scalars['Boolean']>;
  /** Determines if products are digital. */
  isDigital?: InputMaybe<Scalars['Boolean']>;
  /** Determines if shipping is required for products of this variant. */
  isShippingRequired?: InputMaybe<Scalars['Boolean']>;
  /** The product type kind. */
  kind?: InputMaybe<ProductTypeKindEnum>;
  /** Name of the product type. */
  name?: InputMaybe<Scalars['String']>;
  /** List of attributes shared among all product variants. */
  productAttributes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Product type slug. */
  slug?: InputMaybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: InputMaybe<Scalars['String']>;
  /** List of attributes used to distinguish between different variants of a product. */
  variantAttributes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Weight of the ProductType items. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** An enumeration. */
export type ProductTypeKindEnum =
  | 'GIFT_CARD'
  | 'NORMAL';

/** Reorder the attributes of a product type. */
export type ProductTypeReorderAttributes = {
  __typename?: 'ProductTypeReorderAttributes';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  /** Product type from which attributes are reordered. */
  productType?: Maybe<ProductType>;
};

export type ProductTypeSortField =
  /** Sort products by type. */
  | 'DIGITAL'
  /** Sort products by name. */
  | 'NAME'
  /** Sort products by shipping. */
  | 'SHIPPING_REQUIRED';

export type ProductTypeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort product types by the selected field. */
  field: ProductTypeSortField;
};

/** Updates an existing product type. */
export type ProductTypeUpdate = {
  __typename?: 'ProductTypeUpdate';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

/** Updates an existing product. */
export type ProductUpdate = {
  __typename?: 'ProductUpdate';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Represents a version of a product such as different size or color. */
export type ProductVariant = Node & ObjectWithMetadata & {
  __typename?: 'ProductVariant';
  /** List of attributes assigned to this variant. */
  attributes: Array<SelectedAttribute>;
  /** Channel given to retrieve this product variant. Also used by federation gateway to resolve this object in a federated query. */
  channel?: Maybe<Scalars['String']>;
  /** List of price information in channels for the product. */
  channelListings?: Maybe<Array<ProductVariantChannelListing>>;
  created: Scalars['DateTime'];
  /** Digital content for the product variant. */
  digitalContent?: Maybe<DigitalContent>;
  id: Scalars['ID'];
  /**
   * List of images for the product variant.
   * @deprecated This field will be removed in Saleor 4.0. Use the `media` field instead.
   */
  images?: Maybe<Array<Maybe<ProductImage>>>;
  /** Gross margin percentage value. */
  margin?: Maybe<Scalars['Int']>;
  /** List of media for the product variant. */
  media?: Maybe<Array<ProductMedia>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** New in Saleor 3.1. Preorder data for product variant. Note: this feature is in a preview state and can be subject to changes at later point. */
  preorder?: Maybe<PreorderData>;
  /** Lists the storefront variant's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<VariantPricingInfo>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  product: Product;
  /** Quantity of a product available for sale in one checkout. Field value will be `null` when no `limitQuantityPerCheckout` in global settings has been set, and `productVariant` stocks are not tracked. */
  quantityAvailable?: Maybe<Scalars['Int']>;
  quantityLimitPerCustomer?: Maybe<Scalars['Int']>;
  /** Total quantity ordered. */
  quantityOrdered?: Maybe<Scalars['Int']>;
  /** Total revenue generated by a variant in given period of time. Note: this field should be queried using `reportProductSales` query as it uses optimizations suitable for such calculations. */
  revenue?: Maybe<TaxedMoney>;
  sku?: Maybe<Scalars['String']>;
  /** Stocks for the product variant. */
  stocks?: Maybe<Array<Maybe<Stock>>>;
  trackInventory: Scalars['Boolean'];
  /** Returns translated product variant fields for the given language code. */
  translation?: Maybe<ProductVariantTranslation>;
  updatedAt: Scalars['DateTime'];
  weight?: Maybe<Weight>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantAttributesArgs = {
  variantSelection?: InputMaybe<VariantAttributeScope>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantPricingArgs = {
  address?: InputMaybe<AddressInput>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantQuantityAvailableArgs = {
  address?: InputMaybe<AddressInput>;
  countryCode?: InputMaybe<CountryCode>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantRevenueArgs = {
  period?: InputMaybe<ReportingPeriod>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantStocksArgs = {
  address?: InputMaybe<AddressInput>;
  countryCode?: InputMaybe<CountryCode>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates product variants for a given product. */
export type ProductVariantBulkCreate = {
  __typename?: 'ProductVariantBulkCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  bulkProductErrors: Array<BulkProductError>;
  /** Returns how many objects were created. */
  count: Scalars['Int'];
  errors: Array<BulkProductError>;
  /** List of the created variants. */
  productVariants: Array<ProductVariant>;
};

export type ProductVariantBulkCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<BulkAttributeValueInput>;
  /** List of prices assigned to channels. */
  channelListings?: InputMaybe<Array<ProductVariantChannelListingAddInput>>;
  /** New in Saleor 3.1. Determines if variant is in preorder. Note: this feature is in a preview state and can be subject to changes at later point. */
  preorder?: InputMaybe<PreorderSettingsInput>;
  /** New in Saleor 3.1. Determines maximum quantity of `ProductVariant`,that can be bought in a single checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Stocks of a product available for sale. */
  stocks?: InputMaybe<Array<StockInput>>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** Deletes product variants. */
export type ProductVariantBulkDelete = {
  __typename?: 'ProductVariantBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Represents product varaint channel listing. */
export type ProductVariantChannelListing = Node & {
  __typename?: 'ProductVariantChannelListing';
  channel: Channel;
  /** Cost price of the variant. */
  costPrice?: Maybe<Money>;
  id: Scalars['ID'];
  /** Gross margin percentage value. */
  margin?: Maybe<Scalars['Int']>;
  /** New in Saleor 3.1. Preorder variant data. Note: this feature is in a preview state and can be subject to changes at later point. */
  preorderThreshold?: Maybe<PreorderThreshold>;
  price?: Maybe<Money>;
};

export type ProductVariantChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Cost price of the variant in channel. */
  costPrice?: InputMaybe<Scalars['PositiveDecimal']>;
  /** New in Saleor 3.1. The threshold for preorder variant in channel. Note: this feature is in a preview state and can be subject to changes at later point. */
  preorderThreshold?: InputMaybe<Scalars['Int']>;
  /** Price of the particular variant in channel. */
  price: Scalars['PositiveDecimal'];
};

/** Manage product variant prices in channels. */
export type ProductVariantChannelListingUpdate = {
  __typename?: 'ProductVariantChannelListingUpdate';
  errors: Array<ProductChannelListingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productChannelListingErrors: Array<ProductChannelListingError>;
  /** An updated product variant instance. */
  variant?: Maybe<ProductVariant>;
};

export type ProductVariantCountableConnection = {
  __typename?: 'ProductVariantCountableConnection';
  edges: Array<ProductVariantCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductVariantCountableEdge = {
  __typename?: 'ProductVariantCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ProductVariant;
};

/** Creates a new variant for a product. */
export type ProductVariantCreate = {
  __typename?: 'ProductVariantCreate';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<AttributeValueInput>;
  /** New in Saleor 3.1. Determines if variant is in preorder. Note: this feature is in a preview state and can be subject to changes at later point. */
  preorder?: InputMaybe<PreorderSettingsInput>;
  /** Product ID of which type is the variant. */
  product: Scalars['ID'];
  /** New in Saleor 3.1. Determines maximum quantity of `ProductVariant`,that can be bought in a single checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Stocks of a product available for sale. */
  stocks?: InputMaybe<Array<StockInput>>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** Deletes a product variant. */
export type ProductVariantDelete = {
  __typename?: 'ProductVariantDelete';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantFilterInput = {
  isPreorder?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

export type ProductVariantInput = {
  /** List of attributes specific to this variant. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** New in Saleor 3.1. Determines if variant is in preorder. Note: this feature is in a preview state and can be subject to changes at later point. */
  preorder?: InputMaybe<PreorderSettingsInput>;
  /** New in Saleor 3.1. Determines maximum quantity of `ProductVariant`,that can be bought in a single checkout. Note: this feature is in a preview state and can be subject to changes at later point. */
  quantityLimitPerCustomer?: InputMaybe<Scalars['Int']>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** New in Saleor 3.1. Deactivates product variant preorder. It changes all preorder allocation into regular allocation. Note: this feature is in a preview state and can be subject to changes at later point. */
export type ProductVariantPreorderDeactivate = {
  __typename?: 'ProductVariantPreorderDeactivate';
  errors: Array<ProductError>;
  /** Product variant with ended preorder. */
  productVariant?: Maybe<ProductVariant>;
};

/** Reorder the variants of a product. Mutation updates updated_at on product and triggers PRODUCT_UPDATED webhook. */
export type ProductVariantReorder = {
  __typename?: 'ProductVariantReorder';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

/** Reorder product variant attribute values. */
export type ProductVariantReorderAttributeValues = {
  __typename?: 'ProductVariantReorderAttributeValues';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  /** Product variant from which attribute values are reordered. */
  productVariant?: Maybe<ProductVariant>;
};

/** Set default variant for a product. Mutation triggers PRODUCT_UPDATED webhook. */
export type ProductVariantSetDefault = {
  __typename?: 'ProductVariantSetDefault';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
};

export type ProductVariantSortField =
  /** Sort products variants by last modified at. */
  | 'LAST_MODIFIED_AT';

export type ProductVariantSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort productVariants by the selected field. */
  field: ProductVariantSortField;
};

/** Creates stocks for product variant. */
export type ProductVariantStocksCreate = {
  __typename?: 'ProductVariantStocksCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  bulkStockErrors: Array<BulkStockError>;
  errors: Array<BulkStockError>;
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
};

/** Delete stocks from product variant. */
export type ProductVariantStocksDelete = {
  __typename?: 'ProductVariantStocksDelete';
  errors: Array<StockError>;
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  stockErrors: Array<StockError>;
};

/** Update stocks for product variant. */
export type ProductVariantStocksUpdate = {
  __typename?: 'ProductVariantStocksUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  bulkStockErrors: Array<BulkStockError>;
  errors: Array<BulkStockError>;
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantTranslatableContent = Node & {
  __typename?: 'ProductVariantTranslatableContent';
  /** List of product variant attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Represents a version of a product such as different size or color.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  productVariant?: Maybe<ProductVariant>;
  /** Returns translated product variant fields for the given language code. */
  translation?: Maybe<ProductVariantTranslation>;
};


export type ProductVariantTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a product variant. */
export type ProductVariantTranslate = {
  __typename?: 'ProductVariantTranslate';
  errors: Array<TranslationError>;
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type ProductVariantTranslation = Node & {
  __typename?: 'ProductVariantTranslation';
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
};

/** Updates an existing variant for product. */
export type ProductVariantUpdate = {
  __typename?: 'ProductVariantUpdate';
  errors: Array<ProductError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type PublishableChannelListingInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Determines if object is visible to customers. */
  isPublished?: InputMaybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: InputMaybe<Scalars['Date']>;
};

export type Query = {
  __typename?: 'Query';
  _entities?: Maybe<Array<Maybe<_Entity>>>;
  _service?: Maybe<_Service>;
  /** Look up an address by ID. */
  address?: Maybe<Address>;
  /** Returns address validation rules. */
  addressValidationRules?: Maybe<AddressValidationData>;
  /** Look up an app by ID. If ID is not provided, return the currently authenticated app. */
  app?: Maybe<App>;
  /** New in Saleor 3.1. Look up an app extension by ID. Note: this feature is in a preview state and can be subject to changes at later point. */
  appExtension?: Maybe<AppExtension>;
  /** New in Saleor 3.1. List of all extensions. Note: this feature is in a preview state and can be subject to changes at later point. */
  appExtensions?: Maybe<AppExtensionCountableConnection>;
  /** List of the apps. */
  apps?: Maybe<AppCountableConnection>;
  /** List of all apps installations */
  appsInstallations: Array<AppInstallation>;
  /** Look up an attribute by ID. */
  attribute?: Maybe<Attribute>;
  /** List of the shop's attributes. */
  attributes?: Maybe<AttributeCountableConnection>;
  /** List of the shop's categories. */
  categories?: Maybe<CategoryCountableConnection>;
  /** Look up a category by ID or slug. */
  category?: Maybe<Category>;
  /** Look up a channel by ID. */
  channel?: Maybe<Channel>;
  /** List of all channels. */
  channels?: Maybe<Array<Channel>>;
  /** Look up a checkout by token and slug of channel. */
  checkout?: Maybe<Checkout>;
  /** List of checkout lines. */
  checkoutLines?: Maybe<CheckoutLineCountableConnection>;
  /** List of checkouts. */
  checkouts?: Maybe<CheckoutCountableConnection>;
  /** Look up a collection by ID. */
  collection?: Maybe<Collection>;
  /** List of the shop's collections. */
  collections?: Maybe<CollectionCountableConnection>;
  /** List of the shop's customers. */
  customers?: Maybe<UserCountableConnection>;
  /** Look up digital content by ID. */
  digitalContent?: Maybe<DigitalContent>;
  /** List of digital content. */
  digitalContents?: Maybe<DigitalContentCountableConnection>;
  /** List of draft orders. */
  draftOrders?: Maybe<OrderCountableConnection>;
  /** Look up a export file by ID. */
  exportFile?: Maybe<ExportFile>;
  /** List of export files. */
  exportFiles?: Maybe<ExportFileCountableConnection>;
  /** Look up a gift card by ID. */
  giftCard?: Maybe<GiftCard>;
  /** New in Saleor 3.1. List of gift card currencies. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardCurrencies: Array<Scalars['String']>;
  /** Gift card related settings from site settings. */
  giftCardSettings: GiftCardSettings;
  /** New in Saleor 3.1. List of gift card tags. Note: this feature is in a preview state and can be subject to changes at later point. */
  giftCardTags?: Maybe<GiftCardTagCountableConnection>;
  /** List of gift cards. */
  giftCards?: Maybe<GiftCardCountableConnection>;
  /** List of activity events to display on homepage (at the moment it only contains order-events). */
  homepageEvents?: Maybe<OrderEventCountableConnection>;
  /** Return the currently authenticated user. */
  me?: Maybe<User>;
  /** Look up a navigation menu by ID or name. */
  menu?: Maybe<Menu>;
  /** Look up a menu item by ID. */
  menuItem?: Maybe<MenuItem>;
  /** List of the storefronts's menu items. */
  menuItems?: Maybe<MenuItemCountableConnection>;
  /** List of the storefront's menus. */
  menus?: Maybe<MenuCountableConnection>;
  /** Look up an order by ID. */
  order?: Maybe<Order>;
  /** Look up an order by token. */
  orderByToken?: Maybe<Order>;
  /** Order related settings from site settings. */
  orderSettings?: Maybe<OrderSettings>;
  /** List of orders. */
  orders?: Maybe<OrderCountableConnection>;
  /** Return the total sales amount from a specific period. */
  ordersTotal?: Maybe<TaxedMoney>;
  /** Look up a page by ID or slug. */
  page?: Maybe<Page>;
  /** Look up a page type by ID. */
  pageType?: Maybe<PageType>;
  /** List of the page types. */
  pageTypes?: Maybe<PageTypeCountableConnection>;
  /** List of the shop's pages. */
  pages?: Maybe<PageCountableConnection>;
  /** Look up a payment by ID. */
  payment?: Maybe<Payment>;
  /** List of payments. */
  payments?: Maybe<PaymentCountableConnection>;
  /** Look up permission group by ID. */
  permissionGroup?: Maybe<Group>;
  /** List of permission groups. */
  permissionGroups?: Maybe<GroupCountableConnection>;
  /** Look up a plugin by ID. */
  plugin?: Maybe<Plugin>;
  /** List of plugins. */
  plugins?: Maybe<PluginCountableConnection>;
  /** Look up a product by ID. */
  product?: Maybe<Product>;
  /** Look up a product type by ID. */
  productType?: Maybe<ProductType>;
  /** List of the shop's product types. */
  productTypes?: Maybe<ProductTypeCountableConnection>;
  /** Look up a product variant by ID or SKU. */
  productVariant?: Maybe<ProductVariant>;
  /** List of product variants. */
  productVariants?: Maybe<ProductVariantCountableConnection>;
  /** List of the shop's products. */
  products?: Maybe<ProductCountableConnection>;
  /** List of top selling products. */
  reportProductSales?: Maybe<ProductVariantCountableConnection>;
  /** Look up a sale by ID. */
  sale?: Maybe<Sale>;
  /** List of the shop's sales. */
  sales?: Maybe<SaleCountableConnection>;
  /** Look up a shipping zone by ID. */
  shippingZone?: Maybe<ShippingZone>;
  /** List of the shop's shipping zones. */
  shippingZones?: Maybe<ShippingZoneCountableConnection>;
  /** Return information about the shop. */
  shop: Shop;
  /** List of the shop's staff users. */
  staffUsers?: Maybe<UserCountableConnection>;
  /** Look up a stock by ID */
  stock?: Maybe<Stock>;
  /** List of stocks. */
  stocks?: Maybe<StockCountableConnection>;
  /** List of all tax rates available from tax gateway. */
  taxTypes?: Maybe<Array<Maybe<TaxType>>>;
  translation?: Maybe<TranslatableItem>;
  /** Returns a list of all translatable items of a given kind. */
  translations?: Maybe<TranslatableItemConnection>;
  /** Look up a user by ID or email address. */
  user?: Maybe<User>;
  /** Look up a voucher by ID. */
  voucher?: Maybe<Voucher>;
  /** List of the shop's vouchers. */
  vouchers?: Maybe<VoucherCountableConnection>;
  /** Look up a warehouse by ID. */
  warehouse?: Maybe<Warehouse>;
  /** List of warehouses. */
  warehouses?: Maybe<WarehouseCountableConnection>;
  /** Look up a webhook by ID. */
  webhook?: Maybe<Webhook>;
  /**
   * List of all available webhook events.
   * @deprecated This field will be removed in Saleor 4.0. Use `WebhookEventTypeAsyncEnum` and `WebhookEventTypeSyncEnum` to get available event types.
   */
  webhookEvents?: Maybe<Array<Maybe<WebhookEvent>>>;
  /** Retrieve a sample payload for a given webhook event based on real data. It can be useful for some integrations where sample payload is required. */
  webhookSamplePayload?: Maybe<Scalars['JSONString']>;
};


export type Query_EntitiesArgs = {
  representations?: InputMaybe<Array<InputMaybe<Scalars['_Any']>>>;
};


export type QueryAddressArgs = {
  id: Scalars['ID'];
};


export type QueryAddressValidationRulesArgs = {
  city?: InputMaybe<Scalars['String']>;
  cityArea?: InputMaybe<Scalars['String']>;
  countryArea?: InputMaybe<Scalars['String']>;
  countryCode: CountryCode;
};


export type QueryAppArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryAppExtensionArgs = {
  id: Scalars['ID'];
};


export type QueryAppExtensionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AppExtensionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryAppsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AppFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<AppSortingInput>;
};


export type QueryAttributeArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryAttributesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<AttributeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<AttributeSortingInput>;
};


export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CategoryFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  level?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<CategorySortingInput>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryChannelArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryCheckoutArgs = {
  token?: InputMaybe<Scalars['UUID']>;
};


export type QueryCheckoutLinesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryCheckoutsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CheckoutFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<CheckoutSortingInput>;
};


export type QueryCollectionArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CollectionFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<CollectionSortingInput>;
};


export type QueryCustomersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<CustomerFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<UserSortingInput>;
};


export type QueryDigitalContentArgs = {
  id: Scalars['ID'];
};


export type QueryDigitalContentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryDraftOrdersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<OrderDraftFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<OrderSortingInput>;
};


export type QueryExportFileArgs = {
  id: Scalars['ID'];
};


export type QueryExportFilesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ExportFileFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ExportFileSortingInput>;
};


export type QueryGiftCardArgs = {
  id: Scalars['ID'];
};


export type QueryGiftCardTagsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GiftCardTagFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryGiftCardsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<GiftCardFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<GiftCardSortingInput>;
};


export type QueryHomepageEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryMenuArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryMenuItemArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type QueryMenuItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<MenuItemFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<MenuItemSortingInput>;
};


export type QueryMenusArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<MenuFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<MenuSortingInput>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrderByTokenArgs = {
  token: Scalars['UUID'];
};


export type QueryOrdersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<OrderFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<OrderSortingInput>;
};


export type QueryOrdersTotalArgs = {
  channel?: InputMaybe<Scalars['String']>;
  period?: InputMaybe<ReportingPeriod>;
};


export type QueryPageArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryPageTypeArgs = {
  id: Scalars['ID'];
};


export type QueryPageTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PageTypeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<PageTypeSortingInput>;
};


export type QueryPagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PageFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<PageSortingInput>;
};


export type QueryPaymentArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PaymentFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryPermissionGroupArgs = {
  id: Scalars['ID'];
};


export type QueryPermissionGroupsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PermissionGroupFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<PermissionGroupSortingInput>;
};


export type QueryPluginArgs = {
  id: Scalars['ID'];
};


export type QueryPluginsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PluginFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<PluginSortingInput>;
};


export type QueryProductArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryProductTypeArgs = {
  id: Scalars['ID'];
};


export type QueryProductTypesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProductTypeFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ProductTypeSortingInput>;
};


export type QueryProductVariantArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  sku?: InputMaybe<Scalars['String']>;
};


export type QueryProductVariantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProductVariantFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ProductVariantSortingInput>;
};


export type QueryProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProductFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<ProductOrder>;
};


export type QueryReportProductSalesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  period: ReportingPeriod;
};


export type QuerySaleArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type QuerySalesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<SaleFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<SaleSortingInput>;
};


export type QueryShippingZoneArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type QueryShippingZonesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ShippingZoneFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryStaffUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<StaffUserInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<UserSortingInput>;
};


export type QueryStockArgs = {
  id: Scalars['ID'];
};


export type QueryStocksArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<StockFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryTranslationArgs = {
  id: Scalars['ID'];
  kind: TranslatableKinds;
};


export type QueryTranslationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  kind: TranslatableKinds;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryVoucherArgs = {
  channel?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type QueryVouchersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  channel?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<VoucherFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<VoucherSortingInput>;
};


export type QueryWarehouseArgs = {
  id: Scalars['ID'];
};


export type QueryWarehousesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<WarehouseFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<WarehouseSortingInput>;
};


export type QueryWebhookArgs = {
  id: Scalars['ID'];
};


export type QueryWebhookSamplePayloadArgs = {
  eventType: WebhookSampleEventTypeEnum;
};

/** Represents a reduced VAT rate for a particular type of goods. */
export type ReducedRate = {
  __typename?: 'ReducedRate';
  /** Reduced VAT rate in percent. */
  rate: Scalars['Float'];
  /** A type of goods. */
  rateType: Scalars['String'];
};

/** Refresh JWT token. Mutation tries to take refreshToken from the input.If it fails it will try to take refreshToken from the http-only cookie -refreshToken. csrfToken is required when refreshToken is provided as a cookie. */
export type RefreshToken = {
  __typename?: 'RefreshToken';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** JWT token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
};

export type ReorderInput = {
  /** The ID of the item to move. */
  id: Scalars['ID'];
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: InputMaybe<Scalars['Int']>;
};

export type ReportingPeriod =
  | 'THIS_MONTH'
  | 'TODAY';

/** Request email change of the logged in user. */
export type RequestEmailChange = {
  __typename?: 'RequestEmailChange';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** A user instance. */
  user?: Maybe<User>;
};

/** Sends an email with the account password modification link. */
export type RequestPasswordReset = {
  __typename?: 'RequestPasswordReset';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type Sale = Node & ObjectWithMetadata & {
  __typename?: 'Sale';
  /** List of categories this sale applies to. */
  categories?: Maybe<CategoryCountableConnection>;
  /** List of channels available for the sale. */
  channelListings?: Maybe<Array<SaleChannelListing>>;
  /** List of collections this sale applies to. */
  collections?: Maybe<CollectionCountableConnection>;
  created: Scalars['DateTime'];
  /** Currency code for sale. */
  currency?: Maybe<Scalars['String']>;
  /** Sale value. */
  discountValue?: Maybe<Scalars['Float']>;
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of products this sale applies to. */
  products?: Maybe<ProductCountableConnection>;
  startDate: Scalars['DateTime'];
  /** Returns translated sale fields for the given language code. */
  translation?: Maybe<SaleTranslation>;
  type: SaleType;
  updatedAt: Scalars['DateTime'];
  /** New in Saleor 3.1. List of product variants this sale applies to. */
  variants?: Maybe<ProductVariantCountableConnection>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleTranslationArgs = {
  languageCode: LanguageCodeEnum;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleVariantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Adds products, categories, collections to a voucher. */
export type SaleAddCatalogues = {
  __typename?: 'SaleAddCatalogues';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** Sale of which catalogue IDs will be modified. */
  sale?: Maybe<Sale>;
};

/** Deletes sales. */
export type SaleBulkDelete = {
  __typename?: 'SaleBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

/** Represents sale channel listing. */
export type SaleChannelListing = Node & {
  __typename?: 'SaleChannelListing';
  channel: Channel;
  currency: Scalars['String'];
  discountValue: Scalars['Float'];
  id: Scalars['ID'];
};

export type SaleChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** The value of the discount. */
  discountValue: Scalars['PositiveDecimal'];
};

export type SaleChannelListingInput = {
  /** List of channels to which the sale should be assigned. */
  addChannels?: InputMaybe<Array<SaleChannelListingAddInput>>;
  /** List of channels from which the sale should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

/** Manage sale's availability in channels. */
export type SaleChannelListingUpdate = {
  __typename?: 'SaleChannelListingUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** An updated sale instance. */
  sale?: Maybe<Sale>;
};

export type SaleCountableConnection = {
  __typename?: 'SaleCountableConnection';
  edges: Array<SaleCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SaleCountableEdge = {
  __typename?: 'SaleCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Sale;
};

/** Creates a new sale. */
export type SaleCreate = {
  __typename?: 'SaleCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  sale?: Maybe<Sale>;
};

/** Deletes a sale. */
export type SaleDelete = {
  __typename?: 'SaleDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  sale?: Maybe<Sale>;
};

export type SaleFilterInput = {
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  saleType?: InputMaybe<DiscountValueTypeEnum>;
  search?: InputMaybe<Scalars['String']>;
  started?: InputMaybe<DateTimeRangeInput>;
  status?: InputMaybe<Array<InputMaybe<DiscountStatusEnum>>>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

export type SaleInput = {
  /** Categories related to the discount. */
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Collections related to the discount. */
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** End date of the voucher in ISO 8601 format. */
  endDate?: InputMaybe<Scalars['DateTime']>;
  /** Voucher name. */
  name?: InputMaybe<Scalars['String']>;
  /** Products related to the discount. */
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Start date of the voucher in ISO 8601 format. */
  startDate?: InputMaybe<Scalars['DateTime']>;
  /** Fixed or percentage. */
  type?: InputMaybe<DiscountValueTypeEnum>;
  /** Value of the voucher. */
  value?: InputMaybe<Scalars['PositiveDecimal']>;
  variants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Removes products, categories, collections from a sale. */
export type SaleRemoveCatalogues = {
  __typename?: 'SaleRemoveCatalogues';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** Sale of which catalogue IDs will be modified. */
  sale?: Maybe<Sale>;
};

export type SaleSortField =
  /** Sort sales by created at. */
  | 'CREATED_AT'
  /** Sort sales by end date. */
  | 'END_DATE'
  /** Sort sales by last modified at. */
  | 'LAST_MODIFIED_AT'
  /** Sort sales by name. */
  | 'NAME'
  /** Sort sales by start date. */
  | 'START_DATE'
  /** Sort sales by type. */
  | 'TYPE'
  /** Sort sales by value. */
  | 'VALUE';

export type SaleSortingInput = {
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort sales by the selected field. */
  field: SaleSortField;
};

export type SaleTranslatableContent = Node & {
  __typename?: 'SaleTranslatableContent';
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Sales allow creating discounts for categories, collections or products and are visible to all the customers.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  sale?: Maybe<Sale>;
  /** Returns translated sale fields for the given language code. */
  translation?: Maybe<SaleTranslation>;
};


export type SaleTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a sale. */
export type SaleTranslate = {
  __typename?: 'SaleTranslate';
  errors: Array<TranslationError>;
  sale?: Maybe<Sale>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type SaleTranslation = Node & {
  __typename?: 'SaleTranslation';
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
};

export type SaleType =
  | 'FIXED'
  | 'PERCENTAGE';

/** Updates a sale. */
export type SaleUpdate = {
  __typename?: 'SaleUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  sale?: Maybe<Sale>;
};

/** Represents a custom attribute. */
export type SelectedAttribute = {
  __typename?: 'SelectedAttribute';
  /** Name of an attribute displayed in the interface. */
  attribute: Attribute;
  /** Values of an attribute. */
  values: Array<Maybe<AttributeValue>>;
};

export type SeoInput = {
  /** SEO description. */
  description?: InputMaybe<Scalars['String']>;
  /** SEO title. */
  title?: InputMaybe<Scalars['String']>;
};

/** Sets the user's password from the token sent by email using the RequestPasswordReset mutation. */
export type SetPassword = {
  __typename?: 'SetPassword';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** CSRF token required to re-generate access token. */
  csrfToken?: Maybe<Scalars['String']>;
  errors: Array<AccountError>;
  /** JWT refresh token, required to re-generate access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** JWT token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
};

export type ShippingError = {
  __typename?: 'ShippingError';
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: ShippingErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of warehouse IDs which causes the error. */
  warehouses?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export type ShippingErrorCode =
  | 'ALREADY_EXISTS'
  | 'DUPLICATED_INPUT_ITEM'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'MAX_LESS_THAN_MIN'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

/** Shipping methods that can be used as means of shipping for orders and checkouts. */
export type ShippingMethod = Node & ObjectWithMetadata & {
  __typename?: 'ShippingMethod';
  /** Describes if this shipping method is active and can be selected. */
  active: Scalars['Boolean'];
  /** Shipping method description (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Unique ID of ShippingMethod available for Order. */
  id: Scalars['ID'];
  /** Maximum delivery days for this shipping method. */
  maximumDeliveryDays?: Maybe<Scalars['Int']>;
  /** Maximum order price for this shipping method. */
  maximumOrderPrice?: Maybe<Money>;
  /**
   * Maximum order weight for this shipping method.
   * @deprecated This field will be removed in Saleor 4.0.
   */
  maximumOrderWeight?: Maybe<Weight>;
  /** Message connected to this shipping method. */
  message?: Maybe<Scalars['String']>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Minimum delivery days for this shipping method. */
  minimumDeliveryDays?: Maybe<Scalars['Int']>;
  /** Minimal order price for this shipping method. */
  minimumOrderPrice?: Maybe<Money>;
  /**
   * Minimum order weight for this shipping method.
   * @deprecated This field will be removed in Saleor 4.0.
   */
  minimumOrderWeight?: Maybe<Weight>;
  /** Shipping method name. */
  name: Scalars['String'];
  /** The price of selected shipping method. */
  price: Money;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
  /**
   * Type of the shipping method.
   * @deprecated This field will be removed in Saleor 4.0.
   */
  type?: Maybe<ShippingMethodTypeEnum>;
};


/** Shipping methods that can be used as means of shipping for orders and checkouts. */
export type ShippingMethodTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Represents shipping method channel listing. */
export type ShippingMethodChannelListing = Node & {
  __typename?: 'ShippingMethodChannelListing';
  channel: Channel;
  id: Scalars['ID'];
  maximumOrderPrice?: Maybe<Money>;
  minimumOrderPrice?: Maybe<Money>;
  price?: Maybe<Money>;
};

export type ShippingMethodChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Maximum order price to use this shipping method. */
  maximumOrderPrice?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Minimum order price to use this shipping method. */
  minimumOrderPrice?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Shipping price of the shipping method in this channel. */
  price?: InputMaybe<Scalars['PositiveDecimal']>;
};

export type ShippingMethodChannelListingInput = {
  /** List of channels to which the shipping method should be assigned. */
  addChannels?: InputMaybe<Array<ShippingMethodChannelListingAddInput>>;
  /** List of channels from which the shipping method should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

/** Manage shipping method's availability in channels. */
export type ShippingMethodChannelListingUpdate = {
  __typename?: 'ShippingMethodChannelListingUpdate';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  /** An updated shipping method instance. */
  shippingMethod?: Maybe<ShippingMethodType>;
};

/** Represents shipping method postal code rule. */
export type ShippingMethodPostalCodeRule = Node & {
  __typename?: 'ShippingMethodPostalCodeRule';
  /** End address range. */
  end?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Inclusion type of the postal code rule. */
  inclusionType?: Maybe<PostalCodeRuleInclusionTypeEnum>;
  /** Start address range. */
  start?: Maybe<Scalars['String']>;
};

export type ShippingMethodTranslatableContent = Node & {
  __typename?: 'ShippingMethodTranslatableContent';
  description?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Shipping method are the methods you'll use to get customer's orders  to them. They are directly exposed to the customers.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  shippingMethod?: Maybe<ShippingMethodType>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
};


export type ShippingMethodTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

export type ShippingMethodTranslation = Node & {
  __typename?: 'ShippingMethodTranslation';
  description?: Maybe<Scalars['JSONString']>;
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
};

/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodType = Node & ObjectWithMetadata & {
  __typename?: 'ShippingMethodType';
  /** List of channels available for the method. */
  channelListings?: Maybe<Array<ShippingMethodChannelListing>>;
  /** Shipping method description. */
  description?: Maybe<Scalars['JSONString']>;
  /** List of excluded products for the shipping method. */
  excludedProducts?: Maybe<ProductCountableConnection>;
  /** Shipping method ID. */
  id: Scalars['ID'];
  /** Maximum number of days for delivery. */
  maximumDeliveryDays?: Maybe<Scalars['Int']>;
  /** The price of the cheapest variant (including discounts). */
  maximumOrderPrice?: Maybe<Money>;
  /** Maximum order weight to use this shipping method. */
  maximumOrderWeight?: Maybe<Weight>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Minimal number of days for delivery. */
  minimumDeliveryDays?: Maybe<Scalars['Int']>;
  /** The price of the cheapest variant (including discounts). */
  minimumOrderPrice?: Maybe<Money>;
  /** Minimum order weight to use this shipping method. */
  minimumOrderWeight?: Maybe<Weight>;
  /** Shipping method name. */
  name: Scalars['String'];
  /** Postal code ranges rule of exclusion or inclusion of the shipping method. */
  postalCodeRules?: Maybe<Array<Maybe<ShippingMethodPostalCodeRule>>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
  /** Type of the shipping method. */
  type?: Maybe<ShippingMethodTypeEnum>;
};


/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodTypeExcludedProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodTypeTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** An enumeration. */
export type ShippingMethodTypeEnum =
  | 'PRICE'
  | 'WEIGHT';

export type ShippingPostalCodeRulesCreateInputRange = {
  /** End range of the postal code. */
  end?: InputMaybe<Scalars['String']>;
  /** Start range of the postal code. */
  start: Scalars['String'];
};

/** Deletes shipping prices. */
export type ShippingPriceBulkDelete = {
  __typename?: 'ShippingPriceBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
};

/** Creates a new shipping price. */
export type ShippingPriceCreate = {
  __typename?: 'ShippingPriceCreate';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  shippingMethod?: Maybe<ShippingMethodType>;
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
};

/** Deletes a shipping price. */
export type ShippingPriceDelete = {
  __typename?: 'ShippingPriceDelete';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  /** A shipping method to delete. */
  shippingMethod?: Maybe<ShippingMethodType>;
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
};

/** Exclude products from shipping price. */
export type ShippingPriceExcludeProducts = {
  __typename?: 'ShippingPriceExcludeProducts';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  /** A shipping method with new list of excluded products. */
  shippingMethod?: Maybe<ShippingMethodType>;
};

export type ShippingPriceExcludeProductsInput = {
  /** List of products which will be excluded. */
  products: Array<InputMaybe<Scalars['ID']>>;
};

export type ShippingPriceInput = {
  /** Postal code rules to add. */
  addPostalCodeRules?: InputMaybe<Array<ShippingPostalCodeRulesCreateInputRange>>;
  /** Postal code rules to delete. */
  deletePostalCodeRules?: InputMaybe<Array<Scalars['ID']>>;
  /** Shipping method description. */
  description?: InputMaybe<Scalars['JSONString']>;
  /** Inclusion type for currently assigned postal code rules. */
  inclusionType?: InputMaybe<PostalCodeRuleInclusionTypeEnum>;
  /** Maximum number of days for delivery. */
  maximumDeliveryDays?: InputMaybe<Scalars['Int']>;
  /** Maximum order weight to use this shipping method. */
  maximumOrderWeight?: InputMaybe<Scalars['WeightScalar']>;
  /** Minimal number of days for delivery. */
  minimumDeliveryDays?: InputMaybe<Scalars['Int']>;
  /** Minimum order weight to use this shipping method. */
  minimumOrderWeight?: InputMaybe<Scalars['WeightScalar']>;
  /** Name of the shipping method. */
  name?: InputMaybe<Scalars['String']>;
  /** Shipping zone this method belongs to. */
  shippingZone?: InputMaybe<Scalars['ID']>;
  /** Shipping type: price or weight based. */
  type?: InputMaybe<ShippingMethodTypeEnum>;
};

/** Remove product from excluded list for shipping price. */
export type ShippingPriceRemoveProductFromExclude = {
  __typename?: 'ShippingPriceRemoveProductFromExclude';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  /** A shipping method with new list of excluded products. */
  shippingMethod?: Maybe<ShippingMethodType>;
};

/** Creates/updates translations for a shipping method. */
export type ShippingPriceTranslate = {
  __typename?: 'ShippingPriceTranslate';
  errors: Array<TranslationError>;
  shippingMethod?: Maybe<ShippingMethodType>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type ShippingPriceTranslationInput = {
  /** Translated shipping method description (JSON). */
  description?: InputMaybe<Scalars['JSONString']>;
  name?: InputMaybe<Scalars['String']>;
};

/** Updates a new shipping price. */
export type ShippingPriceUpdate = {
  __typename?: 'ShippingPriceUpdate';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  shippingMethod?: Maybe<ShippingMethodType>;
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
};

/** Represents a shipping zone in the shop. Zones are the concept used only for grouping shipping methods in the dashboard, and are never exposed to the customers directly. */
export type ShippingZone = Node & ObjectWithMetadata & {
  __typename?: 'ShippingZone';
  /** List of channels for shipping zone. */
  channels: Array<Channel>;
  /** List of countries available for the method. */
  countries?: Maybe<Array<Maybe<CountryDisplay>>>;
  default: Scalars['Boolean'];
  /** Description of a shipping zone. */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** Lowest and highest prices for the shipping. */
  priceRange?: Maybe<MoneyRange>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of shipping methods available for orders shipped to countries within this shipping zone. */
  shippingMethods?: Maybe<Array<Maybe<ShippingMethodType>>>;
  /** List of warehouses for shipping zone. */
  warehouses: Array<Warehouse>;
};

/** Deletes shipping zones. */
export type ShippingZoneBulkDelete = {
  __typename?: 'ShippingZoneBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
};

export type ShippingZoneCountableConnection = {
  __typename?: 'ShippingZoneCountableConnection';
  edges: Array<ShippingZoneCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ShippingZoneCountableEdge = {
  __typename?: 'ShippingZoneCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ShippingZone;
};

/** Creates a new shipping zone. */
export type ShippingZoneCreate = {
  __typename?: 'ShippingZoneCreate';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  shippingZone?: Maybe<ShippingZone>;
};

export type ShippingZoneCreateInput = {
  /** List of channels to assign to the shipping zone. */
  addChannels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of warehouses to assign to a shipping zone */
  addWarehouses?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** List of countries in this shipping zone. */
  countries?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Default shipping zone will be used for countries not covered by other zones. */
  default?: InputMaybe<Scalars['Boolean']>;
  /** Description of the shipping zone. */
  description?: InputMaybe<Scalars['String']>;
  /** Shipping zone's name. Visible only to the staff. */
  name?: InputMaybe<Scalars['String']>;
};

/** Deletes a shipping zone. */
export type ShippingZoneDelete = {
  __typename?: 'ShippingZoneDelete';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  shippingZone?: Maybe<ShippingZone>;
};

export type ShippingZoneFilterInput = {
  channels?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
};

/** Updates a new shipping zone. */
export type ShippingZoneUpdate = {
  __typename?: 'ShippingZoneUpdate';
  errors: Array<ShippingError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shippingErrors: Array<ShippingError>;
  shippingZone?: Maybe<ShippingZone>;
};

export type ShippingZoneUpdateInput = {
  /** List of channels to assign to the shipping zone. */
  addChannels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of warehouses to assign to a shipping zone */
  addWarehouses?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** List of countries in this shipping zone. */
  countries?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Default shipping zone will be used for countries not covered by other zones. */
  default?: InputMaybe<Scalars['Boolean']>;
  /** Description of the shipping zone. */
  description?: InputMaybe<Scalars['String']>;
  /** Shipping zone's name. Visible only to the staff. */
  name?: InputMaybe<Scalars['String']>;
  /** List of channels to unassign from the shipping zone. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
  /** List of warehouses to unassign from a shipping zone */
  removeWarehouses?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Represents a shop resource containing general shop data and configuration. */
export type Shop = {
  __typename?: 'Shop';
  /** Enable automatic fulfillment for all digital products. */
  automaticFulfillmentDigitalProducts?: Maybe<Scalars['Boolean']>;
  /** List of available external authentications. */
  availableExternalAuthentications: Array<ExternalAuthentication>;
  /** List of available payment gateways. */
  availablePaymentGateways: Array<PaymentGateway>;
  /** Shipping methods that are available for the shop. */
  availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  /** New in Saleor 3.1. List of all currencies supported by shop's channels. */
  channelCurrencies: Array<Scalars['String']>;
  /** Charge taxes on shipping. */
  chargeTaxesOnShipping: Scalars['Boolean'];
  /** Company address. */
  companyAddress?: Maybe<Address>;
  /** List of countries available in the shop. */
  countries: Array<CountryDisplay>;
  /** URL of a view where customers can set their password. */
  customerSetPasswordUrl?: Maybe<Scalars['String']>;
  /** Shop's default country. */
  defaultCountry?: Maybe<CountryDisplay>;
  /** Default number of max downloads per digital content URL. */
  defaultDigitalMaxDownloads?: Maybe<Scalars['Int']>;
  /** Default number of days which digital content URL will be valid. */
  defaultDigitalUrlValidDays?: Maybe<Scalars['Int']>;
  /** Default shop's email sender's address. */
  defaultMailSenderAddress?: Maybe<Scalars['String']>;
  /** Default shop's email sender's name. */
  defaultMailSenderName?: Maybe<Scalars['String']>;
  /** Default weight unit. */
  defaultWeightUnit?: Maybe<WeightUnitsEnum>;
  /** Shop's description. */
  description?: Maybe<Scalars['String']>;
  /** Display prices with tax in store. */
  displayGrossPrices: Scalars['Boolean'];
  /** Shop's domain data. */
  domain: Domain;
  /** New in Saleor 3.1. Allow to approve fulfillments which are unpaid. */
  fulfillmentAllowUnpaid: Scalars['Boolean'];
  /** New in Saleor 3.1. Automatically approve all new fulfillments. */
  fulfillmentAutoApprove: Scalars['Boolean'];
  /** Header text. */
  headerText?: Maybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices: Scalars['Boolean'];
  /** List of the shops's supported languages. */
  languages: Array<Maybe<LanguageDisplay>>;
  /** New in Saleor 3.1. Default number of maximum line quantity in single checkout (per single checkout line). Note: this feature is in a preview state and can be subject to changes at later point. */
  limitQuantityPerCheckout?: Maybe<Scalars['Int']>;
  /** Resource limitations and current usage if any set for a shop */
  limits: LimitInfo;
  /** Shop's name. */
  name: Scalars['String'];
  /** List of available permissions. */
  permissions: Array<Maybe<Permission>>;
  /** List of possible phone prefixes. */
  phonePrefixes: Array<Maybe<Scalars['String']>>;
  /** New in Saleor 3.1. Default number of minutes stock will be reserved for anonymous checkout or null when stock reservation is disabled. */
  reserveStockDurationAnonymousUser?: Maybe<Scalars['Int']>;
  /** New in Saleor 3.1. Default number of minutes stock will be reserved for authenticated checkout or null when stock reservation is disabled. */
  reserveStockDurationAuthenticatedUser?: Maybe<Scalars['Int']>;
  /** List of staff notification recipients. */
  staffNotificationRecipients?: Maybe<Array<Maybe<StaffNotificationRecipient>>>;
  /** Enable inventory tracking. */
  trackInventoryByDefault?: Maybe<Scalars['Boolean']>;
  /** Returns translated shop fields for the given language code. */
  translation?: Maybe<ShopTranslation>;
  /** Saleor API version. */
  version: Scalars['String'];
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopAvailablePaymentGatewaysArgs = {
  channel?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopAvailableShippingMethodsArgs = {
  address?: InputMaybe<AddressInput>;
  channel: Scalars['String'];
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopCountriesArgs = {
  filter?: InputMaybe<CountryFilterInput>;
  languageCode?: InputMaybe<LanguageCodeEnum>;
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Update the shop's address. If the `null` value is passed, the currently selected address will be deleted. */
export type ShopAddressUpdate = {
  __typename?: 'ShopAddressUpdate';
  errors: Array<ShopError>;
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
};

/** Updates site domain of the shop. */
export type ShopDomainUpdate = {
  __typename?: 'ShopDomainUpdate';
  errors: Array<ShopError>;
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
};

export type ShopError = {
  __typename?: 'ShopError';
  /** The error code. */
  code: ShopErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type ShopErrorCode =
  | 'ALREADY_EXISTS'
  | 'CANNOT_FETCH_TAX_RATES'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

/** Fetch tax rates. */
export type ShopFetchTaxRates = {
  __typename?: 'ShopFetchTaxRates';
  errors: Array<ShopError>;
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
};

export type ShopSettingsInput = {
  /** Enable automatic fulfillment for all digital products. */
  automaticFulfillmentDigitalProducts?: InputMaybe<Scalars['Boolean']>;
  /** Charge taxes on shipping. */
  chargeTaxesOnShipping?: InputMaybe<Scalars['Boolean']>;
  /** URL of a view where customers can set their password. */
  customerSetPasswordUrl?: InputMaybe<Scalars['String']>;
  /** Default number of max downloads per digital content URL. */
  defaultDigitalMaxDownloads?: InputMaybe<Scalars['Int']>;
  /** Default number of days which digital content URL will be valid. */
  defaultDigitalUrlValidDays?: InputMaybe<Scalars['Int']>;
  /** Default email sender's address. */
  defaultMailSenderAddress?: InputMaybe<Scalars['String']>;
  /** Default email sender's name. */
  defaultMailSenderName?: InputMaybe<Scalars['String']>;
  /** Default weight unit. */
  defaultWeightUnit?: InputMaybe<WeightUnitsEnum>;
  /** SEO description. */
  description?: InputMaybe<Scalars['String']>;
  /** Display prices with tax in store. */
  displayGrossPrices?: InputMaybe<Scalars['Boolean']>;
  /** New in Saleor 3.1. Enable ability to approve fulfillments which are unpaid. */
  fulfillmentAllowUnpaid?: InputMaybe<Scalars['Boolean']>;
  /** New in Saleor 3.1. Enable automatic approval of all new fulfillments. */
  fulfillmentAutoApprove?: InputMaybe<Scalars['Boolean']>;
  /** Header text. */
  headerText?: InputMaybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices?: InputMaybe<Scalars['Boolean']>;
  /** New in Saleor 3.1. Default number of maximum line quantity in single checkout. Minimum possible value is 1, default value is 50. Note: this feature is in a preview state and can be subject to changes at later point. */
  limitQuantityPerCheckout?: InputMaybe<Scalars['Int']>;
  /** New in Saleor 3.1. Default number of minutes stock will be reserved for anonymous checkout. Enter 0 or null to disable. */
  reserveStockDurationAnonymousUser?: InputMaybe<Scalars['Int']>;
  /** New in Saleor 3.1. Default number of minutes stock will be reserved for authenticated checkout. Enter 0 or null to disable. */
  reserveStockDurationAuthenticatedUser?: InputMaybe<Scalars['Int']>;
  /** Enable inventory tracking. */
  trackInventoryByDefault?: InputMaybe<Scalars['Boolean']>;
};

/** Creates/updates translations for shop settings. */
export type ShopSettingsTranslate = {
  __typename?: 'ShopSettingsTranslate';
  errors: Array<TranslationError>;
  /** Updated shop settings. */
  shop?: Maybe<Shop>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
};

export type ShopSettingsTranslationInput = {
  description?: InputMaybe<Scalars['String']>;
  headerText?: InputMaybe<Scalars['String']>;
};

/** Updates shop settings. */
export type ShopSettingsUpdate = {
  __typename?: 'ShopSettingsUpdate';
  errors: Array<ShopError>;
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
};

export type ShopTranslation = Node & {
  __typename?: 'ShopTranslation';
  description: Scalars['String'];
  headerText: Scalars['String'];
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
};

export type SiteDomainInput = {
  /** Domain name for shop. */
  domain?: InputMaybe<Scalars['String']>;
  /** Shop site name. */
  name?: InputMaybe<Scalars['String']>;
};

/** Deletes staff users. */
export type StaffBulkDelete = {
  __typename?: 'StaffBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<StaffError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  staffErrors: Array<StaffError>;
};

/** Creates a new staff user. */
export type StaffCreate = {
  __typename?: 'StaffCreate';
  errors: Array<StaffError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  staffErrors: Array<StaffError>;
  user?: Maybe<User>;
};

export type StaffCreateInput = {
  /** List of permission group IDs to which user should be assigned. */
  addGroups?: InputMaybe<Array<Scalars['ID']>>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** URL of a view where users should be redirected to set the password. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
};

/** Deletes a staff user. */
export type StaffDelete = {
  __typename?: 'StaffDelete';
  errors: Array<StaffError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  staffErrors: Array<StaffError>;
  user?: Maybe<User>;
};

export type StaffError = {
  __typename?: 'StaffError';
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
  /** The error code. */
  code: AccountErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** List of permission group IDs which cause the error. */
  groups?: Maybe<Array<Scalars['ID']>>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of permissions which causes the error. */
  permissions?: Maybe<Array<PermissionEnum>>;
  /** List of user IDs which causes the error. */
  users?: Maybe<Array<Scalars['ID']>>;
};

export type StaffMemberStatus =
  /** User account has been activated. */
  | 'ACTIVE'
  /** User account has not been activated yet. */
  | 'DEACTIVATED';

/** Represents a recipient of email notifications send by Saleor, such as notifications about new orders. Notifications can be assigned to staff users or arbitrary email addresses. */
export type StaffNotificationRecipient = Node & {
  __typename?: 'StaffNotificationRecipient';
  /** Determines if a notification active. */
  active?: Maybe<Scalars['Boolean']>;
  /** Returns email address of a user subscribed to email notifications. */
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Returns a user subscribed to email notifications. */
  user?: Maybe<User>;
};

/** Creates a new staff notification recipient. */
export type StaffNotificationRecipientCreate = {
  __typename?: 'StaffNotificationRecipientCreate';
  errors: Array<ShopError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

/** Delete staff notification recipient. */
export type StaffNotificationRecipientDelete = {
  __typename?: 'StaffNotificationRecipientDelete';
  errors: Array<ShopError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

export type StaffNotificationRecipientInput = {
  /** Determines if a notification active. */
  active?: InputMaybe<Scalars['Boolean']>;
  /** Email address of a user subscribed to email notifications. */
  email?: InputMaybe<Scalars['String']>;
  /** The ID of the user subscribed to email notifications.. */
  user?: InputMaybe<Scalars['ID']>;
};

/** Updates a staff notification recipient. */
export type StaffNotificationRecipientUpdate = {
  __typename?: 'StaffNotificationRecipientUpdate';
  errors: Array<ShopError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  shopErrors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

/** Updates an existing staff user. */
export type StaffUpdate = {
  __typename?: 'StaffUpdate';
  errors: Array<StaffError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  staffErrors: Array<StaffError>;
  user?: Maybe<User>;
};

export type StaffUpdateInput = {
  /** List of permission group IDs to which user should be assigned. */
  addGroups?: InputMaybe<Array<Scalars['ID']>>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** List of permission group IDs from which user should be unassigned. */
  removeGroups?: InputMaybe<Array<Scalars['ID']>>;
};

export type StaffUserInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<StaffMemberStatus>;
};

/** Represents stock. */
export type Stock = Node & {
  __typename?: 'Stock';
  id: Scalars['ID'];
  productVariant: ProductVariant;
  /** Quantity of a product in the warehouse's possession, including the allocated stock that is waiting for shipment. */
  quantity: Scalars['Int'];
  /** Quantity allocated for orders */
  quantityAllocated: Scalars['Int'];
  /** Quantity reserved for checkouts */
  quantityReserved: Scalars['Int'];
  warehouse: Warehouse;
};

export type StockAvailability =
  | 'IN_STOCK'
  | 'OUT_OF_STOCK';

export type StockCountableConnection = {
  __typename?: 'StockCountableConnection';
  edges: Array<StockCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type StockCountableEdge = {
  __typename?: 'StockCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Stock;
};

export type StockError = {
  __typename?: 'StockError';
  /** The error code. */
  code: StockErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type StockErrorCode =
  | 'ALREADY_EXISTS'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type StockFilterInput = {
  quantity?: InputMaybe<Scalars['Float']>;
  search?: InputMaybe<Scalars['String']>;
};

export type StockInput = {
  /** Quantity of items available for sell. */
  quantity: Scalars['Int'];
  /** Warehouse in which stock is located. */
  warehouse: Scalars['ID'];
};

/** Enum representing the type of a payment storage in a gateway. */
export type StorePaymentMethodEnum =
  /** Storage is disabled. The payment is not stored. */
  | 'NONE'
  /** Off session storage type. The payment is stored to be reused even if the customer is absent. */
  | 'OFF_SESSION'
  /** On session storage type. The payment is stored only to be reused when the customer is present in the checkout flow. */
  | 'ON_SESSION';

/** Representation of tax types fetched from tax gateway. */
export type TaxType = {
  __typename?: 'TaxType';
  /** Description of the tax type. */
  description?: Maybe<Scalars['String']>;
  /** External tax code used to identify given tax group. */
  taxCode?: Maybe<Scalars['String']>;
};

/** Represents a monetary value with taxes. In cases where taxes were not applied, net and gross values will be equal. */
export type TaxedMoney = {
  __typename?: 'TaxedMoney';
  /** Currency code. */
  currency: Scalars['String'];
  /** Amount of money including taxes. */
  gross: Money;
  /** Amount of money without taxes. */
  net: Money;
  /** Amount of taxes. */
  tax: Money;
};

/** Represents a range of monetary values. */
export type TaxedMoneyRange = {
  __typename?: 'TaxedMoneyRange';
  /** Lower bound of a price range. */
  start?: Maybe<TaxedMoney>;
  /** Upper bound of a price range. */
  stop?: Maybe<TaxedMoney>;
};

export type TimePeriod = {
  __typename?: 'TimePeriod';
  /** The length of the period. */
  amount: Scalars['Int'];
  /** The type of the period. */
  type: TimePeriodTypeEnum;
};

export type TimePeriodInputType = {
  /** The length of the period. */
  amount: Scalars['Int'];
  /** The type of the period. */
  type: TimePeriodTypeEnum;
};

/** An enumeration. */
export type TimePeriodTypeEnum =
  | 'DAY'
  | 'MONTH'
  | 'WEEK'
  | 'YEAR';

/** An object representing a single payment. */
export type Transaction = Node & {
  __typename?: 'Transaction';
  /** Total amount of the transaction. */
  amount?: Maybe<Money>;
  created: Scalars['DateTime'];
  error?: Maybe<Scalars['String']>;
  gatewayResponse: Scalars['JSONString'];
  id: Scalars['ID'];
  isSuccess: Scalars['Boolean'];
  kind: TransactionKind;
  payment: Payment;
  token: Scalars['String'];
};

export type TransactionInput = {
  /** Name of the transaction. */
  name?: InputMaybe<Scalars['String']>;
  /** Reference of the transaction. */
  reference?: InputMaybe<Scalars['String']>;
  /** Current status of the payment transaction. */
  status: TransactionStatus;
};

/** An enumeration. */
export type TransactionKind =
  | 'ACTION_TO_CONFIRM'
  | 'AUTH'
  | 'CANCEL'
  | 'CAPTURE'
  | 'CONFIRM'
  | 'EXTERNAL'
  | 'PENDING'
  | 'REFUND'
  | 'REFUND_ONGOING'
  | 'VOID';

/** An enumeration. */
export type TransactionStatus =
  | 'FAILURE'
  | 'PENDING'
  | 'SUCCESS';

export type TranslatableItem = AttributeTranslatableContent | AttributeValueTranslatableContent | CategoryTranslatableContent | CollectionTranslatableContent | MenuItemTranslatableContent | PageTranslatableContent | ProductTranslatableContent | ProductVariantTranslatableContent | SaleTranslatableContent | ShippingMethodTranslatableContent | VoucherTranslatableContent;

export type TranslatableItemConnection = {
  __typename?: 'TranslatableItemConnection';
  edges: Array<TranslatableItemEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type TranslatableItemEdge = {
  __typename?: 'TranslatableItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: TranslatableItem;
};

export type TranslatableKinds =
  | 'ATTRIBUTE'
  | 'ATTRIBUTE_VALUE'
  | 'CATEGORY'
  | 'COLLECTION'
  | 'MENU_ITEM'
  | 'PAGE'
  | 'PRODUCT'
  | 'SALE'
  | 'SHIPPING_METHOD'
  | 'VARIANT'
  | 'VOUCHER';

export type TranslationError = {
  __typename?: 'TranslationError';
  /** The error code. */
  code: TranslationErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type TranslationErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED';

export type TranslationInput = {
  description?: InputMaybe<Scalars['JSONString']>;
  name?: InputMaybe<Scalars['String']>;
  seoDescription?: InputMaybe<Scalars['String']>;
  seoTitle?: InputMaybe<Scalars['String']>;
};

export type UpdateInvoiceInput = {
  /** Invoice number */
  number?: InputMaybe<Scalars['String']>;
  /** URL of an invoice to download. */
  url?: InputMaybe<Scalars['String']>;
};

/** Updates metadata of an object. */
export type UpdateMetadata = {
  __typename?: 'UpdateMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  metadataErrors: Array<MetadataError>;
};

/** Updates private metadata of an object. */
export type UpdatePrivateMetadata = {
  __typename?: 'UpdatePrivateMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  metadataErrors: Array<MetadataError>;
};

export type UploadError = {
  __typename?: 'UploadError';
  /** The error code. */
  code: UploadErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type UploadErrorCode =
  | 'GRAPHQL_ERROR';

/** Represents user data. */
export type User = Node & ObjectWithMetadata & {
  __typename?: 'User';
  /** List of all user's addresses. */
  addresses?: Maybe<Array<Maybe<Address>>>;
  avatar?: Maybe<Image>;
  /**
   * Returns the last open checkout of this user.
   * @deprecated This field will be removed in Saleor 4.0. Use the `checkoutTokens` field to fetch the user checkouts.
   */
  checkout?: Maybe<Checkout>;
  /** Returns the checkout UUID's assigned to this user. */
  checkoutTokens?: Maybe<Array<Scalars['UUID']>>;
  dateJoined: Scalars['DateTime'];
  defaultBillingAddress?: Maybe<Address>;
  defaultShippingAddress?: Maybe<Address>;
  /** List of user's permission groups which user can manage. */
  editableGroups?: Maybe<Array<Maybe<Group>>>;
  email: Scalars['String'];
  /** List of events associated with the user. */
  events?: Maybe<Array<Maybe<CustomerEvent>>>;
  firstName: Scalars['String'];
  /** List of the user gift cards. */
  giftCards?: Maybe<GiftCardCountableConnection>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isStaff: Scalars['Boolean'];
  /** User language code. */
  languageCode: LanguageCodeEnum;
  lastLogin?: Maybe<Scalars['DateTime']>;
  lastName: Scalars['String'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** A note about the customer. */
  note?: Maybe<Scalars['String']>;
  /** List of user's orders. */
  orders?: Maybe<OrderCountableConnection>;
  /** List of user's permission groups. */
  permissionGroups?: Maybe<Array<Maybe<Group>>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of stored payment sources. */
  storedPaymentSources?: Maybe<Array<Maybe<PaymentSource>>>;
  updatedAt: Scalars['DateTime'];
  /** List of user's permissions. */
  userPermissions?: Maybe<Array<Maybe<UserPermission>>>;
};


/** Represents user data. */
export type UserAvatarArgs = {
  size?: InputMaybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserCheckoutTokensArgs = {
  channel?: InputMaybe<Scalars['String']>;
};


/** Represents user data. */
export type UserGiftCardsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserOrdersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserStoredPaymentSourcesArgs = {
  channel?: InputMaybe<Scalars['String']>;
};

/** Deletes a user avatar. Only for staff members. */
export type UserAvatarDelete = {
  __typename?: 'UserAvatarDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** Create a user avatar. Only for staff members. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type UserAvatarUpdate = {
  __typename?: 'UserAvatarUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** Activate or deactivate users. */
export type UserBulkSetActive = {
  __typename?: 'UserBulkSetActive';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<AccountError>;
};

export type UserCountableConnection = {
  __typename?: 'UserCountableConnection';
  edges: Array<UserCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type UserCountableEdge = {
  __typename?: 'UserCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

export type UserCreateInput = {
  /** Slug of a channel which will be used for notify user. Optional when only one channel exists. */
  channel?: InputMaybe<Scalars['String']>;
  /** Billing address of the customer. */
  defaultBillingAddress?: InputMaybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: InputMaybe<AddressInput>;
  /** The unique email address of the user. */
  email?: InputMaybe<Scalars['String']>;
  /** Given name. */
  firstName?: InputMaybe<Scalars['String']>;
  /** User account is active. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
  /** Family name. */
  lastName?: InputMaybe<Scalars['String']>;
  /** A note about the user. */
  note?: InputMaybe<Scalars['String']>;
  /** URL of a view where users should be redirected to set the password. URL in RFC 1808 format. */
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type UserPermission = {
  __typename?: 'UserPermission';
  /** Internal code for permission. */
  code: PermissionEnum;
  /** Describe action(s) allowed to do by permission. */
  name: Scalars['String'];
  /** List of user permission groups which contains this permission. */
  sourcePermissionGroups?: Maybe<Array<Group>>;
};


export type UserPermissionSourcePermissionGroupsArgs = {
  userId: Scalars['ID'];
};

export type UserSortField =
  /** Sort users by created at. */
  | 'CREATED_AT'
  /** Sort users by email. */
  | 'EMAIL'
  /** Sort users by first name. */
  | 'FIRST_NAME'
  /** Sort users by last modified at. */
  | 'LAST_MODIFIED_AT'
  /** Sort users by last name. */
  | 'LAST_NAME'
  /** Sort users by order count. */
  | 'ORDER_COUNT';

export type UserSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort users by the selected field. */
  field: UserSortField;
};

/** Represents a VAT rate for a country. */
export type Vat = {
  __typename?: 'VAT';
  /** Country code. */
  countryCode: Scalars['String'];
  /** Country's VAT rate exceptions for specific types of goods. */
  reducedRates: Array<Maybe<ReducedRate>>;
  /** Standard VAT rate in percent. */
  standardRate?: Maybe<Scalars['Float']>;
};

export type VariantAttributeScope =
  | 'ALL'
  | 'NOT_VARIANT_SELECTION'
  | 'VARIANT_SELECTION';

/** Assign an media to a product variant. */
export type VariantMediaAssign = {
  __typename?: 'VariantMediaAssign';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

/** Unassign an media from a product variant. */
export type VariantMediaUnassign = {
  __typename?: 'VariantMediaUnassign';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

/** Represents availability of a variant in the storefront. */
export type VariantPricingInfo = {
  __typename?: 'VariantPricingInfo';
  /** The discount amount if in sale (null otherwise). */
  discount?: Maybe<TaxedMoney>;
  /** The discount amount in the local currency. */
  discountLocalCurrency?: Maybe<TaxedMoney>;
  /** Whether it is in sale or not. */
  onSale?: Maybe<Scalars['Boolean']>;
  /** The price, with any discount subtracted. */
  price?: Maybe<TaxedMoney>;
  /** The discounted price in the local currency. */
  priceLocalCurrency?: Maybe<TaxedMoney>;
  /** The price without any discount. */
  priceUndiscounted?: Maybe<TaxedMoney>;
};

/** Verify JWT token. */
export type VerifyToken = {
  __typename?: 'VerifyToken';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** Determine if token is valid or not. */
  isValid: Scalars['Boolean'];
  /** JWT payload. */
  payload?: Maybe<Scalars['GenericScalar']>;
  /** User assigned to token. */
  user?: Maybe<User>;
};

/** An enumeration. */
export type VolumeUnitsEnum =
  | 'ACRE_FT'
  | 'ACRE_IN'
  | 'CUBIC_CENTIMETER'
  | 'CUBIC_DECIMETER'
  | 'CUBIC_FOOT'
  | 'CUBIC_INCH'
  | 'CUBIC_METER'
  | 'CUBIC_MILLIMETER'
  | 'CUBIC_YARD'
  | 'FL_OZ'
  | 'LITER'
  | 'PINT'
  | 'QT';

/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type Voucher = Node & ObjectWithMetadata & {
  __typename?: 'Voucher';
  applyOncePerCustomer: Scalars['Boolean'];
  applyOncePerOrder: Scalars['Boolean'];
  /** List of categories this voucher applies to. */
  categories?: Maybe<CategoryCountableConnection>;
  /** List of availability in channels for the voucher. */
  channelListings?: Maybe<Array<VoucherChannelListing>>;
  code: Scalars['String'];
  /** List of collections this voucher applies to. */
  collections?: Maybe<CollectionCountableConnection>;
  /** List of countries available for the shipping voucher. */
  countries?: Maybe<Array<Maybe<CountryDisplay>>>;
  /** Currency code for voucher. */
  currency?: Maybe<Scalars['String']>;
  /** Voucher value. */
  discountValue?: Maybe<Scalars['Float']>;
  /** Determines a type of discount for voucher - value or percentage */
  discountValueType: DiscountValueTypeEnum;
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  minCheckoutItemsQuantity?: Maybe<Scalars['Int']>;
  /** Minimum order value to apply voucher. */
  minSpent?: Maybe<Money>;
  name?: Maybe<Scalars['String']>;
  onlyForStaff: Scalars['Boolean'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of products this voucher applies to. */
  products?: Maybe<ProductCountableConnection>;
  startDate: Scalars['DateTime'];
  /** Returns translated voucher fields for the given language code. */
  translation?: Maybe<VoucherTranslation>;
  /** Determines a type of voucher. */
  type: VoucherTypeEnum;
  usageLimit?: Maybe<Scalars['Int']>;
  used: Scalars['Int'];
  /** New in Saleor 3.1. List of product variants this voucher applies to. */
  variants?: Maybe<ProductVariantCountableConnection>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherCollectionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherTranslationArgs = {
  languageCode: LanguageCodeEnum;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherVariantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Adds products, categories, collections to a voucher. */
export type VoucherAddCatalogues = {
  __typename?: 'VoucherAddCatalogues';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** Voucher of which catalogue IDs will be modified. */
  voucher?: Maybe<Voucher>;
};

/** Deletes vouchers. */
export type VoucherBulkDelete = {
  __typename?: 'VoucherBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

/** Represents voucher channel listing. */
export type VoucherChannelListing = Node & {
  __typename?: 'VoucherChannelListing';
  channel: Channel;
  currency: Scalars['String'];
  discountValue: Scalars['Float'];
  id: Scalars['ID'];
  minSpent?: Maybe<Money>;
};

export type VoucherChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Value of the voucher. */
  discountValue?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Min purchase amount required to apply the voucher. */
  minAmountSpent?: InputMaybe<Scalars['PositiveDecimal']>;
};

export type VoucherChannelListingInput = {
  /** List of channels to which the voucher should be assigned. */
  addChannels?: InputMaybe<Array<VoucherChannelListingAddInput>>;
  /** List of channels from which the voucher should be unassigned. */
  removeChannels?: InputMaybe<Array<Scalars['ID']>>;
};

/** Manage voucher's availability in channels. */
export type VoucherChannelListingUpdate = {
  __typename?: 'VoucherChannelListingUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** An updated voucher instance. */
  voucher?: Maybe<Voucher>;
};

export type VoucherCountableConnection = {
  __typename?: 'VoucherCountableConnection';
  edges: Array<VoucherCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type VoucherCountableEdge = {
  __typename?: 'VoucherCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Voucher;
};

/** Creates a new voucher. */
export type VoucherCreate = {
  __typename?: 'VoucherCreate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  voucher?: Maybe<Voucher>;
};

/** Deletes a voucher. */
export type VoucherDelete = {
  __typename?: 'VoucherDelete';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  voucher?: Maybe<Voucher>;
};

export type VoucherDiscountType =
  | 'FIXED'
  | 'PERCENTAGE'
  | 'SHIPPING';

export type VoucherFilterInput = {
  discountType?: InputMaybe<Array<InputMaybe<VoucherDiscountType>>>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
  started?: InputMaybe<DateTimeRangeInput>;
  status?: InputMaybe<Array<InputMaybe<DiscountStatusEnum>>>;
  timesUsed?: InputMaybe<IntRangeInput>;
};

export type VoucherInput = {
  /** Voucher should be applied once per customer. */
  applyOncePerCustomer?: InputMaybe<Scalars['Boolean']>;
  /** Voucher should be applied to the cheapest item or entire order. */
  applyOncePerOrder?: InputMaybe<Scalars['Boolean']>;
  /** Categories discounted by the voucher. */
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Code to use the voucher. */
  code?: InputMaybe<Scalars['String']>;
  /** Collections discounted by the voucher. */
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Country codes that can be used with the shipping voucher. */
  countries?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Choices: fixed or percentage. */
  discountValueType?: InputMaybe<DiscountValueTypeEnum>;
  /** End date of the voucher in ISO 8601 format. */
  endDate?: InputMaybe<Scalars['DateTime']>;
  /** Minimal quantity of checkout items required to apply the voucher. */
  minCheckoutItemsQuantity?: InputMaybe<Scalars['Int']>;
  /** Voucher name. */
  name?: InputMaybe<Scalars['String']>;
  /** Voucher can be used only by staff user. */
  onlyForStaff?: InputMaybe<Scalars['Boolean']>;
  /** Products discounted by the voucher. */
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Start date of the voucher in ISO 8601 format. */
  startDate?: InputMaybe<Scalars['DateTime']>;
  /** Voucher type: PRODUCT, CATEGORY SHIPPING or ENTIRE_ORDER. */
  type?: InputMaybe<VoucherTypeEnum>;
  /** Limit number of times this voucher can be used in total. */
  usageLimit?: InputMaybe<Scalars['Int']>;
  /** New in Saleor 3.1. Variants discounted by the voucher. */
  variants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Removes products, categories, collections from a voucher. */
export type VoucherRemoveCatalogues = {
  __typename?: 'VoucherRemoveCatalogues';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** Voucher of which catalogue IDs will be modified. */
  voucher?: Maybe<Voucher>;
};

export type VoucherSortField =
  /** Sort vouchers by code. */
  | 'CODE'
  /** Sort vouchers by end date. */
  | 'END_DATE'
  /** Sort vouchers by minimum spent amount. */
  | 'MINIMUM_SPENT_AMOUNT'
  /** Sort vouchers by start date. */
  | 'START_DATE'
  /** Sort vouchers by type. */
  | 'TYPE'
  /** Sort vouchers by usage limit. */
  | 'USAGE_LIMIT'
  /** Sort vouchers by value. */
  | 'VALUE';

export type VoucherSortingInput = {
  /**
   * Specifies the channel in which to sort the data.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use root-level channel argument instead.
   */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort vouchers by the selected field. */
  field: VoucherSortField;
};

export type VoucherTranslatableContent = Node & {
  __typename?: 'VoucherTranslatableContent';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Returns translated voucher fields for the given language code. */
  translation?: Maybe<VoucherTranslation>;
  /**
   * Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes.
   * @deprecated This field will be removed in Saleor 4.0. Get model fields from the root level queries.
   */
  voucher?: Maybe<Voucher>;
};


export type VoucherTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a voucher. */
export type VoucherTranslate = {
  __typename?: 'VoucherTranslate';
  errors: Array<TranslationError>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  translationErrors: Array<TranslationError>;
  voucher?: Maybe<Voucher>;
};

export type VoucherTranslation = Node & {
  __typename?: 'VoucherTranslation';
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
};

export type VoucherTypeEnum =
  | 'ENTIRE_ORDER'
  | 'SHIPPING'
  | 'SPECIFIC_PRODUCT';

/** Updates a voucher. */
export type VoucherUpdate = {
  __typename?: 'VoucherUpdate';
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  voucher?: Maybe<Voucher>;
};

/** Represents warehouse. */
export type Warehouse = Node & ObjectWithMetadata & {
  __typename?: 'Warehouse';
  address: Address;
  /** New in Saleor 3.1. Click and collect options: local, all or disabled. Note: this feature is in a preview state and can be subject to changes at later point. */
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum;
  /**
   * Warehouse company name.
   * @deprecated This field will be removed in Saleor 4.0. Use `Address.companyName` instead.
   */
  companyName: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  isPrivate: Scalars['Boolean'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  shippingZones: ShippingZoneCountableConnection;
  slug: Scalars['String'];
};


/** Represents warehouse. */
export type WarehouseShippingZonesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** An enumeration. */
export type WarehouseClickAndCollectOptionEnum =
  | 'ALL'
  | 'DISABLED'
  | 'LOCAL';

export type WarehouseCountableConnection = {
  __typename?: 'WarehouseCountableConnection';
  edges: Array<WarehouseCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type WarehouseCountableEdge = {
  __typename?: 'WarehouseCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Warehouse;
};

/** Creates new warehouse. */
export type WarehouseCreate = {
  __typename?: 'WarehouseCreate';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  warehouseErrors: Array<WarehouseError>;
};

export type WarehouseCreateInput = {
  /** Address of the warehouse. */
  address: AddressInput;
  /** The email address of the warehouse. */
  email?: InputMaybe<Scalars['String']>;
  /** Warehouse name. */
  name: Scalars['String'];
  /** Shipping zones supported by the warehouse. */
  shippingZones?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Warehouse slug. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Deletes selected warehouse. */
export type WarehouseDelete = {
  __typename?: 'WarehouseDelete';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  warehouseErrors: Array<WarehouseError>;
};

export type WarehouseError = {
  __typename?: 'WarehouseError';
  /** The error code. */
  code: WarehouseErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type WarehouseErrorCode =
  | 'ALREADY_EXISTS'
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

export type WarehouseFilterInput = {
  clickAndCollectOption?: InputMaybe<WarehouseClickAndCollectOptionEnum>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
};

/** Add shipping zone to given warehouse. */
export type WarehouseShippingZoneAssign = {
  __typename?: 'WarehouseShippingZoneAssign';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  warehouseErrors: Array<WarehouseError>;
};

/** Remove shipping zone from given warehouse. */
export type WarehouseShippingZoneUnassign = {
  __typename?: 'WarehouseShippingZoneUnassign';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  warehouseErrors: Array<WarehouseError>;
};

export type WarehouseSortField =
  /** Sort warehouses by name. */
  | 'NAME';

export type WarehouseSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort warehouses by the selected field. */
  field: WarehouseSortField;
};

/** Updates given warehouse. */
export type WarehouseUpdate = {
  __typename?: 'WarehouseUpdate';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  warehouseErrors: Array<WarehouseError>;
};

export type WarehouseUpdateInput = {
  /** Address of the warehouse. */
  address?: InputMaybe<AddressInput>;
  /** New in Saleor 3.1. Click and collect options: local, all or disabled. Note: this feature is in a preview state and can be subject to changes at later point. */
  clickAndCollectOption?: InputMaybe<WarehouseClickAndCollectOptionEnum>;
  /** The email address of the warehouse. */
  email?: InputMaybe<Scalars['String']>;
  /** New in Saleor 3.1. Visibility of warehouse stocks. Note: this feature is in a preview state and can be subject to changes at later point. */
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  /** Warehouse name. */
  name?: InputMaybe<Scalars['String']>;
  /** Warehouse slug. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Webhook. */
export type Webhook = Node & {
  __typename?: 'Webhook';
  app: App;
  /** List of asynchronous webhook events. */
  asyncEvents: Array<WebhookEventAsync>;
  /** Event deliveries. */
  eventDeliveries?: Maybe<EventDeliveryCountableConnection>;
  /**
   * List of webhook events.
   * @deprecated This field will be removed in Saleor 4.0. Use `asyncEvents` or `syncEvents` instead.
   */
  events: Array<WebhookEvent>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  secretKey?: Maybe<Scalars['String']>;
  /** List of synchronous webhook events. */
  syncEvents: Array<WebhookEventSync>;
  targetUrl: Scalars['String'];
};


/** Webhook. */
export type WebhookEventDeliveriesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<EventDeliveryFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<EventDeliverySortingInput>;
};

/** Creates a new webhook subscription. */
export type WebhookCreate = {
  __typename?: 'WebhookCreate';
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  webhookErrors: Array<WebhookError>;
};

export type WebhookCreateInput = {
  /** ID of the app to which webhook belongs. */
  app?: InputMaybe<Scalars['ID']>;
  /** The asynchronous events that webhook wants to subscribe. */
  asyncEvents?: InputMaybe<Array<WebhookEventTypeAsyncEnum>>;
  /**
   * The events that webhook wants to subscribe.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `asyncEvents` or `syncEvents` instead.
   */
  events?: InputMaybe<Array<InputMaybe<WebhookEventTypeEnum>>>;
  /** Determine if webhook will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** The name of the webhook. */
  name?: InputMaybe<Scalars['String']>;
  /** The secret key used to create a hash signature with each payload. */
  secretKey?: InputMaybe<Scalars['String']>;
  /** The synchronous events that webhook wants to subscribe. */
  syncEvents?: InputMaybe<Array<WebhookEventTypeSyncEnum>>;
  /** The url to receive the payload. */
  targetUrl?: InputMaybe<Scalars['String']>;
};

/** Deletes a webhook subscription. */
export type WebhookDelete = {
  __typename?: 'WebhookDelete';
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  webhookErrors: Array<WebhookError>;
};

export type WebhookError = {
  __typename?: 'WebhookError';
  /** The error code. */
  code: WebhookErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export type WebhookErrorCode =
  | 'GRAPHQL_ERROR'
  | 'INVALID'
  | 'NOT_FOUND'
  | 'REQUIRED'
  | 'UNIQUE';

/** Webhook event. */
export type WebhookEvent = {
  __typename?: 'WebhookEvent';
  /** Internal name of the event type. */
  eventType: WebhookEventTypeEnum;
  /** Display name of the event. */
  name: Scalars['String'];
};

/** Asynchronous webhook event. */
export type WebhookEventAsync = {
  __typename?: 'WebhookEventAsync';
  /** Internal name of the event type. */
  eventType: WebhookEventTypeAsyncEnum;
  /** Display name of the event. */
  name: Scalars['String'];
};

/** Synchronous webhook event. */
export type WebhookEventSync = {
  __typename?: 'WebhookEventSync';
  /** Internal name of the event type. */
  eventType: WebhookEventTypeSyncEnum;
  /** Display name of the event. */
  name: Scalars['String'];
};

/** Enum determining type of webhook. */
export type WebhookEventTypeAsyncEnum =
  /** All the events. */
  | 'ANY_EVENTS'
  /** A new checkout is created. */
  | 'CHECKOUT_CREATED'
  /** A checkout is updated. It also triggers all updates related to the checkout. */
  | 'CHECKOUT_UPDATED'
  /** A new collection is created. */
  | 'COLLECTION_CREATED'
  /** A collection is deleted. */
  | 'COLLECTION_DELETED'
  /** A collection is updated. */
  | 'COLLECTION_UPDATED'
  /** A new customer account is created. */
  | 'CUSTOMER_CREATED'
  /** A customer account is updated. */
  | 'CUSTOMER_UPDATED'
  | 'DRAFT_ORDER_CREATED'
  | 'DRAFT_ORDER_DELETED'
  | 'DRAFT_ORDER_UPDATED'
  /** A fulfillment is cancelled. */
  | 'FULFILLMENT_CANCELED'
  /** A new fulfillment is created. */
  | 'FULFILLMENT_CREATED'
  /** An invoice is deleted. */
  | 'INVOICE_DELETED'
  /** An invoice for order requested. */
  | 'INVOICE_REQUESTED'
  /** Invoice has been sent. */
  | 'INVOICE_SENT'
  /** User notification triggered. */
  | 'NOTIFY_USER'
  /** An order is cancelled. */
  | 'ORDER_CANCELLED'
  /** An order is confirmed (status change unconfirmed -> unfulfilled) by a staff user using the OrderConfirm mutation. It also triggers when the user completes the checkout and the shop setting `automatically_confirm_all_new_orders` is enabled. */
  | 'ORDER_CONFIRMED'
  /** A new order is placed. */
  | 'ORDER_CREATED'
  /** An order is fulfilled. */
  | 'ORDER_FULFILLED'
  /** Payment is made and an order is fully paid. */
  | 'ORDER_FULLY_PAID'
  /** An order is updated; triggered for all changes related to an order; covers all other order webhooks, except for ORDER_CREATED. */
  | 'ORDER_UPDATED'
  /** A new page is created. */
  | 'PAGE_CREATED'
  /** A page is deleted. */
  | 'PAGE_DELETED'
  /** A page is updated. */
  | 'PAGE_UPDATED'
  /** A new product is created. */
  | 'PRODUCT_CREATED'
  /** A product is deleted. */
  | 'PRODUCT_DELETED'
  /** A product is updated. */
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_VARIANT_BACK_IN_STOCK'
  /** A new product variant is created. */
  | 'PRODUCT_VARIANT_CREATED'
  /** A product variant is deleted. */
  | 'PRODUCT_VARIANT_DELETED'
  | 'PRODUCT_VARIANT_OUT_OF_STOCK'
  /** A product variant is updated. */
  | 'PRODUCT_VARIANT_UPDATED'
  | 'SALE_CREATED'
  | 'SALE_DELETED'
  | 'SALE_UPDATED'
  | 'TRANSLATION_CREATED'
  | 'TRANSLATION_UPDATED';

/** Enum determining type of webhook. */
export type WebhookEventTypeEnum =
  | 'ANY_EVENTS'
  | 'CHECKOUT_CREATED'
  | 'CHECKOUT_FILTER_SHIPPING_METHODS'
  | 'CHECKOUT_UPDATED'
  | 'COLLECTION_CREATED'
  | 'COLLECTION_DELETED'
  | 'COLLECTION_UPDATED'
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'DRAFT_ORDER_CREATED'
  | 'DRAFT_ORDER_DELETED'
  | 'DRAFT_ORDER_UPDATED'
  | 'FULFILLMENT_CANCELED'
  | 'FULFILLMENT_CREATED'
  | 'INVOICE_DELETED'
  | 'INVOICE_REQUESTED'
  | 'INVOICE_SENT'
  | 'NOTIFY_USER'
  | 'ORDER_CANCELLED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_CREATED'
  | 'ORDER_FILTER_SHIPPING_METHODS'
  | 'ORDER_FULFILLED'
  | 'ORDER_FULLY_PAID'
  | 'ORDER_UPDATED'
  | 'PAGE_CREATED'
  | 'PAGE_DELETED'
  | 'PAGE_UPDATED'
  | 'PAYMENT_AUTHORIZE'
  | 'PAYMENT_CAPTURE'
  | 'PAYMENT_CONFIRM'
  | 'PAYMENT_LIST_GATEWAYS'
  | 'PAYMENT_PROCESS'
  | 'PAYMENT_REFUND'
  | 'PAYMENT_VOID'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_DELETED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_VARIANT_BACK_IN_STOCK'
  | 'PRODUCT_VARIANT_CREATED'
  | 'PRODUCT_VARIANT_DELETED'
  | 'PRODUCT_VARIANT_OUT_OF_STOCK'
  | 'PRODUCT_VARIANT_UPDATED'
  | 'SALE_CREATED'
  | 'SALE_DELETED'
  | 'SALE_UPDATED'
  | 'SHIPPING_LIST_METHODS_FOR_CHECKOUT'
  | 'TRANSLATION_CREATED'
  | 'TRANSLATION_UPDATED';

/** Enum determining type of webhook. */
export type WebhookEventTypeSyncEnum =
  | 'CHECKOUT_FILTER_SHIPPING_METHODS'
  | 'ORDER_FILTER_SHIPPING_METHODS'
  | 'PAYMENT_AUTHORIZE'
  | 'PAYMENT_CAPTURE'
  | 'PAYMENT_CONFIRM'
  | 'PAYMENT_LIST_GATEWAYS'
  | 'PAYMENT_PROCESS'
  | 'PAYMENT_REFUND'
  | 'PAYMENT_VOID'
  | 'SHIPPING_LIST_METHODS_FOR_CHECKOUT';

/** An enumeration. */
export type WebhookSampleEventTypeEnum =
  | 'CHECKOUT_CREATED'
  | 'CHECKOUT_UPDATED'
  | 'COLLECTION_CREATED'
  | 'COLLECTION_DELETED'
  | 'COLLECTION_UPDATED'
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'DRAFT_ORDER_CREATED'
  | 'DRAFT_ORDER_DELETED'
  | 'DRAFT_ORDER_UPDATED'
  | 'FULFILLMENT_CANCELED'
  | 'FULFILLMENT_CREATED'
  | 'INVOICE_DELETED'
  | 'INVOICE_REQUESTED'
  | 'INVOICE_SENT'
  | 'NOTIFY_USER'
  | 'ORDER_CANCELLED'
  | 'ORDER_CONFIRMED'
  | 'ORDER_CREATED'
  | 'ORDER_FULFILLED'
  | 'ORDER_FULLY_PAID'
  | 'ORDER_UPDATED'
  | 'PAGE_CREATED'
  | 'PAGE_DELETED'
  | 'PAGE_UPDATED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_DELETED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_VARIANT_BACK_IN_STOCK'
  | 'PRODUCT_VARIANT_CREATED'
  | 'PRODUCT_VARIANT_DELETED'
  | 'PRODUCT_VARIANT_OUT_OF_STOCK'
  | 'PRODUCT_VARIANT_UPDATED'
  | 'SALE_CREATED'
  | 'SALE_DELETED'
  | 'SALE_UPDATED'
  | 'TRANSLATION_CREATED'
  | 'TRANSLATION_UPDATED';

/** Updates a webhook subscription. */
export type WebhookUpdate = {
  __typename?: 'WebhookUpdate';
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
  /** @deprecated This field will be removed in Saleor 4.0. Use `errors` field instead. */
  webhookErrors: Array<WebhookError>;
};

export type WebhookUpdateInput = {
  /** ID of the app to which webhook belongs. */
  app?: InputMaybe<Scalars['ID']>;
  /** The asynchronous events that webhook wants to subscribe. */
  asyncEvents?: InputMaybe<Array<WebhookEventTypeAsyncEnum>>;
  /**
   * The events that webhook wants to subscribe.
   *
   * DEPRECATED: this field will be removed in Saleor 4.0. Use `asyncEvents` or `syncEvents` instead.
   */
  events?: InputMaybe<Array<InputMaybe<WebhookEventTypeEnum>>>;
  /** Determine if webhook will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** The new name of the webhook. */
  name?: InputMaybe<Scalars['String']>;
  /** Use to create a hash signature with each payload. */
  secretKey?: InputMaybe<Scalars['String']>;
  /** The synchronous events that webhook wants to subscribe. */
  syncEvents?: InputMaybe<Array<WebhookEventTypeSyncEnum>>;
  /** The url to receive the payload. */
  targetUrl?: InputMaybe<Scalars['String']>;
};

/** Represents weight value in a specific weight unit. */
export type Weight = {
  __typename?: 'Weight';
  /** Weight unit. */
  unit: WeightUnitsEnum;
  /** Weight value. */
  value: Scalars['Float'];
};

/** An enumeration. */
export type WeightUnitsEnum =
  | 'G'
  | 'KG'
  | 'LB'
  | 'OZ'
  | 'TONNE';

/** _Entity union as defined by Federation spec. */
export type _Entity = Address | App | Category | Collection | Group | PageType | Product | ProductMedia | ProductType | ProductVariant | User;

/** _Service manifest as defined by Federation spec. */
export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export type AppQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type AppQuery = { __typename?: 'Query', app?: { __typename?: 'App', id: string, name?: string | null } | null };

export type ChannelFragment = { __typename?: 'Channel', id: string, name: string, slug: string };

export type ChannelQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ChannelQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: string, name: string, slug: string } | null };

export type ChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChannelsQuery = { __typename?: 'Query', channels?: Array<{ __typename?: 'Channel', id: string, name: string, slug: string }> | null };

export type MetadataItemFragment = { __typename?: 'MetadataItem', key: string, value: string };

export type MetadataErrorFragment = { __typename?: 'MetadataError', code: MetadataErrorCode, message?: string | null, field?: string | null };

export type PrivateMetadataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PrivateMetadataQuery = { __typename?: 'Query', app?: { __typename?: 'App', id: string, privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | null };

export type UpdatePrivateMetadataMutationVariables = Exact<{
  id: Scalars['ID'];
  input: Array<MetadataInput> | MetadataInput;
}>;


export type UpdatePrivateMetadataMutation = { __typename?: 'Mutation', updatePrivateMetadata?: { __typename?: 'UpdatePrivateMetadata', item?: { __typename?: 'App', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Attribute', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Category', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Checkout', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Collection', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'DigitalContent', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Fulfillment', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'GiftCard', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Invoice', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Menu', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'MenuItem', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Order', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Page', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'PageType', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Payment', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Product', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'ProductType', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'ProductVariant', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Sale', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'ShippingMethod', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'ShippingMethodType', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'ShippingZone', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'User', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Voucher', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | { __typename?: 'Warehouse', privateMetadata: Array<{ __typename?: 'MetadataItem', key: string, value: string } | null> } | null, errors: Array<{ __typename?: 'MetadataError', code: MetadataErrorCode, message?: string | null, field?: string | null }> } | null };

export type AddressFragment = { __typename?: 'Address', companyName: string, firstName: string, lastName: string, streetAddress1: string, streetAddress2: string, postalCode: string, city: string, countryArea: string, phone?: string | null, country: { __typename?: 'CountryDisplay', code: string } };

export type MoneyFragment = { __typename?: 'Money', currency: string, amount: number };

export type OrderLineFragment = { __typename?: 'OrderLine', productName: string, variantName: string, quantity: number, taxRate: number, variant?: { __typename?: 'ProductVariant', product: { __typename?: 'Product', productType: { __typename?: 'ProductType', isDigital: boolean, kind: ProductTypeKindEnum } } } | null, unitPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } } };

export type OrderFragment = { __typename?: 'Order', id: string, number?: string | null, token: string, userEmail?: string | null, shippingTaxRate: number, shippingMethodName?: string | null, billingAddress?: { __typename?: 'Address', companyName: string, firstName: string, lastName: string, streetAddress1: string, streetAddress2: string, postalCode: string, city: string, countryArea: string, phone?: string | null, country: { __typename?: 'CountryDisplay', code: string } } | null, shippingAddress?: { __typename?: 'Address', companyName: string, firstName: string, lastName: string, streetAddress1: string, streetAddress2: string, postalCode: string, city: string, countryArea: string, phone?: string | null, country: { __typename?: 'CountryDisplay', code: string } } | null, total: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }, discounts?: Array<{ __typename?: 'OrderDiscount', name?: string | null, amount: { __typename?: 'Money', currency: string, amount: number } }> | null, shippingPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number }, net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }, lines: Array<{ __typename?: 'OrderLine', productName: string, variantName: string, quantity: number, taxRate: number, variant?: { __typename?: 'ProductVariant', product: { __typename?: 'Product', productType: { __typename?: 'ProductType', isDigital: boolean, kind: ProductTypeKindEnum } } } | null, unitPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } } } | null> };

export type OrderCreateMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderCreateMutation = { __typename?: 'Mutation', orderCreateFromCheckout?: { __typename?: 'OrderCreateFromCheckout', order?: { __typename?: 'Order', id: string, number?: string | null, token: string, userEmail?: string | null, shippingTaxRate: number, shippingMethodName?: string | null, billingAddress?: { __typename?: 'Address', companyName: string, firstName: string, lastName: string, streetAddress1: string, streetAddress2: string, postalCode: string, city: string, countryArea: string, phone?: string | null, country: { __typename?: 'CountryDisplay', code: string } } | null, shippingAddress?: { __typename?: 'Address', companyName: string, firstName: string, lastName: string, streetAddress1: string, streetAddress2: string, postalCode: string, city: string, countryArea: string, phone?: string | null, country: { __typename?: 'CountryDisplay', code: string } } | null, total: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }, discounts?: Array<{ __typename?: 'OrderDiscount', name?: string | null, amount: { __typename?: 'Money', currency: string, amount: number } }> | null, shippingPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number }, net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }, lines: Array<{ __typename?: 'OrderLine', productName: string, variantName: string, quantity: number, taxRate: number, variant?: { __typename?: 'ProductVariant', product: { __typename?: 'Product', productType: { __typename?: 'ProductType', isDigital: boolean, kind: ProductTypeKindEnum } } } | null, unitPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } } } | null> } | null, errors: Array<{ __typename?: 'OrderCreateFromCheckoutError', code: OrderCreateFromCheckoutErrorCode, message?: string | null }> } | null };

export type PaymentCreateMutationVariables = Exact<{
  id: Scalars['ID'];
  payment: PaymentCreateInput;
  transaction?: InputMaybe<TransactionInput>;
}>;


export type PaymentCreateMutation = { __typename?: 'Mutation', paymentCreate?: { __typename?: 'PaymentCreate', payment?: { __typename?: 'Payment', id: string } | null, errors: Array<{ __typename?: 'PaymentCreateError', code: PaymentCreateErrorCode, message?: string | null }> } | null };

export const ChannelFragmentDoc = gql`
    fragment ChannelFragment on Channel {
  id
  name
  slug
}
    `;
export const MetadataItemFragmentDoc = gql`
    fragment MetadataItemFragment on MetadataItem {
  key
  value
}
    `;
export const MetadataErrorFragmentDoc = gql`
    fragment MetadataErrorFragment on MetadataError {
  code
  message
  field
}
    `;
export const AddressFragmentDoc = gql`
    fragment Address on Address {
  companyName
  firstName
  lastName
  streetAddress1
  streetAddress2
  postalCode
  city
  country {
    code
  }
  countryArea
  phone
}
    `;
export const MoneyFragmentDoc = gql`
    fragment Money on Money {
  currency
  amount
}
    `;
export const OrderLineFragmentDoc = gql`
    fragment OrderLine on OrderLine {
  productName
  variantName
  quantity
  taxRate
  variant {
    product {
      productType {
        isDigital
        kind
      }
    }
  }
  unitPrice {
    gross {
      ...Money
    }
  }
  totalPrice {
    gross {
      ...Money
    }
    tax {
      ...Money
    }
  }
}
    ${MoneyFragmentDoc}`;
export const OrderFragmentDoc = gql`
    fragment Order on Order {
  id
  number
  token
  userEmail
  billingAddress {
    ...Address
  }
  shippingAddress {
    ...Address
  }
  total {
    gross {
      ...Money
    }
  }
  discounts {
    name
    amount {
      ...Money
    }
  }
  shippingPrice {
    gross {
      ...Money
    }
    net {
      ...Money
    }
    tax {
      ...Money
    }
  }
  shippingTaxRate
  shippingMethodName
  lines {
    ...OrderLine
  }
}
    ${AddressFragmentDoc}
${MoneyFragmentDoc}
${OrderLineFragmentDoc}`;
export const AppDocument = gql`
    query App($id: ID) {
  app(id: $id) {
    id
    name
  }
}
    `;

export function useAppQuery(options?: Omit<Urql.UseQueryArgs<AppQueryVariables>, 'query'>) {
  return Urql.useQuery<AppQuery>({ query: AppDocument, ...options });
};
export const ChannelDocument = gql`
    query Channel($id: ID!) {
  channel(id: $id) {
    ...ChannelFragment
  }
}
    ${ChannelFragmentDoc}`;

export function useChannelQuery(options: Omit<Urql.UseQueryArgs<ChannelQueryVariables>, 'query'>) {
  return Urql.useQuery<ChannelQuery>({ query: ChannelDocument, ...options });
};
export const ChannelsDocument = gql`
    query Channels {
  channels {
    ...ChannelFragment
  }
}
    ${ChannelFragmentDoc}`;

export function useChannelsQuery(options?: Omit<Urql.UseQueryArgs<ChannelsQueryVariables>, 'query'>) {
  return Urql.useQuery<ChannelsQuery>({ query: ChannelsDocument, ...options });
};
export const PrivateMetadataDocument = gql`
    query PrivateMetadata($id: ID!) {
  app(id: $id) {
    id
    privateMetadata {
      ...MetadataItemFragment
    }
  }
}
    ${MetadataItemFragmentDoc}`;

export function usePrivateMetadataQuery(options: Omit<Urql.UseQueryArgs<PrivateMetadataQueryVariables>, 'query'>) {
  return Urql.useQuery<PrivateMetadataQuery>({ query: PrivateMetadataDocument, ...options });
};
export const UpdatePrivateMetadataDocument = gql`
    mutation UpdatePrivateMetadata($id: ID!, $input: [MetadataInput!]!) {
  updatePrivateMetadata(id: $id, input: $input) {
    item {
      privateMetadata {
        ...MetadataItemFragment
      }
    }
    errors {
      ...MetadataErrorFragment
    }
  }
}
    ${MetadataItemFragmentDoc}
${MetadataErrorFragmentDoc}`;

export function useUpdatePrivateMetadataMutation() {
  return Urql.useMutation<UpdatePrivateMetadataMutation, UpdatePrivateMetadataMutationVariables>(UpdatePrivateMetadataDocument);
};
export const OrderCreateDocument = gql`
    mutation OrderCreate($id: ID!) {
  orderCreateFromCheckout(id: $id) {
    order {
      ...Order
    }
    errors {
      code
      message
    }
  }
}
    ${OrderFragmentDoc}`;

export function useOrderCreateMutation() {
  return Urql.useMutation<OrderCreateMutation, OrderCreateMutationVariables>(OrderCreateDocument);
};
export const PaymentCreateDocument = gql`
    mutation PaymentCreate($id: ID!, $payment: PaymentCreateInput!, $transaction: TransactionInput) {
  paymentCreate(id: $id, payment: $payment, transaction: $transaction) {
    payment {
      id
    }
    errors {
      code
      message
    }
  }
}
    `;

export function usePaymentCreateMutation() {
  return Urql.useMutation<PaymentCreateMutation, PaymentCreateMutationVariables>(PaymentCreateDocument);
};