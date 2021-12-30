// THIS FILE IS GENERATED WITH `npm run generate`
import * as Scalar from '../scalars'
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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
  /**
   * Allows use of a JSON String for input / output from the GraphQL schema.
   *
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
   */
  JSONString: string;
  /**
   * Positive Decimal scalar implementation.
   *
   * Should be used in places where value must be positive.
   */
  PositiveDecimal: any;
  UUID: any;
  /** Variables of this type must be set to null in mutations. They will be replaced with a filename from a following multipart part containing a binary file. See: https://github.com/jaydenseric/graphql-multipart-request-spec. */
  Upload: any;
  WeightScalar: any;
  /** Anything */
  _Any: any;
};

/** Create a new address for the customer. */
export type AccountAddressCreate = {
  __typename?: 'AccountAddressCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was created. */
  user?: Maybe<User>;
};

/** Delete an address of the logged-in user. */
export type AccountAddressDelete = {
  __typename?: 'AccountAddressDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was deleted. */
  user?: Maybe<User>;
};

/** Updates an address of the logged-in user. */
export type AccountAddressUpdate = {
  __typename?: 'AccountAddressUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user object for which the address was edited. */
  user?: Maybe<User>;
};

/** Remove user account. */
export type AccountDelete = {
  __typename?: 'AccountDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum AccountErrorCode {
  AccountNotConfirmed = 'ACCOUNT_NOT_CONFIRMED',
  ActivateOwnAccount = 'ACTIVATE_OWN_ACCOUNT',
  ActivateSuperuserAccount = 'ACTIVATE_SUPERUSER_ACCOUNT',
  ChannelInactive = 'CHANNEL_INACTIVE',
  DeactivateOwnAccount = 'DEACTIVATE_OWN_ACCOUNT',
  DeactivateSuperuserAccount = 'DEACTIVATE_SUPERUSER_ACCOUNT',
  DeleteNonStaffUser = 'DELETE_NON_STAFF_USER',
  DeleteOwnAccount = 'DELETE_OWN_ACCOUNT',
  DeleteStaffAccount = 'DELETE_STAFF_ACCOUNT',
  DeleteSuperuserAccount = 'DELETE_SUPERUSER_ACCOUNT',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Inactive = 'INACTIVE',
  Invalid = 'INVALID',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidPassword = 'INVALID_PASSWORD',
  JwtDecodeError = 'JWT_DECODE_ERROR',
  JwtInvalidCsrfToken = 'JWT_INVALID_CSRF_TOKEN',
  JwtInvalidToken = 'JWT_INVALID_TOKEN',
  JwtMissingToken = 'JWT_MISSING_TOKEN',
  JwtSignatureExpired = 'JWT_SIGNATURE_EXPIRED',
  LeftNotManageablePermission = 'LEFT_NOT_MANAGEABLE_PERMISSION',
  MissingChannelSlug = 'MISSING_CHANNEL_SLUG',
  NotFound = 'NOT_FOUND',
  OutOfScopeGroup = 'OUT_OF_SCOPE_GROUP',
  OutOfScopePermission = 'OUT_OF_SCOPE_PERMISSION',
  OutOfScopeUser = 'OUT_OF_SCOPE_USER',
  PasswordEntirelyNumeric = 'PASSWORD_ENTIRELY_NUMERIC',
  PasswordTooCommon = 'PASSWORD_TOO_COMMON',
  PasswordTooShort = 'PASSWORD_TOO_SHORT',
  PasswordTooSimilar = 'PASSWORD_TOO_SIMILAR',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** User language code. */
  languageCode?: InputMaybe<LanguageCodeEnum>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Sets a default address for the authenticated user. */
export type AccountSetDefaultAddress = {
  __typename?: 'AccountSetDefaultAddress';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** Updates the account of the logged-in user. */
export type AccountUpdate = {
  __typename?: 'AccountUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  address?: Maybe<Address>;
  errors: Array<AccountError>;
  /** A user instance for which the address was created. */
  user?: Maybe<User>;
};

/** Deletes an address. */
export type AddressDelete = {
  __typename?: 'AddressDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** An enumeration. */
export enum AddressTypeEnum {
  Billing = 'BILLING',
  Shipping = 'SHIPPING'
}

/** Updates an address. */
export type AddressUpdate = {
  __typename?: 'AddressUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
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
  /** Homepage of the app. */
  homepageUrl?: Maybe<Scalars['String']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  /** The newly created authentication token. */
  authToken?: Maybe<Scalars['String']>;
  errors: Array<AppError>;
};

/** Deactivate the app. */
export type AppDeactivate = {
  __typename?: 'AppDeactivate';
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

/** Deletes an app. */
export type AppDelete = {
  __typename?: 'AppDelete';
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

/** Delete failed installation. */
export type AppDeleteFailedInstallation = {
  __typename?: 'AppDeleteFailedInstallation';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum AppErrorCode {
  Forbidden = 'FORBIDDEN',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  InvalidManifestFormat = 'INVALID_MANIFEST_FORMAT',
  InvalidPermission = 'INVALID_PERMISSION',
  InvalidStatus = 'INVALID_STATUS',
  InvalidUrlFormat = 'INVALID_URL_FORMAT',
  ManifestUrlCantConnect = 'MANIFEST_URL_CANT_CONNECT',
  NotFound = 'NOT_FOUND',
  OutOfScopeApp = 'OUT_OF_SCOPE_APP',
  OutOfScopePermission = 'OUT_OF_SCOPE_PERMISSION',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** Fetch and validate manifest. */
export type AppFetchManifest = {
  __typename?: 'AppFetchManifest';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
  id: Scalars['ID'];
  manifestUrl: Scalars['String'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** Job status. */
  status: JobStatusEnum;
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
};

/** Retry failed installation of new app. */
export type AppRetryInstall = {
  __typename?: 'AppRetryInstall';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
  errors: Array<AppError>;
};

export enum AppSortField {
  /** Sort apps by creation date. */
  CreationDate = 'CREATION_DATE',
  /** Sort apps by name. */
  Name = 'NAME'
}

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
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Name of the authenticated token. */
  name?: Maybe<Scalars['String']>;
};

/** Creates a new token. */
export type AppTokenCreate = {
  __typename?: 'AppTokenCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  appToken?: Maybe<AppToken>;
  /** The newly created authentication token. */
  authToken?: Maybe<Scalars['String']>;
  errors: Array<AppError>;
};

/** Deletes an authentication token assigned to app. */
export type AppTokenDelete = {
  __typename?: 'AppTokenDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  /** Determine if token is valid or not. */
  valid: Scalars['Boolean'];
};

/** Enum determining type of your App. */
export enum AppTypeEnum {
  /** Local Saleor App. The app is fully manageable from dashboard. You can change assigned permissions, add webhooks, or authentication token */
  Local = 'LOCAL',
  /** Third party external App. Installation is fully automated. Saleor uses a defined App manifest to gather all required information. */
  Thirdparty = 'THIRDPARTY'
}

/** Updates an existing app. */
export type AppUpdate = {
  __typename?: 'AppUpdate';
  app?: Maybe<App>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

/** An enumeration. */
export enum AreaUnitsEnum {
  SqCm = 'SQ_CM',
  SqFt = 'SQ_FT',
  SqInch = 'SQ_INCH',
  SqKm = 'SQ_KM',
  SqM = 'SQ_M',
  SqYd = 'SQ_YD'
}

/** Assigns storefront's navigation menus. */
export type AssignNavigation = {
  __typename?: 'AssignNavigation';
  errors: Array<MenuError>;
  /** Assigned navigation menu. */
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<AttributeError>;
};

export enum AttributeChoicesSortField {
  /** Sort attribute choice by name. */
  Name = 'NAME',
  /** Sort attribute choice by slug. */
  Slug = 'SLUG'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

/** An enumeration. */
export enum AttributeEntityTypeEnum {
  Page = 'PAGE',
  Product = 'PRODUCT'
}

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
export enum AttributeErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type AttributeFilterInput = {
  availableInGrid?: InputMaybe<Scalars['Boolean']>;
  /** Specifies the channel by which the data should be filtered. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
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
export enum AttributeInputTypeEnum {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  DateTime = 'DATE_TIME',
  Dropdown = 'DROPDOWN',
  File = 'FILE',
  Multiselect = 'MULTISELECT',
  Numeric = 'NUMERIC',
  Reference = 'REFERENCE',
  RichText = 'RICH_TEXT'
}

/** Reorder the values of an attribute. */
export type AttributeReorderValues = {
  __typename?: 'AttributeReorderValues';
  /** Attribute from which values are reordered. */
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

export enum AttributeSortField {
  /** Sort attributes based on whether they can be displayed or not in a product grid. */
  AvailableInGrid = 'AVAILABLE_IN_GRID',
  /** Sort attributes by the filterable in dashboard flag */
  FilterableInDashboard = 'FILTERABLE_IN_DASHBOARD',
  /** Sort attributes by the filterable in storefront flag */
  FilterableInStorefront = 'FILTERABLE_IN_STOREFRONT',
  /** Sort attributes by the variant only flag */
  IsVariantOnly = 'IS_VARIANT_ONLY',
  /** Sort attributes by name */
  Name = 'NAME',
  /** Sort attributes by slug */
  Slug = 'SLUG',
  /** Sort attributes by their position in storefront */
  StorefrontSearchPosition = 'STOREFRONT_SEARCH_POSITION',
  /** Sort attributes by the value required flag */
  ValueRequired = 'VALUE_REQUIRED',
  /** Sort attributes by visibility in the storefront */
  VisibleInStorefront = 'VISIBLE_IN_STOREFRONT'
}

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
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  attribute?: Maybe<Attribute>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type AttributeTranslation = Node & {
  __typename?: 'AttributeTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
};

/** An enumeration. */
export enum AttributeTypeEnum {
  PageType = 'PAGE_TYPE',
  ProductType = 'PRODUCT_TYPE'
}

/** Updates attribute. */
export type AttributeUpdate = {
  __typename?: 'AttributeUpdate';
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

export type AttributeUpdateInput = {
  /** New values to be created for this attribute. */
  addValues?: InputMaybe<Array<InputMaybe<AttributeValueCreateInput>>>;
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
  /** The ID of the object. */
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
  /** Represents the value of the attribute value. */
  value?: Maybe<Scalars['String']>;
};


/** Represents a value of an attribute. */
export type AttributeValueTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes values of attributes. */
export type AttributeValueBulkDelete = {
  __typename?: 'AttributeValueBulkDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
  errors: Array<AttributeError>;
};

export type AttributeValueCreateInput = {
  /** Name of a value displayed in the interface. */
  name: Scalars['String'];
  /** Represents the text (JSON) of the attribute value. */
  richText?: InputMaybe<Scalars['JSONString']>;
  /** Represents the value of the attribute value. */
  value?: InputMaybe<Scalars['String']>;
};

/** Deletes a value of an attribute. */
export type AttributeValueDelete = {
  __typename?: 'AttributeValueDelete';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  attributeValue?: Maybe<AttributeValue>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type AttributeValueTranslation = Node & {
  __typename?: 'AttributeValueTranslation';
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
  errors: Array<AttributeError>;
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
  /** Product variant related to the discount. */
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
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Deletes a category. */
export type CategoryDelete = {
  __typename?: 'CategoryDelete';
  category?: Maybe<Category>;
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export enum CategorySortField {
  /** Sort categories by name. */
  Name = 'NAME',
  /** Sort categories by product count. */
  ProductCount = 'PRODUCT_COUNT',
  /** Sort categories by subcategory count. */
  SubcategoryCount = 'SUBCATEGORY_COUNT'
}

export type CategorySortingInput = {
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
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
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  category?: Maybe<Category>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the category (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type CategoryTranslation = Node & {
  __typename?: 'CategoryTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Represents channel. */
export type Channel = Node & {
  __typename?: 'Channel';
  currencyCode: Scalars['String'];
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry: CountryDisplay;
  /** Whether a channel has associated orders. */
  hasOrders: Scalars['Boolean'];
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

/** Creates new channel. */
export type ChannelCreate = {
  __typename?: 'ChannelCreate';
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

export type ChannelCreateInput = {
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /** Currency of the channel. */
  currencyCode: Scalars['String'];
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

/** Delete a channel. Orders associated with the deleted channel will be moved to the target channel. Checkouts, product availability, and pricing will be removed. */
export type ChannelDelete = {
  __typename?: 'ChannelDelete';
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum ChannelErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  ChannelsCurrencyMustBeTheSame = 'CHANNELS_CURRENCY_MUST_BE_THE_SAME',
  ChannelWithOrders = 'CHANNEL_WITH_ORDERS',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** Update a channel. */
export type ChannelUpdate = {
  __typename?: 'ChannelUpdate';
  channel?: Maybe<Channel>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
};

export type ChannelUpdateInput = {
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: InputMaybe<Array<Scalars['ID']>>;
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
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
  /** List of available payment gateways. */
  availablePaymentGateways: Array<PaymentGateway>;
  /** Shipping methods that can be used with this order. */
  availableShippingMethods: Array<Maybe<ShippingMethod>>;
  billingAddress?: Maybe<Address>;
  channel: Channel;
  created: Scalars['DateTime'];
  discount?: Maybe<Money>;
  discountName?: Maybe<Scalars['String']>;
  /** Email of a customer. */
  email: Scalars['String'];
  /** List of gift cards associated with this checkout. */
  giftCards?: Maybe<Array<Maybe<GiftCard>>>;
  /** The ID of the object. */
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
  /** The shipping method related with checkout. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** The price of the shipping, with all the taxes included. */
  shippingPrice?: Maybe<TaxedMoney>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Update billing address in the existing checkout. */
export type CheckoutBillingAddressUpdate = {
  __typename?: 'CheckoutBillingAddressUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Completes the checkout. As a result a new order is created and a payment charge is made. This action requires a successful payment before it can be performed. In case additional confirmation step as 3D secure is required confirmationNeeded flag will be set to True and no order created until payment is confirmed with second call of this mutation. */
export type CheckoutComplete = {
  __typename?: 'CheckoutComplete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  /** Whether the checkout was created or the current active one was returned. Refer to checkoutLinesAdd and checkoutLinesUpdate to merge a cart with an active checkout.DEPRECATED: Will be removed in Saleor 4.0. Always returns True. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Removes the user assigned as the owner of the checkout. */
export type CheckoutCustomerDetach = {
  __typename?: 'CheckoutCustomerDetach';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Updates email address in the existing checkout object. */
export type CheckoutEmailUpdate = {
  __typename?: 'CheckoutEmailUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum CheckoutErrorCode {
  BillingAddressNotSet = 'BILLING_ADDRESS_NOT_SET',
  ChannelInactive = 'CHANNEL_INACTIVE',
  CheckoutNotFullyPaid = 'CHECKOUT_NOT_FULLY_PAID',
  GraphqlError = 'GRAPHQL_ERROR',
  InsufficientStock = 'INSUFFICIENT_STOCK',
  Invalid = 'INVALID',
  InvalidShippingMethod = 'INVALID_SHIPPING_METHOD',
  MissingChannelSlug = 'MISSING_CHANNEL_SLUG',
  NotFound = 'NOT_FOUND',
  PaymentError = 'PAYMENT_ERROR',
  ProductNotPublished = 'PRODUCT_NOT_PUBLISHED',
  ProductUnavailableForPurchase = 'PRODUCT_UNAVAILABLE_FOR_PURCHASE',
  QuantityGreaterThanLimit = 'QUANTITY_GREATER_THAN_LIMIT',
  Required = 'REQUIRED',
  ShippingAddressNotSet = 'SHIPPING_ADDRESS_NOT_SET',
  ShippingMethodNotApplicable = 'SHIPPING_METHOD_NOT_APPLICABLE',
  ShippingMethodNotSet = 'SHIPPING_METHOD_NOT_SET',
  ShippingNotRequired = 'SHIPPING_NOT_REQUIRED',
  TaxError = 'TAX_ERROR',
  UnavailableVariantInChannel = 'UNAVAILABLE_VARIANT_IN_CHANNEL',
  Unique = 'UNIQUE',
  VoucherNotApplicable = 'VOUCHER_NOT_APPLICABLE',
  ZeroQuantity = 'ZERO_QUANTITY'
}

/** Update language code in the existing checkout. */
export type CheckoutLanguageCodeUpdate = {
  __typename?: 'CheckoutLanguageCodeUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Represents an item in the checkout. */
export type CheckoutLine = Node & {
  __typename?: 'CheckoutLine';
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
};

/** Remove a gift card or a voucher from a checkout. */
export type CheckoutRemovePromoCode = {
  __typename?: 'CheckoutRemovePromoCode';
  /** The checkout with the removed gift card or voucher. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Update shipping address in the existing checkout. */
export type CheckoutShippingAddressUpdate = {
  __typename?: 'CheckoutShippingAddressUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

/** Updates the shipping address of the checkout. */
export type CheckoutShippingMethodUpdate = {
  __typename?: 'CheckoutShippingMethodUpdate';
  /** An updated checkout. */
  checkout?: Maybe<Checkout>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
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
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

/** Deletes collections. */
export type CollectionBulkDelete = {
  __typename?: 'CollectionBulkDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<CollectionError>;
};

/** Represents collection channel listing. */
export type CollectionChannelListing = Node & {
  __typename?: 'CollectionChannelListing';
  channel: Channel;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum CollectionErrorCode {
  CannotManageProductWithoutVariant = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type CollectionFilterInput = {
  /** Specifies the channel by which the data should be filtered. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
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

export enum CollectionPublished {
  Hidden = 'HIDDEN',
  Published = 'PUBLISHED'
}

/** Remove products from a collection. */
export type CollectionRemoveProducts = {
  __typename?: 'CollectionRemoveProducts';
  /** Collection from which products will be removed. */
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

/** Reorder the products of a collection. */
export type CollectionReorderProducts = {
  __typename?: 'CollectionReorderProducts';
  /** Collection from which products are reordered. */
  collection?: Maybe<Collection>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

export enum CollectionSortField {
  /** Sort collections by availability. */
  Availability = 'AVAILABILITY',
  /** Sort collections by name. */
  Name = 'NAME',
  /** Sort collections by product count. */
  ProductCount = 'PRODUCT_COUNT',
  /** Sort collections by publication date. */
  PublicationDate = 'PUBLICATION_DATE'
}

export type CollectionSortingInput = {
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
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
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  collection?: Maybe<Collection>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the collection (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type CollectionTranslation = Node & {
  __typename?: 'CollectionTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum ConfigurationTypeFieldEnum {
  Boolean = 'BOOLEAN',
  Multiline = 'MULTILINE',
  Output = 'OUTPUT',
  Password = 'PASSWORD',
  Secret = 'SECRET',
  Secretmultiline = 'SECRETMULTILINE',
  String = 'STRING'
}

/** Confirm user account with token sent by email during registration. */
export type ConfirmAccount = {
  __typename?: 'ConfirmAccount';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An activated user account. */
  user?: Maybe<User>;
};

/** Confirm the email change of the logged-in user. */
export type ConfirmEmailChange = {
  __typename?: 'ConfirmEmailChange';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** A user instance with a new email. */
  user?: Maybe<User>;
};

/** An enumeration. */
export enum CountryCode {
  Ad = 'AD',
  Ae = 'AE',
  Af = 'AF',
  Ag = 'AG',
  Ai = 'AI',
  Al = 'AL',
  Am = 'AM',
  Ao = 'AO',
  Aq = 'AQ',
  Ar = 'AR',
  As = 'AS',
  At = 'AT',
  Au = 'AU',
  Aw = 'AW',
  Ax = 'AX',
  Az = 'AZ',
  Ba = 'BA',
  Bb = 'BB',
  Bd = 'BD',
  Be = 'BE',
  Bf = 'BF',
  Bg = 'BG',
  Bh = 'BH',
  Bi = 'BI',
  Bj = 'BJ',
  Bl = 'BL',
  Bm = 'BM',
  Bn = 'BN',
  Bo = 'BO',
  Bq = 'BQ',
  Br = 'BR',
  Bs = 'BS',
  Bt = 'BT',
  Bv = 'BV',
  Bw = 'BW',
  By = 'BY',
  Bz = 'BZ',
  Ca = 'CA',
  Cc = 'CC',
  Cd = 'CD',
  Cf = 'CF',
  Cg = 'CG',
  Ch = 'CH',
  Ci = 'CI',
  Ck = 'CK',
  Cl = 'CL',
  Cm = 'CM',
  Cn = 'CN',
  Co = 'CO',
  Cr = 'CR',
  Cu = 'CU',
  Cv = 'CV',
  Cw = 'CW',
  Cx = 'CX',
  Cy = 'CY',
  Cz = 'CZ',
  De = 'DE',
  Dj = 'DJ',
  Dk = 'DK',
  Dm = 'DM',
  Do = 'DO',
  Dz = 'DZ',
  Ec = 'EC',
  Ee = 'EE',
  Eg = 'EG',
  Eh = 'EH',
  Er = 'ER',
  Es = 'ES',
  Et = 'ET',
  Eu = 'EU',
  Fi = 'FI',
  Fj = 'FJ',
  Fk = 'FK',
  Fm = 'FM',
  Fo = 'FO',
  Fr = 'FR',
  Ga = 'GA',
  Gb = 'GB',
  Gd = 'GD',
  Ge = 'GE',
  Gf = 'GF',
  Gg = 'GG',
  Gh = 'GH',
  Gi = 'GI',
  Gl = 'GL',
  Gm = 'GM',
  Gn = 'GN',
  Gp = 'GP',
  Gq = 'GQ',
  Gr = 'GR',
  Gs = 'GS',
  Gt = 'GT',
  Gu = 'GU',
  Gw = 'GW',
  Gy = 'GY',
  Hk = 'HK',
  Hm = 'HM',
  Hn = 'HN',
  Hr = 'HR',
  Ht = 'HT',
  Hu = 'HU',
  Id = 'ID',
  Ie = 'IE',
  Il = 'IL',
  Im = 'IM',
  In = 'IN',
  Io = 'IO',
  Iq = 'IQ',
  Ir = 'IR',
  Is = 'IS',
  It = 'IT',
  Je = 'JE',
  Jm = 'JM',
  Jo = 'JO',
  Jp = 'JP',
  Ke = 'KE',
  Kg = 'KG',
  Kh = 'KH',
  Ki = 'KI',
  Km = 'KM',
  Kn = 'KN',
  Kp = 'KP',
  Kr = 'KR',
  Kw = 'KW',
  Ky = 'KY',
  Kz = 'KZ',
  La = 'LA',
  Lb = 'LB',
  Lc = 'LC',
  Li = 'LI',
  Lk = 'LK',
  Lr = 'LR',
  Ls = 'LS',
  Lt = 'LT',
  Lu = 'LU',
  Lv = 'LV',
  Ly = 'LY',
  Ma = 'MA',
  Mc = 'MC',
  Md = 'MD',
  Me = 'ME',
  Mf = 'MF',
  Mg = 'MG',
  Mh = 'MH',
  Mk = 'MK',
  Ml = 'ML',
  Mm = 'MM',
  Mn = 'MN',
  Mo = 'MO',
  Mp = 'MP',
  Mq = 'MQ',
  Mr = 'MR',
  Ms = 'MS',
  Mt = 'MT',
  Mu = 'MU',
  Mv = 'MV',
  Mw = 'MW',
  Mx = 'MX',
  My = 'MY',
  Mz = 'MZ',
  Na = 'NA',
  Nc = 'NC',
  Ne = 'NE',
  Nf = 'NF',
  Ng = 'NG',
  Ni = 'NI',
  Nl = 'NL',
  No = 'NO',
  Np = 'NP',
  Nr = 'NR',
  Nu = 'NU',
  Nz = 'NZ',
  Om = 'OM',
  Pa = 'PA',
  Pe = 'PE',
  Pf = 'PF',
  Pg = 'PG',
  Ph = 'PH',
  Pk = 'PK',
  Pl = 'PL',
  Pm = 'PM',
  Pn = 'PN',
  Pr = 'PR',
  Ps = 'PS',
  Pt = 'PT',
  Pw = 'PW',
  Py = 'PY',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Rs = 'RS',
  Ru = 'RU',
  Rw = 'RW',
  Sa = 'SA',
  Sb = 'SB',
  Sc = 'SC',
  Sd = 'SD',
  Se = 'SE',
  Sg = 'SG',
  Sh = 'SH',
  Si = 'SI',
  Sj = 'SJ',
  Sk = 'SK',
  Sl = 'SL',
  Sm = 'SM',
  Sn = 'SN',
  So = 'SO',
  Sr = 'SR',
  Ss = 'SS',
  St = 'ST',
  Sv = 'SV',
  Sx = 'SX',
  Sy = 'SY',
  Sz = 'SZ',
  Tc = 'TC',
  Td = 'TD',
  Tf = 'TF',
  Tg = 'TG',
  Th = 'TH',
  Tj = 'TJ',
  Tk = 'TK',
  Tl = 'TL',
  Tm = 'TM',
  Tn = 'TN',
  To = 'TO',
  Tr = 'TR',
  Tt = 'TT',
  Tv = 'TV',
  Tw = 'TW',
  Tz = 'TZ',
  Ua = 'UA',
  Ug = 'UG',
  Um = 'UM',
  Us = 'US',
  Uy = 'UY',
  Uz = 'UZ',
  Va = 'VA',
  Vc = 'VC',
  Ve = 'VE',
  Vg = 'VG',
  Vi = 'VI',
  Vn = 'VN',
  Vu = 'VU',
  Wf = 'WF',
  Ws = 'WS',
  Ye = 'YE',
  Yt = 'YT',
  Za = 'ZA',
  Zm = 'ZM',
  Zw = 'ZW'
}

export type CountryDisplay = {
  __typename?: 'CountryDisplay';
  /** Country code. */
  code: Scalars['String'];
  /** Country name. */
  country: Scalars['String'];
  /** Country tax. */
  vat?: Maybe<Vat>;
};

/** Create JWT token. */
export type CreateToken = {
  __typename?: 'CreateToken';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<AccountError>;
};

/** Creates a new customer. */
export type CustomerCreate = {
  __typename?: 'CustomerCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

/** Deletes a customer. */
export type CustomerDelete = {
  __typename?: 'CustomerDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
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
export enum CustomerEventsEnum {
  AccountCreated = 'ACCOUNT_CREATED',
  CustomerDeleted = 'CUSTOMER_DELETED',
  DigitalLinkDownloaded = 'DIGITAL_LINK_DOWNLOADED',
  EmailAssigned = 'EMAIL_ASSIGNED',
  EmailChanged = 'EMAIL_CHANGED',
  EmailChangedRequest = 'EMAIL_CHANGED_REQUEST',
  NameAssigned = 'NAME_ASSIGNED',
  NoteAdded = 'NOTE_ADDED',
  NoteAddedToOrder = 'NOTE_ADDED_TO_ORDER',
  PasswordChanged = 'PASSWORD_CHANGED',
  PasswordReset = 'PASSWORD_RESET',
  PasswordResetLinkSent = 'PASSWORD_RESET_LINK_SENT',
  PlacedOrder = 'PLACED_ORDER'
}

export type CustomerFilterInput = {
  dateJoined?: InputMaybe<DateRangeInput>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  numberOfOrders?: InputMaybe<IntRangeInput>;
  placedOrders?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Delete metadata of an object. */
export type DeleteMetadata = {
  __typename?: 'DeleteMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
};

/** Delete object's private metadata. */
export type DeletePrivateMetadata = {
  __typename?: 'DeletePrivateMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
};

export type DigitalContent = Node & ObjectWithMetadata & {
  __typename?: 'DigitalContent';
  automaticFulfillment: Scalars['Boolean'];
  contentFile: Scalars['String'];
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  variant?: Maybe<ProductVariant>;
};

/** Remove digital content assigned to given variant. */
export type DigitalContentDelete = {
  __typename?: 'DigitalContentDelete';
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum DiscountErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  CannotManageProductWithoutVariant = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export enum DiscountStatusEnum {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Scheduled = 'SCHEDULED'
}

export enum DiscountValueTypeEnum {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE'
}

/** An enumeration. */
export enum DistanceUnitsEnum {
  Cm = 'CM',
  Ft = 'FT',
  Inch = 'INCH',
  Km = 'KM',
  M = 'M',
  Yd = 'YD'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Completes creating an order. */
export type DraftOrderComplete = {
  __typename?: 'DraftOrderComplete';
  errors: Array<OrderError>;
  /** Completed order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Creates a new draft order. */
export type DraftOrderCreate = {
  __typename?: 'DraftOrderCreate';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Updates a draft order. */
export type DraftOrderUpdate = {
  __typename?: 'DraftOrderUpdate';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

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
export enum ExportErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED'
}

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
export enum ExportEventsEnum {
  ExportedFileSent = 'EXPORTED_FILE_SENT',
  ExportDeleted = 'EXPORT_DELETED',
  ExportFailed = 'EXPORT_FAILED',
  ExportFailedInfoSent = 'EXPORT_FAILED_INFO_SENT',
  ExportPending = 'EXPORT_PENDING',
  ExportSuccess = 'EXPORT_SUCCESS'
}

/** Represents a job data of exported file. */
export type ExportFile = Job & Node & {
  __typename?: 'ExportFile';
  app?: Maybe<App>;
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** List of events associated with the export. */
  events?: Maybe<Array<ExportEvent>>;
  /** The ID of the object. */
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

export enum ExportFileSortField {
  /** Sort export file by created at. */
  CreatedAt = 'CREATED_AT',
  /** Sort export file by status. */
  Status = 'STATUS',
  /** Sort export file by updated at. */
  UpdatedAt = 'UPDATED_AT'
}

export type ExportFileSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort export file by the selected field. */
  field: ExportFileSortField;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** List of products IDS to export. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  /** Determine which products should be exported. */
  scope: ExportScope;
};

export enum ExportScope {
  /** Export all products. */
  All = 'ALL',
  /** Export the filtered products. */
  Filter = 'FILTER',
  /** Export products with given ids. */
  Ids = 'IDS'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  /** The data returned by authentication plugin. */
  authenticationData?: Maybe<Scalars['JSONString']>;
  errors: Array<AccountError>;
};

/** Logout user by custom plugin. */
export type ExternalLogout = {
  __typename?: 'ExternalLogout';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** The data returned by authentication plugin. */
  logoutData?: Maybe<Scalars['JSONString']>;
};

/** Obtain external access tokens for user by custom plugin. */
export type ExternalObtainAccessTokens = {
  __typename?: 'ExternalObtainAccessTokens';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum FileTypesEnum {
  Csv = 'CSV',
  Xlsx = 'XLSX'
}

/** Upload a file. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type FileUpload = {
  __typename?: 'FileUpload';
  errors: Array<UploadError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  uploadErrors: Array<UploadError>;
  uploadedFile?: Maybe<File>;
};

/** Represents order fulfillment. */
export type Fulfillment = Node & ObjectWithMetadata & {
  __typename?: 'Fulfillment';
  created: Scalars['DateTime'];
  fulfillmentOrder: Scalars['Int'];
  /** The ID of the object. */
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

/** Cancels existing fulfillment and optionally restocks items. */
export type FulfillmentCancel = {
  __typename?: 'FulfillmentCancel';
  errors: Array<OrderError>;
  /** A canceled fulfillment. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was cancelled. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

export type FulfillmentCancelInput = {
  /** ID of warehouse where items will be restock. */
  warehouseId: Scalars['ID'];
};

/** Represents line of the fulfillment. */
export type FulfillmentLine = Node & {
  __typename?: 'FulfillmentLine';
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Return products. */
export type FulfillmentReturnProducts = {
  __typename?: 'FulfillmentReturnProducts';
  errors: Array<OrderError>;
  /** Order which fulfillment was returned. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  /** A replace fulfillment. */
  replaceFulfillment?: Maybe<Fulfillment>;
  /** A draft order which was created for products with replace flag. */
  replaceOrder?: Maybe<Order>;
  /** A return fulfillment. */
  returnFulfillment?: Maybe<Fulfillment>;
};

/** An enumeration. */
export enum FulfillmentStatus {
  /** Canceled */
  Canceled = 'CANCELED',
  /** Fulfilled */
  Fulfilled = 'FULFILLED',
  /** Refunded */
  Refunded = 'REFUNDED',
  /** Refunded and returned */
  RefundedAndReturned = 'REFUNDED_AND_RETURNED',
  /** Replaced */
  Replaced = 'REPLACED',
  /** Returned */
  Returned = 'RETURNED'
}

/** Updates a fulfillment for an order. */
export type FulfillmentUpdateTracking = {
  __typename?: 'FulfillmentUpdateTracking';
  errors: Array<OrderError>;
  /** A fulfillment with updated tracking. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order for which fulfillment was updated. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export type GiftCard = Node & {
  __typename?: 'GiftCard';
  /** Gift card code. */
  code?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  currentBalance?: Maybe<Money>;
  /** Code in format which allows displaying in a user interface. */
  displayCode?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  initialBalance?: Maybe<Money>;
  isActive: Scalars['Boolean'];
  lastUsedOn?: Maybe<Scalars['DateTime']>;
  startDate: Scalars['Date'];
  /** The customer who bought a gift card. */
  user?: Maybe<User>;
};

/** Activate a gift card. */
export type GiftCardActivate = {
  __typename?: 'GiftCardActivate';
  errors: Array<GiftCardError>;
  /** A gift card to activate. */
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
};

export type GiftCardCreateInput = {
  /** Value of the gift card. */
  balance?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Code to use the gift card. */
  code?: InputMaybe<Scalars['String']>;
  /** End date of the gift card in ISO 8601 format. */
  endDate?: InputMaybe<Scalars['Date']>;
  /** Start date of the gift card in ISO 8601 format. */
  startDate?: InputMaybe<Scalars['Date']>;
  /** The customer's email of the gift card buyer. */
  userEmail?: InputMaybe<Scalars['String']>;
};

/** Deactivate a gift card. */
export type GiftCardDeactivate = {
  __typename?: 'GiftCardDeactivate';
  errors: Array<GiftCardError>;
  /** A gift card to deactivate. */
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
};

/** An enumeration. */
export enum GiftCardErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** Update a gift card. */
export type GiftCardUpdate = {
  __typename?: 'GiftCardUpdate';
  errors: Array<GiftCardError>;
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
};

export type GiftCardUpdateInput = {
  /** Value of the gift card. */
  balance?: InputMaybe<Scalars['PositiveDecimal']>;
  /** End date of the gift card in ISO 8601 format. */
  endDate?: InputMaybe<Scalars['Date']>;
  /** Start date of the gift card in ISO 8601 format. */
  startDate?: InputMaybe<Scalars['Date']>;
  /** The customer's email of the gift card buyer. */
  userEmail?: InputMaybe<Scalars['String']>;
};

/** Represents permission group data. */
export type Group = Node & {
  __typename?: 'Group';
  /** The ID of the object. */
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
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  externalUrl?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  number?: Maybe<Scalars['String']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Job status. */
  status: JobStatusEnum;
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
  /** URL to download an invoice. */
  url?: Maybe<Scalars['String']>;
};

/** Creates a ready to send invoice. */
export type InvoiceCreate = {
  __typename?: 'InvoiceCreate';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum InvoiceErrorCode {
  EmailNotSet = 'EMAIL_NOT_SET',
  InvalidStatus = 'INVALID_STATUS',
  NotFound = 'NOT_FOUND',
  NotReady = 'NOT_READY',
  NumberNotSet = 'NUMBER_NOT_SET',
  Required = 'REQUIRED',
  UrlNotSet = 'URL_NOT_SET'
}

/** Request an invoice for the order using plugin. */
export type InvoiceRequest = {
  __typename?: 'InvoiceRequest';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  /** Order related to an invoice. */
  order?: Maybe<Order>;
};

/** Requests deletion of an invoice. */
export type InvoiceRequestDelete = {
  __typename?: 'InvoiceRequestDelete';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
};

/** Send an invoice notification to the customer. */
export type InvoiceSendNotification = {
  __typename?: 'InvoiceSendNotification';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
};

/** Updates an invoice. */
export type InvoiceUpdate = {
  __typename?: 'InvoiceUpdate';
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum JobStatusEnum {
  Deleted = 'DELETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Success = 'SUCCESS'
}

/** An enumeration. */
export enum LanguageCodeEnum {
  Af = 'AF',
  AfNa = 'AF_NA',
  AfZa = 'AF_ZA',
  Agq = 'AGQ',
  AgqCm = 'AGQ_CM',
  Ak = 'AK',
  AkGh = 'AK_GH',
  Am = 'AM',
  AmEt = 'AM_ET',
  Ar = 'AR',
  ArAe = 'AR_AE',
  ArBh = 'AR_BH',
  ArDj = 'AR_DJ',
  ArDz = 'AR_DZ',
  ArEg = 'AR_EG',
  ArEh = 'AR_EH',
  ArEr = 'AR_ER',
  ArIl = 'AR_IL',
  ArIq = 'AR_IQ',
  ArJo = 'AR_JO',
  ArKm = 'AR_KM',
  ArKw = 'AR_KW',
  ArLb = 'AR_LB',
  ArLy = 'AR_LY',
  ArMa = 'AR_MA',
  ArMr = 'AR_MR',
  ArOm = 'AR_OM',
  ArPs = 'AR_PS',
  ArQa = 'AR_QA',
  ArSa = 'AR_SA',
  ArSd = 'AR_SD',
  ArSo = 'AR_SO',
  ArSs = 'AR_SS',
  ArSy = 'AR_SY',
  ArTd = 'AR_TD',
  ArTn = 'AR_TN',
  ArYe = 'AR_YE',
  As = 'AS',
  Asa = 'ASA',
  AsaTz = 'ASA_TZ',
  Ast = 'AST',
  AstEs = 'AST_ES',
  AsIn = 'AS_IN',
  Az = 'AZ',
  AzCyrl = 'AZ_CYRL',
  AzCyrlAz = 'AZ_CYRL_AZ',
  AzLatn = 'AZ_LATN',
  AzLatnAz = 'AZ_LATN_AZ',
  Bas = 'BAS',
  BasCm = 'BAS_CM',
  Be = 'BE',
  Bem = 'BEM',
  BemZm = 'BEM_ZM',
  Bez = 'BEZ',
  BezTz = 'BEZ_TZ',
  BeBy = 'BE_BY',
  Bg = 'BG',
  BgBg = 'BG_BG',
  Bm = 'BM',
  BmMl = 'BM_ML',
  Bn = 'BN',
  BnBd = 'BN_BD',
  BnIn = 'BN_IN',
  Bo = 'BO',
  BoCn = 'BO_CN',
  BoIn = 'BO_IN',
  Br = 'BR',
  Brx = 'BRX',
  BrxIn = 'BRX_IN',
  BrFr = 'BR_FR',
  Bs = 'BS',
  BsCyrl = 'BS_CYRL',
  BsCyrlBa = 'BS_CYRL_BA',
  BsLatn = 'BS_LATN',
  BsLatnBa = 'BS_LATN_BA',
  Ca = 'CA',
  CaAd = 'CA_AD',
  CaEs = 'CA_ES',
  CaEsValencia = 'CA_ES_VALENCIA',
  CaFr = 'CA_FR',
  CaIt = 'CA_IT',
  Ccp = 'CCP',
  CcpBd = 'CCP_BD',
  CcpIn = 'CCP_IN',
  Ce = 'CE',
  Ceb = 'CEB',
  CebPh = 'CEB_PH',
  CeRu = 'CE_RU',
  Cgg = 'CGG',
  CggUg = 'CGG_UG',
  Chr = 'CHR',
  ChrUs = 'CHR_US',
  Ckb = 'CKB',
  CkbIq = 'CKB_IQ',
  CkbIr = 'CKB_IR',
  Cs = 'CS',
  CsCz = 'CS_CZ',
  Cu = 'CU',
  CuRu = 'CU_RU',
  Cy = 'CY',
  CyGb = 'CY_GB',
  Da = 'DA',
  Dav = 'DAV',
  DavKe = 'DAV_KE',
  DaDk = 'DA_DK',
  DaGl = 'DA_GL',
  De = 'DE',
  DeAt = 'DE_AT',
  DeBe = 'DE_BE',
  DeCh = 'DE_CH',
  DeDe = 'DE_DE',
  DeIt = 'DE_IT',
  DeLi = 'DE_LI',
  DeLu = 'DE_LU',
  Dje = 'DJE',
  DjeNe = 'DJE_NE',
  Dsb = 'DSB',
  DsbDe = 'DSB_DE',
  Dua = 'DUA',
  DuaCm = 'DUA_CM',
  Dyo = 'DYO',
  DyoSn = 'DYO_SN',
  Dz = 'DZ',
  DzBt = 'DZ_BT',
  Ebu = 'EBU',
  EbuKe = 'EBU_KE',
  Ee = 'EE',
  EeGh = 'EE_GH',
  EeTg = 'EE_TG',
  El = 'EL',
  ElCy = 'EL_CY',
  ElGr = 'EL_GR',
  En = 'EN',
  EnAe = 'EN_AE',
  EnAg = 'EN_AG',
  EnAi = 'EN_AI',
  EnAs = 'EN_AS',
  EnAt = 'EN_AT',
  EnAu = 'EN_AU',
  EnBb = 'EN_BB',
  EnBe = 'EN_BE',
  EnBi = 'EN_BI',
  EnBm = 'EN_BM',
  EnBs = 'EN_BS',
  EnBw = 'EN_BW',
  EnBz = 'EN_BZ',
  EnCa = 'EN_CA',
  EnCc = 'EN_CC',
  EnCh = 'EN_CH',
  EnCk = 'EN_CK',
  EnCm = 'EN_CM',
  EnCx = 'EN_CX',
  EnCy = 'EN_CY',
  EnDe = 'EN_DE',
  EnDg = 'EN_DG',
  EnDk = 'EN_DK',
  EnDm = 'EN_DM',
  EnEr = 'EN_ER',
  EnFi = 'EN_FI',
  EnFj = 'EN_FJ',
  EnFk = 'EN_FK',
  EnFm = 'EN_FM',
  EnGb = 'EN_GB',
  EnGd = 'EN_GD',
  EnGg = 'EN_GG',
  EnGh = 'EN_GH',
  EnGi = 'EN_GI',
  EnGm = 'EN_GM',
  EnGu = 'EN_GU',
  EnGy = 'EN_GY',
  EnHk = 'EN_HK',
  EnIe = 'EN_IE',
  EnIl = 'EN_IL',
  EnIm = 'EN_IM',
  EnIn = 'EN_IN',
  EnIo = 'EN_IO',
  EnJe = 'EN_JE',
  EnJm = 'EN_JM',
  EnKe = 'EN_KE',
  EnKi = 'EN_KI',
  EnKn = 'EN_KN',
  EnKy = 'EN_KY',
  EnLc = 'EN_LC',
  EnLr = 'EN_LR',
  EnLs = 'EN_LS',
  EnMg = 'EN_MG',
  EnMh = 'EN_MH',
  EnMo = 'EN_MO',
  EnMp = 'EN_MP',
  EnMs = 'EN_MS',
  EnMt = 'EN_MT',
  EnMu = 'EN_MU',
  EnMw = 'EN_MW',
  EnMy = 'EN_MY',
  EnNa = 'EN_NA',
  EnNf = 'EN_NF',
  EnNg = 'EN_NG',
  EnNl = 'EN_NL',
  EnNr = 'EN_NR',
  EnNu = 'EN_NU',
  EnNz = 'EN_NZ',
  EnPg = 'EN_PG',
  EnPh = 'EN_PH',
  EnPk = 'EN_PK',
  EnPn = 'EN_PN',
  EnPr = 'EN_PR',
  EnPw = 'EN_PW',
  EnRw = 'EN_RW',
  EnSb = 'EN_SB',
  EnSc = 'EN_SC',
  EnSd = 'EN_SD',
  EnSe = 'EN_SE',
  EnSg = 'EN_SG',
  EnSh = 'EN_SH',
  EnSi = 'EN_SI',
  EnSl = 'EN_SL',
  EnSs = 'EN_SS',
  EnSx = 'EN_SX',
  EnSz = 'EN_SZ',
  EnTc = 'EN_TC',
  EnTk = 'EN_TK',
  EnTo = 'EN_TO',
  EnTt = 'EN_TT',
  EnTv = 'EN_TV',
  EnTz = 'EN_TZ',
  EnUg = 'EN_UG',
  EnUm = 'EN_UM',
  EnUs = 'EN_US',
  EnVc = 'EN_VC',
  EnVg = 'EN_VG',
  EnVi = 'EN_VI',
  EnVu = 'EN_VU',
  EnWs = 'EN_WS',
  EnZa = 'EN_ZA',
  EnZm = 'EN_ZM',
  EnZw = 'EN_ZW',
  Eo = 'EO',
  Es = 'ES',
  EsAr = 'ES_AR',
  EsBo = 'ES_BO',
  EsBr = 'ES_BR',
  EsBz = 'ES_BZ',
  EsCl = 'ES_CL',
  EsCo = 'ES_CO',
  EsCr = 'ES_CR',
  EsCu = 'ES_CU',
  EsDo = 'ES_DO',
  EsEa = 'ES_EA',
  EsEc = 'ES_EC',
  EsEs = 'ES_ES',
  EsGq = 'ES_GQ',
  EsGt = 'ES_GT',
  EsHn = 'ES_HN',
  EsIc = 'ES_IC',
  EsMx = 'ES_MX',
  EsNi = 'ES_NI',
  EsPa = 'ES_PA',
  EsPe = 'ES_PE',
  EsPh = 'ES_PH',
  EsPr = 'ES_PR',
  EsPy = 'ES_PY',
  EsSv = 'ES_SV',
  EsUs = 'ES_US',
  EsUy = 'ES_UY',
  EsVe = 'ES_VE',
  Et = 'ET',
  EtEe = 'ET_EE',
  Eu = 'EU',
  EuEs = 'EU_ES',
  Ewo = 'EWO',
  EwoCm = 'EWO_CM',
  Fa = 'FA',
  FaAf = 'FA_AF',
  FaIr = 'FA_IR',
  Ff = 'FF',
  FfAdlm = 'FF_ADLM',
  FfAdlmBf = 'FF_ADLM_BF',
  FfAdlmCm = 'FF_ADLM_CM',
  FfAdlmGh = 'FF_ADLM_GH',
  FfAdlmGm = 'FF_ADLM_GM',
  FfAdlmGn = 'FF_ADLM_GN',
  FfAdlmGw = 'FF_ADLM_GW',
  FfAdlmLr = 'FF_ADLM_LR',
  FfAdlmMr = 'FF_ADLM_MR',
  FfAdlmNe = 'FF_ADLM_NE',
  FfAdlmNg = 'FF_ADLM_NG',
  FfAdlmSl = 'FF_ADLM_SL',
  FfAdlmSn = 'FF_ADLM_SN',
  FfLatn = 'FF_LATN',
  FfLatnBf = 'FF_LATN_BF',
  FfLatnCm = 'FF_LATN_CM',
  FfLatnGh = 'FF_LATN_GH',
  FfLatnGm = 'FF_LATN_GM',
  FfLatnGn = 'FF_LATN_GN',
  FfLatnGw = 'FF_LATN_GW',
  FfLatnLr = 'FF_LATN_LR',
  FfLatnMr = 'FF_LATN_MR',
  FfLatnNe = 'FF_LATN_NE',
  FfLatnNg = 'FF_LATN_NG',
  FfLatnSl = 'FF_LATN_SL',
  FfLatnSn = 'FF_LATN_SN',
  Fi = 'FI',
  Fil = 'FIL',
  FilPh = 'FIL_PH',
  FiFi = 'FI_FI',
  Fo = 'FO',
  FoDk = 'FO_DK',
  FoFo = 'FO_FO',
  Fr = 'FR',
  FrBe = 'FR_BE',
  FrBf = 'FR_BF',
  FrBi = 'FR_BI',
  FrBj = 'FR_BJ',
  FrBl = 'FR_BL',
  FrCa = 'FR_CA',
  FrCd = 'FR_CD',
  FrCf = 'FR_CF',
  FrCg = 'FR_CG',
  FrCh = 'FR_CH',
  FrCi = 'FR_CI',
  FrCm = 'FR_CM',
  FrDj = 'FR_DJ',
  FrDz = 'FR_DZ',
  FrFr = 'FR_FR',
  FrGa = 'FR_GA',
  FrGf = 'FR_GF',
  FrGn = 'FR_GN',
  FrGp = 'FR_GP',
  FrGq = 'FR_GQ',
  FrHt = 'FR_HT',
  FrKm = 'FR_KM',
  FrLu = 'FR_LU',
  FrMa = 'FR_MA',
  FrMc = 'FR_MC',
  FrMf = 'FR_MF',
  FrMg = 'FR_MG',
  FrMl = 'FR_ML',
  FrMq = 'FR_MQ',
  FrMr = 'FR_MR',
  FrMu = 'FR_MU',
  FrNc = 'FR_NC',
  FrNe = 'FR_NE',
  FrPf = 'FR_PF',
  FrPm = 'FR_PM',
  FrRe = 'FR_RE',
  FrRw = 'FR_RW',
  FrSc = 'FR_SC',
  FrSn = 'FR_SN',
  FrSy = 'FR_SY',
  FrTd = 'FR_TD',
  FrTg = 'FR_TG',
  FrTn = 'FR_TN',
  FrVu = 'FR_VU',
  FrWf = 'FR_WF',
  FrYt = 'FR_YT',
  Fur = 'FUR',
  FurIt = 'FUR_IT',
  Fy = 'FY',
  FyNl = 'FY_NL',
  Ga = 'GA',
  GaGb = 'GA_GB',
  GaIe = 'GA_IE',
  Gd = 'GD',
  GdGb = 'GD_GB',
  Gl = 'GL',
  GlEs = 'GL_ES',
  Gsw = 'GSW',
  GswCh = 'GSW_CH',
  GswFr = 'GSW_FR',
  GswLi = 'GSW_LI',
  Gu = 'GU',
  Guz = 'GUZ',
  GuzKe = 'GUZ_KE',
  GuIn = 'GU_IN',
  Gv = 'GV',
  GvIm = 'GV_IM',
  Ha = 'HA',
  Haw = 'HAW',
  HawUs = 'HAW_US',
  HaGh = 'HA_GH',
  HaNe = 'HA_NE',
  HaNg = 'HA_NG',
  He = 'HE',
  HeIl = 'HE_IL',
  Hi = 'HI',
  HiIn = 'HI_IN',
  Hr = 'HR',
  HrBa = 'HR_BA',
  HrHr = 'HR_HR',
  Hsb = 'HSB',
  HsbDe = 'HSB_DE',
  Hu = 'HU',
  HuHu = 'HU_HU',
  Hy = 'HY',
  HyAm = 'HY_AM',
  Ia = 'IA',
  Id = 'ID',
  IdId = 'ID_ID',
  Ig = 'IG',
  IgNg = 'IG_NG',
  Ii = 'II',
  IiCn = 'II_CN',
  Is = 'IS',
  IsIs = 'IS_IS',
  It = 'IT',
  ItCh = 'IT_CH',
  ItIt = 'IT_IT',
  ItSm = 'IT_SM',
  ItVa = 'IT_VA',
  Ja = 'JA',
  JaJp = 'JA_JP',
  Jgo = 'JGO',
  JgoCm = 'JGO_CM',
  Jmc = 'JMC',
  JmcTz = 'JMC_TZ',
  Jv = 'JV',
  JvId = 'JV_ID',
  Ka = 'KA',
  Kab = 'KAB',
  KabDz = 'KAB_DZ',
  Kam = 'KAM',
  KamKe = 'KAM_KE',
  KaGe = 'KA_GE',
  Kde = 'KDE',
  KdeTz = 'KDE_TZ',
  Kea = 'KEA',
  KeaCv = 'KEA_CV',
  Khq = 'KHQ',
  KhqMl = 'KHQ_ML',
  Ki = 'KI',
  KiKe = 'KI_KE',
  Kk = 'KK',
  Kkj = 'KKJ',
  KkjCm = 'KKJ_CM',
  KkKz = 'KK_KZ',
  Kl = 'KL',
  Kln = 'KLN',
  KlnKe = 'KLN_KE',
  KlGl = 'KL_GL',
  Km = 'KM',
  KmKh = 'KM_KH',
  Kn = 'KN',
  KnIn = 'KN_IN',
  Ko = 'KO',
  Kok = 'KOK',
  KokIn = 'KOK_IN',
  KoKp = 'KO_KP',
  KoKr = 'KO_KR',
  Ks = 'KS',
  Ksb = 'KSB',
  KsbTz = 'KSB_TZ',
  Ksf = 'KSF',
  KsfCm = 'KSF_CM',
  Ksh = 'KSH',
  KshDe = 'KSH_DE',
  KsArab = 'KS_ARAB',
  KsArabIn = 'KS_ARAB_IN',
  Ku = 'KU',
  KuTr = 'KU_TR',
  Kw = 'KW',
  KwGb = 'KW_GB',
  Ky = 'KY',
  KyKg = 'KY_KG',
  Lag = 'LAG',
  LagTz = 'LAG_TZ',
  Lb = 'LB',
  LbLu = 'LB_LU',
  Lg = 'LG',
  LgUg = 'LG_UG',
  Lkt = 'LKT',
  LktUs = 'LKT_US',
  Ln = 'LN',
  LnAo = 'LN_AO',
  LnCd = 'LN_CD',
  LnCf = 'LN_CF',
  LnCg = 'LN_CG',
  Lo = 'LO',
  LoLa = 'LO_LA',
  Lrc = 'LRC',
  LrcIq = 'LRC_IQ',
  LrcIr = 'LRC_IR',
  Lt = 'LT',
  LtLt = 'LT_LT',
  Lu = 'LU',
  Luo = 'LUO',
  LuoKe = 'LUO_KE',
  Luy = 'LUY',
  LuyKe = 'LUY_KE',
  LuCd = 'LU_CD',
  Lv = 'LV',
  LvLv = 'LV_LV',
  Mai = 'MAI',
  MaiIn = 'MAI_IN',
  Mas = 'MAS',
  MasKe = 'MAS_KE',
  MasTz = 'MAS_TZ',
  Mer = 'MER',
  MerKe = 'MER_KE',
  Mfe = 'MFE',
  MfeMu = 'MFE_MU',
  Mg = 'MG',
  Mgh = 'MGH',
  MghMz = 'MGH_MZ',
  Mgo = 'MGO',
  MgoCm = 'MGO_CM',
  MgMg = 'MG_MG',
  Mi = 'MI',
  MiNz = 'MI_NZ',
  Mk = 'MK',
  MkMk = 'MK_MK',
  Ml = 'ML',
  MlIn = 'ML_IN',
  Mn = 'MN',
  Mni = 'MNI',
  MniBeng = 'MNI_BENG',
  MniBengIn = 'MNI_BENG_IN',
  MnMn = 'MN_MN',
  Mr = 'MR',
  MrIn = 'MR_IN',
  Ms = 'MS',
  MsBn = 'MS_BN',
  MsId = 'MS_ID',
  MsMy = 'MS_MY',
  MsSg = 'MS_SG',
  Mt = 'MT',
  MtMt = 'MT_MT',
  Mua = 'MUA',
  MuaCm = 'MUA_CM',
  My = 'MY',
  MyMm = 'MY_MM',
  Mzn = 'MZN',
  MznIr = 'MZN_IR',
  Naq = 'NAQ',
  NaqNa = 'NAQ_NA',
  Nb = 'NB',
  NbNo = 'NB_NO',
  NbSj = 'NB_SJ',
  Nd = 'ND',
  Nds = 'NDS',
  NdsDe = 'NDS_DE',
  NdsNl = 'NDS_NL',
  NdZw = 'ND_ZW',
  Ne = 'NE',
  NeIn = 'NE_IN',
  NeNp = 'NE_NP',
  Nl = 'NL',
  NlAw = 'NL_AW',
  NlBe = 'NL_BE',
  NlBq = 'NL_BQ',
  NlCw = 'NL_CW',
  NlNl = 'NL_NL',
  NlSr = 'NL_SR',
  NlSx = 'NL_SX',
  Nmg = 'NMG',
  NmgCm = 'NMG_CM',
  Nn = 'NN',
  Nnh = 'NNH',
  NnhCm = 'NNH_CM',
  NnNo = 'NN_NO',
  Nus = 'NUS',
  NusSs = 'NUS_SS',
  Nyn = 'NYN',
  NynUg = 'NYN_UG',
  Om = 'OM',
  OmEt = 'OM_ET',
  OmKe = 'OM_KE',
  Or = 'OR',
  OrIn = 'OR_IN',
  Os = 'OS',
  OsGe = 'OS_GE',
  OsRu = 'OS_RU',
  Pa = 'PA',
  PaArab = 'PA_ARAB',
  PaArabPk = 'PA_ARAB_PK',
  PaGuru = 'PA_GURU',
  PaGuruIn = 'PA_GURU_IN',
  Pcm = 'PCM',
  PcmNg = 'PCM_NG',
  Pl = 'PL',
  PlPl = 'PL_PL',
  Prg = 'PRG',
  Ps = 'PS',
  PsAf = 'PS_AF',
  PsPk = 'PS_PK',
  Pt = 'PT',
  PtAo = 'PT_AO',
  PtBr = 'PT_BR',
  PtCh = 'PT_CH',
  PtCv = 'PT_CV',
  PtGq = 'PT_GQ',
  PtGw = 'PT_GW',
  PtLu = 'PT_LU',
  PtMo = 'PT_MO',
  PtMz = 'PT_MZ',
  PtPt = 'PT_PT',
  PtSt = 'PT_ST',
  PtTl = 'PT_TL',
  Qu = 'QU',
  QuBo = 'QU_BO',
  QuEc = 'QU_EC',
  QuPe = 'QU_PE',
  Rm = 'RM',
  RmCh = 'RM_CH',
  Rn = 'RN',
  RnBi = 'RN_BI',
  Ro = 'RO',
  Rof = 'ROF',
  RofTz = 'ROF_TZ',
  RoMd = 'RO_MD',
  RoRo = 'RO_RO',
  Ru = 'RU',
  RuBy = 'RU_BY',
  RuKg = 'RU_KG',
  RuKz = 'RU_KZ',
  RuMd = 'RU_MD',
  RuRu = 'RU_RU',
  RuUa = 'RU_UA',
  Rw = 'RW',
  Rwk = 'RWK',
  RwkTz = 'RWK_TZ',
  RwRw = 'RW_RW',
  Sah = 'SAH',
  SahRu = 'SAH_RU',
  Saq = 'SAQ',
  SaqKe = 'SAQ_KE',
  Sat = 'SAT',
  SatOlck = 'SAT_OLCK',
  SatOlckIn = 'SAT_OLCK_IN',
  Sbp = 'SBP',
  SbpTz = 'SBP_TZ',
  Sd = 'SD',
  SdArab = 'SD_ARAB',
  SdArabPk = 'SD_ARAB_PK',
  SdDeva = 'SD_DEVA',
  SdDevaIn = 'SD_DEVA_IN',
  Se = 'SE',
  Seh = 'SEH',
  SehMz = 'SEH_MZ',
  Ses = 'SES',
  SesMl = 'SES_ML',
  SeFi = 'SE_FI',
  SeNo = 'SE_NO',
  SeSe = 'SE_SE',
  Sg = 'SG',
  SgCf = 'SG_CF',
  Shi = 'SHI',
  ShiLatn = 'SHI_LATN',
  ShiLatnMa = 'SHI_LATN_MA',
  ShiTfng = 'SHI_TFNG',
  ShiTfngMa = 'SHI_TFNG_MA',
  Si = 'SI',
  SiLk = 'SI_LK',
  Sk = 'SK',
  SkSk = 'SK_SK',
  Sl = 'SL',
  SlSi = 'SL_SI',
  Smn = 'SMN',
  SmnFi = 'SMN_FI',
  Sn = 'SN',
  SnZw = 'SN_ZW',
  So = 'SO',
  SoDj = 'SO_DJ',
  SoEt = 'SO_ET',
  SoKe = 'SO_KE',
  SoSo = 'SO_SO',
  Sq = 'SQ',
  SqAl = 'SQ_AL',
  SqMk = 'SQ_MK',
  SqXk = 'SQ_XK',
  Sr = 'SR',
  SrCyrl = 'SR_CYRL',
  SrCyrlBa = 'SR_CYRL_BA',
  SrCyrlMe = 'SR_CYRL_ME',
  SrCyrlRs = 'SR_CYRL_RS',
  SrCyrlXk = 'SR_CYRL_XK',
  SrLatn = 'SR_LATN',
  SrLatnBa = 'SR_LATN_BA',
  SrLatnMe = 'SR_LATN_ME',
  SrLatnRs = 'SR_LATN_RS',
  SrLatnXk = 'SR_LATN_XK',
  Su = 'SU',
  SuLatn = 'SU_LATN',
  SuLatnId = 'SU_LATN_ID',
  Sv = 'SV',
  SvAx = 'SV_AX',
  SvFi = 'SV_FI',
  SvSe = 'SV_SE',
  Sw = 'SW',
  SwCd = 'SW_CD',
  SwKe = 'SW_KE',
  SwTz = 'SW_TZ',
  SwUg = 'SW_UG',
  Ta = 'TA',
  TaIn = 'TA_IN',
  TaLk = 'TA_LK',
  TaMy = 'TA_MY',
  TaSg = 'TA_SG',
  Te = 'TE',
  Teo = 'TEO',
  TeoKe = 'TEO_KE',
  TeoUg = 'TEO_UG',
  TeIn = 'TE_IN',
  Tg = 'TG',
  TgTj = 'TG_TJ',
  Th = 'TH',
  ThTh = 'TH_TH',
  Ti = 'TI',
  TiEr = 'TI_ER',
  TiEt = 'TI_ET',
  Tk = 'TK',
  TkTm = 'TK_TM',
  To = 'TO',
  ToTo = 'TO_TO',
  Tr = 'TR',
  TrCy = 'TR_CY',
  TrTr = 'TR_TR',
  Tt = 'TT',
  TtRu = 'TT_RU',
  Twq = 'TWQ',
  TwqNe = 'TWQ_NE',
  Tzm = 'TZM',
  TzmMa = 'TZM_MA',
  Ug = 'UG',
  UgCn = 'UG_CN',
  Uk = 'UK',
  UkUa = 'UK_UA',
  Ur = 'UR',
  UrIn = 'UR_IN',
  UrPk = 'UR_PK',
  Uz = 'UZ',
  UzArab = 'UZ_ARAB',
  UzArabAf = 'UZ_ARAB_AF',
  UzCyrl = 'UZ_CYRL',
  UzCyrlUz = 'UZ_CYRL_UZ',
  UzLatn = 'UZ_LATN',
  UzLatnUz = 'UZ_LATN_UZ',
  Vai = 'VAI',
  VaiLatn = 'VAI_LATN',
  VaiLatnLr = 'VAI_LATN_LR',
  VaiVaii = 'VAI_VAII',
  VaiVaiiLr = 'VAI_VAII_LR',
  Vi = 'VI',
  ViVn = 'VI_VN',
  Vo = 'VO',
  Vun = 'VUN',
  VunTz = 'VUN_TZ',
  Wae = 'WAE',
  WaeCh = 'WAE_CH',
  Wo = 'WO',
  WoSn = 'WO_SN',
  Xh = 'XH',
  XhZa = 'XH_ZA',
  Xog = 'XOG',
  XogUg = 'XOG_UG',
  Yav = 'YAV',
  YavCm = 'YAV_CM',
  Yi = 'YI',
  Yo = 'YO',
  YoBj = 'YO_BJ',
  YoNg = 'YO_NG',
  Yue = 'YUE',
  YueHans = 'YUE_HANS',
  YueHansCn = 'YUE_HANS_CN',
  YueHant = 'YUE_HANT',
  YueHantHk = 'YUE_HANT_HK',
  Zgh = 'ZGH',
  ZghMa = 'ZGH_MA',
  Zh = 'ZH',
  ZhHans = 'ZH_HANS',
  ZhHansCn = 'ZH_HANS_CN',
  ZhHansHk = 'ZH_HANS_HK',
  ZhHansMo = 'ZH_HANS_MO',
  ZhHansSg = 'ZH_HANS_SG',
  ZhHant = 'ZH_HANT',
  ZhHantHk = 'ZH_HANT_HK',
  ZhHantMo = 'ZH_HANT_MO',
  ZhHantTw = 'ZH_HANT_TW',
  Zu = 'ZU',
  ZuZa = 'ZU_ZA'
}

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
export enum MeasurementUnitsEnum {
  AcreFt = 'ACRE_FT',
  AcreIn = 'ACRE_IN',
  Cm = 'CM',
  CubicCentimeter = 'CUBIC_CENTIMETER',
  CubicDecimeter = 'CUBIC_DECIMETER',
  CubicFoot = 'CUBIC_FOOT',
  CubicInch = 'CUBIC_INCH',
  CubicMeter = 'CUBIC_METER',
  CubicMillimeter = 'CUBIC_MILLIMETER',
  CubicYard = 'CUBIC_YARD',
  FlOz = 'FL_OZ',
  Ft = 'FT',
  G = 'G',
  Inch = 'INCH',
  Kg = 'KG',
  Km = 'KM',
  Lb = 'LB',
  Liter = 'LITER',
  M = 'M',
  Oz = 'OZ',
  Pint = 'PINT',
  Qt = 'QT',
  SqCm = 'SQ_CM',
  SqFt = 'SQ_FT',
  SqInch = 'SQ_INCH',
  SqKm = 'SQ_KM',
  SqM = 'SQ_M',
  SqYd = 'SQ_YD',
  Tonne = 'TONNE',
  Yd = 'YD'
}

/** Represents a single menu - an object that is used to help navigate through the store. */
export type Menu = Node & ObjectWithMetadata & {
  __typename?: 'Menu';
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum MenuErrorCode {
  CannotAssignNode = 'CANNOT_ASSIGN_NODE',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  InvalidMenuItem = 'INVALID_MENU_ITEM',
  NotFound = 'NOT_FOUND',
  NoMenuItemProvided = 'NO_MENU_ITEM_PROVIDED',
  Required = 'REQUIRED',
  TooManyMenuItems = 'TOO_MANY_MENU_ITEMS',
  Unique = 'UNIQUE'
}

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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
  id: Scalars['ID'];
  /**
   * Represents a single item of the related menu. Can store categories, collection or pages.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type MenuItemTranslation = Node & {
  __typename?: 'MenuItemTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
};

/** Updates a menu item. */
export type MenuItemUpdate = {
  __typename?: 'MenuItemUpdate';
  errors: Array<MenuError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export enum MenuItemsSortField {
  /** Sort menu items by name. */
  Name = 'NAME'
}

export enum MenuSortField {
  /** Sort menus by items count. */
  ItemsCount = 'ITEMS_COUNT',
  /** Sort menus by name. */
  Name = 'NAME'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum MetadataErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED'
}

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
  localizedAmount: Scalars['String'];
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
  /** Updates the shipping address of the checkout. */
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
  /** Deletes order lines. */
  draftOrderLinesBulkDelete?: Maybe<DraftOrderLinesBulkDelete>;
  /** Updates a draft order. */
  draftOrderUpdate?: Maybe<DraftOrderUpdate>;
  /** Export products to csv file. */
  exportProducts?: Maybe<ExportProducts>;
  /** Prepare external authentication url for user by custom plugin. */
  externalAuthenticationUrl?: Maybe<ExternalAuthenticationUrl>;
  /** Logout user by custom plugin. */
  externalLogout?: Maybe<ExternalLogout>;
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
  /** Creates a new gift card. */
  giftCardCreate?: Maybe<GiftCardCreate>;
  /** Deactivate a gift card. */
  giftCardDeactivate?: Maybe<GiftCardDeactivate>;
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
  /** Adds discount to the order. */
  orderDiscountAdd?: Maybe<OrderDiscountAdd>;
  /** Remove discount from the order. */
  orderDiscountDelete?: Maybe<OrderDiscountDelete>;
  /** Update discount for the order. */
  orderDiscountUpdate?: Maybe<OrderDiscountUpdate>;
  /** Creates new fulfillments for an order. */
  orderFulfill?: Maybe<OrderFulfill>;
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
  /** Updates a shipping method of the order. */
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
  /** Initializes payment process when it is required by gateway. */
  paymentInitialize?: Maybe<PaymentInitialize>;
  /** Refunds the captured payment amount. */
  paymentRefund?: Maybe<PaymentRefund>;
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
  input: AttributeValueCreateInput;
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
  promoCode: Scalars['String'];
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


export type MutationGiftCardCreateArgs = {
  input: GiftCardCreateInput;
};


export type MutationGiftCardDeactivateArgs = {
  id: Scalars['ID'];
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


export type MutationOrderFulfillmentCancelArgs = {
  id: Scalars['ID'];
  input: FulfillmentCancelInput;
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
  input?: InputMaybe<OrderUpdateShippingInput>;
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


export type MutationPaymentInitializeArgs = {
  channel?: InputMaybe<Scalars['String']>;
  gateway: Scalars['String'];
  paymentData?: InputMaybe<Scalars['JSONString']>;
};


export type MutationPaymentRefundArgs = {
  amount?: InputMaybe<Scalars['PositiveDecimal']>;
  paymentId: Scalars['ID'];
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

export enum NavigationType {
  /** Main storefront navigation. */
  Main = 'MAIN',
  /** Secondary storefront navigation. */
  Secondary = 'SECONDARY'
}

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
  /** List of actions that can be performed in the current state of an order. */
  actions: Array<Maybe<OrderAction>>;
  /** Shipping methods that can be used with this order. */
  availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  billingAddress?: Maybe<Address>;
  /** Informs whether a draft order can be finalized(turned into a regular order). */
  canFinalize: Scalars['Boolean'];
  channel: Channel;
  created: Scalars['DateTime'];
  customerNote: Scalars['String'];
  /**
   * Returns applied discount.
   * @deprecated Use discounts field. This field will be removed in Saleor 4.0.
   */
  discount?: Maybe<Money>;
  /**
   * Discount name.
   * @deprecated Use discounts field. This field will be removed in Saleor 4.0.
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
  /** The ID of the object. */
  id: Scalars['ID'];
  /** List of order invoices. */
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  /** Informs if an order is fully paid. */
  isPaid: Scalars['Boolean'];
  /** Returns True, if order requires shipping. */
  isShippingRequired: Scalars['Boolean'];
  /** @deprecated Use the `languageCodeEnum` field to fetch the language code. This field will be removed in Saleor 4.0. */
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
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethodName?: Maybe<Scalars['String']>;
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
   * @deprecated Use discounts field. This field will be removed in Saleor 4.0.
   */
  translatedDiscountName?: Maybe<Scalars['String']>;
  /** Undiscounted total amount of the order. */
  undiscountedTotal: TaxedMoney;
  user?: Maybe<User>;
  /** Email address of the customer. */
  userEmail?: Maybe<Scalars['String']>;
  voucher?: Maybe<Voucher>;
  weight?: Maybe<Weight>;
};

export enum OrderAction {
  /** Represents the capture action. */
  Capture = 'CAPTURE',
  /** Represents a mark-as-paid action. */
  MarkAsPaid = 'MARK_AS_PAID',
  /** Represents a refund action. */
  Refund = 'REFUND',
  /** Represents a void action. */
  Void = 'VOID'
}

/** Adds note to the order. */
export type OrderAddNote = {
  __typename?: 'OrderAddNote';
  errors: Array<OrderError>;
  /** Order note created. */
  event?: Maybe<OrderEvent>;
  /** Order with the note added. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Cancel an order. */
export type OrderCancel = {
  __typename?: 'OrderCancel';
  errors: Array<OrderError>;
  /** Canceled order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Capture an order. */
export type OrderCapture = {
  __typename?: 'OrderCapture';
  errors: Array<OrderError>;
  /** Captured order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** Confirms an unconfirmed order by changing status to unfulfilled. */
export type OrderConfirm = {
  __typename?: 'OrderConfirm';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export enum OrderDirection {
  /** Specifies an ascending sort order. */
  Asc = 'ASC',
  /** Specifies a descending sort order. */
  Desc = 'DESC'
}

/** Contains all details related to the applied discount to the order. */
export type OrderDiscount = Node & {
  __typename?: 'OrderDiscount';
  /** Returns amount of discount. */
  amount: Money;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** An enumeration. */
export enum OrderDiscountType {
  /** Manual */
  Manual = 'MANUAL',
  /** Voucher */
  Voucher = 'VOUCHER'
}

/** Update discount for the order. */
export type OrderDiscountUpdate = {
  __typename?: 'OrderDiscountUpdate';
  errors: Array<OrderError>;
  /** Order which has been discounted. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum OrderErrorCode {
  BillingAddressNotSet = 'BILLING_ADDRESS_NOT_SET',
  CannotCancelFulfillment = 'CANNOT_CANCEL_FULFILLMENT',
  CannotCancelOrder = 'CANNOT_CANCEL_ORDER',
  CannotDelete = 'CANNOT_DELETE',
  CannotDiscount = 'CANNOT_DISCOUNT',
  CannotRefund = 'CANNOT_REFUND',
  CaptureInactivePayment = 'CAPTURE_INACTIVE_PAYMENT',
  ChannelInactive = 'CHANNEL_INACTIVE',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  FulfillOrderLine = 'FULFILL_ORDER_LINE',
  GraphqlError = 'GRAPHQL_ERROR',
  InsufficientStock = 'INSUFFICIENT_STOCK',
  Invalid = 'INVALID',
  InvalidQuantity = 'INVALID_QUANTITY',
  NotAvailableInChannel = 'NOT_AVAILABLE_IN_CHANNEL',
  NotEditable = 'NOT_EDITABLE',
  NotFound = 'NOT_FOUND',
  OrderNoShippingAddress = 'ORDER_NO_SHIPPING_ADDRESS',
  PaymentError = 'PAYMENT_ERROR',
  PaymentMissing = 'PAYMENT_MISSING',
  ProductNotPublished = 'PRODUCT_NOT_PUBLISHED',
  ProductUnavailableForPurchase = 'PRODUCT_UNAVAILABLE_FOR_PURCHASE',
  Required = 'REQUIRED',
  ShippingMethodNotApplicable = 'SHIPPING_METHOD_NOT_APPLICABLE',
  ShippingMethodRequired = 'SHIPPING_METHOD_REQUIRED',
  TaxError = 'TAX_ERROR',
  Unique = 'UNIQUE',
  VoidInactivePayment = 'VOID_INACTIVE_PAYMENT',
  ZeroQuantity = 'ZERO_QUANTITY'
}

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
  /** The ID of the object. */
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
  /** The order which is related to this order. */
  relatedOrder?: Maybe<Order>;
  /** Define if shipping costs were included to the refund. */
  shippingCostsIncluded?: Maybe<Scalars['Boolean']>;
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
export enum OrderEventsEmailsEnum {
  Confirmed = 'CONFIRMED',
  DigitalLinks = 'DIGITAL_LINKS',
  FulfillmentConfirmation = 'FULFILLMENT_CONFIRMATION',
  OrderCancel = 'ORDER_CANCEL',
  OrderConfirmation = 'ORDER_CONFIRMATION',
  OrderRefund = 'ORDER_REFUND',
  PaymentConfirmation = 'PAYMENT_CONFIRMATION',
  ShippingConfirmation = 'SHIPPING_CONFIRMATION',
  TrackingUpdated = 'TRACKING_UPDATED'
}

/** An enumeration. */
export enum OrderEventsEnum {
  AddedProducts = 'ADDED_PRODUCTS',
  Canceled = 'CANCELED',
  Confirmed = 'CONFIRMED',
  DraftCreated = 'DRAFT_CREATED',
  DraftCreatedFromReplace = 'DRAFT_CREATED_FROM_REPLACE',
  EmailSent = 'EMAIL_SENT',
  ExternalServiceNotification = 'EXTERNAL_SERVICE_NOTIFICATION',
  FulfillmentCanceled = 'FULFILLMENT_CANCELED',
  FulfillmentFulfilledItems = 'FULFILLMENT_FULFILLED_ITEMS',
  FulfillmentRefunded = 'FULFILLMENT_REFUNDED',
  FulfillmentReplaced = 'FULFILLMENT_REPLACED',
  FulfillmentRestockedItems = 'FULFILLMENT_RESTOCKED_ITEMS',
  FulfillmentReturned = 'FULFILLMENT_RETURNED',
  InvoiceGenerated = 'INVOICE_GENERATED',
  InvoiceRequested = 'INVOICE_REQUESTED',
  InvoiceSent = 'INVOICE_SENT',
  InvoiceUpdated = 'INVOICE_UPDATED',
  NoteAdded = 'NOTE_ADDED',
  OrderDiscountAdded = 'ORDER_DISCOUNT_ADDED',
  OrderDiscountAutomaticallyUpdated = 'ORDER_DISCOUNT_AUTOMATICALLY_UPDATED',
  OrderDiscountDeleted = 'ORDER_DISCOUNT_DELETED',
  OrderDiscountUpdated = 'ORDER_DISCOUNT_UPDATED',
  OrderFullyPaid = 'ORDER_FULLY_PAID',
  OrderLineDiscountRemoved = 'ORDER_LINE_DISCOUNT_REMOVED',
  OrderLineDiscountUpdated = 'ORDER_LINE_DISCOUNT_UPDATED',
  OrderLineProductDeleted = 'ORDER_LINE_PRODUCT_DELETED',
  OrderLineVariantDeleted = 'ORDER_LINE_VARIANT_DELETED',
  OrderMarkedAsPaid = 'ORDER_MARKED_AS_PAID',
  OrderReplacementCreated = 'ORDER_REPLACEMENT_CREATED',
  Other = 'OTHER',
  OversoldItems = 'OVERSOLD_ITEMS',
  PaymentAuthorized = 'PAYMENT_AUTHORIZED',
  PaymentCaptured = 'PAYMENT_CAPTURED',
  PaymentFailed = 'PAYMENT_FAILED',
  PaymentRefunded = 'PAYMENT_REFUNDED',
  PaymentVoided = 'PAYMENT_VOIDED',
  Placed = 'PLACED',
  PlacedFromDraft = 'PLACED_FROM_DRAFT',
  RemovedProducts = 'REMOVED_PRODUCTS',
  TrackingUpdated = 'TRACKING_UPDATED',
  UpdatedAddress = 'UPDATED_ADDRESS'
}

export type OrderFilterInput = {
  channels?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  created?: InputMaybe<DateRangeInput>;
  customer?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  paymentStatus?: InputMaybe<Array<InputMaybe<PaymentChargeStatusEnum>>>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<InputMaybe<OrderStatusFilter>>>;
};

/** Creates new fulfillments for an order. */
export type OrderFulfill = {
  __typename?: 'OrderFulfill';
  errors: Array<OrderError>;
  /** List of created fulfillments. */
  fulfillments?: Maybe<Array<Maybe<Fulfillment>>>;
  /** Fulfilled order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** The ID of the object. */
  id: Scalars['ID'];
  isShippingRequired: Scalars['Boolean'];
  productName: Scalars['String'];
  productSku: Scalars['String'];
  quantity: Scalars['Int'];
  quantityFulfilled: Scalars['Int'];
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  orderLine?: Maybe<OrderLine>;
};

/** Create order lines for an order. */
export type OrderLinesCreate = {
  __typename?: 'OrderLinesCreate';
  errors: Array<OrderError>;
  /** Related order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** An enumeration. */
export enum OrderOriginEnum {
  Checkout = 'CHECKOUT',
  Draft = 'DRAFT',
  Reissue = 'REISSUE'
}

/** Refund an order. */
export type OrderRefund = {
  __typename?: 'OrderRefund';
  errors: Array<OrderError>;
  /** A refunded order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum OrderSettingsErrorCode {
  Invalid = 'INVALID'
}

/** Update shop order settings. */
export type OrderSettingsUpdate = {
  __typename?: 'OrderSettingsUpdate';
  errors: Array<OrderSettingsError>;
  /** Order settings. */
  orderSettings?: Maybe<OrderSettings>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderSettingsErrors: Array<OrderSettingsError>;
};

export type OrderSettingsUpdateInput = {
  /** When disabled, all new orders from checkout will be marked as unconfirmed. When enabled orders from checkout will become unfulfilled immediately. */
  automaticallyConfirmAllNewOrders: Scalars['Boolean'];
};

export enum OrderSortField {
  /** Sort orders by creation date. */
  CreationDate = 'CREATION_DATE',
  /** Sort orders by customer. */
  Customer = 'CUSTOMER',
  /** Sort orders by fulfillment status. */
  FulfillmentStatus = 'FULFILLMENT_STATUS',
  /** Sort orders by number. */
  Number = 'NUMBER',
  /** Sort orders by payment. */
  Payment = 'PAYMENT'
}

export type OrderSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort orders by the selected field. */
  field: OrderSortField;
};

/** An enumeration. */
export enum OrderStatus {
  /** Canceled */
  Canceled = 'CANCELED',
  /** Draft */
  Draft = 'DRAFT',
  /** Fulfilled */
  Fulfilled = 'FULFILLED',
  /** Partially fulfilled */
  PartiallyFulfilled = 'PARTIALLY_FULFILLED',
  /** Partially returned */
  PartiallyReturned = 'PARTIALLY_RETURNED',
  /** Returned */
  Returned = 'RETURNED',
  /** Unconfirmed */
  Unconfirmed = 'UNCONFIRMED',
  /** Unfulfilled */
  Unfulfilled = 'UNFULFILLED'
}

export enum OrderStatusFilter {
  Canceled = 'CANCELED',
  Fulfilled = 'FULFILLED',
  PartiallyFulfilled = 'PARTIALLY_FULFILLED',
  ReadyToCapture = 'READY_TO_CAPTURE',
  ReadyToFulfill = 'READY_TO_FULFILL',
  Unconfirmed = 'UNCONFIRMED',
  Unfulfilled = 'UNFULFILLED'
}

/** Updates an order. */
export type OrderUpdate = {
  __typename?: 'OrderUpdate';
  errors: Array<OrderError>;
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

/** Updates a shipping method of the order. */
export type OrderUpdateShipping = {
  __typename?: 'OrderUpdateShipping';
  errors: Array<OrderError>;
  /** Order with updated shipping method. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

export type OrderUpdateShippingInput = {
  /** ID of the selected shipping method. */
  shippingMethod?: InputMaybe<Scalars['ID']>;
};

/** Void an order. */
export type OrderVoid = {
  __typename?: 'OrderVoid';
  errors: Array<OrderError>;
  /** A voided order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
};

/** A static page that can be manually added by a shop operator through the dashboard. */
export type Page = Node & ObjectWithMetadata & {
  __typename?: 'Page';
  /** List of attributes assigned to this product. */
  attributes: Array<SelectedAttribute>;
  content?: Maybe<Scalars['JSONString']>;
  /**
   * Content of the page (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson: Scalars['JSONString'];
  created: Scalars['DateTime'];
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  /** The updated page type. */
  pageType?: Maybe<PageType>;
};

/** Unassign attributes from a given page type. */
export type PageAttributeUnassign = {
  __typename?: 'PageAttributeUnassign';
  errors: Array<PageError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
};

/** Publish pages. */
export type PageBulkPublish = {
  __typename?: 'PageBulkPublish';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<PageError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum PageErrorCode {
  AttributeAlreadyAssigned = 'ATTRIBUTE_ALREADY_ASSIGNED',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
};

export enum PageSortField {
  /** Sort pages by creation date. */
  CreationDate = 'CREATION_DATE',
  /** Sort pages by publication date. */
  PublicationDate = 'PUBLICATION_DATE',
  /** Sort pages by slug. */
  Slug = 'SLUG',
  /** Sort pages by title. */
  Title = 'TITLE',
  /** Sort pages by visibility. */
  Visibility = 'VISIBILITY'
}

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
   * @deprecated Will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /**
   * ('A static page that can be manually added by a shop operator ', 'through the dashboard.')
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type PageTranslation = Node & {
  __typename?: 'PageTranslation';
  content?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the page (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  /** Page type from which attributes are reordered. */
  pageType?: Maybe<PageType>;
};

export enum PageTypeSortField {
  /** Sort page types by name. */
  Name = 'NAME',
  /** Sort page types by slug. */
  Slug = 'SLUG'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
};

/** Change the password of the logged in user. */
export type PasswordChange = {
  __typename?: 'PasswordChange';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** A user instance with a new password. */
  user?: Maybe<User>;
};

/** Represents a payment of a given type. */
export type Payment = Node & {
  __typename?: 'Payment';
  /** List of actions that can be performed in the current state of a payment. */
  actions: Array<Maybe<OrderAction>>;
  /** Maximum amount of money that can be captured. */
  availableCaptureAmount?: Maybe<Money>;
  /** Maximum amount of money that can be refunded. */
  availableRefundAmount?: Maybe<Money>;
  /** Total amount captured for this payment. */
  capturedAmount?: Maybe<Money>;
  /** Internal payment status. */
  chargeStatus: PaymentChargeStatusEnum;
  checkout?: Maybe<Checkout>;
  created: Scalars['DateTime'];
  /** The details of the card used for this payment. */
  creditCard?: Maybe<CreditCard>;
  customerIpAddress?: Maybe<Scalars['String']>;
  gateway: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  modified: Scalars['DateTime'];
  order?: Maybe<Order>;
  paymentMethodType: Scalars['String'];
  token: Scalars['String'];
  /** Total amount of the payment. */
  total?: Maybe<Money>;
  /** List of all transactions within this payment. */
  transactions?: Maybe<Array<Maybe<Transaction>>>;
};

/** Captures the authorized payment amount. */
export type PaymentCapture = {
  __typename?: 'PaymentCapture';
  errors: Array<PaymentError>;
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
};

/** An enumeration. */
export enum PaymentChargeStatusEnum {
  Cancelled = 'CANCELLED',
  FullyCharged = 'FULLY_CHARGED',
  FullyRefunded = 'FULLY_REFUNDED',
  NotCharged = 'NOT_CHARGED',
  PartiallyCharged = 'PARTIALLY_CHARGED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  Pending = 'PENDING',
  Refused = 'REFUSED'
}

/** Check payment balance. */
export type PaymentCheckBalance = {
  __typename?: 'PaymentCheckBalance';
  /** Response from the gateway. */
  data?: Maybe<Scalars['JSONString']>;
  errors: Array<PaymentError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export type PaymentError = {
  __typename?: 'PaymentError';
  /** The error code. */
  code: PaymentErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum PaymentErrorCode {
  BalanceCheckError = 'BALANCE_CHECK_ERROR',
  BillingAddressNotSet = 'BILLING_ADDRESS_NOT_SET',
  ChannelInactive = 'CHANNEL_INACTIVE',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  InvalidShippingMethod = 'INVALID_SHIPPING_METHOD',
  NotFound = 'NOT_FOUND',
  NotSupportedGateway = 'NOT_SUPPORTED_GATEWAY',
  PartialPaymentNotAllowed = 'PARTIAL_PAYMENT_NOT_ALLOWED',
  PaymentError = 'PAYMENT_ERROR',
  Required = 'REQUIRED',
  ShippingAddressNotSet = 'SHIPPING_ADDRESS_NOT_SET',
  ShippingMethodNotSet = 'SHIPPING_METHOD_NOT_SET',
  Unique = 'UNIQUE'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** URL of a storefront view where user should be redirected after requiring additional actions. Payment with additional actions will not be finished if this field is not provided. */
  returnUrl?: InputMaybe<Scalars['String']>;
  /** Client-side generated payment token, representing customer's billing data in a secure manner. */
  token?: InputMaybe<Scalars['String']>;
};

/** Refunds the captured payment amount. */
export type PaymentRefund = {
  __typename?: 'PaymentRefund';
  errors: Array<PaymentError>;
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
};

/** Represents a payment source stored for user in payment gateway, such as credit card. */
export type PaymentSource = {
  __typename?: 'PaymentSource';
  /** Stored credit card details if available. */
  creditCardInfo?: Maybe<CreditCard>;
  /** Payment gateway name. */
  gateway: Scalars['String'];
  /** ID of stored payment method. */
  paymentMethodId?: Maybe<Scalars['String']>;
};

/** Voids the authorized payment. */
export type PaymentVoid = {
  __typename?: 'PaymentVoid';
  errors: Array<PaymentError>;
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum PermissionEnum {
  HandlePayments = 'HANDLE_PAYMENTS',
  ImpersonateUser = 'IMPERSONATE_USER',
  ManageApps = 'MANAGE_APPS',
  ManageChannels = 'MANAGE_CHANNELS',
  ManageCheckouts = 'MANAGE_CHECKOUTS',
  ManageDiscounts = 'MANAGE_DISCOUNTS',
  ManageGiftCard = 'MANAGE_GIFT_CARD',
  ManageMenus = 'MANAGE_MENUS',
  ManageOrders = 'MANAGE_ORDERS',
  ManagePages = 'MANAGE_PAGES',
  ManagePageTypesAndAttributes = 'MANAGE_PAGE_TYPES_AND_ATTRIBUTES',
  ManagePlugins = 'MANAGE_PLUGINS',
  ManageProducts = 'MANAGE_PRODUCTS',
  ManageProductTypesAndAttributes = 'MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES',
  ManageSettings = 'MANAGE_SETTINGS',
  ManageShipping = 'MANAGE_SHIPPING',
  ManageStaff = 'MANAGE_STAFF',
  ManageTranslations = 'MANAGE_TRANSLATIONS',
  ManageUsers = 'MANAGE_USERS'
}

/** Create new permission group. */
export type PermissionGroupCreate = {
  __typename?: 'PermissionGroupCreate';
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum PermissionGroupErrorCode {
  AssignNonStaffMember = 'ASSIGN_NON_STAFF_MEMBER',
  CannotRemoveFromLastGroup = 'CANNOT_REMOVE_FROM_LAST_GROUP',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  LeftNotManageablePermission = 'LEFT_NOT_MANAGEABLE_PERMISSION',
  OutOfScopePermission = 'OUT_OF_SCOPE_PERMISSION',
  OutOfScopeUser = 'OUT_OF_SCOPE_USER',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type PermissionGroupFilterInput = {
  search?: InputMaybe<Scalars['String']>;
};

export enum PermissionGroupSortField {
  /** Sort permission group accounts by name. */
  Name = 'NAME'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export enum PluginConfigurationType {
  Global = 'GLOBAL',
  PerChannel = 'PER_CHANNEL'
}

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
export enum PluginErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  PluginMisconfigured = 'PLUGIN_MISCONFIGURED',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type PluginFilterInput = {
  search?: InputMaybe<Scalars['String']>;
  statusInChannels?: InputMaybe<PluginStatusInChannelsInput>;
  type?: InputMaybe<PluginConfigurationType>;
};

export enum PluginSortField {
  IsActive = 'IS_ACTIVE',
  Name = 'NAME'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pluginsErrors: Array<PluginError>;
};

export type PluginUpdateInput = {
  /** Indicates whether the plugin should be enabled. */
  active?: InputMaybe<Scalars['Boolean']>;
  /** Configuration of the plugin. */
  configuration?: InputMaybe<Array<InputMaybe<ConfigurationItemInput>>>;
};

/** An enumeration. */
export enum PostalCodeRuleInclusionTypeEnum {
  Exclude = 'EXCLUDE',
  Include = 'INCLUDE'
}

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
  /** Date when product is available for purchase.  */
  availableForPurchase?: Maybe<Scalars['Date']>;
  category?: Maybe<Category>;
  /** Channel given to retrieve this product. Also used by federation gateway to resolve this object in a federated query. */
  channel?: Maybe<Scalars['String']>;
  /** List of availability in channels for the product. */
  channelListings?: Maybe<Array<ProductChannelListing>>;
  chargeTaxes: Scalars['Boolean'];
  /** List of collections for the product. */
  collections?: Maybe<Array<Maybe<Collection>>>;
  defaultVariant?: Maybe<ProductVariant>;
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /**
   * Get a single product image by ID.
   * @deprecated Will be removed in Saleor 4.0. Use the `mediaById` field instead.
   */
  imageById?: Maybe<ProductImage>;
  /**
   * List of images for the product.
   * @deprecated Will be removed in Saleor 4.0. Use the `media` field instead.
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
  updatedAt?: Maybe<Scalars['DateTime']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  /** The updated product type. */
  productType?: Maybe<ProductType>;
};

export type ProductAttributeAssignInput = {
  /** The ID of the attribute to assign. */
  id: Scalars['ID'];
  /** The attribute type to be assigned as. */
  type: ProductAttributeType;
};

export enum ProductAttributeType {
  Product = 'PRODUCT',
  Variant = 'VARIANT'
}

/** Un-assign attributes from a given product type. */
export type ProductAttributeUnassign = {
  __typename?: 'ProductAttributeUnassign';
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Represents product channel listing. */
export type ProductChannelListing = Node & {
  __typename?: 'ProductChannelListing';
  availableForPurchase?: Maybe<Scalars['Date']>;
  channel: Channel;
  /** The price of the cheapest variant (including discounts). */
  discountedPrice?: Maybe<Money>;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum ProductErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  AttributeAlreadyAssigned = 'ATTRIBUTE_ALREADY_ASSIGNED',
  AttributeCannotBeAssigned = 'ATTRIBUTE_CANNOT_BE_ASSIGNED',
  AttributeVariantsDisabled = 'ATTRIBUTE_VARIANTS_DISABLED',
  CannotManageProductWithoutVariant = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  NotProductsImage = 'NOT_PRODUCTS_IMAGE',
  NotProductsVariant = 'NOT_PRODUCTS_VARIANT',
  ProductNotAssignedToChannel = 'PRODUCT_NOT_ASSIGNED_TO_CHANNEL',
  ProductWithoutCategory = 'PRODUCT_WITHOUT_CATEGORY',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  UnsupportedMediaProvider = 'UNSUPPORTED_MEDIA_PROVIDER',
  VariantNoDigitalContent = 'VARIANT_NO_DIGITAL_CONTENT'
}

export enum ProductFieldEnum {
  Category = 'CATEGORY',
  ChargeTaxes = 'CHARGE_TAXES',
  Collections = 'COLLECTIONS',
  Description = 'DESCRIPTION',
  Name = 'NAME',
  ProductMedia = 'PRODUCT_MEDIA',
  ProductType = 'PRODUCT_TYPE',
  ProductWeight = 'PRODUCT_WEIGHT',
  VariantMedia = 'VARIANT_MEDIA',
  VariantSku = 'VARIANT_SKU',
  VariantWeight = 'VARIANT_WEIGHT'
}

export type ProductFilterInput = {
  attributes?: InputMaybe<Array<InputMaybe<AttributeInput>>>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Specifies the channel by which the data should be filtered. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: InputMaybe<Scalars['String']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  hasCategory?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isPublished?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  minimalPrice?: InputMaybe<PriceRangeInput>;
  price?: InputMaybe<PriceRangeInput>;
  productTypes?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
  stockAvailability?: InputMaybe<StockAvailability>;
  stocks?: InputMaybe<ProductStockFilterInput>;
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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Create a media object (image or video URL) associated with product. For image, this mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type ProductMediaCreate = {
  __typename?: 'ProductMediaCreate';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Changes ordering of the product media. */
export type ProductMediaReorder = {
  __typename?: 'ProductMediaReorder';
  errors: Array<ProductError>;
  media?: Maybe<Array<ProductMedia>>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** An enumeration. */
export enum ProductMediaType {
  /** An uploaded image or an URL to an image */
  Image = 'IMAGE',
  /** A URL to an external video */
  Video = 'VIDEO'
}

/** Updates a product media. */
export type ProductMediaUpdate = {
  __typename?: 'ProductMediaUpdate';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort products by the selected field. */
  field?: InputMaybe<ProductOrderField>;
};

export enum ProductOrderField {
  /** Sort products by collection. Note: This option is available only for the `Collection.products` query. */
  Collection = 'COLLECTION',
  /** Sort products by update date. */
  Date = 'DATE',
  /** Sort products by a minimal price of a product's variant. */
  MinimalPrice = 'MINIMAL_PRICE',
  /** Sort products by name. */
  Name = 'NAME',
  /** Sort products by price. */
  Price = 'PRICE',
  /** Sort products by publication date. */
  PublicationDate = 'PUBLICATION_DATE',
  /** Sort products by publication status. */
  Published = 'PUBLISHED',
  /** Sort products by rank. Note: This option is available only with the `search` filter. */
  Rank = 'RANK',
  /** Sort products by rating. */
  Rating = 'RATING',
  /** Sort products by type. */
  Type = 'TYPE'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Represents an individual item for sale in the storefront.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type ProductTranslation = Node & {
  __typename?: 'ProductTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Translated description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
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
  availableAttributes?: Maybe<AttributeCountableConnection>;
  hasVariants: Scalars['Boolean'];
  /** The ID of the object. */
  id: Scalars['ID'];
  isDigital: Scalars['Boolean'];
  isShippingRequired: Scalars['Boolean'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Product attributes of that product type. */
  productAttributes?: Maybe<Array<Maybe<Attribute>>>;
  /**
   * List of products of this type.
   * @deprecated Will be removed in Saleor 4.0. Use the top-level `products` query with the `productTypes` filter.
   */
  products?: Maybe<ProductCountableConnection>;
  slug: Scalars['String'];
  /** A type of tax. Assigned by enabled tax gateway */
  taxType?: Maybe<TaxType>;
  /** Variant attributes of that product type. */
  variantAttributes?: Maybe<Array<Maybe<Attribute>>>;
  weight?: Maybe<Weight>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

export enum ProductTypeConfigurable {
  Configurable = 'CONFIGURABLE',
  Simple = 'SIMPLE'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

/** Deletes a product type. */
export type ProductTypeDelete = {
  __typename?: 'ProductTypeDelete';
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

export enum ProductTypeEnum {
  Digital = 'DIGITAL',
  Shippable = 'SHIPPABLE'
}

export type ProductTypeFilterInput = {
  configurable?: InputMaybe<ProductTypeConfigurable>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
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

/** Reorder the attributes of a product type. */
export type ProductTypeReorderAttributes = {
  __typename?: 'ProductTypeReorderAttributes';
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  /** Product type from which attributes are reordered. */
  productType?: Maybe<ProductType>;
};

export enum ProductTypeSortField {
  /** Sort products by type. */
  Digital = 'DIGITAL',
  /** Sort products by name. */
  Name = 'NAME',
  /** Sort products by shipping. */
  ShippingRequired = 'SHIPPING_REQUIRED'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

/** Updates an existing product. */
export type ProductUpdate = {
  __typename?: 'ProductUpdate';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** Digital content for the product variant. */
  digitalContent?: Maybe<DigitalContent>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /**
   * List of images for the product variant.
   * @deprecated Will be removed in Saleor 4.0. Use the `media` instead.
   */
  images?: Maybe<Array<Maybe<ProductImage>>>;
  /** Gross margin percentage value. */
  margin?: Maybe<Scalars['Int']>;
  /** List of media for the product variant. */
  media?: Maybe<Array<ProductMedia>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** Lists the storefront variant's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<VariantPricingInfo>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  product: Product;
  /** Quantity of a product available for sale in one checkout. */
  quantityAvailable: Scalars['Int'];
  /** Total quantity ordered. */
  quantityOrdered?: Maybe<Scalars['Int']>;
  /** Total revenue generated by a variant in given period of time. Note: this field should be queried using `reportProductSales` query as it uses optimizations suitable for such calculations. */
  revenue?: Maybe<TaxedMoney>;
  sku: Scalars['String'];
  /** Stocks for the product variant. */
  stocks?: Maybe<Array<Maybe<Stock>>>;
  trackInventory: Scalars['Boolean'];
  /** Returns translated product variant fields for the given language code. */
  translation?: Maybe<ProductVariantTranslation>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** Stock keeping unit. */
  sku: Scalars['String'];
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Represents product varaint channel listing. */
export type ProductVariantChannelListing = Node & {
  __typename?: 'ProductVariantChannelListing';
  channel: Channel;
  /** Cost price of the variant. */
  costPrice?: Maybe<Money>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Gross margin percentage value. */
  margin?: Maybe<Scalars['Int']>;
  price?: Maybe<Money>;
};

export type ProductVariantChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Cost price of the variant in channel. */
  costPrice?: InputMaybe<Scalars['PositiveDecimal']>;
  /** Price of the particular variant in channel. */
  price: Scalars['PositiveDecimal'];
};

/** Manage product variant prices in channels. */
export type ProductVariantChannelListingUpdate = {
  __typename?: 'ProductVariantChannelListingUpdate';
  errors: Array<ProductChannelListingError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<AttributeValueInput>;
  /** Product ID of which type is the variant. */
  product: Scalars['ID'];
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantFilterInput = {
  metadata?: InputMaybe<Array<InputMaybe<MetadataFilter>>>;
  search?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ProductVariantInput = {
  /** List of attributes specific to this variant. */
  attributes?: InputMaybe<Array<AttributeValueInput>>;
  /** Stock keeping unit. */
  sku?: InputMaybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: InputMaybe<Scalars['WeightScalar']>;
};

/** Reorder the variants of a product. Mutation updates updated_at on product and triggers PRODUCT_UPDATED webhook. */
export type ProductVariantReorder = {
  __typename?: 'ProductVariantReorder';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Reorder product variant attribute values. */
export type ProductVariantReorderAttributeValues = {
  __typename?: 'ProductVariantReorderAttributeValues';
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  /** Product variant from which attribute values are reordered. */
  productVariant?: Maybe<ProductVariant>;
};

/** Set default variant for a product. Mutation triggers PRODUCT_UPDATED webhook. */
export type ProductVariantSetDefault = {
  __typename?: 'ProductVariantSetDefault';
  errors: Array<ProductError>;
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
};

/** Creates stocks for product variant. */
export type ProductVariantStocksCreate = {
  __typename?: 'ProductVariantStocksCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  stockErrors: Array<StockError>;
};

/** Update stocks for product variant. */
export type ProductVariantStocksUpdate = {
  __typename?: 'ProductVariantStocksUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkStockErrors: Array<BulkStockError>;
  errors: Array<BulkStockError>;
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantTranslatableContent = Node & {
  __typename?: 'ProductVariantTranslatableContent';
  /** List of product variant attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Represents a version of a product such as different size or color.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type ProductVariantTranslation = Node & {
  __typename?: 'ProductVariantTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name: Scalars['String'];
};

/** Updates an existing variant for product. */
export type ProductVariantUpdate = {
  __typename?: 'ProductVariantUpdate';
  errors: Array<ProductError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** List of all available webhook events. */
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
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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


export type QueryGiftCardsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export enum ReportingPeriod {
  ThisMonth = 'THIS_MONTH',
  Today = 'TODAY'
}

/** Request email change of the logged in user. */
export type RequestEmailChange = {
  __typename?: 'RequestEmailChange';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** A user instance. */
  user?: Maybe<User>;
};

/** Sends an email with the account password modification link. */
export type RequestPasswordReset = {
  __typename?: 'RequestPasswordReset';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** Currency code for sale. */
  currency?: Maybe<Scalars['String']>;
  /** Sale value. */
  discountValue?: Maybe<Scalars['Float']>;
  endDate?: Maybe<Scalars['DateTime']>;
  /** The ID of the object. */
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
  /** List of product variants this sale applies to. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

/** Represents sale channel listing. */
export type SaleChannelListing = Node & {
  __typename?: 'SaleChannelListing';
  channel: Channel;
  currency: Scalars['String'];
  discountValue: Scalars['Float'];
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  sale?: Maybe<Sale>;
};

/** Deletes a sale. */
export type SaleDelete = {
  __typename?: 'SaleDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** Sale of which catalogue IDs will be modified. */
  sale?: Maybe<Sale>;
};

export enum SaleSortField {
  /** Sort sales by end date. */
  EndDate = 'END_DATE',
  /** Sort sales by name. */
  Name = 'NAME',
  /** Sort sales by start date. */
  StartDate = 'START_DATE',
  /** Sort sales by type. */
  Type = 'TYPE',
  /** Sort sales by value. */
  Value = 'VALUE'
}

export type SaleSortingInput = {
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort sales by the selected field. */
  field: SaleSortField;
};

export type SaleTranslatableContent = Node & {
  __typename?: 'SaleTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Sales allow creating discounts for categories, collections or products and are visible to all the customers.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
};

export type SaleTranslation = Node & {
  __typename?: 'SaleTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum SaleType {
  /** fixed */
  Fixed = 'FIXED',
  /** % */
  Percentage = 'PERCENTAGE'
}

/** Updates a sale. */
export type SaleUpdate = {
  __typename?: 'SaleUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum ShippingErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  MaxLessThanMin = 'MAX_LESS_THAN_MIN',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethod = Node & ObjectWithMetadata & {
  __typename?: 'ShippingMethod';
  /** List of channels available for the method. */
  channelListings?: Maybe<Array<ShippingMethodChannelListing>>;
  description?: Maybe<Scalars['JSONString']>;
  /** List of excluded products for the shipping method. */
  excludedProducts?: Maybe<ProductCountableConnection>;
  /** The ID of the object. */
  id: Scalars['ID'];
  maximumDeliveryDays?: Maybe<Scalars['Int']>;
  /** The price of the cheapest variant (including discounts). */
  maximumOrderPrice?: Maybe<Money>;
  maximumOrderWeight?: Maybe<Weight>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  minimumDeliveryDays?: Maybe<Scalars['Int']>;
  /** The price of the cheapest variant (including discounts). */
  minimumOrderPrice?: Maybe<Money>;
  minimumOrderWeight?: Maybe<Weight>;
  name: Scalars['String'];
  /** Postal code ranges rule of exclusion or inclusion of the shipping method. */
  postalCodeRules?: Maybe<Array<Maybe<ShippingMethodPostalCodeRule>>>;
  /** The price of the cheapest variant (including discounts). */
  price?: Maybe<Money>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
  /** Type of the shipping method. */
  type?: Maybe<ShippingMethodTypeEnum>;
};


/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodExcludedProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Represents shipping method channel listing. */
export type ShippingMethodChannelListing = Node & {
  __typename?: 'ShippingMethodChannelListing';
  channel: Channel;
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  /** An updated shipping method instance. */
  shippingMethod?: Maybe<ShippingMethod>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /**
   * Shipping method are the methods you'll use to get customer's orders  to them. They are directly exposed to the customers.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  shippingMethod?: Maybe<ShippingMethod>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
};


export type ShippingMethodTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

export type ShippingMethodTranslation = Node & {
  __typename?: 'ShippingMethodTranslation';
  description?: Maybe<Scalars['JSONString']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum ShippingMethodTypeEnum {
  Price = 'PRICE',
  Weight = 'WEIGHT'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
};

/** Creates a new shipping price. */
export type ShippingPriceCreate = {
  __typename?: 'ShippingPriceCreate';
  errors: Array<ShippingError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  shippingMethod?: Maybe<ShippingMethod>;
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
};

/** Deletes a shipping price. */
export type ShippingPriceDelete = {
  __typename?: 'ShippingPriceDelete';
  errors: Array<ShippingError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  /** A shipping method to delete. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
};

/** Exclude products from shipping price. */
export type ShippingPriceExcludeProducts = {
  __typename?: 'ShippingPriceExcludeProducts';
  errors: Array<ShippingError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  /** A shipping method with new list of excluded products. */
  shippingMethod?: Maybe<ShippingMethod>;
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
  /** Shipping method description (JSON). */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  /** A shipping method with new list of excluded products. */
  shippingMethod?: Maybe<ShippingMethod>;
};

/** Creates/updates translations for a shipping method. */
export type ShippingPriceTranslate = {
  __typename?: 'ShippingPriceTranslate';
  errors: Array<TranslationError>;
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  shippingMethod?: Maybe<ShippingMethod>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  name: Scalars['String'];
  /** Lowest and highest prices for the shipping. */
  priceRange?: Maybe<MoneyRange>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of shipping methods available for orders shipped to countries within this shipping zone. */
  shippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  /** List of warehouses for shipping zone. */
  warehouses: Array<Warehouse>;
};

/** Deletes shipping zones. */
export type ShippingZoneBulkDelete = {
  __typename?: 'ShippingZoneBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  errors: Array<ShippingError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** Header text. */
  headerText?: Maybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices: Scalars['Boolean'];
  /** List of the shops's supported languages. */
  languages: Array<Maybe<LanguageDisplay>>;
  /** Resource limitations and current usage if any set for a shop */
  limits: LimitInfo;
  /** Shop's name. */
  name: Scalars['String'];
  /** List of available permissions. */
  permissions: Array<Maybe<Permission>>;
  /** List of possible phone prefixes. */
  phonePrefixes: Array<Maybe<Scalars['String']>>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
};

/** Updates site domain of the shop. */
export type ShopDomainUpdate = {
  __typename?: 'ShopDomainUpdate';
  errors: Array<ShopError>;
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum ShopErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  CannotFetchTaxRates = 'CANNOT_FETCH_TAX_RATES',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** Fetch tax rates. */
export type ShopFetchTaxRates = {
  __typename?: 'ShopFetchTaxRates';
  errors: Array<ShopError>;
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** Header text. */
  headerText?: InputMaybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices?: InputMaybe<Scalars['Boolean']>;
  /** Enable inventory tracking. */
  trackInventoryByDefault?: InputMaybe<Scalars['Boolean']>;
};

/** Creates/updates translations for shop settings. */
export type ShopSettingsTranslate = {
  __typename?: 'ShopSettingsTranslate';
  errors: Array<TranslationError>;
  /** Updated shop settings. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
};

export type ShopTranslation = Node & {
  __typename?: 'ShopTranslation';
  description: Scalars['String'];
  headerText: Scalars['String'];
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: Array<StaffError>;
};

/** Creates a new staff user. */
export type StaffCreate = {
  __typename?: 'StaffCreate';
  errors: Array<StaffError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export enum StaffMemberStatus {
  /** User account has been activated. */
  Active = 'ACTIVE',
  /** User account has not been activated yet. */
  Deactivated = 'DEACTIVATED'
}

/** Represents a recipient of email notifications send by Saleor, such as notifications about new orders. Notifications can be assigned to staff users or arbitrary email addresses. */
export type StaffNotificationRecipient = Node & {
  __typename?: 'StaffNotificationRecipient';
  /** Determines if a notification active. */
  active?: Maybe<Scalars['Boolean']>;
  /** Returns email address of a user subscribed to email notifications. */
  email?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Returns a user subscribed to email notifications. */
  user?: Maybe<User>;
};

/** Creates a new staff notification recipient. */
export type StaffNotificationRecipientCreate = {
  __typename?: 'StaffNotificationRecipientCreate';
  errors: Array<ShopError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

/** Delete staff notification recipient. */
export type StaffNotificationRecipientDelete = {
  __typename?: 'StaffNotificationRecipientDelete';
  errors: Array<ShopError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

/** Updates an existing staff user. */
export type StaffUpdate = {
  __typename?: 'StaffUpdate';
  errors: Array<StaffError>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<StaffMemberStatus>;
};

/** Represents stock. */
export type Stock = Node & {
  __typename?: 'Stock';
  /** The ID of the object. */
  id: Scalars['ID'];
  productVariant: ProductVariant;
  /** Quantity of a product in the warehouse's possession, including the allocated stock that is waiting for shipment. */
  quantity: Scalars['Int'];
  /** Quantity allocated for orders */
  quantityAllocated: Scalars['Int'];
  warehouse: Warehouse;
};

export enum StockAvailability {
  InStock = 'IN_STOCK',
  OutOfStock = 'OUT_OF_STOCK'
}

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
export enum StockErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

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

/** An object representing a single payment. */
export type Transaction = Node & {
  __typename?: 'Transaction';
  /** Total amount of the transaction. */
  amount?: Maybe<Money>;
  created: Scalars['DateTime'];
  error?: Maybe<Scalars['String']>;
  gatewayResponse: Scalars['JSONString'];
  /** The ID of the object. */
  id: Scalars['ID'];
  isSuccess: Scalars['Boolean'];
  kind: TransactionKind;
  payment: Payment;
  token: Scalars['String'];
};

/** An enumeration. */
export enum TransactionKind {
  /** Action to confirm */
  ActionToConfirm = 'ACTION_TO_CONFIRM',
  /** Authorization */
  Auth = 'AUTH',
  /** Cancel */
  Cancel = 'CANCEL',
  /** Capture */
  Capture = 'CAPTURE',
  /** Confirm */
  Confirm = 'CONFIRM',
  /** External reference */
  External = 'EXTERNAL',
  /** Pending */
  Pending = 'PENDING',
  /** Refund */
  Refund = 'REFUND',
  /** Refund in progress */
  RefundOngoing = 'REFUND_ONGOING',
  /** Void */
  Void = 'VOID'
}

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

export enum TranslatableKinds {
  Attribute = 'ATTRIBUTE',
  AttributeValue = 'ATTRIBUTE_VALUE',
  Category = 'CATEGORY',
  Collection = 'COLLECTION',
  MenuItem = 'MENU_ITEM',
  Page = 'PAGE',
  Product = 'PRODUCT',
  Sale = 'SALE',
  ShippingMethod = 'SHIPPING_METHOD',
  Variant = 'VARIANT',
  Voucher = 'VOUCHER'
}

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
export enum TranslationErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
};

/** Updates private metadata of an object. */
export type UpdatePrivateMetadata = {
  __typename?: 'UpdatePrivateMetadata';
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum UploadErrorCode {
  GraphqlError = 'GRAPHQL_ERROR'
}

/** Represents user data. */
export type User = Node & ObjectWithMetadata & {
  __typename?: 'User';
  /** List of all user's addresses. */
  addresses?: Maybe<Array<Maybe<Address>>>;
  avatar?: Maybe<Image>;
  /**
   * Returns the last open checkout of this user.
   * @deprecated Will be removed in Saleor 4.0. Use the `checkout_tokens` field to fetch the user checkouts.
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
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** Create a user avatar. Only for staff members. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type UserAvatarUpdate = {
  __typename?: 'UserAvatarUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  /** An updated user instance. */
  user?: Maybe<User>;
};

/** Activate or deactivate users. */
export type UserBulkSetActive = {
  __typename?: 'UserBulkSetActive';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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

export enum UserSortField {
  /** Sort users by email. */
  Email = 'EMAIL',
  /** Sort users by first name. */
  FirstName = 'FIRST_NAME',
  /** Sort users by last name. */
  LastName = 'LAST_NAME',
  /** Sort users by order count. */
  OrderCount = 'ORDER_COUNT'
}

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

export enum VariantAttributeScope {
  All = 'ALL',
  NotVariantSelection = 'NOT_VARIANT_SELECTION',
  VariantSelection = 'VARIANT_SELECTION'
}

/** Assign an media to a product variant. */
export type VariantMediaAssign = {
  __typename?: 'VariantMediaAssign';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

/** Unassign an media from a product variant. */
export type VariantMediaUnassign = {
  __typename?: 'VariantMediaUnassign';
  errors: Array<ProductError>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum VolumeUnitsEnum {
  AcreFt = 'ACRE_FT',
  AcreIn = 'ACRE_IN',
  CubicCentimeter = 'CUBIC_CENTIMETER',
  CubicDecimeter = 'CUBIC_DECIMETER',
  CubicFoot = 'CUBIC_FOOT',
  CubicInch = 'CUBIC_INCH',
  CubicMeter = 'CUBIC_METER',
  CubicMillimeter = 'CUBIC_MILLIMETER',
  CubicYard = 'CUBIC_YARD',
  FlOz = 'FL_OZ',
  Liter = 'LITER',
  Pint = 'PINT',
  Qt = 'QT'
}

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
  /** The ID of the object. */
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
  /** List of product variants this voucher applies to. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

/** Represents voucher channel listing. */
export type VoucherChannelListing = Node & {
  __typename?: 'VoucherChannelListing';
  channel: Channel;
  currency: Scalars['String'];
  discountValue: Scalars['Float'];
  /** The ID of the object. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  voucher?: Maybe<Voucher>;
};

/** Deletes a voucher. */
export type VoucherDelete = {
  __typename?: 'VoucherDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  voucher?: Maybe<Voucher>;
};

export enum VoucherDiscountType {
  Fixed = 'FIXED',
  Percentage = 'PERCENTAGE',
  Shipping = 'SHIPPING'
}

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
  /** Variants discounted by the voucher. */
  variants?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Removes products, categories, collections from a voucher. */
export type VoucherRemoveCatalogues = {
  __typename?: 'VoucherRemoveCatalogues';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  /** Voucher of which catalogue IDs will be modified. */
  voucher?: Maybe<Voucher>;
};

export enum VoucherSortField {
  /** Sort vouchers by code. */
  Code = 'CODE',
  /** Sort vouchers by end date. */
  EndDate = 'END_DATE',
  /** Sort vouchers by minimum spent amount. */
  MinimumSpentAmount = 'MINIMUM_SPENT_AMOUNT',
  /** Sort vouchers by start date. */
  StartDate = 'START_DATE',
  /** Sort vouchers by type. */
  Type = 'TYPE',
  /** Sort vouchers by usage limit. */
  UsageLimit = 'USAGE_LIMIT',
  /** Sort vouchers by value. */
  Value = 'VALUE'
}

export type VoucherSortingInput = {
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: InputMaybe<Scalars['String']>;
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort vouchers by the selected field. */
  field: VoucherSortField;
};

export type VoucherTranslatableContent = Node & {
  __typename?: 'VoucherTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Returns translated voucher fields for the given language code. */
  translation?: Maybe<VoucherTranslation>;
  /**
   * Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  voucher?: Maybe<Voucher>;
};

export type VoucherTranslation = Node & {
  __typename?: 'VoucherTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Translation language. */
  language: LanguageDisplay;
  name?: Maybe<Scalars['String']>;
};

export enum VoucherTypeEnum {
  EntireOrder = 'ENTIRE_ORDER',
  Shipping = 'SHIPPING',
  SpecificProduct = 'SPECIFIC_PRODUCT'
}

/** Updates a voucher. */
export type VoucherUpdate = {
  __typename?: 'VoucherUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
  voucher?: Maybe<Voucher>;
};

/** Represents warehouse. */
export type Warehouse = Node & ObjectWithMetadata & {
  __typename?: 'Warehouse';
  address: Address;
  /**
   * Warehouse company name.
   * @deprecated Use address.CompanyName. This field will be removed in Saleor 4.0.
   */
  companyName: Scalars['String'];
  email: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum WarehouseErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type WarehouseFilterInput = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  search?: InputMaybe<Scalars['String']>;
};

/** Add shipping zone to given warehouse. */
export type WarehouseShippingZoneAssign = {
  __typename?: 'WarehouseShippingZoneAssign';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
};

/** Remove shipping zone from given warehouse. */
export type WarehouseShippingZoneUnassign = {
  __typename?: 'WarehouseShippingZoneUnassign';
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
};

export enum WarehouseSortField {
  /** Sort warehouses by name. */
  Name = 'NAME'
}

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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
};

export type WarehouseUpdateInput = {
  /** Address of the warehouse. */
  address?: InputMaybe<AddressInput>;
  /** The email address of the warehouse. */
  email?: InputMaybe<Scalars['String']>;
  /** Warehouse name. */
  name?: InputMaybe<Scalars['String']>;
  /** Warehouse slug. */
  slug?: InputMaybe<Scalars['String']>;
};

/** Webhook. */
export type Webhook = Node & {
  __typename?: 'Webhook';
  app: App;
  /** List of webhook events. */
  events: Array<WebhookEvent>;
  /** The ID of the object. */
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  secretKey?: Maybe<Scalars['String']>;
  targetUrl: Scalars['String'];
};

/** Creates a new webhook subscription. */
export type WebhookCreate = {
  __typename?: 'WebhookCreate';
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: Array<WebhookError>;
};

export type WebhookCreateInput = {
  /** ID of the app to which webhook belongs. */
  app?: InputMaybe<Scalars['ID']>;
  /** The events that webhook wants to subscribe. */
  events?: InputMaybe<Array<InputMaybe<WebhookEventTypeEnum>>>;
  /** Determine if webhook will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** The name of the webhook. */
  name?: InputMaybe<Scalars['String']>;
  /** The secret key used to create a hash signature with each payload. */
  secretKey?: InputMaybe<Scalars['String']>;
  /** The url to receive the payload. */
  targetUrl?: InputMaybe<Scalars['String']>;
};

/** Deletes a webhook subscription. */
export type WebhookDelete = {
  __typename?: 'WebhookDelete';
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
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
export enum WebhookErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** Webhook event. */
export type WebhookEvent = {
  __typename?: 'WebhookEvent';
  /** Internal name of the event type. */
  eventType: WebhookEventTypeEnum;
  /** Display name of the event. */
  name: Scalars['String'];
};

/** Enum determining type of webhook. */
export enum WebhookEventTypeEnum {
  /** All the events. */
  AnyEvents = 'ANY_EVENTS',
  /** A new checkout is created. */
  CheckoutCreated = 'CHECKOUT_CREATED',
  /** A checkout is updated. It also triggers all updates related to the checkout. */
  CheckoutUpdated = 'CHECKOUT_UPDATED',
  /** A new customer account is created. */
  CustomerCreated = 'CUSTOMER_CREATED',
  /** A customer account is updated. */
  CustomerUpdated = 'CUSTOMER_UPDATED',
  DraftOrderCreated = 'DRAFT_ORDER_CREATED',
  DraftOrderDeleted = 'DRAFT_ORDER_DELETED',
  DraftOrderUpdated = 'DRAFT_ORDER_UPDATED',
  /** A new fulfillment is created. */
  FulfillmentCreated = 'FULFILLMENT_CREATED',
  /** An invoice is deleted. */
  InvoiceDeleted = 'INVOICE_DELETED',
  /** An invoice for order requested. */
  InvoiceRequested = 'INVOICE_REQUESTED',
  /** Invoice has been sent. */
  InvoiceSent = 'INVOICE_SENT',
  /** User notification triggered. */
  NotifyUser = 'NOTIFY_USER',
  /** An order is cancelled. */
  OrderCancelled = 'ORDER_CANCELLED',
  /** An order is confirmed (status change unconfirmed -> unfulfilled) by a staff user using the OrderConfirm mutation. It also triggers when the user completes the checkout and the shop setting `automatically_confirm_all_new_orders` is enabled. */
  OrderConfirmed = 'ORDER_CONFIRMED',
  /** A new order is placed. */
  OrderCreated = 'ORDER_CREATED',
  /** An order is fulfilled. */
  OrderFulfilled = 'ORDER_FULFILLED',
  /** Payment is made and an order is fully paid. */
  OrderFullyPaid = 'ORDER_FULLY_PAID',
  /** An order is updated; triggered for all changes related to an order; covers all other order webhooks, except for ORDER_CREATED. */
  OrderUpdated = 'ORDER_UPDATED',
  /** A new page is created. */
  PageCreated = 'PAGE_CREATED',
  /** A page is deleted. */
  PageDeleted = 'PAGE_DELETED',
  /** A page is updated. */
  PageUpdated = 'PAGE_UPDATED',
  PaymentAuthorize = 'PAYMENT_AUTHORIZE',
  PaymentCapture = 'PAYMENT_CAPTURE',
  PaymentConfirm = 'PAYMENT_CONFIRM',
  PaymentListGateways = 'PAYMENT_LIST_GATEWAYS',
  PaymentProcess = 'PAYMENT_PROCESS',
  PaymentRefund = 'PAYMENT_REFUND',
  PaymentVoid = 'PAYMENT_VOID',
  /** A new product is created. */
  ProductCreated = 'PRODUCT_CREATED',
  /** A product is deleted. */
  ProductDeleted = 'PRODUCT_DELETED',
  /** A product is updated. */
  ProductUpdated = 'PRODUCT_UPDATED',
  /** A new product variant is created. */
  ProductVariantCreated = 'PRODUCT_VARIANT_CREATED',
  /** A product variant is deleted. */
  ProductVariantDeleted = 'PRODUCT_VARIANT_DELETED',
  /** A product variant is updated. */
  ProductVariantUpdated = 'PRODUCT_VARIANT_UPDATED',
  TranslationCreated = 'TRANSLATION_CREATED',
  TranslationUpdated = 'TRANSLATION_UPDATED'
}

/** An enumeration. */
export enum WebhookSampleEventTypeEnum {
  CheckoutCreated = 'CHECKOUT_CREATED',
  CheckoutUpdated = 'CHECKOUT_UPDATED',
  CustomerCreated = 'CUSTOMER_CREATED',
  CustomerUpdated = 'CUSTOMER_UPDATED',
  DraftOrderCreated = 'DRAFT_ORDER_CREATED',
  DraftOrderDeleted = 'DRAFT_ORDER_DELETED',
  DraftOrderUpdated = 'DRAFT_ORDER_UPDATED',
  FulfillmentCreated = 'FULFILLMENT_CREATED',
  InvoiceDeleted = 'INVOICE_DELETED',
  InvoiceRequested = 'INVOICE_REQUESTED',
  InvoiceSent = 'INVOICE_SENT',
  NotifyUser = 'NOTIFY_USER',
  OrderCancelled = 'ORDER_CANCELLED',
  OrderConfirmed = 'ORDER_CONFIRMED',
  OrderCreated = 'ORDER_CREATED',
  OrderFulfilled = 'ORDER_FULFILLED',
  OrderFullyPaid = 'ORDER_FULLY_PAID',
  OrderUpdated = 'ORDER_UPDATED',
  PageCreated = 'PAGE_CREATED',
  PageDeleted = 'PAGE_DELETED',
  PageUpdated = 'PAGE_UPDATED',
  PaymentAuthorize = 'PAYMENT_AUTHORIZE',
  PaymentCapture = 'PAYMENT_CAPTURE',
  PaymentConfirm = 'PAYMENT_CONFIRM',
  PaymentListGateways = 'PAYMENT_LIST_GATEWAYS',
  PaymentProcess = 'PAYMENT_PROCESS',
  PaymentRefund = 'PAYMENT_REFUND',
  PaymentVoid = 'PAYMENT_VOID',
  ProductCreated = 'PRODUCT_CREATED',
  ProductDeleted = 'PRODUCT_DELETED',
  ProductUpdated = 'PRODUCT_UPDATED',
  ProductVariantCreated = 'PRODUCT_VARIANT_CREATED',
  ProductVariantDeleted = 'PRODUCT_VARIANT_DELETED',
  ProductVariantUpdated = 'PRODUCT_VARIANT_UPDATED',
  TranslationCreated = 'TRANSLATION_CREATED',
  TranslationUpdated = 'TRANSLATION_UPDATED'
}

/** Updates a webhook subscription. */
export type WebhookUpdate = {
  __typename?: 'WebhookUpdate';
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: Array<WebhookError>;
};

export type WebhookUpdateInput = {
  /** ID of the app to which webhook belongs. */
  app?: InputMaybe<Scalars['ID']>;
  /** The events that webhook wants to subscribe. */
  events?: InputMaybe<Array<InputMaybe<WebhookEventTypeEnum>>>;
  /** Determine if webhook will be set active or not. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** The new name of the webhook. */
  name?: InputMaybe<Scalars['String']>;
  /** Use to create a hash signature with each payload. */
  secretKey?: InputMaybe<Scalars['String']>;
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
export enum WeightUnitsEnum {
  G = 'G',
  Kg = 'KG',
  Lb = 'LB',
  Oz = 'OZ',
  Tonne = 'TONNE'
}

export type _Entity = Address | App | Category | Collection | Group | PageType | Product | ProductMedia | ProductType | ProductVariant | User;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export type AddressDetailsFragment = { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } };

export type CategoryBasicFragment = { __typename?: 'Category', id: string, name: string, slug: string };

export type CategoryDetailsFragment = { __typename?: 'Category', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: string | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, ancestors?: { __typename?: 'CategoryCountableConnection', edges: Array<{ __typename?: 'CategoryCountableEdge', node: { __typename?: 'Category', id: string, name: string, slug: string } }> } | null | undefined };

export type CheckoutDetailsFragment = { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined };

export type CheckoutLineDetailsFragment = { __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } };

export type CollectionBasicFragment = { __typename?: 'Collection', id: string, name: string, slug: string };

export type CollectionDetailsFragment = { __typename?: 'Collection', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: string | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined };

export type DeliveryMethodFragment = { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined };

export type ErrorDetailsFragment = { __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: CheckoutErrorCode };

export type ImageFragment = { __typename?: 'Image', url: string, alt?: string | null | undefined };

export type MainMenuItemFragment = { __typename?: 'MenuItem', name: string, children?: Array<{ __typename?: 'MenuItem', name: string, category?: { __typename?: 'Category', slug: string } | null | undefined, collection?: { __typename?: 'Collection', slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, title: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, slug: string, created: any, content?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type MenuItemFragment = { __typename?: 'MenuItem', id: string, name: string, category?: { __typename?: 'Category', id: string, slug: string } | null | undefined, collection?: { __typename?: 'Collection', id: string, slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, slug: string, content?: string | null | undefined } | null | undefined };

export type OrderDetailsFragment = { __typename?: 'Order', id: string, token: string, created: any, number?: string | null | undefined, status: OrderStatus, total: { __typename?: 'TaxedMoney', currency: string, gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } };

export type PageInfoFragment = { __typename?: 'PageInfo', hasNextPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined };

export type PriceFragment = { __typename?: 'Money', currency: string, amount: number, localizedAmount: string };

export type ProductCardFragment = { __typename?: 'Product', id: string, slug: string, name: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, category?: { __typename?: 'Category', name: string } | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', onSale?: boolean | null | undefined, priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, stop?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined };

export type ProductDetailsFragment = { __typename?: 'Product', id: string, name: string, slug: string, description?: string | null | undefined, seoDescription?: string | null | undefined, seoTitle?: string | null | undefined, isAvailableForPurchase?: boolean | null | undefined, attributes: Array<{ __typename?: 'SelectedAttribute', attribute: { __typename?: 'Attribute', name?: string | null | undefined, type?: AttributeTypeEnum | null | undefined, unit?: MeasurementUnitsEnum | null | undefined }, values: Array<{ __typename?: 'AttributeValue', name?: string | null | undefined, value?: string | null | undefined } | null | undefined> }>, category?: { __typename?: 'Category', name: string, id: string, slug: string } | null | undefined, variants?: Array<{ __typename?: 'ProductVariant', id: string, name: string, quantityAvailable: number, attributes: Array<{ __typename?: 'SelectedAttribute', attribute: { __typename?: 'Attribute', name?: string | null | undefined, type?: AttributeTypeEnum | null | undefined, unit?: MeasurementUnitsEnum | null | undefined }, values: Array<{ __typename?: 'AttributeValue', name?: string | null | undefined, value?: string | null | undefined } | null | undefined> }>, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: ProductMediaType }> | null | undefined } | null | undefined> | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: ProductMediaType }> | null | undefined, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined };

export type ProductMediaFragment = { __typename?: 'ProductMedia', url: string, alt: string, type: ProductMediaType };

export type ProductVariantDetailsFragment = { __typename?: 'ProductVariant', id: string, name: string, quantityAvailable: number, attributes: Array<{ __typename?: 'SelectedAttribute', attribute: { __typename?: 'Attribute', name?: string | null | undefined, type?: AttributeTypeEnum | null | undefined, unit?: MeasurementUnitsEnum | null | undefined }, values: Array<{ __typename?: 'AttributeValue', name?: string | null | undefined, value?: string | null | undefined } | null | undefined> }>, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: ProductMediaType }> | null | undefined };

export type SelectedAttributeDetailsFragment = { __typename?: 'SelectedAttribute', attribute: { __typename?: 'Attribute', name?: string | null | undefined, type?: AttributeTypeEnum | null | undefined, unit?: MeasurementUnitsEnum | null | undefined }, values: Array<{ __typename?: 'AttributeValue', name?: string | null | undefined, value?: string | null | undefined } | null | undefined> };

export type AddressDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AddressDeleteMutation = { __typename?: 'Mutation', accountAddressDelete?: { __typename?: 'AccountAddressDelete', user?: { __typename?: 'User', addresses?: Array<{ __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined> | null | undefined } | null | undefined } | null | undefined };

export type AddressSetDefaultMutationVariables = Exact<{
  addressID: Scalars['ID'];
  userID: Scalars['ID'];
  addressType: AddressTypeEnum;
}>;


export type AddressSetDefaultMutation = { __typename?: 'Mutation', addressSetDefault?: { __typename?: 'AddressSetDefault', errors: Array<{ __typename?: 'AccountError', field?: string | null | undefined, message?: string | null | undefined, code: AccountErrorCode }> } | null | undefined };

export type CheckoutAddProductLineMutationVariables = Exact<{
  checkoutToken: Scalars['UUID'];
  variantId: Scalars['ID'];
}>;


export type CheckoutAddProductLineMutation = { __typename?: 'Mutation', checkoutLinesAdd?: { __typename?: 'CheckoutLinesAdd', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', message?: string | null | undefined, code: CheckoutErrorCode }> } | null | undefined };

export type CheckoutAddPromoCodeMutationVariables = Exact<{
  token: Scalars['UUID'];
  promoCode: Scalars['String'];
}>;


export type CheckoutAddPromoCodeMutation = { __typename?: 'Mutation', checkoutAddPromoCode?: { __typename?: 'CheckoutAddPromoCode', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', message?: string | null | undefined, field?: string | null | undefined }> } | null | undefined };

export type CheckoutBillingAddressUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  address: AddressInput;
}>;


export type CheckoutBillingAddressUpdateMutation = { __typename?: 'Mutation', checkoutBillingAddressUpdate?: { __typename?: 'CheckoutBillingAddressUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: CheckoutErrorCode }> } | null | undefined };

export type CheckoutCompleteMutationVariables = Exact<{
  checkoutToken: Scalars['UUID'];
  paymentData?: InputMaybe<Scalars['JSONString']>;
}>;


export type CheckoutCompleteMutation = { __typename?: 'Mutation', checkoutComplete?: { __typename?: 'CheckoutComplete', confirmationNeeded: boolean, confirmationData?: string | null | undefined, order?: { __typename?: 'Order', id: string, status: OrderStatus, token: string, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, variants?: Array<string> | null | undefined, addressType?: AddressTypeEnum | null | undefined }> } | null | undefined };

export type CreateCheckoutMutationVariables = Exact<{
  email: Scalars['String'];
  lines: Array<CheckoutLineInput> | CheckoutLineInput;
  channel: Scalars['String'];
}>;


export type CreateCheckoutMutation = { __typename?: 'Mutation', checkoutCreate?: { __typename?: 'CheckoutCreate', checkout?: { __typename?: 'Checkout', id: string, token: any } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: CheckoutErrorCode }> } | null | undefined };

export type CheckoutPaymentCreateMutationVariables = Exact<{
  checkoutToken: Scalars['UUID'];
  paymentInput: PaymentInput;
}>;


export type CheckoutPaymentCreateMutation = { __typename?: 'Mutation', checkoutPaymentCreate?: { __typename?: 'CheckoutPaymentCreate', payment?: { __typename?: 'Payment', id: string, total?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'PaymentError', field?: string | null | undefined, message?: string | null | undefined }> } | null | undefined };

export type CheckoutEmailUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  email: Scalars['String'];
}>;


export type CheckoutEmailUpdateMutation = { __typename?: 'Mutation', checkoutEmailUpdate?: { __typename?: 'CheckoutEmailUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined }> } | null | undefined };

export type CheckoutLineUpdateMutationVariables = Exact<{
  token?: InputMaybe<Scalars['UUID']>;
  lines: Array<CheckoutLineInput> | CheckoutLineInput;
}>;


export type CheckoutLineUpdateMutation = { __typename?: 'Mutation', checkoutLinesUpdate?: { __typename?: 'CheckoutLinesUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: CheckoutErrorCode }> } | null | undefined };

export type RemoveProductFromCheckoutMutationVariables = Exact<{
  checkoutToken: Scalars['UUID'];
  lineId: Scalars['ID'];
}>;


export type RemoveProductFromCheckoutMutation = { __typename?: 'Mutation', checkoutLineDelete?: { __typename?: 'CheckoutLineDelete', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined }> } | null | undefined };

export type CheckoutShippingAddressUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  address: AddressInput;
}>;


export type CheckoutShippingAddressUpdateMutation = { __typename?: 'Mutation', checkoutShippingAddressUpdate?: { __typename?: 'CheckoutShippingAddressUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: CheckoutErrorCode }> } | null | undefined };

export type CheckoutShippingMethodUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  shippingMethodId: Scalars['ID'];
}>;


export type CheckoutShippingMethodUpdateMutation = { __typename?: 'Mutation', checkoutShippingMethodUpdate?: { __typename?: 'CheckoutShippingMethodUpdate', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined, errors: Array<{ __typename?: 'CheckoutError', field?: string | null | undefined, message?: string | null | undefined, code: CheckoutErrorCode }> } | null | undefined };

export type SetAddressDefaultMutationVariables = Exact<{
  id: Scalars['ID'];
  type: AddressTypeEnum;
}>;


export type SetAddressDefaultMutation = { __typename?: 'Mutation', accountSetDefaultAddress?: { __typename?: 'AccountSetDefaultAddress', user?: { __typename?: 'User', addresses?: Array<{ __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined> | null | undefined } | null | undefined, errors: Array<{ __typename?: 'AccountError', code: AccountErrorCode, message?: string | null | undefined }> } | null | undefined };

export type PasswordChangeMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type PasswordChangeMutation = { __typename?: 'Mutation', passwordChange?: { __typename?: 'PasswordChange', user?: { __typename?: 'User', email: string } | null | undefined, errors: Array<{ __typename?: 'AccountError', field?: string | null | undefined, message?: string | null | undefined, code: AccountErrorCode }> } | null | undefined };

export type RequestEmailChangeMutationVariables = Exact<{
  newEmail: Scalars['String'];
  password: Scalars['String'];
  redirectUrl: Scalars['String'];
}>;


export type RequestEmailChangeMutation = { __typename?: 'Mutation', requestEmailChange?: { __typename?: 'RequestEmailChange', user?: { __typename?: 'User', email: string } | null | undefined, errors: Array<{ __typename?: 'AccountError', field?: string | null | undefined, message?: string | null | undefined, code: AccountErrorCode }> } | null | undefined };

export type AvailableShippingMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableShippingMethodsQuery = { __typename?: 'Query', shop: { __typename?: 'Shop', availableShippingMethods?: Array<{ __typename?: 'ShippingMethod', id: string, name: string, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined> | null | undefined } };

export type CategoryBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type CategoryBySlugQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: string | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, ancestors?: { __typename?: 'CategoryCountableConnection', edges: Array<{ __typename?: 'CategoryCountableEdge', node: { __typename?: 'Category', id: string, name: string, slug: string } }> } | null | undefined } | null | undefined };

export type CategoryPathsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
}>;


export type CategoryPathsQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryCountableConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, edges: Array<{ __typename?: 'CategoryCountableEdge', node: { __typename?: 'Category', slug: string } }> } | null | undefined };

export type CheckoutByTokenQueryVariables = Exact<{
  checkoutToken: Scalars['UUID'];
}>;


export type CheckoutByTokenQuery = { __typename?: 'Query', checkout?: { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, discountName?: string | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, shippingMethod?: { __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined, availableShippingMethods: Array<{ __typename?: 'ShippingMethod', id: string, name: string, minimumDeliveryDays?: number | null | undefined, maximumDeliveryDays?: number | null | undefined, price?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined } | null | undefined>, availablePaymentGateways: Array<{ __typename?: 'PaymentGateway', id: string, name: string, config: Array<{ __typename?: 'GatewayConfigLine', field: string, value?: string | null | undefined }> }>, lines?: Array<{ __typename?: 'CheckoutLine', id: string, quantity: number, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, variant: { __typename?: 'ProductVariant', id: string, name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined }, pricing?: { __typename?: 'VariantPricingInfo', price?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } } | null | undefined> | null | undefined, discount?: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } | null | undefined, subtotalPrice?: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, shippingPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, totalPrice?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined };

export type CollectionBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type CollectionBySlugQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, description?: string | null | undefined, name: string, slug: string, backgroundImage?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined } | null | undefined };

export type CollectionPathsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  channel: Scalars['String'];
}>;


export type CollectionPathsQuery = { __typename?: 'Query', collections?: { __typename?: 'CollectionCountableConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, edges: Array<{ __typename?: 'CollectionCountableEdge', node: { __typename?: 'Collection', slug: string } }> } | null | undefined };

export type CurrentUserDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserDetailsQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, lastLogin?: any | null | undefined, dateJoined: any, email: string, firstName: string, lastName: string, avatar?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, orders?: { __typename?: 'OrderCountableConnection', totalCount?: number | null | undefined } | null | undefined } | null | undefined };

export type MainMenuQueryVariables = Exact<{ [key: string]: never; }>;


export type MainMenuQuery = { __typename?: 'Query', menu?: { __typename?: 'Menu', items?: Array<{ __typename?: 'MenuItem', name: string, children?: Array<{ __typename?: 'MenuItem', name: string, category?: { __typename?: 'Category', slug: string } | null | undefined, collection?: { __typename?: 'Collection', slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, title: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, slug: string, created: any, content?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type MenuQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type MenuQuery = { __typename?: 'Query', menu?: { __typename?: 'Menu', id: string, name: string, slug: string, items?: Array<{ __typename?: 'MenuItem', id: string, name: string, category?: { __typename?: 'Category', id: string, slug: string } | null | undefined, collection?: { __typename?: 'Collection', id: string, slug: string } | null | undefined, page?: { __typename?: 'Page', id: string, slug: string, content?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type OrderDetailsQueryVariables = Exact<{
  token: Scalars['UUID'];
}>;


export type OrderDetailsQuery = { __typename?: 'Query', orderByToken?: { __typename?: 'Order', id: string, number?: string | null | undefined, created: any, statusDisplay?: string | null | undefined, shippingPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, lines: Array<{ __typename?: 'OrderLine', id: string, productName: string, variantName: string, quantity: number, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined>, total: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined };

export type OrderDetailsByTokenQueryVariables = Exact<{
  token: Scalars['UUID'];
}>;


export type OrderDetailsByTokenQuery = { __typename?: 'Query', orderByToken?: { __typename?: 'Order', id: string, status: OrderStatus, number?: string | null | undefined, shippingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, billingAddress?: { __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined, subtotal: { __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, tax: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, total: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, lines: Array<{ __typename?: 'OrderLine', id: string, productName: string, variantName: string, quantity: number, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, unitPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } }, totalPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined>, shippingPrice: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } | null | undefined };

export type OrdersQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type OrdersQuery = { __typename?: 'Query', me?: { __typename?: 'User', orders?: { __typename?: 'OrderCountableConnection', totalCount?: number | null | undefined, edges: Array<{ __typename?: 'OrderCountableEdge', cursor: string, node: { __typename?: 'Order', id: string, token: string, created: any, number?: string | null | undefined, status: OrderStatus, total: { __typename?: 'TaxedMoney', currency: string, gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string }, net: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } | null | undefined };

export type PageQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type PageQuery = { __typename?: 'Query', page?: { __typename?: 'Page', id: string, title: string, seoTitle?: string | null | undefined, seoDescription?: string | null | undefined, slug: string, created: any, content?: string | null | undefined } | null | undefined };

export type PagePathsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
}>;


export type PagePathsQuery = { __typename?: 'Query', pages?: { __typename?: 'PageCountableConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, edges: Array<{ __typename?: 'PageCountableEdge', node: { __typename?: 'Page', slug: string } }> } | null | undefined };

export type ProductBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
  channel: Scalars['String'];
}>;


export type ProductBySlugQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, slug: string, description?: string | null | undefined, seoDescription?: string | null | undefined, seoTitle?: string | null | undefined, isAvailableForPurchase?: boolean | null | undefined, attributes: Array<{ __typename?: 'SelectedAttribute', attribute: { __typename?: 'Attribute', name?: string | null | undefined, type?: AttributeTypeEnum | null | undefined, unit?: MeasurementUnitsEnum | null | undefined }, values: Array<{ __typename?: 'AttributeValue', name?: string | null | undefined, value?: string | null | undefined } | null | undefined> }>, category?: { __typename?: 'Category', name: string, id: string, slug: string } | null | undefined, variants?: Array<{ __typename?: 'ProductVariant', id: string, name: string, quantityAvailable: number, attributes: Array<{ __typename?: 'SelectedAttribute', attribute: { __typename?: 'Attribute', name?: string | null | undefined, type?: AttributeTypeEnum | null | undefined, unit?: MeasurementUnitsEnum | null | undefined }, values: Array<{ __typename?: 'AttributeValue', name?: string | null | undefined, value?: string | null | undefined } | null | undefined> }>, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: ProductMediaType }> | null | undefined } | null | undefined> | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined, media?: Array<{ __typename?: 'ProductMedia', url: string, alt: string, type: ProductMediaType }> | null | undefined, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined } | null | undefined };

export type ProductCollectionQueryVariables = Exact<{
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<ProductFilterInput>;
  channel: Scalars['String'];
}>;


export type ProductCollectionQuery = { __typename?: 'Query', products?: { __typename?: 'ProductCountableConnection', totalCount?: number | null | undefined, edges: Array<{ __typename?: 'ProductCountableEdge', cursor: string, node: { __typename?: 'Product', id: string, slug: string, name: string, thumbnail?: { __typename?: 'Image', url: string, alt?: string | null | undefined } | null | undefined, category?: { __typename?: 'Category', name: string } | null | undefined, pricing?: { __typename?: 'ProductPricingInfo', onSale?: boolean | null | undefined, priceRange?: { __typename?: 'TaxedMoneyRange', start?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined, stop?: { __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number, localizedAmount: string } } | null | undefined } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined };

export type ProductPathsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']>;
  channel: Scalars['String'];
}>;


export type ProductPathsQuery = { __typename?: 'Query', products?: { __typename?: 'ProductCountableConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, edges: Array<{ __typename?: 'ProductCountableEdge', node: { __typename?: 'Product', slug: string } }> } | null | undefined };

export type CurrentUserAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserAddressesQuery = { __typename?: 'Query', me?: { __typename?: 'User', addresses?: Array<{ __typename?: 'Address', id: string, phone?: string | null | undefined, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, isDefaultBillingAddress?: boolean | null | undefined, isDefaultShippingAddress?: boolean | null | undefined, country: { __typename?: 'CountryDisplay', code: string, country: string } } | null | undefined> | null | undefined } | null | undefined };

export const CategoryBasicFragmentDoc = gql`
    fragment CategoryBasicFragment on Category {
  id
  name
  slug
}
    `;
export const ImageFragmentDoc = gql`
    fragment ImageFragment on Image {
  url
  alt
}
    `;
export const CategoryDetailsFragmentDoc = gql`
    fragment CategoryDetailsFragment on Category {
  id
  ...CategoryBasicFragment
  seoTitle
  seoDescription
  description
  backgroundImage {
    ...ImageFragment
  }
  ancestors(first: 5) {
    edges {
      node {
        ...CategoryBasicFragment
      }
    }
  }
}
    ${CategoryBasicFragmentDoc}
${ImageFragmentDoc}`;
export const AddressDetailsFragmentDoc = gql`
    fragment AddressDetailsFragment on Address {
  id
  phone
  firstName
  lastName
  streetAddress1
  city
  postalCode
  isDefaultBillingAddress
  isDefaultShippingAddress
  country {
    code
    country
  }
}
    `;
export const PriceFragmentDoc = gql`
    fragment PriceFragment on Money {
  currency
  amount
  localizedAmount @client
}
    `;
export const DeliveryMethodFragmentDoc = gql`
    fragment DeliveryMethodFragment on ShippingMethod {
  id
  name
  price {
    ...PriceFragment
  }
  minimumDeliveryDays
  maximumDeliveryDays
}
    ${PriceFragmentDoc}`;
export const CheckoutLineDetailsFragmentDoc = gql`
    fragment CheckoutLineDetailsFragment on CheckoutLine {
  id
  totalPrice {
    gross {
      ...PriceFragment
    }
  }
  variant {
    id
    product {
      id
      name
      slug
      thumbnail {
        ...ImageFragment
      }
    }
    pricing {
      price {
        gross {
          ...PriceFragment
        }
      }
    }
    name
  }
  quantity
}
    ${PriceFragmentDoc}
${ImageFragmentDoc}`;
export const CheckoutDetailsFragmentDoc = gql`
    fragment CheckoutDetailsFragment on Checkout {
  id
  token
  email
  billingAddress {
    ...AddressDetailsFragment
  }
  shippingAddress {
    ...AddressDetailsFragment
  }
  shippingMethod {
    ...DeliveryMethodFragment
  }
  isShippingRequired
  availableShippingMethods {
    ...DeliveryMethodFragment
  }
  availablePaymentGateways {
    id
    name
    config {
      field
      value
    }
  }
  lines {
    ...CheckoutLineDetailsFragment
  }
  discount {
    ...PriceFragment
  }
  discountName
  subtotalPrice {
    net {
      ...PriceFragment
    }
    tax {
      ...PriceFragment
    }
  }
  shippingPrice {
    gross {
      ...PriceFragment
    }
  }
  totalPrice {
    gross {
      ...PriceFragment
    }
  }
}
    ${AddressDetailsFragmentDoc}
${DeliveryMethodFragmentDoc}
${CheckoutLineDetailsFragmentDoc}
${PriceFragmentDoc}`;
export const CollectionBasicFragmentDoc = gql`
    fragment CollectionBasicFragment on Collection {
  id
  name
  slug
}
    `;
export const CollectionDetailsFragmentDoc = gql`
    fragment CollectionDetailsFragment on Collection {
  id
  ...CollectionBasicFragment
  seoTitle
  seoDescription
  description
  backgroundImage {
    ...ImageFragment
  }
}
    ${CollectionBasicFragmentDoc}
${ImageFragmentDoc}`;
export const ErrorDetailsFragmentDoc = gql`
    fragment ErrorDetailsFragment on CheckoutError {
  field
  message
  code
}
    `;
export const MainMenuItemFragmentDoc = gql`
    fragment MainMenuItemFragment on MenuItem {
  name
  children {
    name
    category {
      slug
    }
    collection {
      slug
    }
    page {
      id
      title
      seoTitle
      seoDescription
      slug
      created
      content
    }
  }
}
    `;
export const MenuItemFragmentDoc = gql`
    fragment MenuItemFragment on MenuItem {
  id
  name
  category {
    id
    slug
  }
  collection {
    id
    slug
  }
  page {
    id
    slug
    content
  }
}
    `;
export const OrderDetailsFragmentDoc = gql`
    fragment OrderDetailsFragment on Order {
  id
  token
  created
  number
  status
  total {
    currency
    gross {
      ...PriceFragment
    }
    net {
      ...PriceFragment
    }
  }
}
    ${PriceFragmentDoc}`;
export const PageInfoFragmentDoc = gql`
    fragment PageInfoFragment on PageInfo {
  hasNextPage
  startCursor
  endCursor
}
    `;
export const ProductCardFragmentDoc = gql`
    fragment ProductCardFragment on Product {
  id
  slug
  name
  thumbnail {
    ...ImageFragment
  }
  category {
    name
  }
  pricing {
    onSale
    priceRange {
      start {
        gross {
          ...PriceFragment
        }
      }
      stop {
        gross {
          ...PriceFragment
        }
      }
    }
  }
}
    ${ImageFragmentDoc}
${PriceFragmentDoc}`;
export const SelectedAttributeDetailsFragmentDoc = gql`
    fragment SelectedAttributeDetailsFragment on SelectedAttribute {
  attribute {
    name
    type
    unit
  }
  values {
    name
    value
  }
}
    `;
export const ProductMediaFragmentDoc = gql`
    fragment ProductMediaFragment on ProductMedia {
  url
  alt
  type
}
    `;
export const ProductVariantDetailsFragmentDoc = gql`
    fragment ProductVariantDetailsFragment on ProductVariant {
  id
  name
  quantityAvailable
  attributes {
    ...SelectedAttributeDetailsFragment
  }
  media {
    ...ProductMediaFragment
  }
}
    ${SelectedAttributeDetailsFragmentDoc}
${ProductMediaFragmentDoc}`;
export const ProductDetailsFragmentDoc = gql`
    fragment ProductDetailsFragment on Product {
  id
  name
  slug
  description
  seoDescription
  seoTitle
  isAvailableForPurchase
  attributes {
    ...SelectedAttributeDetailsFragment
  }
  category {
    ...CategoryBasicFragment
  }
  variants {
    ...ProductVariantDetailsFragment
  }
  pricing {
    priceRange {
      start {
        gross {
          ...PriceFragment
        }
      }
    }
  }
  media {
    ...ProductMediaFragment
  }
  thumbnail {
    ...ImageFragment
  }
  category {
    name
  }
}
    ${SelectedAttributeDetailsFragmentDoc}
${CategoryBasicFragmentDoc}
${ProductVariantDetailsFragmentDoc}
${PriceFragmentDoc}
${ProductMediaFragmentDoc}
${ImageFragmentDoc}`;
export const AddressDeleteDocument = gql`
    mutation AddressDelete($id: ID!) {
  accountAddressDelete(id: $id) {
    user {
      addresses {
        ...AddressDetailsFragment
      }
    }
  }
}
    ${AddressDetailsFragmentDoc}`;
export type AddressDeleteMutationFn = Apollo.MutationFunction<AddressDeleteMutation, AddressDeleteMutationVariables>;

/**
 * __useAddressDeleteMutation__
 *
 * To run a mutation, you first call `useAddressDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddressDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addressDeleteMutation, { data, loading, error }] = useAddressDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAddressDeleteMutation(baseOptions?: Apollo.MutationHookOptions<AddressDeleteMutation, AddressDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddressDeleteMutation, AddressDeleteMutationVariables>(AddressDeleteDocument, options);
      }
export type AddressDeleteMutationHookResult = ReturnType<typeof useAddressDeleteMutation>;
export type AddressDeleteMutationResult = Apollo.MutationResult<AddressDeleteMutation>;
export type AddressDeleteMutationOptions = Apollo.BaseMutationOptions<AddressDeleteMutation, AddressDeleteMutationVariables>;
export const AddressSetDefaultDocument = gql`
    mutation AddressSetDefault($addressID: ID!, $userID: ID!, $addressType: AddressTypeEnum!) {
  addressSetDefault(addressId: $addressID, type: $addressType, userId: $userID) {
    errors {
      field
      message
      code
    }
  }
}
    `;
export type AddressSetDefaultMutationFn = Apollo.MutationFunction<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>;

/**
 * __useAddressSetDefaultMutation__
 *
 * To run a mutation, you first call `useAddressSetDefaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddressSetDefaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addressSetDefaultMutation, { data, loading, error }] = useAddressSetDefaultMutation({
 *   variables: {
 *      addressID: // value for 'addressID'
 *      userID: // value for 'userID'
 *      addressType: // value for 'addressType'
 *   },
 * });
 */
export function useAddressSetDefaultMutation(baseOptions?: Apollo.MutationHookOptions<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>(AddressSetDefaultDocument, options);
      }
export type AddressSetDefaultMutationHookResult = ReturnType<typeof useAddressSetDefaultMutation>;
export type AddressSetDefaultMutationResult = Apollo.MutationResult<AddressSetDefaultMutation>;
export type AddressSetDefaultMutationOptions = Apollo.BaseMutationOptions<AddressSetDefaultMutation, AddressSetDefaultMutationVariables>;
export const CheckoutAddProductLineDocument = gql`
    mutation CheckoutAddProductLine($checkoutToken: UUID!, $variantId: ID!) {
  checkoutLinesAdd(
    token: $checkoutToken
    lines: [{quantity: 1, variantId: $variantId}]
  ) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      message
      code
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type CheckoutAddProductLineMutationFn = Apollo.MutationFunction<CheckoutAddProductLineMutation, CheckoutAddProductLineMutationVariables>;

/**
 * __useCheckoutAddProductLineMutation__
 *
 * To run a mutation, you first call `useCheckoutAddProductLineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutAddProductLineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutAddProductLineMutation, { data, loading, error }] = useCheckoutAddProductLineMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      variantId: // value for 'variantId'
 *   },
 * });
 */
export function useCheckoutAddProductLineMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutAddProductLineMutation, CheckoutAddProductLineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutAddProductLineMutation, CheckoutAddProductLineMutationVariables>(CheckoutAddProductLineDocument, options);
      }
export type CheckoutAddProductLineMutationHookResult = ReturnType<typeof useCheckoutAddProductLineMutation>;
export type CheckoutAddProductLineMutationResult = Apollo.MutationResult<CheckoutAddProductLineMutation>;
export type CheckoutAddProductLineMutationOptions = Apollo.BaseMutationOptions<CheckoutAddProductLineMutation, CheckoutAddProductLineMutationVariables>;
export const CheckoutAddPromoCodeDocument = gql`
    mutation CheckoutAddPromoCode($token: UUID!, $promoCode: String!) {
  checkoutAddPromoCode(token: $token, promoCode: $promoCode) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      message
      field
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type CheckoutAddPromoCodeMutationFn = Apollo.MutationFunction<CheckoutAddPromoCodeMutation, CheckoutAddPromoCodeMutationVariables>;

/**
 * __useCheckoutAddPromoCodeMutation__
 *
 * To run a mutation, you first call `useCheckoutAddPromoCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutAddPromoCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutAddPromoCodeMutation, { data, loading, error }] = useCheckoutAddPromoCodeMutation({
 *   variables: {
 *      token: // value for 'token'
 *      promoCode: // value for 'promoCode'
 *   },
 * });
 */
export function useCheckoutAddPromoCodeMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutAddPromoCodeMutation, CheckoutAddPromoCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutAddPromoCodeMutation, CheckoutAddPromoCodeMutationVariables>(CheckoutAddPromoCodeDocument, options);
      }
export type CheckoutAddPromoCodeMutationHookResult = ReturnType<typeof useCheckoutAddPromoCodeMutation>;
export type CheckoutAddPromoCodeMutationResult = Apollo.MutationResult<CheckoutAddPromoCodeMutation>;
export type CheckoutAddPromoCodeMutationOptions = Apollo.BaseMutationOptions<CheckoutAddPromoCodeMutation, CheckoutAddPromoCodeMutationVariables>;
export const CheckoutBillingAddressUpdateDocument = gql`
    mutation CheckoutBillingAddressUpdate($token: UUID!, $address: AddressInput!) {
  checkoutBillingAddressUpdate(billingAddress: $address, token: $token) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
      code
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type CheckoutBillingAddressUpdateMutationFn = Apollo.MutationFunction<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>;

/**
 * __useCheckoutBillingAddressUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutBillingAddressUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutBillingAddressUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutBillingAddressUpdateMutation, { data, loading, error }] = useCheckoutBillingAddressUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCheckoutBillingAddressUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>(CheckoutBillingAddressUpdateDocument, options);
      }
export type CheckoutBillingAddressUpdateMutationHookResult = ReturnType<typeof useCheckoutBillingAddressUpdateMutation>;
export type CheckoutBillingAddressUpdateMutationResult = Apollo.MutationResult<CheckoutBillingAddressUpdateMutation>;
export type CheckoutBillingAddressUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutBillingAddressUpdateMutation, CheckoutBillingAddressUpdateMutationVariables>;
export const CheckoutCompleteDocument = gql`
    mutation checkoutComplete($checkoutToken: UUID!, $paymentData: JSONString) {
  checkoutComplete(token: $checkoutToken, paymentData: $paymentData) {
    order {
      id
      status
      token
      billingAddress {
        id
        ...AddressDetailsFragment
      }
      shippingAddress {
        id
        ...AddressDetailsFragment
      }
    }
    confirmationNeeded
    confirmationData
    errors {
      field
      message
      variants
      addressType
    }
  }
}
    ${AddressDetailsFragmentDoc}`;
export type CheckoutCompleteMutationFn = Apollo.MutationFunction<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>;

/**
 * __useCheckoutCompleteMutation__
 *
 * To run a mutation, you first call `useCheckoutCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutCompleteMutation, { data, loading, error }] = useCheckoutCompleteMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      paymentData: // value for 'paymentData'
 *   },
 * });
 */
export function useCheckoutCompleteMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>(CheckoutCompleteDocument, options);
      }
export type CheckoutCompleteMutationHookResult = ReturnType<typeof useCheckoutCompleteMutation>;
export type CheckoutCompleteMutationResult = Apollo.MutationResult<CheckoutCompleteMutation>;
export type CheckoutCompleteMutationOptions = Apollo.BaseMutationOptions<CheckoutCompleteMutation, CheckoutCompleteMutationVariables>;
export const CreateCheckoutDocument = gql`
    mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!, $channel: String!) {
  checkoutCreate(input: {channel: $channel, email: $email, lines: $lines}) {
    checkout {
      id
      token
    }
    errors {
      field
      message
      code
    }
  }
}
    `;
export type CreateCheckoutMutationFn = Apollo.MutationFunction<CreateCheckoutMutation, CreateCheckoutMutationVariables>;

/**
 * __useCreateCheckoutMutation__
 *
 * To run a mutation, you first call `useCreateCheckoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCheckoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCheckoutMutation, { data, loading, error }] = useCreateCheckoutMutation({
 *   variables: {
 *      email: // value for 'email'
 *      lines: // value for 'lines'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useCreateCheckoutMutation(baseOptions?: Apollo.MutationHookOptions<CreateCheckoutMutation, CreateCheckoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCheckoutMutation, CreateCheckoutMutationVariables>(CreateCheckoutDocument, options);
      }
export type CreateCheckoutMutationHookResult = ReturnType<typeof useCreateCheckoutMutation>;
export type CreateCheckoutMutationResult = Apollo.MutationResult<CreateCheckoutMutation>;
export type CreateCheckoutMutationOptions = Apollo.BaseMutationOptions<CreateCheckoutMutation, CreateCheckoutMutationVariables>;
export const CheckoutPaymentCreateDocument = gql`
    mutation checkoutPaymentCreate($checkoutToken: UUID!, $paymentInput: PaymentInput!) {
  checkoutPaymentCreate(token: $checkoutToken, input: $paymentInput) {
    payment {
      id
      total {
        ...PriceFragment
      }
    }
    errors {
      field
      message
    }
  }
}
    ${PriceFragmentDoc}`;
export type CheckoutPaymentCreateMutationFn = Apollo.MutationFunction<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>;

/**
 * __useCheckoutPaymentCreateMutation__
 *
 * To run a mutation, you first call `useCheckoutPaymentCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutPaymentCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutPaymentCreateMutation, { data, loading, error }] = useCheckoutPaymentCreateMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      paymentInput: // value for 'paymentInput'
 *   },
 * });
 */
export function useCheckoutPaymentCreateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>(CheckoutPaymentCreateDocument, options);
      }
export type CheckoutPaymentCreateMutationHookResult = ReturnType<typeof useCheckoutPaymentCreateMutation>;
export type CheckoutPaymentCreateMutationResult = Apollo.MutationResult<CheckoutPaymentCreateMutation>;
export type CheckoutPaymentCreateMutationOptions = Apollo.BaseMutationOptions<CheckoutPaymentCreateMutation, CheckoutPaymentCreateMutationVariables>;
export const CheckoutEmailUpdateDocument = gql`
    mutation CheckoutEmailUpdate($token: UUID!, $email: String!) {
  checkoutEmailUpdate(email: $email, token: $token) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type CheckoutEmailUpdateMutationFn = Apollo.MutationFunction<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>;

/**
 * __useCheckoutEmailUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutEmailUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutEmailUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutEmailUpdateMutation, { data, loading, error }] = useCheckoutEmailUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCheckoutEmailUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>(CheckoutEmailUpdateDocument, options);
      }
export type CheckoutEmailUpdateMutationHookResult = ReturnType<typeof useCheckoutEmailUpdateMutation>;
export type CheckoutEmailUpdateMutationResult = Apollo.MutationResult<CheckoutEmailUpdateMutation>;
export type CheckoutEmailUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutEmailUpdateMutation, CheckoutEmailUpdateMutationVariables>;
export const CheckoutLineUpdateDocument = gql`
    mutation CheckoutLineUpdate($token: UUID, $lines: [CheckoutLineInput!]!) {
  checkoutLinesUpdate(token: $token, lines: $lines) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      ...ErrorDetailsFragment
    }
  }
}
    ${CheckoutDetailsFragmentDoc}
${ErrorDetailsFragmentDoc}`;
export type CheckoutLineUpdateMutationFn = Apollo.MutationFunction<CheckoutLineUpdateMutation, CheckoutLineUpdateMutationVariables>;

/**
 * __useCheckoutLineUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutLineUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutLineUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutLineUpdateMutation, { data, loading, error }] = useCheckoutLineUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      lines: // value for 'lines'
 *   },
 * });
 */
export function useCheckoutLineUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutLineUpdateMutation, CheckoutLineUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutLineUpdateMutation, CheckoutLineUpdateMutationVariables>(CheckoutLineUpdateDocument, options);
      }
export type CheckoutLineUpdateMutationHookResult = ReturnType<typeof useCheckoutLineUpdateMutation>;
export type CheckoutLineUpdateMutationResult = Apollo.MutationResult<CheckoutLineUpdateMutation>;
export type CheckoutLineUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutLineUpdateMutation, CheckoutLineUpdateMutationVariables>;
export const RemoveProductFromCheckoutDocument = gql`
    mutation RemoveProductFromCheckout($checkoutToken: UUID!, $lineId: ID!) {
  checkoutLineDelete(token: $checkoutToken, lineId: $lineId) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type RemoveProductFromCheckoutMutationFn = Apollo.MutationFunction<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>;

/**
 * __useRemoveProductFromCheckoutMutation__
 *
 * To run a mutation, you first call `useRemoveProductFromCheckoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProductFromCheckoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProductFromCheckoutMutation, { data, loading, error }] = useRemoveProductFromCheckoutMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      lineId: // value for 'lineId'
 *   },
 * });
 */
export function useRemoveProductFromCheckoutMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>(RemoveProductFromCheckoutDocument, options);
      }
export type RemoveProductFromCheckoutMutationHookResult = ReturnType<typeof useRemoveProductFromCheckoutMutation>;
export type RemoveProductFromCheckoutMutationResult = Apollo.MutationResult<RemoveProductFromCheckoutMutation>;
export type RemoveProductFromCheckoutMutationOptions = Apollo.BaseMutationOptions<RemoveProductFromCheckoutMutation, RemoveProductFromCheckoutMutationVariables>;
export const CheckoutShippingAddressUpdateDocument = gql`
    mutation CheckoutShippingAddressUpdate($token: UUID!, $address: AddressInput!) {
  checkoutShippingAddressUpdate(shippingAddress: $address, token: $token) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
      code
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type CheckoutShippingAddressUpdateMutationFn = Apollo.MutationFunction<CheckoutShippingAddressUpdateMutation, CheckoutShippingAddressUpdateMutationVariables>;

/**
 * __useCheckoutShippingAddressUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutShippingAddressUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutShippingAddressUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutShippingAddressUpdateMutation, { data, loading, error }] = useCheckoutShippingAddressUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCheckoutShippingAddressUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutShippingAddressUpdateMutation, CheckoutShippingAddressUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutShippingAddressUpdateMutation, CheckoutShippingAddressUpdateMutationVariables>(CheckoutShippingAddressUpdateDocument, options);
      }
export type CheckoutShippingAddressUpdateMutationHookResult = ReturnType<typeof useCheckoutShippingAddressUpdateMutation>;
export type CheckoutShippingAddressUpdateMutationResult = Apollo.MutationResult<CheckoutShippingAddressUpdateMutation>;
export type CheckoutShippingAddressUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutShippingAddressUpdateMutation, CheckoutShippingAddressUpdateMutationVariables>;
export const CheckoutShippingMethodUpdateDocument = gql`
    mutation CheckoutShippingMethodUpdate($token: UUID!, $shippingMethodId: ID!) {
  checkoutShippingMethodUpdate(shippingMethodId: $shippingMethodId, token: $token) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      field
      message
      code
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type CheckoutShippingMethodUpdateMutationFn = Apollo.MutationFunction<CheckoutShippingMethodUpdateMutation, CheckoutShippingMethodUpdateMutationVariables>;

/**
 * __useCheckoutShippingMethodUpdateMutation__
 *
 * To run a mutation, you first call `useCheckoutShippingMethodUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutShippingMethodUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutShippingMethodUpdateMutation, { data, loading, error }] = useCheckoutShippingMethodUpdateMutation({
 *   variables: {
 *      token: // value for 'token'
 *      shippingMethodId: // value for 'shippingMethodId'
 *   },
 * });
 */
export function useCheckoutShippingMethodUpdateMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutShippingMethodUpdateMutation, CheckoutShippingMethodUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutShippingMethodUpdateMutation, CheckoutShippingMethodUpdateMutationVariables>(CheckoutShippingMethodUpdateDocument, options);
      }
export type CheckoutShippingMethodUpdateMutationHookResult = ReturnType<typeof useCheckoutShippingMethodUpdateMutation>;
export type CheckoutShippingMethodUpdateMutationResult = Apollo.MutationResult<CheckoutShippingMethodUpdateMutation>;
export type CheckoutShippingMethodUpdateMutationOptions = Apollo.BaseMutationOptions<CheckoutShippingMethodUpdateMutation, CheckoutShippingMethodUpdateMutationVariables>;
export const SetAddressDefaultDocument = gql`
    mutation SetAddressDefault($id: ID!, $type: AddressTypeEnum!) {
  accountSetDefaultAddress(id: $id, type: $type) {
    user {
      addresses {
        ...AddressDetailsFragment
      }
    }
    errors {
      code
      message
    }
  }
}
    ${AddressDetailsFragmentDoc}`;
export type SetAddressDefaultMutationFn = Apollo.MutationFunction<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>;

/**
 * __useSetAddressDefaultMutation__
 *
 * To run a mutation, you first call `useSetAddressDefaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAddressDefaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAddressDefaultMutation, { data, loading, error }] = useSetAddressDefaultMutation({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSetAddressDefaultMutation(baseOptions?: Apollo.MutationHookOptions<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>(SetAddressDefaultDocument, options);
      }
export type SetAddressDefaultMutationHookResult = ReturnType<typeof useSetAddressDefaultMutation>;
export type SetAddressDefaultMutationResult = Apollo.MutationResult<SetAddressDefaultMutation>;
export type SetAddressDefaultMutationOptions = Apollo.BaseMutationOptions<SetAddressDefaultMutation, SetAddressDefaultMutationVariables>;
export const PasswordChangeDocument = gql`
    mutation PasswordChange($newPassword: String!, $oldPassword: String!) {
  passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
    user {
      email
    }
    errors {
      field
      message
      code
    }
  }
}
    `;
export type PasswordChangeMutationFn = Apollo.MutationFunction<PasswordChangeMutation, PasswordChangeMutationVariables>;

/**
 * __usePasswordChangeMutation__
 *
 * To run a mutation, you first call `usePasswordChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePasswordChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [passwordChangeMutation, { data, loading, error }] = usePasswordChangeMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      oldPassword: // value for 'oldPassword'
 *   },
 * });
 */
export function usePasswordChangeMutation(baseOptions?: Apollo.MutationHookOptions<PasswordChangeMutation, PasswordChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PasswordChangeMutation, PasswordChangeMutationVariables>(PasswordChangeDocument, options);
      }
export type PasswordChangeMutationHookResult = ReturnType<typeof usePasswordChangeMutation>;
export type PasswordChangeMutationResult = Apollo.MutationResult<PasswordChangeMutation>;
export type PasswordChangeMutationOptions = Apollo.BaseMutationOptions<PasswordChangeMutation, PasswordChangeMutationVariables>;
export const RequestEmailChangeDocument = gql`
    mutation RequestEmailChange($newEmail: String!, $password: String!, $redirectUrl: String!) {
  requestEmailChange(
    channel: "default-channel"
    newEmail: $newEmail
    password: $password
    redirectUrl: $redirectUrl
  ) {
    user {
      email
    }
    errors {
      field
      message
      code
    }
  }
}
    `;
export type RequestEmailChangeMutationFn = Apollo.MutationFunction<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>;

/**
 * __useRequestEmailChangeMutation__
 *
 * To run a mutation, you first call `useRequestEmailChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestEmailChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestEmailChangeMutation, { data, loading, error }] = useRequestEmailChangeMutation({
 *   variables: {
 *      newEmail: // value for 'newEmail'
 *      password: // value for 'password'
 *      redirectUrl: // value for 'redirectUrl'
 *   },
 * });
 */
export function useRequestEmailChangeMutation(baseOptions?: Apollo.MutationHookOptions<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>(RequestEmailChangeDocument, options);
      }
export type RequestEmailChangeMutationHookResult = ReturnType<typeof useRequestEmailChangeMutation>;
export type RequestEmailChangeMutationResult = Apollo.MutationResult<RequestEmailChangeMutation>;
export type RequestEmailChangeMutationOptions = Apollo.BaseMutationOptions<RequestEmailChangeMutation, RequestEmailChangeMutationVariables>;
export const AvailableShippingMethodsDocument = gql`
    query AvailableShippingMethods {
  shop {
    availableShippingMethods(channel: "default-channel") {
      id
      name
      price {
        ...PriceFragment
      }
    }
  }
}
    ${PriceFragmentDoc}`;

/**
 * __useAvailableShippingMethodsQuery__
 *
 * To run a query within a React component, call `useAvailableShippingMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableShippingMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableShippingMethodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableShippingMethodsQuery(baseOptions?: Apollo.QueryHookOptions<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>(AvailableShippingMethodsDocument, options);
      }
export function useAvailableShippingMethodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>(AvailableShippingMethodsDocument, options);
        }
export type AvailableShippingMethodsQueryHookResult = ReturnType<typeof useAvailableShippingMethodsQuery>;
export type AvailableShippingMethodsLazyQueryHookResult = ReturnType<typeof useAvailableShippingMethodsLazyQuery>;
export type AvailableShippingMethodsQueryResult = Apollo.QueryResult<AvailableShippingMethodsQuery, AvailableShippingMethodsQueryVariables>;
export const CategoryBySlugDocument = gql`
    query CategoryBySlug($slug: String!) {
  category(slug: $slug) {
    ...CategoryDetailsFragment
  }
}
    ${CategoryDetailsFragmentDoc}`;

/**
 * __useCategoryBySlugQuery__
 *
 * To run a query within a React component, call `useCategoryBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCategoryBySlugQuery(baseOptions: Apollo.QueryHookOptions<CategoryBySlugQuery, CategoryBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryBySlugQuery, CategoryBySlugQueryVariables>(CategoryBySlugDocument, options);
      }
export function useCategoryBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryBySlugQuery, CategoryBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryBySlugQuery, CategoryBySlugQueryVariables>(CategoryBySlugDocument, options);
        }
export type CategoryBySlugQueryHookResult = ReturnType<typeof useCategoryBySlugQuery>;
export type CategoryBySlugLazyQueryHookResult = ReturnType<typeof useCategoryBySlugLazyQuery>;
export type CategoryBySlugQueryResult = Apollo.QueryResult<CategoryBySlugQuery, CategoryBySlugQueryVariables>;
export const CategoryPathsDocument = gql`
    query CategoryPaths($after: String) {
  categories(first: 100, after: $after) {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      node {
        slug
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useCategoryPathsQuery__
 *
 * To run a query within a React component, call `useCategoryPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryPathsQuery({
 *   variables: {
 *      after: // value for 'after'
 *   },
 * });
 */
export function useCategoryPathsQuery(baseOptions?: Apollo.QueryHookOptions<CategoryPathsQuery, CategoryPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryPathsQuery, CategoryPathsQueryVariables>(CategoryPathsDocument, options);
      }
export function useCategoryPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryPathsQuery, CategoryPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryPathsQuery, CategoryPathsQueryVariables>(CategoryPathsDocument, options);
        }
export type CategoryPathsQueryHookResult = ReturnType<typeof useCategoryPathsQuery>;
export type CategoryPathsLazyQueryHookResult = ReturnType<typeof useCategoryPathsLazyQuery>;
export type CategoryPathsQueryResult = Apollo.QueryResult<CategoryPathsQuery, CategoryPathsQueryVariables>;
export const CheckoutByTokenDocument = gql`
    query CheckoutByToken($checkoutToken: UUID!) {
  checkout(token: $checkoutToken) {
    ...CheckoutDetailsFragment
  }
}
    ${CheckoutDetailsFragmentDoc}`;

/**
 * __useCheckoutByTokenQuery__
 *
 * To run a query within a React component, call `useCheckoutByTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckoutByTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckoutByTokenQuery({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *   },
 * });
 */
export function useCheckoutByTokenQuery(baseOptions: Apollo.QueryHookOptions<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>(CheckoutByTokenDocument, options);
      }
export function useCheckoutByTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>(CheckoutByTokenDocument, options);
        }
export type CheckoutByTokenQueryHookResult = ReturnType<typeof useCheckoutByTokenQuery>;
export type CheckoutByTokenLazyQueryHookResult = ReturnType<typeof useCheckoutByTokenLazyQuery>;
export type CheckoutByTokenQueryResult = Apollo.QueryResult<CheckoutByTokenQuery, CheckoutByTokenQueryVariables>;
export const CollectionBySlugDocument = gql`
    query CollectionBySlug($slug: String!) {
  collection(slug: $slug, channel: "default-channel") {
    id
    ...CollectionDetailsFragment
    seoTitle
    seoDescription
    description
    backgroundImage {
      ...ImageFragment
    }
  }
}
    ${CollectionDetailsFragmentDoc}
${ImageFragmentDoc}`;

/**
 * __useCollectionBySlugQuery__
 *
 * To run a query within a React component, call `useCollectionBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCollectionBySlugQuery(baseOptions: Apollo.QueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
      }
export function useCollectionBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionBySlugQuery, CollectionBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionBySlugQuery, CollectionBySlugQueryVariables>(CollectionBySlugDocument, options);
        }
export type CollectionBySlugQueryHookResult = ReturnType<typeof useCollectionBySlugQuery>;
export type CollectionBySlugLazyQueryHookResult = ReturnType<typeof useCollectionBySlugLazyQuery>;
export type CollectionBySlugQueryResult = Apollo.QueryResult<CollectionBySlugQuery, CollectionBySlugQueryVariables>;
export const CollectionPathsDocument = gql`
    query CollectionPaths($after: String, $channel: String!) {
  collections(first: 20, channel: $channel, after: $after) {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      node {
        slug
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useCollectionPathsQuery__
 *
 * To run a query within a React component, call `useCollectionPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCollectionPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCollectionPathsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useCollectionPathsQuery(baseOptions: Apollo.QueryHookOptions<CollectionPathsQuery, CollectionPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CollectionPathsQuery, CollectionPathsQueryVariables>(CollectionPathsDocument, options);
      }
export function useCollectionPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CollectionPathsQuery, CollectionPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CollectionPathsQuery, CollectionPathsQueryVariables>(CollectionPathsDocument, options);
        }
export type CollectionPathsQueryHookResult = ReturnType<typeof useCollectionPathsQuery>;
export type CollectionPathsLazyQueryHookResult = ReturnType<typeof useCollectionPathsLazyQuery>;
export type CollectionPathsQueryResult = Apollo.QueryResult<CollectionPathsQuery, CollectionPathsQueryVariables>;
export const CurrentUserDetailsDocument = gql`
    query CurrentUserDetails {
  me {
    id
    lastLogin
    dateJoined
    email
    firstName
    lastName
    avatar {
      ...ImageFragment
    }
    orders {
      totalCount
    }
  }
}
    ${ImageFragmentDoc}`;

/**
 * __useCurrentUserDetailsQuery__
 *
 * To run a query within a React component, call `useCurrentUserDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserDetailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserDetailsQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>(CurrentUserDetailsDocument, options);
      }
export function useCurrentUserDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>(CurrentUserDetailsDocument, options);
        }
export type CurrentUserDetailsQueryHookResult = ReturnType<typeof useCurrentUserDetailsQuery>;
export type CurrentUserDetailsLazyQueryHookResult = ReturnType<typeof useCurrentUserDetailsLazyQuery>;
export type CurrentUserDetailsQueryResult = Apollo.QueryResult<CurrentUserDetailsQuery, CurrentUserDetailsQueryVariables>;
export const MainMenuDocument = gql`
    query MainMenu {
  menu(slug: "navbar") {
    items {
      ...MainMenuItemFragment
    }
  }
}
    ${MainMenuItemFragmentDoc}`;

/**
 * __useMainMenuQuery__
 *
 * To run a query within a React component, call `useMainMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useMainMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMainMenuQuery({
 *   variables: {
 *   },
 * });
 */
export function useMainMenuQuery(baseOptions?: Apollo.QueryHookOptions<MainMenuQuery, MainMenuQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MainMenuQuery, MainMenuQueryVariables>(MainMenuDocument, options);
      }
export function useMainMenuLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MainMenuQuery, MainMenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MainMenuQuery, MainMenuQueryVariables>(MainMenuDocument, options);
        }
export type MainMenuQueryHookResult = ReturnType<typeof useMainMenuQuery>;
export type MainMenuLazyQueryHookResult = ReturnType<typeof useMainMenuLazyQuery>;
export type MainMenuQueryResult = Apollo.QueryResult<MainMenuQuery, MainMenuQueryVariables>;
export const MenuQueryDocument = gql`
    query MenuQuery($slug: String!) {
  menu(channel: "default-channel", slug: $slug) {
    id
    name
    slug
    items {
      ...MenuItemFragment
    }
  }
}
    ${MenuItemFragmentDoc}`;

/**
 * __useMenuQuery__
 *
 * To run a query within a React component, call `useMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMenuQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useMenuQuery(baseOptions: Apollo.QueryHookOptions<MenuQuery, MenuQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MenuQuery, MenuQueryVariables>(MenuQueryDocument, options);
      }
export function useMenuQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MenuQuery, MenuQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MenuQuery, MenuQueryVariables>(MenuQueryDocument, options);
        }
export type MenuQueryHookResult = ReturnType<typeof useMenuQuery>;
export type MenuQueryLazyQueryHookResult = ReturnType<typeof useMenuQueryLazyQuery>;
export type MenuQueryQueryResult = Apollo.QueryResult<MenuQuery, MenuQueryVariables>;
export const OrderDetailsQueryDocument = gql`
    query OrderDetailsQuery($token: UUID!) {
  orderByToken(token: $token) {
    id
    number
    shippingPrice {
      gross {
        ...PriceFragment
      }
    }
    created
    lines {
      id
      thumbnail {
        ...ImageFragment
      }
      totalPrice {
        gross {
          ...PriceFragment
        }
      }
      productName
      variantName
      quantity
    }
    total {
      gross {
        ...PriceFragment
      }
    }
    statusDisplay
  }
}
    ${PriceFragmentDoc}
${ImageFragmentDoc}`;

/**
 * __useOrderDetailsQuery__
 *
 * To run a query within a React component, call `useOrderDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useOrderDetailsQuery(baseOptions: Apollo.QueryHookOptions<OrderDetailsQuery, OrderDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderDetailsQuery, OrderDetailsQueryVariables>(OrderDetailsQueryDocument, options);
      }
export function useOrderDetailsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderDetailsQuery, OrderDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderDetailsQuery, OrderDetailsQueryVariables>(OrderDetailsQueryDocument, options);
        }
export type OrderDetailsQueryHookResult = ReturnType<typeof useOrderDetailsQuery>;
export type OrderDetailsQueryLazyQueryHookResult = ReturnType<typeof useOrderDetailsQueryLazyQuery>;
export type OrderDetailsQueryQueryResult = Apollo.QueryResult<OrderDetailsQuery, OrderDetailsQueryVariables>;
export const OrderDetailsByTokenDocument = gql`
    query OrderDetailsByToken($token: UUID!) {
  orderByToken(token: $token) {
    id
    status
    number
    shippingAddress {
      ...AddressDetailsFragment
    }
    billingAddress {
      ...AddressDetailsFragment
    }
    subtotal {
      net {
        ...PriceFragment
      }
      tax {
        ...PriceFragment
      }
    }
    total {
      gross {
        ...PriceFragment
      }
    }
    lines {
      id
      productName
      variantName
      quantity
      thumbnail {
        url
        alt
      }
      unitPrice {
        gross {
          ...PriceFragment
        }
      }
      totalPrice {
        gross {
          ...PriceFragment
        }
      }
    }
    shippingPrice {
      gross {
        ...PriceFragment
      }
    }
  }
}
    ${AddressDetailsFragmentDoc}
${PriceFragmentDoc}`;

/**
 * __useOrderDetailsByTokenQuery__
 *
 * To run a query within a React component, call `useOrderDetailsByTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderDetailsByTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderDetailsByTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useOrderDetailsByTokenQuery(baseOptions: Apollo.QueryHookOptions<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>(OrderDetailsByTokenDocument, options);
      }
export function useOrderDetailsByTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>(OrderDetailsByTokenDocument, options);
        }
export type OrderDetailsByTokenQueryHookResult = ReturnType<typeof useOrderDetailsByTokenQuery>;
export type OrderDetailsByTokenLazyQueryHookResult = ReturnType<typeof useOrderDetailsByTokenLazyQuery>;
export type OrderDetailsByTokenQueryResult = Apollo.QueryResult<OrderDetailsByTokenQuery, OrderDetailsByTokenQueryVariables>;
export const OrdersDocument = gql`
    query Orders($before: String, $after: String) {
  me {
    orders(first: 10, before: $before, after: $after) {
      edges {
        cursor
        node {
          ...OrderDetailsFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
}
    ${OrderDetailsFragmentDoc}`;

/**
 * __useOrdersQuery__
 *
 * To run a query within a React component, call `useOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useOrdersQuery(baseOptions?: Apollo.QueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
      }
export function useOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
        }
export type OrdersQueryHookResult = ReturnType<typeof useOrdersQuery>;
export type OrdersLazyQueryHookResult = ReturnType<typeof useOrdersLazyQuery>;
export type OrdersQueryResult = Apollo.QueryResult<OrdersQuery, OrdersQueryVariables>;
export const PageDocument = gql`
    query Page($slug: String!) {
  page(slug: $slug) {
    id
    title
    seoTitle
    seoDescription
    slug
    created
    content
  }
}
    `;

/**
 * __usePageQuery__
 *
 * To run a query within a React component, call `usePageQuery` and pass it any options that fit your needs.
 * When your component renders, `usePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePageQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function usePageQuery(baseOptions: Apollo.QueryHookOptions<PageQuery, PageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PageQuery, PageQueryVariables>(PageDocument, options);
      }
export function usePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PageQuery, PageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PageQuery, PageQueryVariables>(PageDocument, options);
        }
export type PageQueryHookResult = ReturnType<typeof usePageQuery>;
export type PageLazyQueryHookResult = ReturnType<typeof usePageLazyQuery>;
export type PageQueryResult = Apollo.QueryResult<PageQuery, PageQueryVariables>;
export const PagePathsDocument = gql`
    query PagePaths($after: String) {
  pages(first: 100, after: $after) {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      node {
        slug
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __usePagePathsQuery__
 *
 * To run a query within a React component, call `usePagePathsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePagePathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePagePathsQuery({
 *   variables: {
 *      after: // value for 'after'
 *   },
 * });
 */
export function usePagePathsQuery(baseOptions?: Apollo.QueryHookOptions<PagePathsQuery, PagePathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PagePathsQuery, PagePathsQueryVariables>(PagePathsDocument, options);
      }
export function usePagePathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PagePathsQuery, PagePathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PagePathsQuery, PagePathsQueryVariables>(PagePathsDocument, options);
        }
export type PagePathsQueryHookResult = ReturnType<typeof usePagePathsQuery>;
export type PagePathsLazyQueryHookResult = ReturnType<typeof usePagePathsLazyQuery>;
export type PagePathsQueryResult = Apollo.QueryResult<PagePathsQuery, PagePathsQueryVariables>;
export const ProductBySlugDocument = gql`
    query ProductBySlug($slug: String!, $channel: String!) {
  product(slug: $slug, channel: $channel) {
    ...ProductDetailsFragment
  }
}
    ${ProductDetailsFragmentDoc}`;

/**
 * __useProductBySlugQuery__
 *
 * To run a query within a React component, call `useProductBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useProductBySlugQuery(baseOptions: Apollo.QueryHookOptions<ProductBySlugQuery, ProductBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductBySlugQuery, ProductBySlugQueryVariables>(ProductBySlugDocument, options);
      }
export function useProductBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductBySlugQuery, ProductBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductBySlugQuery, ProductBySlugQueryVariables>(ProductBySlugDocument, options);
        }
export type ProductBySlugQueryHookResult = ReturnType<typeof useProductBySlugQuery>;
export type ProductBySlugLazyQueryHookResult = ReturnType<typeof useProductBySlugLazyQuery>;
export type ProductBySlugQueryResult = Apollo.QueryResult<ProductBySlugQuery, ProductBySlugQueryVariables>;
export const ProductCollectionDocument = gql`
    query ProductCollection($before: String, $after: String, $filter: ProductFilterInput, $channel: String!) {
  products(
    first: 4
    channel: $channel
    after: $after
    before: $before
    filter: $filter
  ) {
    totalCount
    edges {
      cursor
      node {
        ...ProductCardFragment
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    ${ProductCardFragmentDoc}`;

/**
 * __useProductCollectionQuery__
 *
 * To run a query within a React component, call `useProductCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductCollectionQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      filter: // value for 'filter'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useProductCollectionQuery(baseOptions: Apollo.QueryHookOptions<ProductCollectionQuery, ProductCollectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductCollectionQuery, ProductCollectionQueryVariables>(ProductCollectionDocument, options);
      }
export function useProductCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductCollectionQuery, ProductCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductCollectionQuery, ProductCollectionQueryVariables>(ProductCollectionDocument, options);
        }
export type ProductCollectionQueryHookResult = ReturnType<typeof useProductCollectionQuery>;
export type ProductCollectionLazyQueryHookResult = ReturnType<typeof useProductCollectionLazyQuery>;
export type ProductCollectionQueryResult = Apollo.QueryResult<ProductCollectionQuery, ProductCollectionQueryVariables>;
export const ProductPathsDocument = gql`
    query ProductPaths($after: String, $channel: String!) {
  products(first: 100, channel: $channel, after: $after) {
    pageInfo {
      ...PageInfoFragment
    }
    edges {
      node {
        slug
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

/**
 * __useProductPathsQuery__
 *
 * To run a query within a React component, call `useProductPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductPathsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      channel: // value for 'channel'
 *   },
 * });
 */
export function useProductPathsQuery(baseOptions: Apollo.QueryHookOptions<ProductPathsQuery, ProductPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductPathsQuery, ProductPathsQueryVariables>(ProductPathsDocument, options);
      }
export function useProductPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductPathsQuery, ProductPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductPathsQuery, ProductPathsQueryVariables>(ProductPathsDocument, options);
        }
export type ProductPathsQueryHookResult = ReturnType<typeof useProductPathsQuery>;
export type ProductPathsLazyQueryHookResult = ReturnType<typeof useProductPathsLazyQuery>;
export type ProductPathsQueryResult = Apollo.QueryResult<ProductPathsQuery, ProductPathsQueryVariables>;
export const CurrentUserAddressesDocument = gql`
    query CurrentUserAddresses {
  me {
    addresses {
      ...AddressDetailsFragment
    }
  }
}
    ${AddressDetailsFragmentDoc}`;

/**
 * __useCurrentUserAddressesQuery__
 *
 * To run a query within a React component, call `useCurrentUserAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserAddressesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserAddressesQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>(CurrentUserAddressesDocument, options);
      }
export function useCurrentUserAddressesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>(CurrentUserAddressesDocument, options);
        }
export type CurrentUserAddressesQueryHookResult = ReturnType<typeof useCurrentUserAddressesQuery>;
export type CurrentUserAddressesLazyQueryHookResult = ReturnType<typeof useCurrentUserAddressesLazyQuery>;
export type CurrentUserAddressesQueryResult = Apollo.QueryResult<CurrentUserAddressesQuery, CurrentUserAddressesQueryVariables>;
export type AccountAddressCreateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AccountAddressCreateKeySpecifier)[];
export type AccountAddressCreateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountAddressDeleteKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AccountAddressDeleteKeySpecifier)[];
export type AccountAddressDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountAddressUpdateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AccountAddressUpdateKeySpecifier)[];
export type AccountAddressUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountDeleteKeySpecifier)[];
export type AccountDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'message' | AccountErrorKeySpecifier)[];
export type AccountErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountRegisterKeySpecifier = ('accountErrors' | 'errors' | 'requiresConfirmation' | 'user' | AccountRegisterKeySpecifier)[];
export type AccountRegisterFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	requiresConfirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountRequestDeletionKeySpecifier = ('accountErrors' | 'errors' | AccountRequestDeletionKeySpecifier)[];
export type AccountRequestDeletionFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountSetDefaultAddressKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountSetDefaultAddressKeySpecifier)[];
export type AccountSetDefaultAddressFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountUpdateKeySpecifier)[];
export type AccountUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressKeySpecifier = ('city' | 'cityArea' | 'companyName' | 'country' | 'countryArea' | 'firstName' | 'id' | 'isDefaultBillingAddress' | 'isDefaultShippingAddress' | 'lastName' | 'phone' | 'postalCode' | 'streetAddress1' | 'streetAddress2' | AddressKeySpecifier)[];
export type AddressFieldPolicy = {
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	cityArea?: FieldPolicy<any> | FieldReadFunction<any>,
	companyName?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	countryArea?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	phone?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCode?: FieldPolicy<any> | FieldReadFunction<any>,
	streetAddress1?: FieldPolicy<any> | FieldReadFunction<any>,
	streetAddress2?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressCreateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AddressCreateKeySpecifier)[];
export type AddressCreateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressDeleteKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AddressDeleteKeySpecifier)[];
export type AddressDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressSetDefaultKeySpecifier = ('accountErrors' | 'errors' | 'user' | AddressSetDefaultKeySpecifier)[];
export type AddressSetDefaultFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressUpdateKeySpecifier = ('accountErrors' | 'address' | 'errors' | 'user' | AddressUpdateKeySpecifier)[];
export type AddressUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressValidationDataKeySpecifier = ('addressFormat' | 'addressLatinFormat' | 'allowedFields' | 'cityAreaChoices' | 'cityAreaType' | 'cityChoices' | 'cityType' | 'countryAreaChoices' | 'countryAreaType' | 'countryCode' | 'countryName' | 'postalCodeExamples' | 'postalCodeMatchers' | 'postalCodePrefix' | 'postalCodeType' | 'requiredFields' | 'upperFields' | AddressValidationDataKeySpecifier)[];
export type AddressValidationDataFieldPolicy = {
	addressFormat?: FieldPolicy<any> | FieldReadFunction<any>,
	addressLatinFormat?: FieldPolicy<any> | FieldReadFunction<any>,
	allowedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	cityAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	cityAreaType?: FieldPolicy<any> | FieldReadFunction<any>,
	cityChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	cityType?: FieldPolicy<any> | FieldReadFunction<any>,
	countryAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	countryAreaType?: FieldPolicy<any> | FieldReadFunction<any>,
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	countryName?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeExamples?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeMatchers?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodePrefix?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeType?: FieldPolicy<any> | FieldReadFunction<any>,
	requiredFields?: FieldPolicy<any> | FieldReadFunction<any>,
	upperFields?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AllocationKeySpecifier = ('id' | 'quantity' | 'warehouse' | AllocationKeySpecifier)[];
export type AllocationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppKeySpecifier = ('aboutApp' | 'accessToken' | 'appUrl' | 'configurationUrl' | 'created' | 'dataPrivacy' | 'dataPrivacyUrl' | 'homepageUrl' | 'id' | 'isActive' | 'metadata' | 'name' | 'permissions' | 'privateMetadata' | 'supportUrl' | 'tokens' | 'type' | 'version' | 'webhooks' | AppKeySpecifier)[];
export type AppFieldPolicy = {
	aboutApp?: FieldPolicy<any> | FieldReadFunction<any>,
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>,
	appUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	supportUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	tokens?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	webhooks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppActivateKeySpecifier = ('app' | 'appErrors' | 'errors' | AppActivateKeySpecifier)[];
export type AppActivateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AppCountableConnectionKeySpecifier)[];
export type AppCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCountableEdgeKeySpecifier = ('cursor' | 'node' | AppCountableEdgeKeySpecifier)[];
export type AppCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCreateKeySpecifier = ('app' | 'appErrors' | 'authToken' | 'errors' | AppCreateKeySpecifier)[];
export type AppCreateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeactivateKeySpecifier = ('app' | 'appErrors' | 'errors' | AppDeactivateKeySpecifier)[];
export type AppDeactivateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeleteKeySpecifier = ('app' | 'appErrors' | 'errors' | AppDeleteKeySpecifier)[];
export type AppDeleteFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeleteFailedInstallationKeySpecifier = ('appErrors' | 'appInstallation' | 'errors' | AppDeleteFailedInstallationKeySpecifier)[];
export type AppDeleteFailedInstallationFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppErrorKeySpecifier = ('code' | 'field' | 'message' | 'permissions' | AppErrorKeySpecifier)[];
export type AppErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppFetchManifestKeySpecifier = ('appErrors' | 'errors' | 'manifest' | AppFetchManifestKeySpecifier)[];
export type AppFetchManifestFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	manifest?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstallKeySpecifier = ('appErrors' | 'appInstallation' | 'errors' | AppInstallKeySpecifier)[];
export type AppInstallFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstallationKeySpecifier = ('appName' | 'createdAt' | 'id' | 'manifestUrl' | 'message' | 'status' | 'updatedAt' | AppInstallationKeySpecifier)[];
export type AppInstallationFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	manifestUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppRetryInstallKeySpecifier = ('appErrors' | 'appInstallation' | 'errors' | AppRetryInstallKeySpecifier)[];
export type AppRetryInstallFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenKeySpecifier = ('authToken' | 'id' | 'name' | AppTokenKeySpecifier)[];
export type AppTokenFieldPolicy = {
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenCreateKeySpecifier = ('appErrors' | 'appToken' | 'authToken' | 'errors' | AppTokenCreateKeySpecifier)[];
export type AppTokenCreateFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appToken?: FieldPolicy<any> | FieldReadFunction<any>,
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenDeleteKeySpecifier = ('appErrors' | 'appToken' | 'errors' | AppTokenDeleteKeySpecifier)[];
export type AppTokenDeleteFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	appToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenVerifyKeySpecifier = ('appErrors' | 'errors' | 'valid' | AppTokenVerifyKeySpecifier)[];
export type AppTokenVerifyFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	valid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppUpdateKeySpecifier = ('app' | 'appErrors' | 'errors' | AppUpdateKeySpecifier)[];
export type AppUpdateFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignNavigationKeySpecifier = ('errors' | 'menu' | 'menuErrors' | AssignNavigationKeySpecifier)[];
export type AssignNavigationFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeKeySpecifier = ('availableInGrid' | 'choices' | 'entityType' | 'filterableInDashboard' | 'filterableInStorefront' | 'id' | 'inputType' | 'metadata' | 'name' | 'privateMetadata' | 'productTypes' | 'productVariantTypes' | 'slug' | 'storefrontSearchPosition' | 'translation' | 'type' | 'unit' | 'valueRequired' | 'visibleInStorefront' | 'withChoices' | AttributeKeySpecifier)[];
export type AttributeFieldPolicy = {
	availableInGrid?: FieldPolicy<any> | FieldReadFunction<any>,
	choices?: FieldPolicy<any> | FieldReadFunction<any>,
	entityType?: FieldPolicy<any> | FieldReadFunction<any>,
	filterableInDashboard?: FieldPolicy<any> | FieldReadFunction<any>,
	filterableInStorefront?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inputType?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	storefrontSearchPosition?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	valueRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	visibleInStorefront?: FieldPolicy<any> | FieldReadFunction<any>,
	withChoices?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkDeleteKeySpecifier = ('attributeErrors' | 'count' | 'errors' | AttributeBulkDeleteKeySpecifier)[];
export type AttributeBulkDeleteFieldPolicy = {
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AttributeCountableConnectionKeySpecifier)[];
export type AttributeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCountableEdgeKeySpecifier = ('cursor' | 'node' | AttributeCountableEdgeKeySpecifier)[];
export type AttributeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCreateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeCreateKeySpecifier)[];
export type AttributeCreateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeDeleteKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeDeleteKeySpecifier)[];
export type AttributeDeleteFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeErrorKeySpecifier = ('code' | 'field' | 'message' | AttributeErrorKeySpecifier)[];
export type AttributeErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeReorderValuesKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeReorderValuesKeySpecifier)[];
export type AttributeReorderValuesFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslatableContentKeySpecifier = ('attribute' | 'id' | 'name' | 'translation' | AttributeTranslatableContentKeySpecifier)[];
export type AttributeTranslatableContentFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslateKeySpecifier = ('attribute' | 'errors' | 'translationErrors' | AttributeTranslateKeySpecifier)[];
export type AttributeTranslateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslationKeySpecifier = ('id' | 'language' | 'name' | AttributeTranslationKeySpecifier)[];
export type AttributeTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeUpdateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeUpdateKeySpecifier)[];
export type AttributeUpdateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueKeySpecifier = ('boolean' | 'date' | 'dateTime' | 'file' | 'id' | 'inputType' | 'name' | 'reference' | 'richText' | 'slug' | 'translation' | 'value' | AttributeValueKeySpecifier)[];
export type AttributeValueFieldPolicy = {
	boolean?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	dateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inputType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	reference?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueBulkDeleteKeySpecifier = ('attributeErrors' | 'count' | 'errors' | AttributeValueBulkDeleteKeySpecifier)[];
export type AttributeValueBulkDeleteFieldPolicy = {
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | AttributeValueCountableConnectionKeySpecifier)[];
export type AttributeValueCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCountableEdgeKeySpecifier = ('cursor' | 'node' | AttributeValueCountableEdgeKeySpecifier)[];
export type AttributeValueCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCreateKeySpecifier = ('attribute' | 'attributeErrors' | 'attributeValue' | 'errors' | AttributeValueCreateKeySpecifier)[];
export type AttributeValueCreateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueDeleteKeySpecifier = ('attribute' | 'attributeErrors' | 'attributeValue' | 'errors' | AttributeValueDeleteKeySpecifier)[];
export type AttributeValueDeleteFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslatableContentKeySpecifier = ('attributeValue' | 'id' | 'name' | 'richText' | 'translation' | AttributeValueTranslatableContentKeySpecifier)[];
export type AttributeValueTranslatableContentFieldPolicy = {
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslateKeySpecifier = ('attributeValue' | 'errors' | 'translationErrors' | AttributeValueTranslateKeySpecifier)[];
export type AttributeValueTranslateFieldPolicy = {
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslationKeySpecifier = ('id' | 'language' | 'name' | 'richText' | AttributeValueTranslationKeySpecifier)[];
export type AttributeValueTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueUpdateKeySpecifier = ('attribute' | 'attributeErrors' | 'attributeValue' | 'errors' | AttributeValueUpdateKeySpecifier)[];
export type AttributeValueUpdateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BulkProductErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'field' | 'index' | 'message' | 'values' | 'warehouses' | BulkProductErrorKeySpecifier)[];
export type BulkProductErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BulkStockErrorKeySpecifier = ('attributes' | 'code' | 'field' | 'index' | 'message' | 'values' | BulkStockErrorKeySpecifier)[];
export type BulkStockErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryKeySpecifier = ('ancestors' | 'backgroundImage' | 'children' | 'description' | 'descriptionJson' | 'id' | 'level' | 'metadata' | 'name' | 'parent' | 'privateMetadata' | 'products' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | CategoryKeySpecifier)[];
export type CategoryFieldPolicy = {
	ancestors?: FieldPolicy<any> | FieldReadFunction<any>,
	backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | CategoryBulkDeleteKeySpecifier)[];
export type CategoryBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CategoryCountableConnectionKeySpecifier)[];
export type CategoryCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCountableEdgeKeySpecifier = ('cursor' | 'node' | CategoryCountableEdgeKeySpecifier)[];
export type CategoryCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCreateKeySpecifier = ('category' | 'errors' | 'productErrors' | CategoryCreateKeySpecifier)[];
export type CategoryCreateFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryDeleteKeySpecifier = ('category' | 'errors' | 'productErrors' | CategoryDeleteKeySpecifier)[];
export type CategoryDeleteFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslatableContentKeySpecifier = ('category' | 'description' | 'descriptionJson' | 'id' | 'name' | 'seoDescription' | 'seoTitle' | 'translation' | CategoryTranslatableContentKeySpecifier)[];
export type CategoryTranslatableContentFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslateKeySpecifier = ('category' | 'errors' | 'translationErrors' | CategoryTranslateKeySpecifier)[];
export type CategoryTranslateFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslationKeySpecifier = ('description' | 'descriptionJson' | 'id' | 'language' | 'name' | 'seoDescription' | 'seoTitle' | CategoryTranslationKeySpecifier)[];
export type CategoryTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryUpdateKeySpecifier = ('category' | 'errors' | 'productErrors' | CategoryUpdateKeySpecifier)[];
export type CategoryUpdateFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelKeySpecifier = ('currencyCode' | 'defaultCountry' | 'hasOrders' | 'id' | 'isActive' | 'name' | 'slug' | ChannelKeySpecifier)[];
export type ChannelFieldPolicy = {
	currencyCode?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	hasOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelActivateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelActivateKeySpecifier)[];
export type ChannelActivateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelCreateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelCreateKeySpecifier)[];
export type ChannelCreateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeactivateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelDeactivateKeySpecifier)[];
export type ChannelDeactivateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeleteKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelDeleteKeySpecifier)[];
export type ChannelDeleteFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelErrorKeySpecifier = ('code' | 'field' | 'message' | 'shippingZones' | ChannelErrorKeySpecifier)[];
export type ChannelErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelUpdateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelUpdateKeySpecifier)[];
export type ChannelUpdateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutKeySpecifier = ('availablePaymentGateways' | 'availableShippingMethods' | 'billingAddress' | 'channel' | 'created' | 'discount' | 'discountName' | 'email' | 'giftCards' | 'id' | 'isShippingRequired' | 'languageCode' | 'lastChange' | 'lines' | 'metadata' | 'note' | 'privateMetadata' | 'quantity' | 'shippingAddress' | 'shippingMethod' | 'shippingPrice' | 'subtotalPrice' | 'token' | 'totalPrice' | 'translatedDiscountName' | 'user' | 'voucherCode' | CheckoutKeySpecifier)[];
export type CheckoutFieldPolicy = {
	availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	billingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountName?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	lastChange?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	subtotalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutAddPromoCodeKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutAddPromoCodeKeySpecifier)[];
export type CheckoutAddPromoCodeFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutBillingAddressUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutBillingAddressUpdateKeySpecifier)[];
export type CheckoutBillingAddressUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCompleteKeySpecifier = ('checkoutErrors' | 'confirmationData' | 'confirmationNeeded' | 'errors' | 'order' | CheckoutCompleteKeySpecifier)[];
export type CheckoutCompleteFieldPolicy = {
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmationData?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmationNeeded?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CheckoutCountableConnectionKeySpecifier)[];
export type CheckoutCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCountableEdgeKeySpecifier = ('cursor' | 'node' | CheckoutCountableEdgeKeySpecifier)[];
export type CheckoutCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreateKeySpecifier = ('checkout' | 'checkoutErrors' | 'created' | 'errors' | CheckoutCreateKeySpecifier)[];
export type CheckoutCreateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCustomerAttachKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutCustomerAttachKeySpecifier)[];
export type CheckoutCustomerAttachFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCustomerDetachKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutCustomerDetachKeySpecifier)[];
export type CheckoutCustomerDetachFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutEmailUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutEmailUpdateKeySpecifier)[];
export type CheckoutEmailUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'lines' | 'message' | 'variants' | CheckoutErrorKeySpecifier)[];
export type CheckoutErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLanguageCodeUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLanguageCodeUpdateKeySpecifier)[];
export type CheckoutLanguageCodeUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineKeySpecifier = ('id' | 'quantity' | 'requiresShipping' | 'totalPrice' | 'variant' | CheckoutLineKeySpecifier)[];
export type CheckoutLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	requiresShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CheckoutLineCountableConnectionKeySpecifier)[];
export type CheckoutLineCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineCountableEdgeKeySpecifier = ('cursor' | 'node' | CheckoutLineCountableEdgeKeySpecifier)[];
export type CheckoutLineCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineDeleteKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLineDeleteKeySpecifier)[];
export type CheckoutLineDeleteFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLinesAddKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLinesAddKeySpecifier)[];
export type CheckoutLinesAddFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLinesDeleteKeySpecifier = ('checkout' | 'errors' | CheckoutLinesDeleteKeySpecifier)[];
export type CheckoutLinesDeleteFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLinesUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLinesUpdateKeySpecifier)[];
export type CheckoutLinesUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutPaymentCreateKeySpecifier = ('checkout' | 'errors' | 'payment' | 'paymentErrors' | CheckoutPaymentCreateKeySpecifier)[];
export type CheckoutPaymentCreateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutRemovePromoCodeKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutRemovePromoCodeKeySpecifier)[];
export type CheckoutRemovePromoCodeFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutShippingAddressUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutShippingAddressUpdateKeySpecifier)[];
export type CheckoutShippingAddressUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutShippingMethodUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutShippingMethodUpdateKeySpecifier)[];
export type CheckoutShippingMethodUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChoiceValueKeySpecifier = ('raw' | 'verbose' | ChoiceValueKeySpecifier)[];
export type ChoiceValueFieldPolicy = {
	raw?: FieldPolicy<any> | FieldReadFunction<any>,
	verbose?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionKeySpecifier = ('backgroundImage' | 'channel' | 'channelListings' | 'description' | 'descriptionJson' | 'id' | 'metadata' | 'name' | 'privateMetadata' | 'products' | 'seoDescription' | 'seoTitle' | 'slug' | 'translation' | CollectionKeySpecifier)[];
export type CollectionFieldPolicy = {
	backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionAddProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionAddProductsKeySpecifier)[];
export type CollectionAddProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionBulkDeleteKeySpecifier = ('collectionErrors' | 'count' | 'errors' | CollectionBulkDeleteKeySpecifier)[];
export type CollectionBulkDeleteFieldPolicy = {
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingKeySpecifier = ('channel' | 'id' | 'isPublished' | 'publicationDate' | CollectionChannelListingKeySpecifier)[];
export type CollectionChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'field' | 'message' | 'values' | CollectionChannelListingErrorKeySpecifier)[];
export type CollectionChannelListingErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingUpdateKeySpecifier = ('collection' | 'collectionChannelListingErrors' | 'errors' | CollectionChannelListingUpdateKeySpecifier)[];
export type CollectionChannelListingUpdateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | CollectionCountableConnectionKeySpecifier)[];
export type CollectionCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCountableEdgeKeySpecifier = ('cursor' | 'node' | CollectionCountableEdgeKeySpecifier)[];
export type CollectionCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCreateKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionCreateKeySpecifier)[];
export type CollectionCreateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionDeleteKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionDeleteKeySpecifier)[];
export type CollectionDeleteFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionErrorKeySpecifier = ('code' | 'field' | 'message' | 'products' | CollectionErrorKeySpecifier)[];
export type CollectionErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionRemoveProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionRemoveProductsKeySpecifier)[];
export type CollectionRemoveProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionReorderProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionReorderProductsKeySpecifier)[];
export type CollectionReorderProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslatableContentKeySpecifier = ('collection' | 'description' | 'descriptionJson' | 'id' | 'name' | 'seoDescription' | 'seoTitle' | 'translation' | CollectionTranslatableContentKeySpecifier)[];
export type CollectionTranslatableContentFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslateKeySpecifier = ('collection' | 'errors' | 'translationErrors' | CollectionTranslateKeySpecifier)[];
export type CollectionTranslateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslationKeySpecifier = ('description' | 'descriptionJson' | 'id' | 'language' | 'name' | 'seoDescription' | 'seoTitle' | CollectionTranslationKeySpecifier)[];
export type CollectionTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionUpdateKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionUpdateKeySpecifier)[];
export type CollectionUpdateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfigurationItemKeySpecifier = ('helpText' | 'label' | 'name' | 'type' | 'value' | ConfigurationItemKeySpecifier)[];
export type ConfigurationItemFieldPolicy = {
	helpText?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfirmAccountKeySpecifier = ('accountErrors' | 'errors' | 'user' | ConfirmAccountKeySpecifier)[];
export type ConfirmAccountFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfirmEmailChangeKeySpecifier = ('accountErrors' | 'errors' | 'user' | ConfirmEmailChangeKeySpecifier)[];
export type ConfirmEmailChangeFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CountryDisplayKeySpecifier = ('code' | 'country' | 'vat' | CountryDisplayKeySpecifier)[];
export type CountryDisplayFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	vat?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateTokenKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | CreateTokenKeySpecifier)[];
export type CreateTokenFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreditCardKeySpecifier = ('brand' | 'expMonth' | 'expYear' | 'firstDigits' | 'lastDigits' | CreditCardKeySpecifier)[];
export type CreditCardFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	expMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	expYear?: FieldPolicy<any> | FieldReadFunction<any>,
	firstDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	lastDigits?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerBulkDeleteKeySpecifier = ('accountErrors' | 'count' | 'errors' | CustomerBulkDeleteKeySpecifier)[];
export type CustomerBulkDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerCreateKeySpecifier = ('accountErrors' | 'errors' | 'user' | CustomerCreateKeySpecifier)[];
export type CustomerCreateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | CustomerDeleteKeySpecifier)[];
export type CustomerDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerEventKeySpecifier = ('app' | 'count' | 'date' | 'id' | 'message' | 'order' | 'orderLine' | 'type' | 'user' | CustomerEventKeySpecifier)[];
export type CustomerEventFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | CustomerUpdateKeySpecifier)[];
export type CustomerUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeactivateAllUserTokensKeySpecifier = ('accountErrors' | 'errors' | DeactivateAllUserTokensKeySpecifier)[];
export type DeactivateAllUserTokensFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeleteMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | DeleteMetadataKeySpecifier)[];
export type DeleteMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeletePrivateMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | DeletePrivateMetadataKeySpecifier)[];
export type DeletePrivateMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentKeySpecifier = ('automaticFulfillment' | 'contentFile' | 'id' | 'maxDownloads' | 'metadata' | 'privateMetadata' | 'productVariant' | 'urlValidDays' | 'urls' | 'useDefaultSettings' | DigitalContentKeySpecifier)[];
export type DigitalContentFieldPolicy = {
	automaticFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	contentFile?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maxDownloads?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	urlValidDays?: FieldPolicy<any> | FieldReadFunction<any>,
	urls?: FieldPolicy<any> | FieldReadFunction<any>,
	useDefaultSettings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | DigitalContentCountableConnectionKeySpecifier)[];
export type DigitalContentCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCountableEdgeKeySpecifier = ('cursor' | 'node' | DigitalContentCountableEdgeKeySpecifier)[];
export type DigitalContentCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCreateKeySpecifier = ('content' | 'errors' | 'productErrors' | 'variant' | DigitalContentCreateKeySpecifier)[];
export type DigitalContentCreateFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentDeleteKeySpecifier = ('errors' | 'productErrors' | 'variant' | DigitalContentDeleteKeySpecifier)[];
export type DigitalContentDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUpdateKeySpecifier = ('content' | 'errors' | 'productErrors' | 'variant' | DigitalContentUpdateKeySpecifier)[];
export type DigitalContentUpdateFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUrlKeySpecifier = ('content' | 'created' | 'downloadNum' | 'id' | 'token' | 'url' | DigitalContentUrlKeySpecifier)[];
export type DigitalContentUrlFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	downloadNum?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUrlCreateKeySpecifier = ('digitalContentUrl' | 'errors' | 'productErrors' | DigitalContentUrlCreateKeySpecifier)[];
export type DigitalContentUrlCreateFieldPolicy = {
	digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DiscountErrorKeySpecifier = ('channels' | 'code' | 'field' | 'message' | 'products' | DiscountErrorKeySpecifier)[];
export type DiscountErrorFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DomainKeySpecifier = ('host' | 'sslEnabled' | 'url' | DomainKeySpecifier)[];
export type DomainFieldPolicy = {
	host?: FieldPolicy<any> | FieldReadFunction<any>,
	sslEnabled?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderBulkDeleteKeySpecifier = ('count' | 'errors' | 'orderErrors' | DraftOrderBulkDeleteKeySpecifier)[];
export type DraftOrderBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCompleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderCompleteKeySpecifier)[];
export type DraftOrderCompleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCreateKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderCreateKeySpecifier)[];
export type DraftOrderCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderDeleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderDeleteKeySpecifier)[];
export type DraftOrderDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderLinesBulkDeleteKeySpecifier = ('count' | 'errors' | 'orderErrors' | DraftOrderLinesBulkDeleteKeySpecifier)[];
export type DraftOrderLinesBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | DraftOrderUpdateKeySpecifier)[];
export type DraftOrderUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportErrorKeySpecifier = ('code' | 'field' | 'message' | ExportErrorKeySpecifier)[];
export type ExportErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportEventKeySpecifier = ('app' | 'date' | 'id' | 'message' | 'type' | 'user' | ExportEventKeySpecifier)[];
export type ExportEventFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileKeySpecifier = ('app' | 'createdAt' | 'events' | 'id' | 'message' | 'status' | 'updatedAt' | 'url' | 'user' | ExportFileKeySpecifier)[];
export type ExportFileFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ExportFileCountableConnectionKeySpecifier)[];
export type ExportFileCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileCountableEdgeKeySpecifier = ('cursor' | 'node' | ExportFileCountableEdgeKeySpecifier)[];
export type ExportFileCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportProductsKeySpecifier = ('errors' | 'exportErrors' | 'exportFile' | ExportProductsKeySpecifier)[];
export type ExportProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	exportErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalAuthenticationKeySpecifier = ('id' | 'name' | ExternalAuthenticationKeySpecifier)[];
export type ExternalAuthenticationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalAuthenticationUrlKeySpecifier = ('accountErrors' | 'authenticationData' | 'errors' | ExternalAuthenticationUrlKeySpecifier)[];
export type ExternalAuthenticationUrlFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	authenticationData?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalLogoutKeySpecifier = ('accountErrors' | 'errors' | 'logoutData' | ExternalLogoutKeySpecifier)[];
export type ExternalLogoutFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	logoutData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalObtainAccessTokensKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | ExternalObtainAccessTokensKeySpecifier)[];
export type ExternalObtainAccessTokensFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalRefreshKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | ExternalRefreshKeySpecifier)[];
export type ExternalRefreshFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalVerifyKeySpecifier = ('accountErrors' | 'errors' | 'isValid' | 'user' | 'verifyData' | ExternalVerifyKeySpecifier)[];
export type ExternalVerifyFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	isValid?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyData?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('contentType' | 'url' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	contentType?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileUploadKeySpecifier = ('errors' | 'uploadErrors' | 'uploadedFile' | FileUploadKeySpecifier)[];
export type FileUploadFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadedFile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentKeySpecifier = ('created' | 'fulfillmentOrder' | 'id' | 'lines' | 'metadata' | 'privateMetadata' | 'status' | 'statusDisplay' | 'trackingNumber' | 'warehouse' | FulfillmentKeySpecifier)[];
export type FulfillmentFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillmentOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	trackingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentCancelKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentCancelKeySpecifier)[];
export type FulfillmentCancelFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentLineKeySpecifier = ('id' | 'orderLine' | 'quantity' | FulfillmentLineKeySpecifier)[];
export type FulfillmentLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentRefundProductsKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentRefundProductsKeySpecifier)[];
export type FulfillmentRefundProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentReturnProductsKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'replaceFulfillment' | 'replaceOrder' | 'returnFulfillment' | FulfillmentReturnProductsKeySpecifier)[];
export type FulfillmentReturnProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	replaceFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	replaceOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	returnFulfillment?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentUpdateTrackingKeySpecifier = ('errors' | 'fulfillment' | 'order' | 'orderErrors' | FulfillmentUpdateTrackingKeySpecifier)[];
export type FulfillmentUpdateTrackingFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GatewayConfigLineKeySpecifier = ('field' | 'value' | GatewayConfigLineKeySpecifier)[];
export type GatewayConfigLineFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardKeySpecifier = ('code' | 'created' | 'currentBalance' | 'displayCode' | 'endDate' | 'id' | 'initialBalance' | 'isActive' | 'lastUsedOn' | 'startDate' | 'user' | GiftCardKeySpecifier)[];
export type GiftCardFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	currentBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	displayCode?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	initialBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUsedOn?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardActivateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardActivateKeySpecifier)[];
export type GiftCardActivateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | GiftCardCountableConnectionKeySpecifier)[];
export type GiftCardCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCountableEdgeKeySpecifier = ('cursor' | 'node' | GiftCardCountableEdgeKeySpecifier)[];
export type GiftCardCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCreateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardCreateKeySpecifier)[];
export type GiftCardCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardDeactivateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardDeactivateKeySpecifier)[];
export type GiftCardDeactivateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardErrorKeySpecifier = ('code' | 'field' | 'message' | GiftCardErrorKeySpecifier)[];
export type GiftCardErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardUpdateKeySpecifier = ('errors' | 'giftCard' | 'giftCardErrors' | GiftCardUpdateKeySpecifier)[];
export type GiftCardUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupKeySpecifier = ('id' | 'name' | 'permissions' | 'userCanManage' | 'users' | GroupKeySpecifier)[];
export type GroupFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	userCanManage?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | GroupCountableConnectionKeySpecifier)[];
export type GroupCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupCountableEdgeKeySpecifier = ('cursor' | 'node' | GroupCountableEdgeKeySpecifier)[];
export type GroupCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ImageKeySpecifier = ('alt' | 'url' | ImageKeySpecifier)[];
export type ImageFieldPolicy = {
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceKeySpecifier = ('createdAt' | 'externalUrl' | 'id' | 'message' | 'metadata' | 'number' | 'privateMetadata' | 'status' | 'updatedAt' | 'url' | InvoiceKeySpecifier)[];
export type InvoiceFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	externalUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceCreateKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceCreateKeySpecifier)[];
export type InvoiceCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceDeleteKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceDeleteKeySpecifier)[];
export type InvoiceDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceErrorKeySpecifier = ('code' | 'field' | 'message' | InvoiceErrorKeySpecifier)[];
export type InvoiceErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | 'order' | InvoiceRequestKeySpecifier)[];
export type InvoiceRequestFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestDeleteKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceRequestDeleteKeySpecifier)[];
export type InvoiceRequestDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceSendNotificationKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceSendNotificationKeySpecifier)[];
export type InvoiceSendNotificationFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceUpdateKeySpecifier = ('errors' | 'invoice' | 'invoiceErrors' | InvoiceUpdateKeySpecifier)[];
export type InvoiceUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JobKeySpecifier = ('createdAt' | 'message' | 'status' | 'updatedAt' | JobKeySpecifier)[];
export type JobFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LanguageDisplayKeySpecifier = ('code' | 'language' | LanguageDisplayKeySpecifier)[];
export type LanguageDisplayFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitInfoKeySpecifier = ('allowedUsage' | 'currentUsage' | LimitInfoKeySpecifier)[];
export type LimitInfoFieldPolicy = {
	allowedUsage?: FieldPolicy<any> | FieldReadFunction<any>,
	currentUsage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitsKeySpecifier = ('channels' | 'orders' | 'productVariants' | 'staffUsers' | 'warehouses' | LimitsKeySpecifier)[];
export type LimitsFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ManifestKeySpecifier = ('about' | 'appUrl' | 'configurationUrl' | 'dataPrivacy' | 'dataPrivacyUrl' | 'homepageUrl' | 'identifier' | 'name' | 'permissions' | 'supportUrl' | 'tokenTargetUrl' | 'version' | ManifestKeySpecifier)[];
export type ManifestFieldPolicy = {
	about?: FieldPolicy<any> | FieldReadFunction<any>,
	appUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	identifier?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	supportUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenTargetUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MarginKeySpecifier = ('start' | 'stop' | MarginKeySpecifier)[];
export type MarginFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuKeySpecifier = ('id' | 'items' | 'metadata' | 'name' | 'privateMetadata' | 'slug' | MenuKeySpecifier)[];
export type MenuFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuBulkDeleteKeySpecifier = ('count' | 'errors' | 'menuErrors' | MenuBulkDeleteKeySpecifier)[];
export type MenuBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | MenuCountableConnectionKeySpecifier)[];
export type MenuCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCountableEdgeKeySpecifier = ('cursor' | 'node' | MenuCountableEdgeKeySpecifier)[];
export type MenuCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCreateKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuCreateKeySpecifier)[];
export type MenuCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuDeleteKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuDeleteKeySpecifier)[];
export type MenuDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuErrorKeySpecifier = ('code' | 'field' | 'message' | MenuErrorKeySpecifier)[];
export type MenuErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemKeySpecifier = ('category' | 'children' | 'collection' | 'id' | 'level' | 'menu' | 'metadata' | 'name' | 'page' | 'parent' | 'privateMetadata' | 'translation' | 'url' | MenuItemKeySpecifier)[];
export type MenuItemFieldPolicy = {
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemBulkDeleteKeySpecifier = ('count' | 'errors' | 'menuErrors' | MenuItemBulkDeleteKeySpecifier)[];
export type MenuItemBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | MenuItemCountableConnectionKeySpecifier)[];
export type MenuItemCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCountableEdgeKeySpecifier = ('cursor' | 'node' | MenuItemCountableEdgeKeySpecifier)[];
export type MenuItemCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCreateKeySpecifier = ('errors' | 'menuErrors' | 'menuItem' | MenuItemCreateKeySpecifier)[];
export type MenuItemCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemDeleteKeySpecifier = ('errors' | 'menuErrors' | 'menuItem' | MenuItemDeleteKeySpecifier)[];
export type MenuItemDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemMoveKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuItemMoveKeySpecifier)[];
export type MenuItemMoveFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslatableContentKeySpecifier = ('id' | 'menuItem' | 'name' | 'translation' | MenuItemTranslatableContentKeySpecifier)[];
export type MenuItemTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslateKeySpecifier = ('errors' | 'menuItem' | 'translationErrors' | MenuItemTranslateKeySpecifier)[];
export type MenuItemTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslationKeySpecifier = ('id' | 'language' | 'name' | MenuItemTranslationKeySpecifier)[];
export type MenuItemTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemUpdateKeySpecifier = ('errors' | 'menuErrors' | 'menuItem' | MenuItemUpdateKeySpecifier)[];
export type MenuItemUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuUpdateKeySpecifier = ('errors' | 'menu' | 'menuErrors' | MenuUpdateKeySpecifier)[];
export type MenuUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetadataErrorKeySpecifier = ('code' | 'field' | 'message' | MetadataErrorKeySpecifier)[];
export type MetadataErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetadataItemKeySpecifier = ('key' | 'value' | MetadataItemKeySpecifier)[];
export type MetadataItemFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MoneyKeySpecifier = ('amount' | 'currency' | 'localizedAmount' | MoneyKeySpecifier)[];
export type MoneyFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	localizedAmount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MoneyRangeKeySpecifier = ('start' | 'stop' | MoneyRangeKeySpecifier)[];
export type MoneyRangeFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('accountAddressCreate' | 'accountAddressDelete' | 'accountAddressUpdate' | 'accountDelete' | 'accountRegister' | 'accountRequestDeletion' | 'accountSetDefaultAddress' | 'accountUpdate' | 'addressCreate' | 'addressDelete' | 'addressSetDefault' | 'addressUpdate' | 'appActivate' | 'appCreate' | 'appDeactivate' | 'appDelete' | 'appDeleteFailedInstallation' | 'appFetchManifest' | 'appInstall' | 'appRetryInstall' | 'appTokenCreate' | 'appTokenDelete' | 'appTokenVerify' | 'appUpdate' | 'assignNavigation' | 'assignWarehouseShippingZone' | 'attributeBulkDelete' | 'attributeCreate' | 'attributeDelete' | 'attributeReorderValues' | 'attributeTranslate' | 'attributeUpdate' | 'attributeValueBulkDelete' | 'attributeValueCreate' | 'attributeValueDelete' | 'attributeValueTranslate' | 'attributeValueUpdate' | 'categoryBulkDelete' | 'categoryCreate' | 'categoryDelete' | 'categoryTranslate' | 'categoryUpdate' | 'channelActivate' | 'channelCreate' | 'channelDeactivate' | 'channelDelete' | 'channelUpdate' | 'checkoutAddPromoCode' | 'checkoutBillingAddressUpdate' | 'checkoutComplete' | 'checkoutCreate' | 'checkoutCustomerAttach' | 'checkoutCustomerDetach' | 'checkoutEmailUpdate' | 'checkoutLanguageCodeUpdate' | 'checkoutLineDelete' | 'checkoutLinesAdd' | 'checkoutLinesDelete' | 'checkoutLinesUpdate' | 'checkoutPaymentCreate' | 'checkoutRemovePromoCode' | 'checkoutShippingAddressUpdate' | 'checkoutShippingMethodUpdate' | 'collectionAddProducts' | 'collectionBulkDelete' | 'collectionChannelListingUpdate' | 'collectionCreate' | 'collectionDelete' | 'collectionRemoveProducts' | 'collectionReorderProducts' | 'collectionTranslate' | 'collectionUpdate' | 'confirmAccount' | 'confirmEmailChange' | 'createWarehouse' | 'customerBulkDelete' | 'customerCreate' | 'customerDelete' | 'customerUpdate' | 'deleteMetadata' | 'deletePrivateMetadata' | 'deleteWarehouse' | 'digitalContentCreate' | 'digitalContentDelete' | 'digitalContentUpdate' | 'digitalContentUrlCreate' | 'draftOrderBulkDelete' | 'draftOrderComplete' | 'draftOrderCreate' | 'draftOrderDelete' | 'draftOrderLinesBulkDelete' | 'draftOrderUpdate' | 'exportProducts' | 'externalAuthenticationUrl' | 'externalLogout' | 'externalObtainAccessTokens' | 'externalRefresh' | 'externalVerify' | 'fileUpload' | 'giftCardActivate' | 'giftCardCreate' | 'giftCardDeactivate' | 'giftCardUpdate' | 'invoiceCreate' | 'invoiceDelete' | 'invoiceRequest' | 'invoiceRequestDelete' | 'invoiceSendNotification' | 'invoiceUpdate' | 'menuBulkDelete' | 'menuCreate' | 'menuDelete' | 'menuItemBulkDelete' | 'menuItemCreate' | 'menuItemDelete' | 'menuItemMove' | 'menuItemTranslate' | 'menuItemUpdate' | 'menuUpdate' | 'orderAddNote' | 'orderBulkCancel' | 'orderCancel' | 'orderCapture' | 'orderConfirm' | 'orderDiscountAdd' | 'orderDiscountDelete' | 'orderDiscountUpdate' | 'orderFulfill' | 'orderFulfillmentCancel' | 'orderFulfillmentRefundProducts' | 'orderFulfillmentReturnProducts' | 'orderFulfillmentUpdateTracking' | 'orderLineDelete' | 'orderLineDiscountRemove' | 'orderLineDiscountUpdate' | 'orderLineUpdate' | 'orderLinesCreate' | 'orderMarkAsPaid' | 'orderRefund' | 'orderSettingsUpdate' | 'orderUpdate' | 'orderUpdateShipping' | 'orderVoid' | 'pageAttributeAssign' | 'pageAttributeUnassign' | 'pageBulkDelete' | 'pageBulkPublish' | 'pageCreate' | 'pageDelete' | 'pageReorderAttributeValues' | 'pageTranslate' | 'pageTypeBulkDelete' | 'pageTypeCreate' | 'pageTypeDelete' | 'pageTypeReorderAttributes' | 'pageTypeUpdate' | 'pageUpdate' | 'passwordChange' | 'paymentCapture' | 'paymentCheckBalance' | 'paymentInitialize' | 'paymentRefund' | 'paymentVoid' | 'permissionGroupCreate' | 'permissionGroupDelete' | 'permissionGroupUpdate' | 'pluginUpdate' | 'productAttributeAssign' | 'productAttributeUnassign' | 'productBulkDelete' | 'productChannelListingUpdate' | 'productCreate' | 'productDelete' | 'productMediaBulkDelete' | 'productMediaCreate' | 'productMediaDelete' | 'productMediaReorder' | 'productMediaUpdate' | 'productReorderAttributeValues' | 'productTranslate' | 'productTypeBulkDelete' | 'productTypeCreate' | 'productTypeDelete' | 'productTypeReorderAttributes' | 'productTypeUpdate' | 'productUpdate' | 'productVariantBulkCreate' | 'productVariantBulkDelete' | 'productVariantChannelListingUpdate' | 'productVariantCreate' | 'productVariantDelete' | 'productVariantReorder' | 'productVariantReorderAttributeValues' | 'productVariantSetDefault' | 'productVariantStocksCreate' | 'productVariantStocksDelete' | 'productVariantStocksUpdate' | 'productVariantTranslate' | 'productVariantUpdate' | 'requestEmailChange' | 'requestPasswordReset' | 'saleBulkDelete' | 'saleCataloguesAdd' | 'saleCataloguesRemove' | 'saleChannelListingUpdate' | 'saleCreate' | 'saleDelete' | 'saleTranslate' | 'saleUpdate' | 'setPassword' | 'shippingMethodChannelListingUpdate' | 'shippingPriceBulkDelete' | 'shippingPriceCreate' | 'shippingPriceDelete' | 'shippingPriceExcludeProducts' | 'shippingPriceRemoveProductFromExclude' | 'shippingPriceTranslate' | 'shippingPriceUpdate' | 'shippingZoneBulkDelete' | 'shippingZoneCreate' | 'shippingZoneDelete' | 'shippingZoneUpdate' | 'shopAddressUpdate' | 'shopDomainUpdate' | 'shopFetchTaxRates' | 'shopSettingsTranslate' | 'shopSettingsUpdate' | 'staffBulkDelete' | 'staffCreate' | 'staffDelete' | 'staffNotificationRecipientCreate' | 'staffNotificationRecipientDelete' | 'staffNotificationRecipientUpdate' | 'staffUpdate' | 'tokenCreate' | 'tokenRefresh' | 'tokenVerify' | 'tokensDeactivateAll' | 'unassignWarehouseShippingZone' | 'updateMetadata' | 'updatePrivateMetadata' | 'updateWarehouse' | 'userAvatarDelete' | 'userAvatarUpdate' | 'userBulkSetActive' | 'variantMediaAssign' | 'variantMediaUnassign' | 'voucherBulkDelete' | 'voucherCataloguesAdd' | 'voucherCataloguesRemove' | 'voucherChannelListingUpdate' | 'voucherCreate' | 'voucherDelete' | 'voucherTranslate' | 'voucherUpdate' | 'webhookCreate' | 'webhookDelete' | 'webhookUpdate' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	accountAddressCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	accountRegister?: FieldPolicy<any> | FieldReadFunction<any>,
	accountRequestDeletion?: FieldPolicy<any> | FieldReadFunction<any>,
	accountSetDefaultAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	accountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	addressCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	addressDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	addressSetDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	addressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	appActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	appCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	appDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	appDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	appDeleteFailedInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	appFetchManifest?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstall?: FieldPolicy<any> | FieldReadFunction<any>,
	appRetryInstall?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	appUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	assignNavigation?: FieldPolicy<any> | FieldReadFunction<any>,
	assignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeReorderValues?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	channelUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutAddPromoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutBillingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutComplete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerAttach?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerDetach?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutEmailUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLanguageCodeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLineDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutPaymentCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutRemovePromoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutShippingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutShippingMethodUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionAddProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionRemoveProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionReorderProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmEmailChange?: FieldPolicy<any> | FieldReadFunction<any>,
	createWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	customerBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	customerCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	customerDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	customerUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	deletePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrlCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderComplete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderLinesBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	exportProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	externalAuthenticationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	externalLogout?: FieldPolicy<any> | FieldReadFunction<any>,
	externalObtainAccessTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	externalRefresh?: FieldPolicy<any> | FieldReadFunction<any>,
	externalVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	fileUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceRequest?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceRequestDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceSendNotification?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemMove?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderAddNote?: FieldPolicy<any> | FieldReadFunction<any>,
	orderBulkCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCapture?: FieldPolicy<any> | FieldReadFunction<any>,
	orderConfirm?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfill?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentRefundProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentReturnProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentUpdateTracking?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDiscountRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLinesCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderMarkAsPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	orderRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdateShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	orderVoid?: FieldPolicy<any> | FieldReadFunction<any>,
	pageAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	pageAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	pageBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageBulkPublish?: FieldPolicy<any> | FieldReadFunction<any>,
	pageCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	passwordChange?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentCapture?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentCheckBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentInitialize?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentVoid?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pluginUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	productBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaReorder?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	productTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantReorder?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantSetDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	requestEmailChange?: FieldPolicy<any> | FieldReadFunction<any>,
	requestPasswordReset?: FieldPolicy<any> | FieldReadFunction<any>,
	saleBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	saleChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	saleTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	setPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceExcludeProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceRemoveProductFromExclude?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopDomainUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopFetchTaxRates?: FieldPolicy<any> | FieldReadFunction<any>,
	shopSettingsTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenRefresh?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	tokensDeactivateAll?: FieldPolicy<any> | FieldReadFunction<any>,
	unassignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	updateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	updateWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	userAvatarDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	userAvatarUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	userBulkSetActive?: FieldPolicy<any> | FieldReadFunction<any>,
	variantMediaAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	variantMediaUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookUpdate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ObjectWithMetadataKeySpecifier = ('metadata' | 'privateMetadata' | ObjectWithMetadataKeySpecifier)[];
export type ObjectWithMetadataFieldPolicy = {
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderKeySpecifier = ('actions' | 'availableShippingMethods' | 'billingAddress' | 'canFinalize' | 'channel' | 'created' | 'customerNote' | 'discount' | 'discountName' | 'discounts' | 'displayGrossPrices' | 'errors' | 'events' | 'fulfillments' | 'giftCards' | 'id' | 'invoices' | 'isPaid' | 'isShippingRequired' | 'languageCode' | 'languageCodeEnum' | 'lines' | 'metadata' | 'number' | 'origin' | 'original' | 'paymentStatus' | 'paymentStatusDisplay' | 'payments' | 'privateMetadata' | 'redirectUrl' | 'shippingAddress' | 'shippingMethod' | 'shippingMethodName' | 'shippingPrice' | 'shippingTaxRate' | 'status' | 'statusDisplay' | 'subtotal' | 'token' | 'total' | 'totalAuthorized' | 'totalBalance' | 'totalCaptured' | 'trackingClientId' | 'translatedDiscountName' | 'undiscountedTotal' | 'user' | 'userEmail' | 'voucher' | 'weight' | OrderKeySpecifier)[];
export type OrderFieldPolicy = {
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	billingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	canFinalize?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	customerNote?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountName?: FieldPolicy<any> | FieldReadFunction<any>,
	discounts?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillments?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invoices?: FieldPolicy<any> | FieldReadFunction<any>,
	isPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCodeEnum?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	origin?: FieldPolicy<any> | FieldReadFunction<any>,
	original?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentStatusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodName?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxRate?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	subtotal?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAuthorized?: FieldPolicy<any> | FieldReadFunction<any>,
	totalBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCaptured?: FieldPolicy<any> | FieldReadFunction<any>,
	trackingClientId?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	userEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderAddNoteKeySpecifier = ('errors' | 'event' | 'order' | 'orderErrors' | OrderAddNoteKeySpecifier)[];
export type OrderAddNoteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCancelKeySpecifier = ('count' | 'errors' | 'orderErrors' | OrderBulkCancelKeySpecifier)[];
export type OrderBulkCancelFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCancelKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderCancelKeySpecifier)[];
export type OrderCancelFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCaptureKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderCaptureKeySpecifier)[];
export type OrderCaptureFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderConfirmKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderConfirmKeySpecifier)[];
export type OrderConfirmFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | OrderCountableConnectionKeySpecifier)[];
export type OrderCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCountableEdgeKeySpecifier = ('cursor' | 'node' | OrderCountableEdgeKeySpecifier)[];
export type OrderCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountKeySpecifier = ('amount' | 'id' | 'name' | 'reason' | 'translatedName' | 'type' | 'value' | 'valueType' | OrderDiscountKeySpecifier)[];
export type OrderDiscountFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedName?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	valueType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountAddKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderDiscountAddKeySpecifier)[];
export type OrderDiscountAddFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountDeleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderDiscountDeleteKeySpecifier)[];
export type OrderDiscountDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderDiscountUpdateKeySpecifier)[];
export type OrderDiscountUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'message' | 'orderLines' | 'variants' | 'warehouse' | OrderErrorKeySpecifier)[];
export type OrderErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLines?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventKeySpecifier = ('amount' | 'app' | 'composedId' | 'date' | 'discount' | 'email' | 'emailType' | 'fulfilledItems' | 'id' | 'invoiceNumber' | 'lines' | 'message' | 'orderNumber' | 'oversoldItems' | 'paymentGateway' | 'paymentId' | 'quantity' | 'relatedOrder' | 'shippingCostsIncluded' | 'transactionReference' | 'type' | 'user' | 'warehouse' | OrderEventKeySpecifier)[];
export type OrderEventFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	composedId?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	emailType?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfilledItems?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	orderNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	oversoldItems?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentGateway?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentId?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	relatedOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingCostsIncluded?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionReference?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | OrderEventCountableConnectionKeySpecifier)[];
export type OrderEventCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventCountableEdgeKeySpecifier = ('cursor' | 'node' | OrderEventCountableEdgeKeySpecifier)[];
export type OrderEventCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventDiscountObjectKeySpecifier = ('amount' | 'oldAmount' | 'oldValue' | 'oldValueType' | 'reason' | 'value' | 'valueType' | OrderEventDiscountObjectKeySpecifier)[];
export type OrderEventDiscountObjectFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	oldAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	oldValue?: FieldPolicy<any> | FieldReadFunction<any>,
	oldValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	valueType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventOrderLineObjectKeySpecifier = ('discount' | 'itemName' | 'orderLine' | 'quantity' | OrderEventOrderLineObjectKeySpecifier)[];
export type OrderEventOrderLineObjectFieldPolicy = {
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	itemName?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFulfillKeySpecifier = ('errors' | 'fulfillments' | 'order' | 'orderErrors' | OrderFulfillKeySpecifier)[];
export type OrderFulfillFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillments?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineKeySpecifier = ('allocations' | 'digitalContentUrl' | 'id' | 'isShippingRequired' | 'productName' | 'productSku' | 'quantity' | 'quantityFulfilled' | 'taxRate' | 'thumbnail' | 'totalPrice' | 'translatedProductName' | 'translatedVariantName' | 'undiscountedUnitPrice' | 'unitDiscount' | 'unitDiscountReason' | 'unitDiscountType' | 'unitDiscountValue' | 'unitPrice' | 'variant' | 'variantName' | OrderLineKeySpecifier)[];
export type OrderLineFieldPolicy = {
	allocations?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	productName?: FieldPolicy<any> | FieldReadFunction<any>,
	productSku?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityFulfilled?: FieldPolicy<any> | FieldReadFunction<any>,
	taxRate?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedProductName?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedVariantName?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedUnitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscount?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountReason?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountType?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	unitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	variantName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDeleteKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineDeleteKeySpecifier)[];
export type OrderLineDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountRemoveKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineDiscountRemoveKeySpecifier)[];
export type OrderLineDiscountRemoveFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineDiscountUpdateKeySpecifier)[];
export type OrderLineDiscountUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLine' | OrderLineUpdateKeySpecifier)[];
export type OrderLineUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLinesCreateKeySpecifier = ('errors' | 'order' | 'orderErrors' | 'orderLines' | OrderLinesCreateKeySpecifier)[];
export type OrderLinesCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLines?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderMarkAsPaidKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderMarkAsPaidKeySpecifier)[];
export type OrderMarkAsPaidFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderRefundKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderRefundKeySpecifier)[];
export type OrderRefundFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsKeySpecifier = ('automaticallyConfirmAllNewOrders' | OrderSettingsKeySpecifier)[];
export type OrderSettingsFieldPolicy = {
	automaticallyConfirmAllNewOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsErrorKeySpecifier = ('code' | 'field' | 'message' | OrderSettingsErrorKeySpecifier)[];
export type OrderSettingsErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsUpdateKeySpecifier = ('errors' | 'orderSettings' | 'orderSettingsErrors' | OrderSettingsUpdateKeySpecifier)[];
export type OrderSettingsUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettingsErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdateKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderUpdateKeySpecifier)[];
export type OrderUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdateShippingKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderUpdateShippingKeySpecifier)[];
export type OrderUpdateShippingFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderVoidKeySpecifier = ('errors' | 'order' | 'orderErrors' | OrderVoidKeySpecifier)[];
export type OrderVoidFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageKeySpecifier = ('attributes' | 'content' | 'contentJson' | 'created' | 'id' | 'isPublished' | 'metadata' | 'pageType' | 'privateMetadata' | 'publicationDate' | 'seoDescription' | 'seoTitle' | 'slug' | 'title' | 'translation' | PageKeySpecifier)[];
export type PageFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageAttributeAssignKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageAttributeAssignKeySpecifier)[];
export type PageAttributeAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageAttributeUnassignKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageAttributeUnassignKeySpecifier)[];
export type PageAttributeUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageBulkDeleteKeySpecifier = ('count' | 'errors' | 'pageErrors' | PageBulkDeleteKeySpecifier)[];
export type PageBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageBulkPublishKeySpecifier = ('count' | 'errors' | 'pageErrors' | PageBulkPublishKeySpecifier)[];
export type PageBulkPublishFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PageCountableConnectionKeySpecifier)[];
export type PageCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCountableEdgeKeySpecifier = ('cursor' | 'node' | PageCountableEdgeKeySpecifier)[];
export type PageCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCreateKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageCreateKeySpecifier)[];
export type PageCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageDeleteKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageDeleteKeySpecifier)[];
export type PageDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageErrorKeySpecifier = ('attributes' | 'code' | 'field' | 'message' | 'values' | PageErrorKeySpecifier)[];
export type PageErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageReorderAttributeValuesKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageReorderAttributeValuesKeySpecifier)[];
export type PageReorderAttributeValuesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslatableContentKeySpecifier = ('attributeValues' | 'content' | 'contentJson' | 'id' | 'page' | 'seoDescription' | 'seoTitle' | 'title' | 'translation' | PageTranslatableContentKeySpecifier)[];
export type PageTranslatableContentFieldPolicy = {
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslateKeySpecifier = ('errors' | 'page' | 'translationErrors' | PageTranslateKeySpecifier)[];
export type PageTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslationKeySpecifier = ('content' | 'contentJson' | 'id' | 'language' | 'seoDescription' | 'seoTitle' | 'title' | PageTranslationKeySpecifier)[];
export type PageTranslationFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeKeySpecifier = ('attributes' | 'availableAttributes' | 'hasPages' | 'id' | 'metadata' | 'name' | 'privateMetadata' | 'slug' | PageTypeKeySpecifier)[];
export type PageTypeFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPages?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeBulkDeleteKeySpecifier = ('count' | 'errors' | 'pageErrors' | PageTypeBulkDeleteKeySpecifier)[];
export type PageTypeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PageTypeCountableConnectionKeySpecifier)[];
export type PageTypeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCountableEdgeKeySpecifier = ('cursor' | 'node' | PageTypeCountableEdgeKeySpecifier)[];
export type PageTypeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCreateKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeCreateKeySpecifier)[];
export type PageTypeCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeDeleteKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeDeleteKeySpecifier)[];
export type PageTypeDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeReorderAttributesKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeReorderAttributesKeySpecifier)[];
export type PageTypeReorderAttributesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeUpdateKeySpecifier = ('errors' | 'pageErrors' | 'pageType' | PageTypeUpdateKeySpecifier)[];
export type PageTypeUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageUpdateKeySpecifier = ('errors' | 'page' | 'pageErrors' | PageUpdateKeySpecifier)[];
export type PageUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PasswordChangeKeySpecifier = ('accountErrors' | 'errors' | 'user' | PasswordChangeKeySpecifier)[];
export type PasswordChangeFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentKeySpecifier = ('actions' | 'availableCaptureAmount' | 'availableRefundAmount' | 'capturedAmount' | 'chargeStatus' | 'checkout' | 'created' | 'creditCard' | 'customerIpAddress' | 'gateway' | 'id' | 'isActive' | 'modified' | 'order' | 'paymentMethodType' | 'token' | 'total' | 'transactions' | PaymentKeySpecifier)[];
export type PaymentFieldPolicy = {
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	availableCaptureAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	availableRefundAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	capturedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	creditCard?: FieldPolicy<any> | FieldReadFunction<any>,
	customerIpAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	modified?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodType?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCaptureKeySpecifier = ('errors' | 'payment' | 'paymentErrors' | PaymentCaptureKeySpecifier)[];
export type PaymentCaptureFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCheckBalanceKeySpecifier = ('data' | 'errors' | 'paymentErrors' | PaymentCheckBalanceKeySpecifier)[];
export type PaymentCheckBalanceFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PaymentCountableConnectionKeySpecifier)[];
export type PaymentCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCountableEdgeKeySpecifier = ('cursor' | 'node' | PaymentCountableEdgeKeySpecifier)[];
export type PaymentCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentErrorKeySpecifier = ('code' | 'field' | 'message' | PaymentErrorKeySpecifier)[];
export type PaymentErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayKeySpecifier = ('config' | 'currencies' | 'id' | 'name' | PaymentGatewayKeySpecifier)[];
export type PaymentGatewayFieldPolicy = {
	config?: FieldPolicy<any> | FieldReadFunction<any>,
	currencies?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentInitializeKeySpecifier = ('errors' | 'initializedPayment' | 'paymentErrors' | PaymentInitializeKeySpecifier)[];
export type PaymentInitializeFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	initializedPayment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentInitializedKeySpecifier = ('data' | 'gateway' | 'name' | PaymentInitializedKeySpecifier)[];
export type PaymentInitializedFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentRefundKeySpecifier = ('errors' | 'payment' | 'paymentErrors' | PaymentRefundKeySpecifier)[];
export type PaymentRefundFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentSourceKeySpecifier = ('creditCardInfo' | 'gateway' | 'paymentMethodId' | PaymentSourceKeySpecifier)[];
export type PaymentSourceFieldPolicy = {
	creditCardInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentVoidKeySpecifier = ('errors' | 'payment' | 'paymentErrors' | PaymentVoidKeySpecifier)[];
export type PaymentVoidFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionKeySpecifier = ('code' | 'name' | PermissionKeySpecifier)[];
export type PermissionFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupCreateKeySpecifier = ('errors' | 'group' | 'permissionGroupErrors' | PermissionGroupCreateKeySpecifier)[];
export type PermissionGroupCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupDeleteKeySpecifier = ('errors' | 'group' | 'permissionGroupErrors' | PermissionGroupDeleteKeySpecifier)[];
export type PermissionGroupDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupErrorKeySpecifier = ('code' | 'field' | 'message' | 'permissions' | 'users' | PermissionGroupErrorKeySpecifier)[];
export type PermissionGroupErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupUpdateKeySpecifier = ('errors' | 'group' | 'permissionGroupErrors' | PermissionGroupUpdateKeySpecifier)[];
export type PermissionGroupUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginKeySpecifier = ('channelConfigurations' | 'description' | 'globalConfiguration' | 'id' | 'name' | PluginKeySpecifier)[];
export type PluginFieldPolicy = {
	channelConfigurations?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	globalConfiguration?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginConfigurationKeySpecifier = ('active' | 'channel' | 'configuration' | PluginConfigurationKeySpecifier)[];
export type PluginConfigurationFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	configuration?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | PluginCountableConnectionKeySpecifier)[];
export type PluginCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginCountableEdgeKeySpecifier = ('cursor' | 'node' | PluginCountableEdgeKeySpecifier)[];
export type PluginCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginErrorKeySpecifier = ('code' | 'field' | 'message' | PluginErrorKeySpecifier)[];
export type PluginErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginUpdateKeySpecifier = ('errors' | 'plugin' | 'pluginsErrors' | PluginUpdateKeySpecifier)[];
export type PluginUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	pluginsErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductKeySpecifier = ('attributes' | 'availableForPurchase' | 'category' | 'channel' | 'channelListings' | 'chargeTaxes' | 'collections' | 'defaultVariant' | 'description' | 'descriptionJson' | 'id' | 'imageById' | 'images' | 'isAvailable' | 'isAvailableForPurchase' | 'media' | 'mediaById' | 'metadata' | 'name' | 'pricing' | 'privateMetadata' | 'productType' | 'rating' | 'seoDescription' | 'seoTitle' | 'slug' | 'taxType' | 'thumbnail' | 'translation' | 'updatedAt' | 'variants' | 'weight' | ProductKeySpecifier)[];
export type ProductFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	imageById?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	mediaById?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	rating?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	taxType?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeAssignKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductAttributeAssignKeySpecifier)[];
export type ProductAttributeAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeUnassignKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductAttributeUnassignKeySpecifier)[];
export type ProductAttributeUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductBulkDeleteKeySpecifier)[];
export type ProductBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingKeySpecifier = ('availableForPurchase' | 'channel' | 'discountedPrice' | 'id' | 'isAvailableForPurchase' | 'isPublished' | 'margin' | 'pricing' | 'publicationDate' | 'purchaseCost' | 'visibleInListings' | ProductChannelListingKeySpecifier)[];
export type ProductChannelListingFieldPolicy = {
	availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	discountedPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	purchaseCost?: FieldPolicy<any> | FieldReadFunction<any>,
	visibleInListings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingErrorKeySpecifier = ('attributes' | 'channels' | 'code' | 'field' | 'message' | 'values' | 'variants' | ProductChannelListingErrorKeySpecifier)[];
export type ProductChannelListingErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingUpdateKeySpecifier = ('errors' | 'product' | 'productChannelListingErrors' | ProductChannelListingUpdateKeySpecifier)[];
export type ProductChannelListingUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProductCountableConnectionKeySpecifier)[];
export type ProductCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCountableEdgeKeySpecifier = ('cursor' | 'node' | ProductCountableEdgeKeySpecifier)[];
export type ProductCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCreateKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductCreateKeySpecifier)[];
export type ProductCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductDeleteKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductDeleteKeySpecifier)[];
export type ProductDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductErrorKeySpecifier = ('attributes' | 'code' | 'field' | 'message' | 'values' | ProductErrorKeySpecifier)[];
export type ProductErrorFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductImageKeySpecifier = ('alt' | 'id' | 'sortOrder' | 'url' | ProductImageKeySpecifier)[];
export type ProductImageFieldPolicy = {
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sortOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaKeySpecifier = ('alt' | 'id' | 'oembedData' | 'sortOrder' | 'type' | 'url' | ProductMediaKeySpecifier)[];
export type ProductMediaFieldPolicy = {
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	oembedData?: FieldPolicy<any> | FieldReadFunction<any>,
	sortOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductMediaBulkDeleteKeySpecifier)[];
export type ProductMediaBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaCreateKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaCreateKeySpecifier)[];
export type ProductMediaCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaDeleteKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaDeleteKeySpecifier)[];
export type ProductMediaDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaReorderKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaReorderKeySpecifier)[];
export type ProductMediaReorderFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaUpdateKeySpecifier = ('errors' | 'media' | 'product' | 'productErrors' | ProductMediaUpdateKeySpecifier)[];
export type ProductMediaUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductPricingInfoKeySpecifier = ('discount' | 'discountLocalCurrency' | 'onSale' | 'priceRange' | 'priceRangeLocalCurrency' | 'priceRangeUndiscounted' | ProductPricingInfoKeySpecifier)[];
export type ProductPricingInfoFieldPolicy = {
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	onSale?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRange?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangeLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangeUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductReorderAttributeValuesKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductReorderAttributeValuesKeySpecifier)[];
export type ProductReorderAttributeValuesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslatableContentKeySpecifier = ('attributeValues' | 'description' | 'descriptionJson' | 'id' | 'name' | 'product' | 'seoDescription' | 'seoTitle' | 'translation' | ProductTranslatableContentKeySpecifier)[];
export type ProductTranslatableContentFieldPolicy = {
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslateKeySpecifier = ('errors' | 'product' | 'translationErrors' | ProductTranslateKeySpecifier)[];
export type ProductTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslationKeySpecifier = ('description' | 'descriptionJson' | 'id' | 'language' | 'name' | 'seoDescription' | 'seoTitle' | ProductTranslationKeySpecifier)[];
export type ProductTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeKeySpecifier = ('availableAttributes' | 'hasVariants' | 'id' | 'isDigital' | 'isShippingRequired' | 'metadata' | 'name' | 'privateMetadata' | 'productAttributes' | 'products' | 'slug' | 'taxType' | 'variantAttributes' | 'weight' | ProductTypeKeySpecifier)[];
export type ProductTypeFieldPolicy = {
	availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	hasVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isDigital?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	taxType?: FieldPolicy<any> | FieldReadFunction<any>,
	variantAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductTypeBulkDeleteKeySpecifier)[];
export type ProductTypeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProductTypeCountableConnectionKeySpecifier)[];
export type ProductTypeCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCountableEdgeKeySpecifier = ('cursor' | 'node' | ProductTypeCountableEdgeKeySpecifier)[];
export type ProductTypeCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCreateKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeCreateKeySpecifier)[];
export type ProductTypeCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeDeleteKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeDeleteKeySpecifier)[];
export type ProductTypeDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeReorderAttributesKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeReorderAttributesKeySpecifier)[];
export type ProductTypeReorderAttributesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeUpdateKeySpecifier = ('errors' | 'productErrors' | 'productType' | ProductTypeUpdateKeySpecifier)[];
export type ProductTypeUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductUpdateKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductUpdateKeySpecifier)[];
export type ProductUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantKeySpecifier = ('attributes' | 'channel' | 'channelListings' | 'digitalContent' | 'id' | 'images' | 'margin' | 'media' | 'metadata' | 'name' | 'pricing' | 'privateMetadata' | 'product' | 'quantityAvailable' | 'quantityOrdered' | 'revenue' | 'sku' | 'stocks' | 'trackInventory' | 'translation' | 'weight' | ProductVariantKeySpecifier)[];
export type ProductVariantFieldPolicy = {
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContent?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityAvailable?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityOrdered?: FieldPolicy<any> | FieldReadFunction<any>,
	revenue?: FieldPolicy<any> | FieldReadFunction<any>,
	sku?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	trackInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkCreateKeySpecifier = ('bulkProductErrors' | 'count' | 'errors' | 'productVariants' | ProductVariantBulkCreateKeySpecifier)[];
export type ProductVariantBulkCreateFieldPolicy = {
	bulkProductErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkDeleteKeySpecifier = ('count' | 'errors' | 'productErrors' | ProductVariantBulkDeleteKeySpecifier)[];
export type ProductVariantBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantChannelListingKeySpecifier = ('channel' | 'costPrice' | 'id' | 'margin' | 'price' | ProductVariantChannelListingKeySpecifier)[];
export type ProductVariantChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	costPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantChannelListingUpdateKeySpecifier = ('errors' | 'productChannelListingErrors' | 'variant' | ProductVariantChannelListingUpdateKeySpecifier)[];
export type ProductVariantChannelListingUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ProductVariantCountableConnectionKeySpecifier)[];
export type ProductVariantCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCountableEdgeKeySpecifier = ('cursor' | 'node' | ProductVariantCountableEdgeKeySpecifier)[];
export type ProductVariantCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCreateKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantCreateKeySpecifier)[];
export type ProductVariantCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantDeleteKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantDeleteKeySpecifier)[];
export type ProductVariantDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantReorderKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductVariantReorderKeySpecifier)[];
export type ProductVariantReorderFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantReorderAttributeValuesKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantReorderAttributeValuesKeySpecifier)[];
export type ProductVariantReorderAttributeValuesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantSetDefaultKeySpecifier = ('errors' | 'product' | 'productErrors' | ProductVariantSetDefaultKeySpecifier)[];
export type ProductVariantSetDefaultFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksCreateKeySpecifier = ('bulkStockErrors' | 'errors' | 'productVariant' | ProductVariantStocksCreateKeySpecifier)[];
export type ProductVariantStocksCreateFieldPolicy = {
	bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksDeleteKeySpecifier = ('errors' | 'productVariant' | 'stockErrors' | ProductVariantStocksDeleteKeySpecifier)[];
export type ProductVariantStocksDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	stockErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksUpdateKeySpecifier = ('bulkStockErrors' | 'errors' | 'productVariant' | ProductVariantStocksUpdateKeySpecifier)[];
export type ProductVariantStocksUpdateFieldPolicy = {
	bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslatableContentKeySpecifier = ('attributeValues' | 'id' | 'name' | 'productVariant' | 'translation' | ProductVariantTranslatableContentKeySpecifier)[];
export type ProductVariantTranslatableContentFieldPolicy = {
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslateKeySpecifier = ('errors' | 'productVariant' | 'translationErrors' | ProductVariantTranslateKeySpecifier)[];
export type ProductVariantTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslationKeySpecifier = ('id' | 'language' | 'name' | ProductVariantTranslationKeySpecifier)[];
export type ProductVariantTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantUpdateKeySpecifier = ('errors' | 'productErrors' | 'productVariant' | ProductVariantUpdateKeySpecifier)[];
export type ProductVariantUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('_entities' | '_service' | 'address' | 'addressValidationRules' | 'app' | 'apps' | 'appsInstallations' | 'attribute' | 'attributes' | 'categories' | 'category' | 'channel' | 'channels' | 'checkout' | 'checkoutLines' | 'checkouts' | 'collection' | 'collections' | 'customers' | 'digitalContent' | 'digitalContents' | 'draftOrders' | 'exportFile' | 'exportFiles' | 'giftCard' | 'giftCards' | 'homepageEvents' | 'me' | 'menu' | 'menuItem' | 'menuItems' | 'menus' | 'order' | 'orderByToken' | 'orderSettings' | 'orders' | 'ordersTotal' | 'page' | 'pageType' | 'pageTypes' | 'pages' | 'payment' | 'payments' | 'permissionGroup' | 'permissionGroups' | 'plugin' | 'plugins' | 'product' | 'productType' | 'productTypes' | 'productVariant' | 'productVariants' | 'products' | 'reportProductSales' | 'sale' | 'sales' | 'shippingZone' | 'shippingZones' | 'shop' | 'staffUsers' | 'stock' | 'stocks' | 'taxTypes' | 'translation' | 'translations' | 'user' | 'voucher' | 'vouchers' | 'warehouse' | 'warehouses' | 'webhook' | 'webhookEvents' | 'webhookSamplePayload' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	_entities?: FieldPolicy<any> | FieldReadFunction<any>,
	_service?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	addressValidationRules?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	apps?: FieldPolicy<any> | FieldReadFunction<any>,
	appsInstallations?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLines?: FieldPolicy<any> | FieldReadFunction<any>,
	checkouts?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	customers?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContent?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContents?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFiles?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItems?: FieldPolicy<any> | FieldReadFunction<any>,
	menus?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderByToken?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	ordersTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	pages?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	plugins?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	reportProductSales?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	sales?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	stock?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	taxTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	vouchers?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookSamplePayload?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReducedRateKeySpecifier = ('rate' | 'rateType' | ReducedRateKeySpecifier)[];
export type ReducedRateFieldPolicy = {
	rate?: FieldPolicy<any> | FieldReadFunction<any>,
	rateType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefreshTokenKeySpecifier = ('accountErrors' | 'errors' | 'token' | 'user' | RefreshTokenKeySpecifier)[];
export type RefreshTokenFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RequestEmailChangeKeySpecifier = ('accountErrors' | 'errors' | 'user' | RequestEmailChangeKeySpecifier)[];
export type RequestEmailChangeFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RequestPasswordResetKeySpecifier = ('accountErrors' | 'errors' | RequestPasswordResetKeySpecifier)[];
export type RequestPasswordResetFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleKeySpecifier = ('categories' | 'channelListings' | 'collections' | 'currency' | 'discountValue' | 'endDate' | 'id' | 'metadata' | 'name' | 'privateMetadata' | 'products' | 'startDate' | 'translation' | 'type' | 'variants' | SaleKeySpecifier)[];
export type SaleFieldPolicy = {
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleAddCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleAddCataloguesKeySpecifier)[];
export type SaleAddCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleBulkDeleteKeySpecifier = ('count' | 'discountErrors' | 'errors' | SaleBulkDeleteKeySpecifier)[];
export type SaleBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleChannelListingKeySpecifier = ('channel' | 'currency' | 'discountValue' | 'id' | SaleChannelListingKeySpecifier)[];
export type SaleChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleChannelListingUpdateKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleChannelListingUpdateKeySpecifier)[];
export type SaleChannelListingUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | SaleCountableConnectionKeySpecifier)[];
export type SaleCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCountableEdgeKeySpecifier = ('cursor' | 'node' | SaleCountableEdgeKeySpecifier)[];
export type SaleCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCreateKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleCreateKeySpecifier)[];
export type SaleCreateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleDeleteKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleDeleteKeySpecifier)[];
export type SaleDeleteFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleRemoveCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleRemoveCataloguesKeySpecifier)[];
export type SaleRemoveCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslatableContentKeySpecifier = ('id' | 'name' | 'sale' | 'translation' | SaleTranslatableContentKeySpecifier)[];
export type SaleTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslateKeySpecifier = ('errors' | 'sale' | 'translationErrors' | SaleTranslateKeySpecifier)[];
export type SaleTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslationKeySpecifier = ('id' | 'language' | 'name' | SaleTranslationKeySpecifier)[];
export type SaleTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleUpdateKeySpecifier = ('discountErrors' | 'errors' | 'sale' | SaleUpdateKeySpecifier)[];
export type SaleUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SelectedAttributeKeySpecifier = ('attribute' | 'values' | SelectedAttributeKeySpecifier)[];
export type SelectedAttributeFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SetPasswordKeySpecifier = ('accountErrors' | 'csrfToken' | 'errors' | 'refreshToken' | 'token' | 'user' | SetPasswordKeySpecifier)[];
export type SetPasswordFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingErrorKeySpecifier = ('channels' | 'code' | 'field' | 'message' | 'warehouses' | ShippingErrorKeySpecifier)[];
export type ShippingErrorFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodKeySpecifier = ('channelListings' | 'description' | 'excludedProducts' | 'id' | 'maximumDeliveryDays' | 'maximumOrderPrice' | 'maximumOrderWeight' | 'metadata' | 'minimumDeliveryDays' | 'minimumOrderPrice' | 'minimumOrderWeight' | 'name' | 'postalCodeRules' | 'price' | 'privateMetadata' | 'translation' | 'type' | ShippingMethodKeySpecifier)[];
export type ShippingMethodFieldPolicy = {
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	excludedProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeRules?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodChannelListingKeySpecifier = ('channel' | 'id' | 'maximumOrderPrice' | 'minimumOrderPrice' | 'price' | ShippingMethodChannelListingKeySpecifier)[];
export type ShippingMethodChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodChannelListingUpdateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | ShippingMethodChannelListingUpdateKeySpecifier)[];
export type ShippingMethodChannelListingUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodPostalCodeRuleKeySpecifier = ('end' | 'id' | 'inclusionType' | 'start' | ShippingMethodPostalCodeRuleKeySpecifier)[];
export type ShippingMethodPostalCodeRuleFieldPolicy = {
	end?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inclusionType?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTranslatableContentKeySpecifier = ('description' | 'id' | 'name' | 'shippingMethod' | 'translation' | ShippingMethodTranslatableContentKeySpecifier)[];
export type ShippingMethodTranslatableContentFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTranslationKeySpecifier = ('description' | 'id' | 'language' | 'name' | ShippingMethodTranslationKeySpecifier)[];
export type ShippingMethodTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceBulkDeleteKeySpecifier = ('count' | 'errors' | 'shippingErrors' | ShippingPriceBulkDeleteKeySpecifier)[];
export type ShippingPriceBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceCreateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | 'shippingZone' | ShippingPriceCreateKeySpecifier)[];
export type ShippingPriceCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceDeleteKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | 'shippingZone' | ShippingPriceDeleteKeySpecifier)[];
export type ShippingPriceDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceExcludeProductsKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | ShippingPriceExcludeProductsKeySpecifier)[];
export type ShippingPriceExcludeProductsFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceRemoveProductFromExcludeKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | ShippingPriceRemoveProductFromExcludeKeySpecifier)[];
export type ShippingPriceRemoveProductFromExcludeFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceTranslateKeySpecifier = ('errors' | 'shippingMethod' | 'translationErrors' | ShippingPriceTranslateKeySpecifier)[];
export type ShippingPriceTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceUpdateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingMethod' | 'shippingZone' | ShippingPriceUpdateKeySpecifier)[];
export type ShippingPriceUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneKeySpecifier = ('channels' | 'countries' | 'default' | 'description' | 'id' | 'metadata' | 'name' | 'priceRange' | 'privateMetadata' | 'shippingMethods' | 'warehouses' | ShippingZoneKeySpecifier)[];
export type ShippingZoneFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	default?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRange?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneBulkDeleteKeySpecifier = ('count' | 'errors' | 'shippingErrors' | ShippingZoneBulkDeleteKeySpecifier)[];
export type ShippingZoneBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | ShippingZoneCountableConnectionKeySpecifier)[];
export type ShippingZoneCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCountableEdgeKeySpecifier = ('cursor' | 'node' | ShippingZoneCountableEdgeKeySpecifier)[];
export type ShippingZoneCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCreateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingZone' | ShippingZoneCreateKeySpecifier)[];
export type ShippingZoneCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneDeleteKeySpecifier = ('errors' | 'shippingErrors' | 'shippingZone' | ShippingZoneDeleteKeySpecifier)[];
export type ShippingZoneDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneUpdateKeySpecifier = ('errors' | 'shippingErrors' | 'shippingZone' | ShippingZoneUpdateKeySpecifier)[];
export type ShippingZoneUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopKeySpecifier = ('automaticFulfillmentDigitalProducts' | 'availableExternalAuthentications' | 'availablePaymentGateways' | 'availableShippingMethods' | 'chargeTaxesOnShipping' | 'companyAddress' | 'countries' | 'customerSetPasswordUrl' | 'defaultCountry' | 'defaultDigitalMaxDownloads' | 'defaultDigitalUrlValidDays' | 'defaultMailSenderAddress' | 'defaultMailSenderName' | 'defaultWeightUnit' | 'description' | 'displayGrossPrices' | 'domain' | 'headerText' | 'includeTaxesInPrices' | 'languages' | 'limits' | 'name' | 'permissions' | 'phonePrefixes' | 'staffNotificationRecipients' | 'trackInventoryByDefault' | 'translation' | 'version' | ShopKeySpecifier)[];
export type ShopFieldPolicy = {
	automaticFulfillmentDigitalProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	availableExternalAuthentications?: FieldPolicy<any> | FieldReadFunction<any>,
	availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxesOnShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	companyAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	customerSetPasswordUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultDigitalMaxDownloads?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultDigitalUrlValidDays?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultMailSenderAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultMailSenderName?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultWeightUnit?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	domain?: FieldPolicy<any> | FieldReadFunction<any>,
	headerText?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTaxesInPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	languages?: FieldPolicy<any> | FieldReadFunction<any>,
	limits?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	phonePrefixes?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipients?: FieldPolicy<any> | FieldReadFunction<any>,
	trackInventoryByDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopAddressUpdateKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopAddressUpdateKeySpecifier)[];
export type ShopAddressUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopDomainUpdateKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopDomainUpdateKeySpecifier)[];
export type ShopDomainUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopErrorKeySpecifier = ('code' | 'field' | 'message' | ShopErrorKeySpecifier)[];
export type ShopErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopFetchTaxRatesKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopFetchTaxRatesKeySpecifier)[];
export type ShopFetchTaxRatesFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopSettingsTranslateKeySpecifier = ('errors' | 'shop' | 'translationErrors' | ShopSettingsTranslateKeySpecifier)[];
export type ShopSettingsTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopSettingsUpdateKeySpecifier = ('errors' | 'shop' | 'shopErrors' | ShopSettingsUpdateKeySpecifier)[];
export type ShopSettingsUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopTranslationKeySpecifier = ('description' | 'headerText' | 'id' | 'language' | ShopTranslationKeySpecifier)[];
export type ShopTranslationFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	headerText?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffBulkDeleteKeySpecifier = ('count' | 'errors' | 'staffErrors' | StaffBulkDeleteKeySpecifier)[];
export type StaffBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffCreateKeySpecifier = ('errors' | 'staffErrors' | 'user' | StaffCreateKeySpecifier)[];
export type StaffCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffDeleteKeySpecifier = ('errors' | 'staffErrors' | 'user' | StaffDeleteKeySpecifier)[];
export type StaffDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffErrorKeySpecifier = ('addressType' | 'code' | 'field' | 'groups' | 'message' | 'permissions' | 'users' | StaffErrorKeySpecifier)[];
export type StaffErrorFieldPolicy = {
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	groups?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientKeySpecifier = ('active' | 'email' | 'id' | 'user' | StaffNotificationRecipientKeySpecifier)[];
export type StaffNotificationRecipientFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientCreateKeySpecifier = ('errors' | 'shopErrors' | 'staffNotificationRecipient' | StaffNotificationRecipientCreateKeySpecifier)[];
export type StaffNotificationRecipientCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientDeleteKeySpecifier = ('errors' | 'shopErrors' | 'staffNotificationRecipient' | StaffNotificationRecipientDeleteKeySpecifier)[];
export type StaffNotificationRecipientDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientUpdateKeySpecifier = ('errors' | 'shopErrors' | 'staffNotificationRecipient' | StaffNotificationRecipientUpdateKeySpecifier)[];
export type StaffNotificationRecipientUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffUpdateKeySpecifier = ('errors' | 'staffErrors' | 'user' | StaffUpdateKeySpecifier)[];
export type StaffUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockKeySpecifier = ('id' | 'productVariant' | 'quantity' | 'quantityAllocated' | 'warehouse' | StockKeySpecifier)[];
export type StockFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityAllocated?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | StockCountableConnectionKeySpecifier)[];
export type StockCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockCountableEdgeKeySpecifier = ('cursor' | 'node' | StockCountableEdgeKeySpecifier)[];
export type StockCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockErrorKeySpecifier = ('code' | 'field' | 'message' | StockErrorKeySpecifier)[];
export type StockErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxTypeKeySpecifier = ('description' | 'taxCode' | TaxTypeKeySpecifier)[];
export type TaxTypeFieldPolicy = {
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	taxCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxedMoneyKeySpecifier = ('currency' | 'gross' | 'net' | 'tax' | TaxedMoneyKeySpecifier)[];
export type TaxedMoneyFieldPolicy = {
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	gross?: FieldPolicy<any> | FieldReadFunction<any>,
	net?: FieldPolicy<any> | FieldReadFunction<any>,
	tax?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaxedMoneyRangeKeySpecifier = ('start' | 'stop' | TaxedMoneyRangeKeySpecifier)[];
export type TaxedMoneyRangeFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TransactionKeySpecifier = ('amount' | 'created' | 'error' | 'gatewayResponse' | 'id' | 'isSuccess' | 'kind' | 'payment' | 'token' | TransactionKeySpecifier)[];
export type TransactionFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	error?: FieldPolicy<any> | FieldReadFunction<any>,
	gatewayResponse?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isSuccess?: FieldPolicy<any> | FieldReadFunction<any>,
	kind?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslatableItemConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | TranslatableItemConnectionKeySpecifier)[];
export type TranslatableItemConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslatableItemEdgeKeySpecifier = ('cursor' | 'node' | TranslatableItemEdgeKeySpecifier)[];
export type TranslatableItemEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslationErrorKeySpecifier = ('code' | 'field' | 'message' | TranslationErrorKeySpecifier)[];
export type TranslationErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | UpdateMetadataKeySpecifier)[];
export type UpdateMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdatePrivateMetadataKeySpecifier = ('errors' | 'item' | 'metadataErrors' | UpdatePrivateMetadataKeySpecifier)[];
export type UpdatePrivateMetadataFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>,
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UploadErrorKeySpecifier = ('code' | 'field' | 'message' | UploadErrorKeySpecifier)[];
export type UploadErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('addresses' | 'avatar' | 'checkout' | 'checkoutTokens' | 'dateJoined' | 'defaultBillingAddress' | 'defaultShippingAddress' | 'editableGroups' | 'email' | 'events' | 'firstName' | 'giftCards' | 'id' | 'isActive' | 'isStaff' | 'languageCode' | 'lastLogin' | 'lastName' | 'metadata' | 'note' | 'orders' | 'permissionGroups' | 'privateMetadata' | 'storedPaymentSources' | 'userPermissions' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	addresses?: FieldPolicy<any> | FieldReadFunction<any>,
	avatar?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	dateJoined?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	editableGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	isStaff?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	lastLogin?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	storedPaymentSources?: FieldPolicy<any> | FieldReadFunction<any>,
	userPermissions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAvatarDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | UserAvatarDeleteKeySpecifier)[];
export type UserAvatarDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAvatarUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | UserAvatarUpdateKeySpecifier)[];
export type UserAvatarUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserBulkSetActiveKeySpecifier = ('accountErrors' | 'count' | 'errors' | UserBulkSetActiveKeySpecifier)[];
export type UserBulkSetActiveFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | UserCountableConnectionKeySpecifier)[];
export type UserCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCountableEdgeKeySpecifier = ('cursor' | 'node' | UserCountableEdgeKeySpecifier)[];
export type UserCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserPermissionKeySpecifier = ('code' | 'name' | 'sourcePermissionGroups' | UserPermissionKeySpecifier)[];
export type UserPermissionFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sourcePermissionGroups?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VATKeySpecifier = ('countryCode' | 'reducedRates' | 'standardRate' | VATKeySpecifier)[];
export type VATFieldPolicy = {
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	reducedRates?: FieldPolicy<any> | FieldReadFunction<any>,
	standardRate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantMediaAssignKeySpecifier = ('errors' | 'media' | 'productErrors' | 'productVariant' | VariantMediaAssignKeySpecifier)[];
export type VariantMediaAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantMediaUnassignKeySpecifier = ('errors' | 'media' | 'productErrors' | 'productVariant' | VariantMediaUnassignKeySpecifier)[];
export type VariantMediaUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantPricingInfoKeySpecifier = ('discount' | 'discountLocalCurrency' | 'onSale' | 'price' | 'priceLocalCurrency' | 'priceUndiscounted' | VariantPricingInfoKeySpecifier)[];
export type VariantPricingInfoFieldPolicy = {
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	onSale?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	priceLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	priceUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VerifyTokenKeySpecifier = ('accountErrors' | 'errors' | 'isValid' | 'payload' | 'user' | VerifyTokenKeySpecifier)[];
export type VerifyTokenFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	isValid?: FieldPolicy<any> | FieldReadFunction<any>,
	payload?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherKeySpecifier = ('applyOncePerCustomer' | 'applyOncePerOrder' | 'categories' | 'channelListings' | 'code' | 'collections' | 'countries' | 'currency' | 'discountValue' | 'discountValueType' | 'endDate' | 'id' | 'metadata' | 'minCheckoutItemsQuantity' | 'minSpent' | 'name' | 'onlyForStaff' | 'privateMetadata' | 'products' | 'startDate' | 'translation' | 'type' | 'usageLimit' | 'used' | 'variants' | VoucherKeySpecifier)[];
export type VoucherFieldPolicy = {
	applyOncePerCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	applyOncePerOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	minCheckoutItemsQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	minSpent?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	onlyForStaff?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	usageLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	used?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherAddCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherAddCataloguesKeySpecifier)[];
export type VoucherAddCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherBulkDeleteKeySpecifier = ('count' | 'discountErrors' | 'errors' | VoucherBulkDeleteKeySpecifier)[];
export type VoucherBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherChannelListingKeySpecifier = ('channel' | 'currency' | 'discountValue' | 'id' | 'minSpent' | VoucherChannelListingKeySpecifier)[];
export type VoucherChannelListingFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	minSpent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherChannelListingUpdateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherChannelListingUpdateKeySpecifier)[];
export type VoucherChannelListingUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | VoucherCountableConnectionKeySpecifier)[];
export type VoucherCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCountableEdgeKeySpecifier = ('cursor' | 'node' | VoucherCountableEdgeKeySpecifier)[];
export type VoucherCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCreateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherCreateKeySpecifier)[];
export type VoucherCreateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherDeleteKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherDeleteKeySpecifier)[];
export type VoucherDeleteFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherRemoveCataloguesKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherRemoveCataloguesKeySpecifier)[];
export type VoucherRemoveCataloguesFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'voucher' | VoucherTranslatableContentKeySpecifier)[];
export type VoucherTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslateKeySpecifier = ('errors' | 'translationErrors' | 'voucher' | VoucherTranslateKeySpecifier)[];
export type VoucherTranslateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslationKeySpecifier = ('id' | 'language' | 'name' | VoucherTranslationKeySpecifier)[];
export type VoucherTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherUpdateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherUpdateKeySpecifier)[];
export type VoucherUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseKeySpecifier = ('address' | 'companyName' | 'email' | 'id' | 'metadata' | 'name' | 'privateMetadata' | 'shippingZones' | 'slug' | WarehouseKeySpecifier)[];
export type WarehouseFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	companyName?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCountableConnectionKeySpecifier = ('edges' | 'pageInfo' | 'totalCount' | WarehouseCountableConnectionKeySpecifier)[];
export type WarehouseCountableConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCountableEdgeKeySpecifier = ('cursor' | 'node' | WarehouseCountableEdgeKeySpecifier)[];
export type WarehouseCountableEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCreateKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseCreateKeySpecifier)[];
export type WarehouseCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseDeleteKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseDeleteKeySpecifier)[];
export type WarehouseDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseErrorKeySpecifier = ('code' | 'field' | 'message' | WarehouseErrorKeySpecifier)[];
export type WarehouseErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseShippingZoneAssignKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseShippingZoneAssignKeySpecifier)[];
export type WarehouseShippingZoneAssignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseShippingZoneUnassignKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseShippingZoneUnassignKeySpecifier)[];
export type WarehouseShippingZoneUnassignFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseUpdateKeySpecifier = ('errors' | 'warehouse' | 'warehouseErrors' | WarehouseUpdateKeySpecifier)[];
export type WarehouseUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookKeySpecifier = ('app' | 'events' | 'id' | 'isActive' | 'name' | 'secretKey' | 'targetUrl' | WebhookKeySpecifier)[];
export type WebhookFieldPolicy = {
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	secretKey?: FieldPolicy<any> | FieldReadFunction<any>,
	targetUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookCreateKeySpecifier = ('errors' | 'webhook' | 'webhookErrors' | WebhookCreateKeySpecifier)[];
export type WebhookCreateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookDeleteKeySpecifier = ('errors' | 'webhook' | 'webhookErrors' | WebhookDeleteKeySpecifier)[];
export type WebhookDeleteFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookErrorKeySpecifier = ('code' | 'field' | 'message' | WebhookErrorKeySpecifier)[];
export type WebhookErrorFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookEventKeySpecifier = ('eventType' | 'name' | WebhookEventKeySpecifier)[];
export type WebhookEventFieldPolicy = {
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookUpdateKeySpecifier = ('errors' | 'webhook' | 'webhookErrors' | WebhookUpdateKeySpecifier)[];
export type WebhookUpdateFieldPolicy = {
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WeightKeySpecifier = ('unit' | 'value' | WeightKeySpecifier)[];
export type WeightFieldPolicy = {
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type _ServiceKeySpecifier = ('sdl' | _ServiceKeySpecifier)[];
export type _ServiceFieldPolicy = {
	sdl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	AccountAddressCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountAddressCreateKeySpecifier | (() => undefined | AccountAddressCreateKeySpecifier),
		fields?: AccountAddressCreateFieldPolicy,
	},
	AccountAddressDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountAddressDeleteKeySpecifier | (() => undefined | AccountAddressDeleteKeySpecifier),
		fields?: AccountAddressDeleteFieldPolicy,
	},
	AccountAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountAddressUpdateKeySpecifier | (() => undefined | AccountAddressUpdateKeySpecifier),
		fields?: AccountAddressUpdateFieldPolicy,
	},
	AccountDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountDeleteKeySpecifier | (() => undefined | AccountDeleteKeySpecifier),
		fields?: AccountDeleteFieldPolicy,
	},
	AccountError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountErrorKeySpecifier | (() => undefined | AccountErrorKeySpecifier),
		fields?: AccountErrorFieldPolicy,
	},
	AccountRegister?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountRegisterKeySpecifier | (() => undefined | AccountRegisterKeySpecifier),
		fields?: AccountRegisterFieldPolicy,
	},
	AccountRequestDeletion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountRequestDeletionKeySpecifier | (() => undefined | AccountRequestDeletionKeySpecifier),
		fields?: AccountRequestDeletionFieldPolicy,
	},
	AccountSetDefaultAddress?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountSetDefaultAddressKeySpecifier | (() => undefined | AccountSetDefaultAddressKeySpecifier),
		fields?: AccountSetDefaultAddressFieldPolicy,
	},
	AccountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AccountUpdateKeySpecifier | (() => undefined | AccountUpdateKeySpecifier),
		fields?: AccountUpdateFieldPolicy,
	},
	Address?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressKeySpecifier | (() => undefined | AddressKeySpecifier),
		fields?: AddressFieldPolicy,
	},
	AddressCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressCreateKeySpecifier | (() => undefined | AddressCreateKeySpecifier),
		fields?: AddressCreateFieldPolicy,
	},
	AddressDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressDeleteKeySpecifier | (() => undefined | AddressDeleteKeySpecifier),
		fields?: AddressDeleteFieldPolicy,
	},
	AddressSetDefault?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressSetDefaultKeySpecifier | (() => undefined | AddressSetDefaultKeySpecifier),
		fields?: AddressSetDefaultFieldPolicy,
	},
	AddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressUpdateKeySpecifier | (() => undefined | AddressUpdateKeySpecifier),
		fields?: AddressUpdateFieldPolicy,
	},
	AddressValidationData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AddressValidationDataKeySpecifier | (() => undefined | AddressValidationDataKeySpecifier),
		fields?: AddressValidationDataFieldPolicy,
	},
	Allocation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AllocationKeySpecifier | (() => undefined | AllocationKeySpecifier),
		fields?: AllocationFieldPolicy,
	},
	App?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppKeySpecifier | (() => undefined | AppKeySpecifier),
		fields?: AppFieldPolicy,
	},
	AppActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppActivateKeySpecifier | (() => undefined | AppActivateKeySpecifier),
		fields?: AppActivateFieldPolicy,
	},
	AppCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppCountableConnectionKeySpecifier | (() => undefined | AppCountableConnectionKeySpecifier),
		fields?: AppCountableConnectionFieldPolicy,
	},
	AppCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppCountableEdgeKeySpecifier | (() => undefined | AppCountableEdgeKeySpecifier),
		fields?: AppCountableEdgeFieldPolicy,
	},
	AppCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppCreateKeySpecifier | (() => undefined | AppCreateKeySpecifier),
		fields?: AppCreateFieldPolicy,
	},
	AppDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeactivateKeySpecifier | (() => undefined | AppDeactivateKeySpecifier),
		fields?: AppDeactivateFieldPolicy,
	},
	AppDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeleteKeySpecifier | (() => undefined | AppDeleteKeySpecifier),
		fields?: AppDeleteFieldPolicy,
	},
	AppDeleteFailedInstallation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppDeleteFailedInstallationKeySpecifier | (() => undefined | AppDeleteFailedInstallationKeySpecifier),
		fields?: AppDeleteFailedInstallationFieldPolicy,
	},
	AppError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppErrorKeySpecifier | (() => undefined | AppErrorKeySpecifier),
		fields?: AppErrorFieldPolicy,
	},
	AppFetchManifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppFetchManifestKeySpecifier | (() => undefined | AppFetchManifestKeySpecifier),
		fields?: AppFetchManifestFieldPolicy,
	},
	AppInstall?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppInstallKeySpecifier | (() => undefined | AppInstallKeySpecifier),
		fields?: AppInstallFieldPolicy,
	},
	AppInstallation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppInstallationKeySpecifier | (() => undefined | AppInstallationKeySpecifier),
		fields?: AppInstallationFieldPolicy,
	},
	AppRetryInstall?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppRetryInstallKeySpecifier | (() => undefined | AppRetryInstallKeySpecifier),
		fields?: AppRetryInstallFieldPolicy,
	},
	AppToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenKeySpecifier | (() => undefined | AppTokenKeySpecifier),
		fields?: AppTokenFieldPolicy,
	},
	AppTokenCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenCreateKeySpecifier | (() => undefined | AppTokenCreateKeySpecifier),
		fields?: AppTokenCreateFieldPolicy,
	},
	AppTokenDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenDeleteKeySpecifier | (() => undefined | AppTokenDeleteKeySpecifier),
		fields?: AppTokenDeleteFieldPolicy,
	},
	AppTokenVerify?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppTokenVerifyKeySpecifier | (() => undefined | AppTokenVerifyKeySpecifier),
		fields?: AppTokenVerifyFieldPolicy,
	},
	AppUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AppUpdateKeySpecifier | (() => undefined | AppUpdateKeySpecifier),
		fields?: AppUpdateFieldPolicy,
	},
	AssignNavigation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AssignNavigationKeySpecifier | (() => undefined | AssignNavigationKeySpecifier),
		fields?: AssignNavigationFieldPolicy,
	},
	Attribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeKeySpecifier | (() => undefined | AttributeKeySpecifier),
		fields?: AttributeFieldPolicy,
	},
	AttributeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeBulkDeleteKeySpecifier | (() => undefined | AttributeBulkDeleteKeySpecifier),
		fields?: AttributeBulkDeleteFieldPolicy,
	},
	AttributeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCountableConnectionKeySpecifier | (() => undefined | AttributeCountableConnectionKeySpecifier),
		fields?: AttributeCountableConnectionFieldPolicy,
	},
	AttributeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCountableEdgeKeySpecifier | (() => undefined | AttributeCountableEdgeKeySpecifier),
		fields?: AttributeCountableEdgeFieldPolicy,
	},
	AttributeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeCreateKeySpecifier | (() => undefined | AttributeCreateKeySpecifier),
		fields?: AttributeCreateFieldPolicy,
	},
	AttributeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeDeleteKeySpecifier | (() => undefined | AttributeDeleteKeySpecifier),
		fields?: AttributeDeleteFieldPolicy,
	},
	AttributeError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeErrorKeySpecifier | (() => undefined | AttributeErrorKeySpecifier),
		fields?: AttributeErrorFieldPolicy,
	},
	AttributeReorderValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeReorderValuesKeySpecifier | (() => undefined | AttributeReorderValuesKeySpecifier),
		fields?: AttributeReorderValuesFieldPolicy,
	},
	AttributeTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeTranslatableContentKeySpecifier | (() => undefined | AttributeTranslatableContentKeySpecifier),
		fields?: AttributeTranslatableContentFieldPolicy,
	},
	AttributeTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeTranslateKeySpecifier | (() => undefined | AttributeTranslateKeySpecifier),
		fields?: AttributeTranslateFieldPolicy,
	},
	AttributeTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeTranslationKeySpecifier | (() => undefined | AttributeTranslationKeySpecifier),
		fields?: AttributeTranslationFieldPolicy,
	},
	AttributeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeUpdateKeySpecifier | (() => undefined | AttributeUpdateKeySpecifier),
		fields?: AttributeUpdateFieldPolicy,
	},
	AttributeValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueKeySpecifier | (() => undefined | AttributeValueKeySpecifier),
		fields?: AttributeValueFieldPolicy,
	},
	AttributeValueBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueBulkDeleteKeySpecifier | (() => undefined | AttributeValueBulkDeleteKeySpecifier),
		fields?: AttributeValueBulkDeleteFieldPolicy,
	},
	AttributeValueCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCountableConnectionKeySpecifier | (() => undefined | AttributeValueCountableConnectionKeySpecifier),
		fields?: AttributeValueCountableConnectionFieldPolicy,
	},
	AttributeValueCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCountableEdgeKeySpecifier | (() => undefined | AttributeValueCountableEdgeKeySpecifier),
		fields?: AttributeValueCountableEdgeFieldPolicy,
	},
	AttributeValueCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueCreateKeySpecifier | (() => undefined | AttributeValueCreateKeySpecifier),
		fields?: AttributeValueCreateFieldPolicy,
	},
	AttributeValueDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueDeleteKeySpecifier | (() => undefined | AttributeValueDeleteKeySpecifier),
		fields?: AttributeValueDeleteFieldPolicy,
	},
	AttributeValueTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueTranslatableContentKeySpecifier | (() => undefined | AttributeValueTranslatableContentKeySpecifier),
		fields?: AttributeValueTranslatableContentFieldPolicy,
	},
	AttributeValueTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueTranslateKeySpecifier | (() => undefined | AttributeValueTranslateKeySpecifier),
		fields?: AttributeValueTranslateFieldPolicy,
	},
	AttributeValueTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueTranslationKeySpecifier | (() => undefined | AttributeValueTranslationKeySpecifier),
		fields?: AttributeValueTranslationFieldPolicy,
	},
	AttributeValueUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AttributeValueUpdateKeySpecifier | (() => undefined | AttributeValueUpdateKeySpecifier),
		fields?: AttributeValueUpdateFieldPolicy,
	},
	BulkProductError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BulkProductErrorKeySpecifier | (() => undefined | BulkProductErrorKeySpecifier),
		fields?: BulkProductErrorFieldPolicy,
	},
	BulkStockError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BulkStockErrorKeySpecifier | (() => undefined | BulkStockErrorKeySpecifier),
		fields?: BulkStockErrorFieldPolicy,
	},
	Category?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryKeySpecifier | (() => undefined | CategoryKeySpecifier),
		fields?: CategoryFieldPolicy,
	},
	CategoryBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryBulkDeleteKeySpecifier | (() => undefined | CategoryBulkDeleteKeySpecifier),
		fields?: CategoryBulkDeleteFieldPolicy,
	},
	CategoryCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCountableConnectionKeySpecifier | (() => undefined | CategoryCountableConnectionKeySpecifier),
		fields?: CategoryCountableConnectionFieldPolicy,
	},
	CategoryCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCountableEdgeKeySpecifier | (() => undefined | CategoryCountableEdgeKeySpecifier),
		fields?: CategoryCountableEdgeFieldPolicy,
	},
	CategoryCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryCreateKeySpecifier | (() => undefined | CategoryCreateKeySpecifier),
		fields?: CategoryCreateFieldPolicy,
	},
	CategoryDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryDeleteKeySpecifier | (() => undefined | CategoryDeleteKeySpecifier),
		fields?: CategoryDeleteFieldPolicy,
	},
	CategoryTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryTranslatableContentKeySpecifier | (() => undefined | CategoryTranslatableContentKeySpecifier),
		fields?: CategoryTranslatableContentFieldPolicy,
	},
	CategoryTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryTranslateKeySpecifier | (() => undefined | CategoryTranslateKeySpecifier),
		fields?: CategoryTranslateFieldPolicy,
	},
	CategoryTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryTranslationKeySpecifier | (() => undefined | CategoryTranslationKeySpecifier),
		fields?: CategoryTranslationFieldPolicy,
	},
	CategoryUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CategoryUpdateKeySpecifier | (() => undefined | CategoryUpdateKeySpecifier),
		fields?: CategoryUpdateFieldPolicy,
	},
	Channel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelKeySpecifier | (() => undefined | ChannelKeySpecifier),
		fields?: ChannelFieldPolicy,
	},
	ChannelActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelActivateKeySpecifier | (() => undefined | ChannelActivateKeySpecifier),
		fields?: ChannelActivateFieldPolicy,
	},
	ChannelCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelCreateKeySpecifier | (() => undefined | ChannelCreateKeySpecifier),
		fields?: ChannelCreateFieldPolicy,
	},
	ChannelDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelDeactivateKeySpecifier | (() => undefined | ChannelDeactivateKeySpecifier),
		fields?: ChannelDeactivateFieldPolicy,
	},
	ChannelDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelDeleteKeySpecifier | (() => undefined | ChannelDeleteKeySpecifier),
		fields?: ChannelDeleteFieldPolicy,
	},
	ChannelError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelErrorKeySpecifier | (() => undefined | ChannelErrorKeySpecifier),
		fields?: ChannelErrorFieldPolicy,
	},
	ChannelUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChannelUpdateKeySpecifier | (() => undefined | ChannelUpdateKeySpecifier),
		fields?: ChannelUpdateFieldPolicy,
	},
	Checkout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutKeySpecifier | (() => undefined | CheckoutKeySpecifier),
		fields?: CheckoutFieldPolicy,
	},
	CheckoutAddPromoCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutAddPromoCodeKeySpecifier | (() => undefined | CheckoutAddPromoCodeKeySpecifier),
		fields?: CheckoutAddPromoCodeFieldPolicy,
	},
	CheckoutBillingAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutBillingAddressUpdateKeySpecifier | (() => undefined | CheckoutBillingAddressUpdateKeySpecifier),
		fields?: CheckoutBillingAddressUpdateFieldPolicy,
	},
	CheckoutComplete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCompleteKeySpecifier | (() => undefined | CheckoutCompleteKeySpecifier),
		fields?: CheckoutCompleteFieldPolicy,
	},
	CheckoutCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCountableConnectionKeySpecifier | (() => undefined | CheckoutCountableConnectionKeySpecifier),
		fields?: CheckoutCountableConnectionFieldPolicy,
	},
	CheckoutCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCountableEdgeKeySpecifier | (() => undefined | CheckoutCountableEdgeKeySpecifier),
		fields?: CheckoutCountableEdgeFieldPolicy,
	},
	CheckoutCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCreateKeySpecifier | (() => undefined | CheckoutCreateKeySpecifier),
		fields?: CheckoutCreateFieldPolicy,
	},
	CheckoutCustomerAttach?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCustomerAttachKeySpecifier | (() => undefined | CheckoutCustomerAttachKeySpecifier),
		fields?: CheckoutCustomerAttachFieldPolicy,
	},
	CheckoutCustomerDetach?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutCustomerDetachKeySpecifier | (() => undefined | CheckoutCustomerDetachKeySpecifier),
		fields?: CheckoutCustomerDetachFieldPolicy,
	},
	CheckoutEmailUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutEmailUpdateKeySpecifier | (() => undefined | CheckoutEmailUpdateKeySpecifier),
		fields?: CheckoutEmailUpdateFieldPolicy,
	},
	CheckoutError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutErrorKeySpecifier | (() => undefined | CheckoutErrorKeySpecifier),
		fields?: CheckoutErrorFieldPolicy,
	},
	CheckoutLanguageCodeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLanguageCodeUpdateKeySpecifier | (() => undefined | CheckoutLanguageCodeUpdateKeySpecifier),
		fields?: CheckoutLanguageCodeUpdateFieldPolicy,
	},
	CheckoutLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineKeySpecifier | (() => undefined | CheckoutLineKeySpecifier),
		fields?: CheckoutLineFieldPolicy,
	},
	CheckoutLineCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineCountableConnectionKeySpecifier | (() => undefined | CheckoutLineCountableConnectionKeySpecifier),
		fields?: CheckoutLineCountableConnectionFieldPolicy,
	},
	CheckoutLineCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineCountableEdgeKeySpecifier | (() => undefined | CheckoutLineCountableEdgeKeySpecifier),
		fields?: CheckoutLineCountableEdgeFieldPolicy,
	},
	CheckoutLineDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLineDeleteKeySpecifier | (() => undefined | CheckoutLineDeleteKeySpecifier),
		fields?: CheckoutLineDeleteFieldPolicy,
	},
	CheckoutLinesAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLinesAddKeySpecifier | (() => undefined | CheckoutLinesAddKeySpecifier),
		fields?: CheckoutLinesAddFieldPolicy,
	},
	CheckoutLinesDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLinesDeleteKeySpecifier | (() => undefined | CheckoutLinesDeleteKeySpecifier),
		fields?: CheckoutLinesDeleteFieldPolicy,
	},
	CheckoutLinesUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutLinesUpdateKeySpecifier | (() => undefined | CheckoutLinesUpdateKeySpecifier),
		fields?: CheckoutLinesUpdateFieldPolicy,
	},
	CheckoutPaymentCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutPaymentCreateKeySpecifier | (() => undefined | CheckoutPaymentCreateKeySpecifier),
		fields?: CheckoutPaymentCreateFieldPolicy,
	},
	CheckoutRemovePromoCode?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutRemovePromoCodeKeySpecifier | (() => undefined | CheckoutRemovePromoCodeKeySpecifier),
		fields?: CheckoutRemovePromoCodeFieldPolicy,
	},
	CheckoutShippingAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutShippingAddressUpdateKeySpecifier | (() => undefined | CheckoutShippingAddressUpdateKeySpecifier),
		fields?: CheckoutShippingAddressUpdateFieldPolicy,
	},
	CheckoutShippingMethodUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckoutShippingMethodUpdateKeySpecifier | (() => undefined | CheckoutShippingMethodUpdateKeySpecifier),
		fields?: CheckoutShippingMethodUpdateFieldPolicy,
	},
	ChoiceValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ChoiceValueKeySpecifier | (() => undefined | ChoiceValueKeySpecifier),
		fields?: ChoiceValueFieldPolicy,
	},
	Collection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionKeySpecifier | (() => undefined | CollectionKeySpecifier),
		fields?: CollectionFieldPolicy,
	},
	CollectionAddProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionAddProductsKeySpecifier | (() => undefined | CollectionAddProductsKeySpecifier),
		fields?: CollectionAddProductsFieldPolicy,
	},
	CollectionBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionBulkDeleteKeySpecifier | (() => undefined | CollectionBulkDeleteKeySpecifier),
		fields?: CollectionBulkDeleteFieldPolicy,
	},
	CollectionChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionChannelListingKeySpecifier | (() => undefined | CollectionChannelListingKeySpecifier),
		fields?: CollectionChannelListingFieldPolicy,
	},
	CollectionChannelListingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionChannelListingErrorKeySpecifier | (() => undefined | CollectionChannelListingErrorKeySpecifier),
		fields?: CollectionChannelListingErrorFieldPolicy,
	},
	CollectionChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionChannelListingUpdateKeySpecifier | (() => undefined | CollectionChannelListingUpdateKeySpecifier),
		fields?: CollectionChannelListingUpdateFieldPolicy,
	},
	CollectionCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCountableConnectionKeySpecifier | (() => undefined | CollectionCountableConnectionKeySpecifier),
		fields?: CollectionCountableConnectionFieldPolicy,
	},
	CollectionCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCountableEdgeKeySpecifier | (() => undefined | CollectionCountableEdgeKeySpecifier),
		fields?: CollectionCountableEdgeFieldPolicy,
	},
	CollectionCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionCreateKeySpecifier | (() => undefined | CollectionCreateKeySpecifier),
		fields?: CollectionCreateFieldPolicy,
	},
	CollectionDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionDeleteKeySpecifier | (() => undefined | CollectionDeleteKeySpecifier),
		fields?: CollectionDeleteFieldPolicy,
	},
	CollectionError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionErrorKeySpecifier | (() => undefined | CollectionErrorKeySpecifier),
		fields?: CollectionErrorFieldPolicy,
	},
	CollectionRemoveProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionRemoveProductsKeySpecifier | (() => undefined | CollectionRemoveProductsKeySpecifier),
		fields?: CollectionRemoveProductsFieldPolicy,
	},
	CollectionReorderProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionReorderProductsKeySpecifier | (() => undefined | CollectionReorderProductsKeySpecifier),
		fields?: CollectionReorderProductsFieldPolicy,
	},
	CollectionTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionTranslatableContentKeySpecifier | (() => undefined | CollectionTranslatableContentKeySpecifier),
		fields?: CollectionTranslatableContentFieldPolicy,
	},
	CollectionTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionTranslateKeySpecifier | (() => undefined | CollectionTranslateKeySpecifier),
		fields?: CollectionTranslateFieldPolicy,
	},
	CollectionTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionTranslationKeySpecifier | (() => undefined | CollectionTranslationKeySpecifier),
		fields?: CollectionTranslationFieldPolicy,
	},
	CollectionUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CollectionUpdateKeySpecifier | (() => undefined | CollectionUpdateKeySpecifier),
		fields?: CollectionUpdateFieldPolicy,
	},
	ConfigurationItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConfigurationItemKeySpecifier | (() => undefined | ConfigurationItemKeySpecifier),
		fields?: ConfigurationItemFieldPolicy,
	},
	ConfirmAccount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConfirmAccountKeySpecifier | (() => undefined | ConfirmAccountKeySpecifier),
		fields?: ConfirmAccountFieldPolicy,
	},
	ConfirmEmailChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConfirmEmailChangeKeySpecifier | (() => undefined | ConfirmEmailChangeKeySpecifier),
		fields?: ConfirmEmailChangeFieldPolicy,
	},
	CountryDisplay?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CountryDisplayKeySpecifier | (() => undefined | CountryDisplayKeySpecifier),
		fields?: CountryDisplayFieldPolicy,
	},
	CreateToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateTokenKeySpecifier | (() => undefined | CreateTokenKeySpecifier),
		fields?: CreateTokenFieldPolicy,
	},
	CreditCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreditCardKeySpecifier | (() => undefined | CreditCardKeySpecifier),
		fields?: CreditCardFieldPolicy,
	},
	CustomerBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerBulkDeleteKeySpecifier | (() => undefined | CustomerBulkDeleteKeySpecifier),
		fields?: CustomerBulkDeleteFieldPolicy,
	},
	CustomerCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerCreateKeySpecifier | (() => undefined | CustomerCreateKeySpecifier),
		fields?: CustomerCreateFieldPolicy,
	},
	CustomerDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerDeleteKeySpecifier | (() => undefined | CustomerDeleteKeySpecifier),
		fields?: CustomerDeleteFieldPolicy,
	},
	CustomerEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerEventKeySpecifier | (() => undefined | CustomerEventKeySpecifier),
		fields?: CustomerEventFieldPolicy,
	},
	CustomerUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CustomerUpdateKeySpecifier | (() => undefined | CustomerUpdateKeySpecifier),
		fields?: CustomerUpdateFieldPolicy,
	},
	DeactivateAllUserTokens?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeactivateAllUserTokensKeySpecifier | (() => undefined | DeactivateAllUserTokensKeySpecifier),
		fields?: DeactivateAllUserTokensFieldPolicy,
	},
	DeleteMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteMetadataKeySpecifier | (() => undefined | DeleteMetadataKeySpecifier),
		fields?: DeleteMetadataFieldPolicy,
	},
	DeletePrivateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeletePrivateMetadataKeySpecifier | (() => undefined | DeletePrivateMetadataKeySpecifier),
		fields?: DeletePrivateMetadataFieldPolicy,
	},
	DigitalContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentKeySpecifier | (() => undefined | DigitalContentKeySpecifier),
		fields?: DigitalContentFieldPolicy,
	},
	DigitalContentCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentCountableConnectionKeySpecifier | (() => undefined | DigitalContentCountableConnectionKeySpecifier),
		fields?: DigitalContentCountableConnectionFieldPolicy,
	},
	DigitalContentCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentCountableEdgeKeySpecifier | (() => undefined | DigitalContentCountableEdgeKeySpecifier),
		fields?: DigitalContentCountableEdgeFieldPolicy,
	},
	DigitalContentCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentCreateKeySpecifier | (() => undefined | DigitalContentCreateKeySpecifier),
		fields?: DigitalContentCreateFieldPolicy,
	},
	DigitalContentDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentDeleteKeySpecifier | (() => undefined | DigitalContentDeleteKeySpecifier),
		fields?: DigitalContentDeleteFieldPolicy,
	},
	DigitalContentUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentUpdateKeySpecifier | (() => undefined | DigitalContentUpdateKeySpecifier),
		fields?: DigitalContentUpdateFieldPolicy,
	},
	DigitalContentUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentUrlKeySpecifier | (() => undefined | DigitalContentUrlKeySpecifier),
		fields?: DigitalContentUrlFieldPolicy,
	},
	DigitalContentUrlCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DigitalContentUrlCreateKeySpecifier | (() => undefined | DigitalContentUrlCreateKeySpecifier),
		fields?: DigitalContentUrlCreateFieldPolicy,
	},
	DiscountError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DiscountErrorKeySpecifier | (() => undefined | DiscountErrorKeySpecifier),
		fields?: DiscountErrorFieldPolicy,
	},
	Domain?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DomainKeySpecifier | (() => undefined | DomainKeySpecifier),
		fields?: DomainFieldPolicy,
	},
	DraftOrderBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderBulkDeleteKeySpecifier | (() => undefined | DraftOrderBulkDeleteKeySpecifier),
		fields?: DraftOrderBulkDeleteFieldPolicy,
	},
	DraftOrderComplete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderCompleteKeySpecifier | (() => undefined | DraftOrderCompleteKeySpecifier),
		fields?: DraftOrderCompleteFieldPolicy,
	},
	DraftOrderCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderCreateKeySpecifier | (() => undefined | DraftOrderCreateKeySpecifier),
		fields?: DraftOrderCreateFieldPolicy,
	},
	DraftOrderDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderDeleteKeySpecifier | (() => undefined | DraftOrderDeleteKeySpecifier),
		fields?: DraftOrderDeleteFieldPolicy,
	},
	DraftOrderLinesBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderLinesBulkDeleteKeySpecifier | (() => undefined | DraftOrderLinesBulkDeleteKeySpecifier),
		fields?: DraftOrderLinesBulkDeleteFieldPolicy,
	},
	DraftOrderUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DraftOrderUpdateKeySpecifier | (() => undefined | DraftOrderUpdateKeySpecifier),
		fields?: DraftOrderUpdateFieldPolicy,
	},
	ExportError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportErrorKeySpecifier | (() => undefined | ExportErrorKeySpecifier),
		fields?: ExportErrorFieldPolicy,
	},
	ExportEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportEventKeySpecifier | (() => undefined | ExportEventKeySpecifier),
		fields?: ExportEventFieldPolicy,
	},
	ExportFile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportFileKeySpecifier | (() => undefined | ExportFileKeySpecifier),
		fields?: ExportFileFieldPolicy,
	},
	ExportFileCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportFileCountableConnectionKeySpecifier | (() => undefined | ExportFileCountableConnectionKeySpecifier),
		fields?: ExportFileCountableConnectionFieldPolicy,
	},
	ExportFileCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportFileCountableEdgeKeySpecifier | (() => undefined | ExportFileCountableEdgeKeySpecifier),
		fields?: ExportFileCountableEdgeFieldPolicy,
	},
	ExportProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExportProductsKeySpecifier | (() => undefined | ExportProductsKeySpecifier),
		fields?: ExportProductsFieldPolicy,
	},
	ExternalAuthentication?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalAuthenticationKeySpecifier | (() => undefined | ExternalAuthenticationKeySpecifier),
		fields?: ExternalAuthenticationFieldPolicy,
	},
	ExternalAuthenticationUrl?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalAuthenticationUrlKeySpecifier | (() => undefined | ExternalAuthenticationUrlKeySpecifier),
		fields?: ExternalAuthenticationUrlFieldPolicy,
	},
	ExternalLogout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalLogoutKeySpecifier | (() => undefined | ExternalLogoutKeySpecifier),
		fields?: ExternalLogoutFieldPolicy,
	},
	ExternalObtainAccessTokens?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalObtainAccessTokensKeySpecifier | (() => undefined | ExternalObtainAccessTokensKeySpecifier),
		fields?: ExternalObtainAccessTokensFieldPolicy,
	},
	ExternalRefresh?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalRefreshKeySpecifier | (() => undefined | ExternalRefreshKeySpecifier),
		fields?: ExternalRefreshFieldPolicy,
	},
	ExternalVerify?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExternalVerifyKeySpecifier | (() => undefined | ExternalVerifyKeySpecifier),
		fields?: ExternalVerifyFieldPolicy,
	},
	File?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	FileUpload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileUploadKeySpecifier | (() => undefined | FileUploadKeySpecifier),
		fields?: FileUploadFieldPolicy,
	},
	Fulfillment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentKeySpecifier | (() => undefined | FulfillmentKeySpecifier),
		fields?: FulfillmentFieldPolicy,
	},
	FulfillmentCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentCancelKeySpecifier | (() => undefined | FulfillmentCancelKeySpecifier),
		fields?: FulfillmentCancelFieldPolicy,
	},
	FulfillmentLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentLineKeySpecifier | (() => undefined | FulfillmentLineKeySpecifier),
		fields?: FulfillmentLineFieldPolicy,
	},
	FulfillmentRefundProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentRefundProductsKeySpecifier | (() => undefined | FulfillmentRefundProductsKeySpecifier),
		fields?: FulfillmentRefundProductsFieldPolicy,
	},
	FulfillmentReturnProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentReturnProductsKeySpecifier | (() => undefined | FulfillmentReturnProductsKeySpecifier),
		fields?: FulfillmentReturnProductsFieldPolicy,
	},
	FulfillmentUpdateTracking?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FulfillmentUpdateTrackingKeySpecifier | (() => undefined | FulfillmentUpdateTrackingKeySpecifier),
		fields?: FulfillmentUpdateTrackingFieldPolicy,
	},
	GatewayConfigLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GatewayConfigLineKeySpecifier | (() => undefined | GatewayConfigLineKeySpecifier),
		fields?: GatewayConfigLineFieldPolicy,
	},
	GiftCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardKeySpecifier | (() => undefined | GiftCardKeySpecifier),
		fields?: GiftCardFieldPolicy,
	},
	GiftCardActivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardActivateKeySpecifier | (() => undefined | GiftCardActivateKeySpecifier),
		fields?: GiftCardActivateFieldPolicy,
	},
	GiftCardCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCountableConnectionKeySpecifier | (() => undefined | GiftCardCountableConnectionKeySpecifier),
		fields?: GiftCardCountableConnectionFieldPolicy,
	},
	GiftCardCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCountableEdgeKeySpecifier | (() => undefined | GiftCardCountableEdgeKeySpecifier),
		fields?: GiftCardCountableEdgeFieldPolicy,
	},
	GiftCardCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardCreateKeySpecifier | (() => undefined | GiftCardCreateKeySpecifier),
		fields?: GiftCardCreateFieldPolicy,
	},
	GiftCardDeactivate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardDeactivateKeySpecifier | (() => undefined | GiftCardDeactivateKeySpecifier),
		fields?: GiftCardDeactivateFieldPolicy,
	},
	GiftCardError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardErrorKeySpecifier | (() => undefined | GiftCardErrorKeySpecifier),
		fields?: GiftCardErrorFieldPolicy,
	},
	GiftCardUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GiftCardUpdateKeySpecifier | (() => undefined | GiftCardUpdateKeySpecifier),
		fields?: GiftCardUpdateFieldPolicy,
	},
	Group?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupKeySpecifier | (() => undefined | GroupKeySpecifier),
		fields?: GroupFieldPolicy,
	},
	GroupCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupCountableConnectionKeySpecifier | (() => undefined | GroupCountableConnectionKeySpecifier),
		fields?: GroupCountableConnectionFieldPolicy,
	},
	GroupCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GroupCountableEdgeKeySpecifier | (() => undefined | GroupCountableEdgeKeySpecifier),
		fields?: GroupCountableEdgeFieldPolicy,
	},
	Image?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ImageKeySpecifier | (() => undefined | ImageKeySpecifier),
		fields?: ImageFieldPolicy,
	},
	Invoice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceKeySpecifier | (() => undefined | InvoiceKeySpecifier),
		fields?: InvoiceFieldPolicy,
	},
	InvoiceCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceCreateKeySpecifier | (() => undefined | InvoiceCreateKeySpecifier),
		fields?: InvoiceCreateFieldPolicy,
	},
	InvoiceDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceDeleteKeySpecifier | (() => undefined | InvoiceDeleteKeySpecifier),
		fields?: InvoiceDeleteFieldPolicy,
	},
	InvoiceError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceErrorKeySpecifier | (() => undefined | InvoiceErrorKeySpecifier),
		fields?: InvoiceErrorFieldPolicy,
	},
	InvoiceRequest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceRequestKeySpecifier | (() => undefined | InvoiceRequestKeySpecifier),
		fields?: InvoiceRequestFieldPolicy,
	},
	InvoiceRequestDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceRequestDeleteKeySpecifier | (() => undefined | InvoiceRequestDeleteKeySpecifier),
		fields?: InvoiceRequestDeleteFieldPolicy,
	},
	InvoiceSendNotification?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceSendNotificationKeySpecifier | (() => undefined | InvoiceSendNotificationKeySpecifier),
		fields?: InvoiceSendNotificationFieldPolicy,
	},
	InvoiceUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InvoiceUpdateKeySpecifier | (() => undefined | InvoiceUpdateKeySpecifier),
		fields?: InvoiceUpdateFieldPolicy,
	},
	Job?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JobKeySpecifier | (() => undefined | JobKeySpecifier),
		fields?: JobFieldPolicy,
	},
	LanguageDisplay?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LanguageDisplayKeySpecifier | (() => undefined | LanguageDisplayKeySpecifier),
		fields?: LanguageDisplayFieldPolicy,
	},
	LimitInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LimitInfoKeySpecifier | (() => undefined | LimitInfoKeySpecifier),
		fields?: LimitInfoFieldPolicy,
	},
	Limits?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LimitsKeySpecifier | (() => undefined | LimitsKeySpecifier),
		fields?: LimitsFieldPolicy,
	},
	Manifest?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ManifestKeySpecifier | (() => undefined | ManifestKeySpecifier),
		fields?: ManifestFieldPolicy,
	},
	Margin?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MarginKeySpecifier | (() => undefined | MarginKeySpecifier),
		fields?: MarginFieldPolicy,
	},
	Menu?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuKeySpecifier | (() => undefined | MenuKeySpecifier),
		fields?: MenuFieldPolicy,
	},
	MenuBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuBulkDeleteKeySpecifier | (() => undefined | MenuBulkDeleteKeySpecifier),
		fields?: MenuBulkDeleteFieldPolicy,
	},
	MenuCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCountableConnectionKeySpecifier | (() => undefined | MenuCountableConnectionKeySpecifier),
		fields?: MenuCountableConnectionFieldPolicy,
	},
	MenuCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCountableEdgeKeySpecifier | (() => undefined | MenuCountableEdgeKeySpecifier),
		fields?: MenuCountableEdgeFieldPolicy,
	},
	MenuCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuCreateKeySpecifier | (() => undefined | MenuCreateKeySpecifier),
		fields?: MenuCreateFieldPolicy,
	},
	MenuDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuDeleteKeySpecifier | (() => undefined | MenuDeleteKeySpecifier),
		fields?: MenuDeleteFieldPolicy,
	},
	MenuError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuErrorKeySpecifier | (() => undefined | MenuErrorKeySpecifier),
		fields?: MenuErrorFieldPolicy,
	},
	MenuItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemKeySpecifier | (() => undefined | MenuItemKeySpecifier),
		fields?: MenuItemFieldPolicy,
	},
	MenuItemBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemBulkDeleteKeySpecifier | (() => undefined | MenuItemBulkDeleteKeySpecifier),
		fields?: MenuItemBulkDeleteFieldPolicy,
	},
	MenuItemCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCountableConnectionKeySpecifier | (() => undefined | MenuItemCountableConnectionKeySpecifier),
		fields?: MenuItemCountableConnectionFieldPolicy,
	},
	MenuItemCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCountableEdgeKeySpecifier | (() => undefined | MenuItemCountableEdgeKeySpecifier),
		fields?: MenuItemCountableEdgeFieldPolicy,
	},
	MenuItemCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemCreateKeySpecifier | (() => undefined | MenuItemCreateKeySpecifier),
		fields?: MenuItemCreateFieldPolicy,
	},
	MenuItemDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemDeleteKeySpecifier | (() => undefined | MenuItemDeleteKeySpecifier),
		fields?: MenuItemDeleteFieldPolicy,
	},
	MenuItemMove?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemMoveKeySpecifier | (() => undefined | MenuItemMoveKeySpecifier),
		fields?: MenuItemMoveFieldPolicy,
	},
	MenuItemTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemTranslatableContentKeySpecifier | (() => undefined | MenuItemTranslatableContentKeySpecifier),
		fields?: MenuItemTranslatableContentFieldPolicy,
	},
	MenuItemTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemTranslateKeySpecifier | (() => undefined | MenuItemTranslateKeySpecifier),
		fields?: MenuItemTranslateFieldPolicy,
	},
	MenuItemTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemTranslationKeySpecifier | (() => undefined | MenuItemTranslationKeySpecifier),
		fields?: MenuItemTranslationFieldPolicy,
	},
	MenuItemUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuItemUpdateKeySpecifier | (() => undefined | MenuItemUpdateKeySpecifier),
		fields?: MenuItemUpdateFieldPolicy,
	},
	MenuUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MenuUpdateKeySpecifier | (() => undefined | MenuUpdateKeySpecifier),
		fields?: MenuUpdateFieldPolicy,
	},
	MetadataError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MetadataErrorKeySpecifier | (() => undefined | MetadataErrorKeySpecifier),
		fields?: MetadataErrorFieldPolicy,
	},
	MetadataItem?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MetadataItemKeySpecifier | (() => undefined | MetadataItemKeySpecifier),
		fields?: MetadataItemFieldPolicy,
	},
	Money?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MoneyKeySpecifier | (() => undefined | MoneyKeySpecifier),
		fields?: MoneyFieldPolicy,
	},
	MoneyRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MoneyRangeKeySpecifier | (() => undefined | MoneyRangeKeySpecifier),
		fields?: MoneyRangeFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier),
		fields?: NodeFieldPolicy,
	},
	ObjectWithMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ObjectWithMetadataKeySpecifier | (() => undefined | ObjectWithMetadataKeySpecifier),
		fields?: ObjectWithMetadataFieldPolicy,
	},
	Order?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderKeySpecifier | (() => undefined | OrderKeySpecifier),
		fields?: OrderFieldPolicy,
	},
	OrderAddNote?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderAddNoteKeySpecifier | (() => undefined | OrderAddNoteKeySpecifier),
		fields?: OrderAddNoteFieldPolicy,
	},
	OrderBulkCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderBulkCancelKeySpecifier | (() => undefined | OrderBulkCancelKeySpecifier),
		fields?: OrderBulkCancelFieldPolicy,
	},
	OrderCancel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCancelKeySpecifier | (() => undefined | OrderCancelKeySpecifier),
		fields?: OrderCancelFieldPolicy,
	},
	OrderCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCaptureKeySpecifier | (() => undefined | OrderCaptureKeySpecifier),
		fields?: OrderCaptureFieldPolicy,
	},
	OrderConfirm?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderConfirmKeySpecifier | (() => undefined | OrderConfirmKeySpecifier),
		fields?: OrderConfirmFieldPolicy,
	},
	OrderCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCountableConnectionKeySpecifier | (() => undefined | OrderCountableConnectionKeySpecifier),
		fields?: OrderCountableConnectionFieldPolicy,
	},
	OrderCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderCountableEdgeKeySpecifier | (() => undefined | OrderCountableEdgeKeySpecifier),
		fields?: OrderCountableEdgeFieldPolicy,
	},
	OrderDiscount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountKeySpecifier | (() => undefined | OrderDiscountKeySpecifier),
		fields?: OrderDiscountFieldPolicy,
	},
	OrderDiscountAdd?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountAddKeySpecifier | (() => undefined | OrderDiscountAddKeySpecifier),
		fields?: OrderDiscountAddFieldPolicy,
	},
	OrderDiscountDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountDeleteKeySpecifier | (() => undefined | OrderDiscountDeleteKeySpecifier),
		fields?: OrderDiscountDeleteFieldPolicy,
	},
	OrderDiscountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderDiscountUpdateKeySpecifier | (() => undefined | OrderDiscountUpdateKeySpecifier),
		fields?: OrderDiscountUpdateFieldPolicy,
	},
	OrderError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderErrorKeySpecifier | (() => undefined | OrderErrorKeySpecifier),
		fields?: OrderErrorFieldPolicy,
	},
	OrderEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventKeySpecifier | (() => undefined | OrderEventKeySpecifier),
		fields?: OrderEventFieldPolicy,
	},
	OrderEventCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventCountableConnectionKeySpecifier | (() => undefined | OrderEventCountableConnectionKeySpecifier),
		fields?: OrderEventCountableConnectionFieldPolicy,
	},
	OrderEventCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventCountableEdgeKeySpecifier | (() => undefined | OrderEventCountableEdgeKeySpecifier),
		fields?: OrderEventCountableEdgeFieldPolicy,
	},
	OrderEventDiscountObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventDiscountObjectKeySpecifier | (() => undefined | OrderEventDiscountObjectKeySpecifier),
		fields?: OrderEventDiscountObjectFieldPolicy,
	},
	OrderEventOrderLineObject?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderEventOrderLineObjectKeySpecifier | (() => undefined | OrderEventOrderLineObjectKeySpecifier),
		fields?: OrderEventOrderLineObjectFieldPolicy,
	},
	OrderFulfill?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderFulfillKeySpecifier | (() => undefined | OrderFulfillKeySpecifier),
		fields?: OrderFulfillFieldPolicy,
	},
	OrderLine?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineKeySpecifier | (() => undefined | OrderLineKeySpecifier),
		fields?: OrderLineFieldPolicy,
	},
	OrderLineDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDeleteKeySpecifier | (() => undefined | OrderLineDeleteKeySpecifier),
		fields?: OrderLineDeleteFieldPolicy,
	},
	OrderLineDiscountRemove?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDiscountRemoveKeySpecifier | (() => undefined | OrderLineDiscountRemoveKeySpecifier),
		fields?: OrderLineDiscountRemoveFieldPolicy,
	},
	OrderLineDiscountUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineDiscountUpdateKeySpecifier | (() => undefined | OrderLineDiscountUpdateKeySpecifier),
		fields?: OrderLineDiscountUpdateFieldPolicy,
	},
	OrderLineUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLineUpdateKeySpecifier | (() => undefined | OrderLineUpdateKeySpecifier),
		fields?: OrderLineUpdateFieldPolicy,
	},
	OrderLinesCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderLinesCreateKeySpecifier | (() => undefined | OrderLinesCreateKeySpecifier),
		fields?: OrderLinesCreateFieldPolicy,
	},
	OrderMarkAsPaid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderMarkAsPaidKeySpecifier | (() => undefined | OrderMarkAsPaidKeySpecifier),
		fields?: OrderMarkAsPaidFieldPolicy,
	},
	OrderRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderRefundKeySpecifier | (() => undefined | OrderRefundKeySpecifier),
		fields?: OrderRefundFieldPolicy,
	},
	OrderSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderSettingsKeySpecifier | (() => undefined | OrderSettingsKeySpecifier),
		fields?: OrderSettingsFieldPolicy,
	},
	OrderSettingsError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderSettingsErrorKeySpecifier | (() => undefined | OrderSettingsErrorKeySpecifier),
		fields?: OrderSettingsErrorFieldPolicy,
	},
	OrderSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderSettingsUpdateKeySpecifier | (() => undefined | OrderSettingsUpdateKeySpecifier),
		fields?: OrderSettingsUpdateFieldPolicy,
	},
	OrderUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderUpdateKeySpecifier | (() => undefined | OrderUpdateKeySpecifier),
		fields?: OrderUpdateFieldPolicy,
	},
	OrderUpdateShipping?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderUpdateShippingKeySpecifier | (() => undefined | OrderUpdateShippingKeySpecifier),
		fields?: OrderUpdateShippingFieldPolicy,
	},
	OrderVoid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OrderVoidKeySpecifier | (() => undefined | OrderVoidKeySpecifier),
		fields?: OrderVoidFieldPolicy,
	},
	Page?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageKeySpecifier | (() => undefined | PageKeySpecifier),
		fields?: PageFieldPolicy,
	},
	PageAttributeAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageAttributeAssignKeySpecifier | (() => undefined | PageAttributeAssignKeySpecifier),
		fields?: PageAttributeAssignFieldPolicy,
	},
	PageAttributeUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageAttributeUnassignKeySpecifier | (() => undefined | PageAttributeUnassignKeySpecifier),
		fields?: PageAttributeUnassignFieldPolicy,
	},
	PageBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageBulkDeleteKeySpecifier | (() => undefined | PageBulkDeleteKeySpecifier),
		fields?: PageBulkDeleteFieldPolicy,
	},
	PageBulkPublish?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageBulkPublishKeySpecifier | (() => undefined | PageBulkPublishKeySpecifier),
		fields?: PageBulkPublishFieldPolicy,
	},
	PageCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCountableConnectionKeySpecifier | (() => undefined | PageCountableConnectionKeySpecifier),
		fields?: PageCountableConnectionFieldPolicy,
	},
	PageCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCountableEdgeKeySpecifier | (() => undefined | PageCountableEdgeKeySpecifier),
		fields?: PageCountableEdgeFieldPolicy,
	},
	PageCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageCreateKeySpecifier | (() => undefined | PageCreateKeySpecifier),
		fields?: PageCreateFieldPolicy,
	},
	PageDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageDeleteKeySpecifier | (() => undefined | PageDeleteKeySpecifier),
		fields?: PageDeleteFieldPolicy,
	},
	PageError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageErrorKeySpecifier | (() => undefined | PageErrorKeySpecifier),
		fields?: PageErrorFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	PageReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageReorderAttributeValuesKeySpecifier | (() => undefined | PageReorderAttributeValuesKeySpecifier),
		fields?: PageReorderAttributeValuesFieldPolicy,
	},
	PageTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTranslatableContentKeySpecifier | (() => undefined | PageTranslatableContentKeySpecifier),
		fields?: PageTranslatableContentFieldPolicy,
	},
	PageTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTranslateKeySpecifier | (() => undefined | PageTranslateKeySpecifier),
		fields?: PageTranslateFieldPolicy,
	},
	PageTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTranslationKeySpecifier | (() => undefined | PageTranslationKeySpecifier),
		fields?: PageTranslationFieldPolicy,
	},
	PageType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeKeySpecifier | (() => undefined | PageTypeKeySpecifier),
		fields?: PageTypeFieldPolicy,
	},
	PageTypeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeBulkDeleteKeySpecifier | (() => undefined | PageTypeBulkDeleteKeySpecifier),
		fields?: PageTypeBulkDeleteFieldPolicy,
	},
	PageTypeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCountableConnectionKeySpecifier | (() => undefined | PageTypeCountableConnectionKeySpecifier),
		fields?: PageTypeCountableConnectionFieldPolicy,
	},
	PageTypeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCountableEdgeKeySpecifier | (() => undefined | PageTypeCountableEdgeKeySpecifier),
		fields?: PageTypeCountableEdgeFieldPolicy,
	},
	PageTypeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeCreateKeySpecifier | (() => undefined | PageTypeCreateKeySpecifier),
		fields?: PageTypeCreateFieldPolicy,
	},
	PageTypeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeDeleteKeySpecifier | (() => undefined | PageTypeDeleteKeySpecifier),
		fields?: PageTypeDeleteFieldPolicy,
	},
	PageTypeReorderAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeReorderAttributesKeySpecifier | (() => undefined | PageTypeReorderAttributesKeySpecifier),
		fields?: PageTypeReorderAttributesFieldPolicy,
	},
	PageTypeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageTypeUpdateKeySpecifier | (() => undefined | PageTypeUpdateKeySpecifier),
		fields?: PageTypeUpdateFieldPolicy,
	},
	PageUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageUpdateKeySpecifier | (() => undefined | PageUpdateKeySpecifier),
		fields?: PageUpdateFieldPolicy,
	},
	PasswordChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PasswordChangeKeySpecifier | (() => undefined | PasswordChangeKeySpecifier),
		fields?: PasswordChangeFieldPolicy,
	},
	Payment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentKeySpecifier | (() => undefined | PaymentKeySpecifier),
		fields?: PaymentFieldPolicy,
	},
	PaymentCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCaptureKeySpecifier | (() => undefined | PaymentCaptureKeySpecifier),
		fields?: PaymentCaptureFieldPolicy,
	},
	PaymentCheckBalance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCheckBalanceKeySpecifier | (() => undefined | PaymentCheckBalanceKeySpecifier),
		fields?: PaymentCheckBalanceFieldPolicy,
	},
	PaymentCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCountableConnectionKeySpecifier | (() => undefined | PaymentCountableConnectionKeySpecifier),
		fields?: PaymentCountableConnectionFieldPolicy,
	},
	PaymentCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentCountableEdgeKeySpecifier | (() => undefined | PaymentCountableEdgeKeySpecifier),
		fields?: PaymentCountableEdgeFieldPolicy,
	},
	PaymentError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentErrorKeySpecifier | (() => undefined | PaymentErrorKeySpecifier),
		fields?: PaymentErrorFieldPolicy,
	},
	PaymentGateway?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentGatewayKeySpecifier | (() => undefined | PaymentGatewayKeySpecifier),
		fields?: PaymentGatewayFieldPolicy,
	},
	PaymentInitialize?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentInitializeKeySpecifier | (() => undefined | PaymentInitializeKeySpecifier),
		fields?: PaymentInitializeFieldPolicy,
	},
	PaymentInitialized?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentInitializedKeySpecifier | (() => undefined | PaymentInitializedKeySpecifier),
		fields?: PaymentInitializedFieldPolicy,
	},
	PaymentRefund?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentRefundKeySpecifier | (() => undefined | PaymentRefundKeySpecifier),
		fields?: PaymentRefundFieldPolicy,
	},
	PaymentSource?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentSourceKeySpecifier | (() => undefined | PaymentSourceKeySpecifier),
		fields?: PaymentSourceFieldPolicy,
	},
	PaymentVoid?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaymentVoidKeySpecifier | (() => undefined | PaymentVoidKeySpecifier),
		fields?: PaymentVoidFieldPolicy,
	},
	Permission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionKeySpecifier | (() => undefined | PermissionKeySpecifier),
		fields?: PermissionFieldPolicy,
	},
	PermissionGroupCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupCreateKeySpecifier | (() => undefined | PermissionGroupCreateKeySpecifier),
		fields?: PermissionGroupCreateFieldPolicy,
	},
	PermissionGroupDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupDeleteKeySpecifier | (() => undefined | PermissionGroupDeleteKeySpecifier),
		fields?: PermissionGroupDeleteFieldPolicy,
	},
	PermissionGroupError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupErrorKeySpecifier | (() => undefined | PermissionGroupErrorKeySpecifier),
		fields?: PermissionGroupErrorFieldPolicy,
	},
	PermissionGroupUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PermissionGroupUpdateKeySpecifier | (() => undefined | PermissionGroupUpdateKeySpecifier),
		fields?: PermissionGroupUpdateFieldPolicy,
	},
	Plugin?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginKeySpecifier | (() => undefined | PluginKeySpecifier),
		fields?: PluginFieldPolicy,
	},
	PluginConfiguration?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginConfigurationKeySpecifier | (() => undefined | PluginConfigurationKeySpecifier),
		fields?: PluginConfigurationFieldPolicy,
	},
	PluginCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginCountableConnectionKeySpecifier | (() => undefined | PluginCountableConnectionKeySpecifier),
		fields?: PluginCountableConnectionFieldPolicy,
	},
	PluginCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginCountableEdgeKeySpecifier | (() => undefined | PluginCountableEdgeKeySpecifier),
		fields?: PluginCountableEdgeFieldPolicy,
	},
	PluginError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginErrorKeySpecifier | (() => undefined | PluginErrorKeySpecifier),
		fields?: PluginErrorFieldPolicy,
	},
	PluginUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PluginUpdateKeySpecifier | (() => undefined | PluginUpdateKeySpecifier),
		fields?: PluginUpdateFieldPolicy,
	},
	Product?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductKeySpecifier | (() => undefined | ProductKeySpecifier),
		fields?: ProductFieldPolicy,
	},
	ProductAttributeAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAttributeAssignKeySpecifier | (() => undefined | ProductAttributeAssignKeySpecifier),
		fields?: ProductAttributeAssignFieldPolicy,
	},
	ProductAttributeUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductAttributeUnassignKeySpecifier | (() => undefined | ProductAttributeUnassignKeySpecifier),
		fields?: ProductAttributeUnassignFieldPolicy,
	},
	ProductBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductBulkDeleteKeySpecifier | (() => undefined | ProductBulkDeleteKeySpecifier),
		fields?: ProductBulkDeleteFieldPolicy,
	},
	ProductChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductChannelListingKeySpecifier | (() => undefined | ProductChannelListingKeySpecifier),
		fields?: ProductChannelListingFieldPolicy,
	},
	ProductChannelListingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductChannelListingErrorKeySpecifier | (() => undefined | ProductChannelListingErrorKeySpecifier),
		fields?: ProductChannelListingErrorFieldPolicy,
	},
	ProductChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductChannelListingUpdateKeySpecifier | (() => undefined | ProductChannelListingUpdateKeySpecifier),
		fields?: ProductChannelListingUpdateFieldPolicy,
	},
	ProductCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCountableConnectionKeySpecifier | (() => undefined | ProductCountableConnectionKeySpecifier),
		fields?: ProductCountableConnectionFieldPolicy,
	},
	ProductCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCountableEdgeKeySpecifier | (() => undefined | ProductCountableEdgeKeySpecifier),
		fields?: ProductCountableEdgeFieldPolicy,
	},
	ProductCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductCreateKeySpecifier | (() => undefined | ProductCreateKeySpecifier),
		fields?: ProductCreateFieldPolicy,
	},
	ProductDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductDeleteKeySpecifier | (() => undefined | ProductDeleteKeySpecifier),
		fields?: ProductDeleteFieldPolicy,
	},
	ProductError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductErrorKeySpecifier | (() => undefined | ProductErrorKeySpecifier),
		fields?: ProductErrorFieldPolicy,
	},
	ProductImage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductImageKeySpecifier | (() => undefined | ProductImageKeySpecifier),
		fields?: ProductImageFieldPolicy,
	},
	ProductMedia?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaKeySpecifier | (() => undefined | ProductMediaKeySpecifier),
		fields?: ProductMediaFieldPolicy,
	},
	ProductMediaBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaBulkDeleteKeySpecifier | (() => undefined | ProductMediaBulkDeleteKeySpecifier),
		fields?: ProductMediaBulkDeleteFieldPolicy,
	},
	ProductMediaCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaCreateKeySpecifier | (() => undefined | ProductMediaCreateKeySpecifier),
		fields?: ProductMediaCreateFieldPolicy,
	},
	ProductMediaDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaDeleteKeySpecifier | (() => undefined | ProductMediaDeleteKeySpecifier),
		fields?: ProductMediaDeleteFieldPolicy,
	},
	ProductMediaReorder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaReorderKeySpecifier | (() => undefined | ProductMediaReorderKeySpecifier),
		fields?: ProductMediaReorderFieldPolicy,
	},
	ProductMediaUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductMediaUpdateKeySpecifier | (() => undefined | ProductMediaUpdateKeySpecifier),
		fields?: ProductMediaUpdateFieldPolicy,
	},
	ProductPricingInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductPricingInfoKeySpecifier | (() => undefined | ProductPricingInfoKeySpecifier),
		fields?: ProductPricingInfoFieldPolicy,
	},
	ProductReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductReorderAttributeValuesKeySpecifier | (() => undefined | ProductReorderAttributeValuesKeySpecifier),
		fields?: ProductReorderAttributeValuesFieldPolicy,
	},
	ProductTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTranslatableContentKeySpecifier | (() => undefined | ProductTranslatableContentKeySpecifier),
		fields?: ProductTranslatableContentFieldPolicy,
	},
	ProductTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTranslateKeySpecifier | (() => undefined | ProductTranslateKeySpecifier),
		fields?: ProductTranslateFieldPolicy,
	},
	ProductTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTranslationKeySpecifier | (() => undefined | ProductTranslationKeySpecifier),
		fields?: ProductTranslationFieldPolicy,
	},
	ProductType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeKeySpecifier | (() => undefined | ProductTypeKeySpecifier),
		fields?: ProductTypeFieldPolicy,
	},
	ProductTypeBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeBulkDeleteKeySpecifier | (() => undefined | ProductTypeBulkDeleteKeySpecifier),
		fields?: ProductTypeBulkDeleteFieldPolicy,
	},
	ProductTypeCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeCountableConnectionKeySpecifier | (() => undefined | ProductTypeCountableConnectionKeySpecifier),
		fields?: ProductTypeCountableConnectionFieldPolicy,
	},
	ProductTypeCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeCountableEdgeKeySpecifier | (() => undefined | ProductTypeCountableEdgeKeySpecifier),
		fields?: ProductTypeCountableEdgeFieldPolicy,
	},
	ProductTypeCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeCreateKeySpecifier | (() => undefined | ProductTypeCreateKeySpecifier),
		fields?: ProductTypeCreateFieldPolicy,
	},
	ProductTypeDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeDeleteKeySpecifier | (() => undefined | ProductTypeDeleteKeySpecifier),
		fields?: ProductTypeDeleteFieldPolicy,
	},
	ProductTypeReorderAttributes?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeReorderAttributesKeySpecifier | (() => undefined | ProductTypeReorderAttributesKeySpecifier),
		fields?: ProductTypeReorderAttributesFieldPolicy,
	},
	ProductTypeUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductTypeUpdateKeySpecifier | (() => undefined | ProductTypeUpdateKeySpecifier),
		fields?: ProductTypeUpdateFieldPolicy,
	},
	ProductUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductUpdateKeySpecifier | (() => undefined | ProductUpdateKeySpecifier),
		fields?: ProductUpdateFieldPolicy,
	},
	ProductVariant?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantKeySpecifier | (() => undefined | ProductVariantKeySpecifier),
		fields?: ProductVariantFieldPolicy,
	},
	ProductVariantBulkCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkCreateKeySpecifier | (() => undefined | ProductVariantBulkCreateKeySpecifier),
		fields?: ProductVariantBulkCreateFieldPolicy,
	},
	ProductVariantBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantBulkDeleteKeySpecifier | (() => undefined | ProductVariantBulkDeleteKeySpecifier),
		fields?: ProductVariantBulkDeleteFieldPolicy,
	},
	ProductVariantChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantChannelListingKeySpecifier | (() => undefined | ProductVariantChannelListingKeySpecifier),
		fields?: ProductVariantChannelListingFieldPolicy,
	},
	ProductVariantChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantChannelListingUpdateKeySpecifier | (() => undefined | ProductVariantChannelListingUpdateKeySpecifier),
		fields?: ProductVariantChannelListingUpdateFieldPolicy,
	},
	ProductVariantCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCountableConnectionKeySpecifier | (() => undefined | ProductVariantCountableConnectionKeySpecifier),
		fields?: ProductVariantCountableConnectionFieldPolicy,
	},
	ProductVariantCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCountableEdgeKeySpecifier | (() => undefined | ProductVariantCountableEdgeKeySpecifier),
		fields?: ProductVariantCountableEdgeFieldPolicy,
	},
	ProductVariantCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantCreateKeySpecifier | (() => undefined | ProductVariantCreateKeySpecifier),
		fields?: ProductVariantCreateFieldPolicy,
	},
	ProductVariantDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantDeleteKeySpecifier | (() => undefined | ProductVariantDeleteKeySpecifier),
		fields?: ProductVariantDeleteFieldPolicy,
	},
	ProductVariantReorder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantReorderKeySpecifier | (() => undefined | ProductVariantReorderKeySpecifier),
		fields?: ProductVariantReorderFieldPolicy,
	},
	ProductVariantReorderAttributeValues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantReorderAttributeValuesKeySpecifier | (() => undefined | ProductVariantReorderAttributeValuesKeySpecifier),
		fields?: ProductVariantReorderAttributeValuesFieldPolicy,
	},
	ProductVariantSetDefault?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantSetDefaultKeySpecifier | (() => undefined | ProductVariantSetDefaultKeySpecifier),
		fields?: ProductVariantSetDefaultFieldPolicy,
	},
	ProductVariantStocksCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStocksCreateKeySpecifier | (() => undefined | ProductVariantStocksCreateKeySpecifier),
		fields?: ProductVariantStocksCreateFieldPolicy,
	},
	ProductVariantStocksDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStocksDeleteKeySpecifier | (() => undefined | ProductVariantStocksDeleteKeySpecifier),
		fields?: ProductVariantStocksDeleteFieldPolicy,
	},
	ProductVariantStocksUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantStocksUpdateKeySpecifier | (() => undefined | ProductVariantStocksUpdateKeySpecifier),
		fields?: ProductVariantStocksUpdateFieldPolicy,
	},
	ProductVariantTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantTranslatableContentKeySpecifier | (() => undefined | ProductVariantTranslatableContentKeySpecifier),
		fields?: ProductVariantTranslatableContentFieldPolicy,
	},
	ProductVariantTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantTranslateKeySpecifier | (() => undefined | ProductVariantTranslateKeySpecifier),
		fields?: ProductVariantTranslateFieldPolicy,
	},
	ProductVariantTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantTranslationKeySpecifier | (() => undefined | ProductVariantTranslationKeySpecifier),
		fields?: ProductVariantTranslationFieldPolicy,
	},
	ProductVariantUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ProductVariantUpdateKeySpecifier | (() => undefined | ProductVariantUpdateKeySpecifier),
		fields?: ProductVariantUpdateFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	ReducedRate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReducedRateKeySpecifier | (() => undefined | ReducedRateKeySpecifier),
		fields?: ReducedRateFieldPolicy,
	},
	RefreshToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefreshTokenKeySpecifier | (() => undefined | RefreshTokenKeySpecifier),
		fields?: RefreshTokenFieldPolicy,
	},
	RequestEmailChange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RequestEmailChangeKeySpecifier | (() => undefined | RequestEmailChangeKeySpecifier),
		fields?: RequestEmailChangeFieldPolicy,
	},
	RequestPasswordReset?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RequestPasswordResetKeySpecifier | (() => undefined | RequestPasswordResetKeySpecifier),
		fields?: RequestPasswordResetFieldPolicy,
	},
	Sale?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleKeySpecifier | (() => undefined | SaleKeySpecifier),
		fields?: SaleFieldPolicy,
	},
	SaleAddCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleAddCataloguesKeySpecifier | (() => undefined | SaleAddCataloguesKeySpecifier),
		fields?: SaleAddCataloguesFieldPolicy,
	},
	SaleBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleBulkDeleteKeySpecifier | (() => undefined | SaleBulkDeleteKeySpecifier),
		fields?: SaleBulkDeleteFieldPolicy,
	},
	SaleChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleChannelListingKeySpecifier | (() => undefined | SaleChannelListingKeySpecifier),
		fields?: SaleChannelListingFieldPolicy,
	},
	SaleChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleChannelListingUpdateKeySpecifier | (() => undefined | SaleChannelListingUpdateKeySpecifier),
		fields?: SaleChannelListingUpdateFieldPolicy,
	},
	SaleCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCountableConnectionKeySpecifier | (() => undefined | SaleCountableConnectionKeySpecifier),
		fields?: SaleCountableConnectionFieldPolicy,
	},
	SaleCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCountableEdgeKeySpecifier | (() => undefined | SaleCountableEdgeKeySpecifier),
		fields?: SaleCountableEdgeFieldPolicy,
	},
	SaleCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleCreateKeySpecifier | (() => undefined | SaleCreateKeySpecifier),
		fields?: SaleCreateFieldPolicy,
	},
	SaleDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleDeleteKeySpecifier | (() => undefined | SaleDeleteKeySpecifier),
		fields?: SaleDeleteFieldPolicy,
	},
	SaleRemoveCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleRemoveCataloguesKeySpecifier | (() => undefined | SaleRemoveCataloguesKeySpecifier),
		fields?: SaleRemoveCataloguesFieldPolicy,
	},
	SaleTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleTranslatableContentKeySpecifier | (() => undefined | SaleTranslatableContentKeySpecifier),
		fields?: SaleTranslatableContentFieldPolicy,
	},
	SaleTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleTranslateKeySpecifier | (() => undefined | SaleTranslateKeySpecifier),
		fields?: SaleTranslateFieldPolicy,
	},
	SaleTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleTranslationKeySpecifier | (() => undefined | SaleTranslationKeySpecifier),
		fields?: SaleTranslationFieldPolicy,
	},
	SaleUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SaleUpdateKeySpecifier | (() => undefined | SaleUpdateKeySpecifier),
		fields?: SaleUpdateFieldPolicy,
	},
	SelectedAttribute?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SelectedAttributeKeySpecifier | (() => undefined | SelectedAttributeKeySpecifier),
		fields?: SelectedAttributeFieldPolicy,
	},
	SetPassword?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SetPasswordKeySpecifier | (() => undefined | SetPasswordKeySpecifier),
		fields?: SetPasswordFieldPolicy,
	},
	ShippingError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingErrorKeySpecifier | (() => undefined | ShippingErrorKeySpecifier),
		fields?: ShippingErrorFieldPolicy,
	},
	ShippingMethod?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodKeySpecifier | (() => undefined | ShippingMethodKeySpecifier),
		fields?: ShippingMethodFieldPolicy,
	},
	ShippingMethodChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodChannelListingKeySpecifier | (() => undefined | ShippingMethodChannelListingKeySpecifier),
		fields?: ShippingMethodChannelListingFieldPolicy,
	},
	ShippingMethodChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodChannelListingUpdateKeySpecifier | (() => undefined | ShippingMethodChannelListingUpdateKeySpecifier),
		fields?: ShippingMethodChannelListingUpdateFieldPolicy,
	},
	ShippingMethodPostalCodeRule?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodPostalCodeRuleKeySpecifier | (() => undefined | ShippingMethodPostalCodeRuleKeySpecifier),
		fields?: ShippingMethodPostalCodeRuleFieldPolicy,
	},
	ShippingMethodTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodTranslatableContentKeySpecifier | (() => undefined | ShippingMethodTranslatableContentKeySpecifier),
		fields?: ShippingMethodTranslatableContentFieldPolicy,
	},
	ShippingMethodTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingMethodTranslationKeySpecifier | (() => undefined | ShippingMethodTranslationKeySpecifier),
		fields?: ShippingMethodTranslationFieldPolicy,
	},
	ShippingPriceBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceBulkDeleteKeySpecifier | (() => undefined | ShippingPriceBulkDeleteKeySpecifier),
		fields?: ShippingPriceBulkDeleteFieldPolicy,
	},
	ShippingPriceCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceCreateKeySpecifier | (() => undefined | ShippingPriceCreateKeySpecifier),
		fields?: ShippingPriceCreateFieldPolicy,
	},
	ShippingPriceDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceDeleteKeySpecifier | (() => undefined | ShippingPriceDeleteKeySpecifier),
		fields?: ShippingPriceDeleteFieldPolicy,
	},
	ShippingPriceExcludeProducts?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceExcludeProductsKeySpecifier | (() => undefined | ShippingPriceExcludeProductsKeySpecifier),
		fields?: ShippingPriceExcludeProductsFieldPolicy,
	},
	ShippingPriceRemoveProductFromExclude?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceRemoveProductFromExcludeKeySpecifier | (() => undefined | ShippingPriceRemoveProductFromExcludeKeySpecifier),
		fields?: ShippingPriceRemoveProductFromExcludeFieldPolicy,
	},
	ShippingPriceTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceTranslateKeySpecifier | (() => undefined | ShippingPriceTranslateKeySpecifier),
		fields?: ShippingPriceTranslateFieldPolicy,
	},
	ShippingPriceUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingPriceUpdateKeySpecifier | (() => undefined | ShippingPriceUpdateKeySpecifier),
		fields?: ShippingPriceUpdateFieldPolicy,
	},
	ShippingZone?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneKeySpecifier | (() => undefined | ShippingZoneKeySpecifier),
		fields?: ShippingZoneFieldPolicy,
	},
	ShippingZoneBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneBulkDeleteKeySpecifier | (() => undefined | ShippingZoneBulkDeleteKeySpecifier),
		fields?: ShippingZoneBulkDeleteFieldPolicy,
	},
	ShippingZoneCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCountableConnectionKeySpecifier | (() => undefined | ShippingZoneCountableConnectionKeySpecifier),
		fields?: ShippingZoneCountableConnectionFieldPolicy,
	},
	ShippingZoneCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCountableEdgeKeySpecifier | (() => undefined | ShippingZoneCountableEdgeKeySpecifier),
		fields?: ShippingZoneCountableEdgeFieldPolicy,
	},
	ShippingZoneCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneCreateKeySpecifier | (() => undefined | ShippingZoneCreateKeySpecifier),
		fields?: ShippingZoneCreateFieldPolicy,
	},
	ShippingZoneDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneDeleteKeySpecifier | (() => undefined | ShippingZoneDeleteKeySpecifier),
		fields?: ShippingZoneDeleteFieldPolicy,
	},
	ShippingZoneUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShippingZoneUpdateKeySpecifier | (() => undefined | ShippingZoneUpdateKeySpecifier),
		fields?: ShippingZoneUpdateFieldPolicy,
	},
	Shop?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopKeySpecifier | (() => undefined | ShopKeySpecifier),
		fields?: ShopFieldPolicy,
	},
	ShopAddressUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopAddressUpdateKeySpecifier | (() => undefined | ShopAddressUpdateKeySpecifier),
		fields?: ShopAddressUpdateFieldPolicy,
	},
	ShopDomainUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopDomainUpdateKeySpecifier | (() => undefined | ShopDomainUpdateKeySpecifier),
		fields?: ShopDomainUpdateFieldPolicy,
	},
	ShopError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopErrorKeySpecifier | (() => undefined | ShopErrorKeySpecifier),
		fields?: ShopErrorFieldPolicy,
	},
	ShopFetchTaxRates?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopFetchTaxRatesKeySpecifier | (() => undefined | ShopFetchTaxRatesKeySpecifier),
		fields?: ShopFetchTaxRatesFieldPolicy,
	},
	ShopSettingsTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopSettingsTranslateKeySpecifier | (() => undefined | ShopSettingsTranslateKeySpecifier),
		fields?: ShopSettingsTranslateFieldPolicy,
	},
	ShopSettingsUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopSettingsUpdateKeySpecifier | (() => undefined | ShopSettingsUpdateKeySpecifier),
		fields?: ShopSettingsUpdateFieldPolicy,
	},
	ShopTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShopTranslationKeySpecifier | (() => undefined | ShopTranslationKeySpecifier),
		fields?: ShopTranslationFieldPolicy,
	},
	StaffBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffBulkDeleteKeySpecifier | (() => undefined | StaffBulkDeleteKeySpecifier),
		fields?: StaffBulkDeleteFieldPolicy,
	},
	StaffCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffCreateKeySpecifier | (() => undefined | StaffCreateKeySpecifier),
		fields?: StaffCreateFieldPolicy,
	},
	StaffDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffDeleteKeySpecifier | (() => undefined | StaffDeleteKeySpecifier),
		fields?: StaffDeleteFieldPolicy,
	},
	StaffError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffErrorKeySpecifier | (() => undefined | StaffErrorKeySpecifier),
		fields?: StaffErrorFieldPolicy,
	},
	StaffNotificationRecipient?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientKeySpecifier | (() => undefined | StaffNotificationRecipientKeySpecifier),
		fields?: StaffNotificationRecipientFieldPolicy,
	},
	StaffNotificationRecipientCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientCreateKeySpecifier | (() => undefined | StaffNotificationRecipientCreateKeySpecifier),
		fields?: StaffNotificationRecipientCreateFieldPolicy,
	},
	StaffNotificationRecipientDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientDeleteKeySpecifier | (() => undefined | StaffNotificationRecipientDeleteKeySpecifier),
		fields?: StaffNotificationRecipientDeleteFieldPolicy,
	},
	StaffNotificationRecipientUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffNotificationRecipientUpdateKeySpecifier | (() => undefined | StaffNotificationRecipientUpdateKeySpecifier),
		fields?: StaffNotificationRecipientUpdateFieldPolicy,
	},
	StaffUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StaffUpdateKeySpecifier | (() => undefined | StaffUpdateKeySpecifier),
		fields?: StaffUpdateFieldPolicy,
	},
	Stock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockKeySpecifier | (() => undefined | StockKeySpecifier),
		fields?: StockFieldPolicy,
	},
	StockCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockCountableConnectionKeySpecifier | (() => undefined | StockCountableConnectionKeySpecifier),
		fields?: StockCountableConnectionFieldPolicy,
	},
	StockCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockCountableEdgeKeySpecifier | (() => undefined | StockCountableEdgeKeySpecifier),
		fields?: StockCountableEdgeFieldPolicy,
	},
	StockError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StockErrorKeySpecifier | (() => undefined | StockErrorKeySpecifier),
		fields?: StockErrorFieldPolicy,
	},
	TaxType?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxTypeKeySpecifier | (() => undefined | TaxTypeKeySpecifier),
		fields?: TaxTypeFieldPolicy,
	},
	TaxedMoney?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxedMoneyKeySpecifier | (() => undefined | TaxedMoneyKeySpecifier),
		fields?: TaxedMoneyFieldPolicy,
	},
	TaxedMoneyRange?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaxedMoneyRangeKeySpecifier | (() => undefined | TaxedMoneyRangeKeySpecifier),
		fields?: TaxedMoneyRangeFieldPolicy,
	},
	Transaction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TransactionKeySpecifier | (() => undefined | TransactionKeySpecifier),
		fields?: TransactionFieldPolicy,
	},
	TranslatableItemConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslatableItemConnectionKeySpecifier | (() => undefined | TranslatableItemConnectionKeySpecifier),
		fields?: TranslatableItemConnectionFieldPolicy,
	},
	TranslatableItemEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslatableItemEdgeKeySpecifier | (() => undefined | TranslatableItemEdgeKeySpecifier),
		fields?: TranslatableItemEdgeFieldPolicy,
	},
	TranslationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TranslationErrorKeySpecifier | (() => undefined | TranslationErrorKeySpecifier),
		fields?: TranslationErrorFieldPolicy,
	},
	UpdateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateMetadataKeySpecifier | (() => undefined | UpdateMetadataKeySpecifier),
		fields?: UpdateMetadataFieldPolicy,
	},
	UpdatePrivateMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdatePrivateMetadataKeySpecifier | (() => undefined | UpdatePrivateMetadataKeySpecifier),
		fields?: UpdatePrivateMetadataFieldPolicy,
	},
	UploadError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UploadErrorKeySpecifier | (() => undefined | UploadErrorKeySpecifier),
		fields?: UploadErrorFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserAvatarDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAvatarDeleteKeySpecifier | (() => undefined | UserAvatarDeleteKeySpecifier),
		fields?: UserAvatarDeleteFieldPolicy,
	},
	UserAvatarUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAvatarUpdateKeySpecifier | (() => undefined | UserAvatarUpdateKeySpecifier),
		fields?: UserAvatarUpdateFieldPolicy,
	},
	UserBulkSetActive?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserBulkSetActiveKeySpecifier | (() => undefined | UserBulkSetActiveKeySpecifier),
		fields?: UserBulkSetActiveFieldPolicy,
	},
	UserCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCountableConnectionKeySpecifier | (() => undefined | UserCountableConnectionKeySpecifier),
		fields?: UserCountableConnectionFieldPolicy,
	},
	UserCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserCountableEdgeKeySpecifier | (() => undefined | UserCountableEdgeKeySpecifier),
		fields?: UserCountableEdgeFieldPolicy,
	},
	UserPermission?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserPermissionKeySpecifier | (() => undefined | UserPermissionKeySpecifier),
		fields?: UserPermissionFieldPolicy,
	},
	VAT?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VATKeySpecifier | (() => undefined | VATKeySpecifier),
		fields?: VATFieldPolicy,
	},
	VariantMediaAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VariantMediaAssignKeySpecifier | (() => undefined | VariantMediaAssignKeySpecifier),
		fields?: VariantMediaAssignFieldPolicy,
	},
	VariantMediaUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VariantMediaUnassignKeySpecifier | (() => undefined | VariantMediaUnassignKeySpecifier),
		fields?: VariantMediaUnassignFieldPolicy,
	},
	VariantPricingInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VariantPricingInfoKeySpecifier | (() => undefined | VariantPricingInfoKeySpecifier),
		fields?: VariantPricingInfoFieldPolicy,
	},
	VerifyToken?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VerifyTokenKeySpecifier | (() => undefined | VerifyTokenKeySpecifier),
		fields?: VerifyTokenFieldPolicy,
	},
	Voucher?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherKeySpecifier | (() => undefined | VoucherKeySpecifier),
		fields?: VoucherFieldPolicy,
	},
	VoucherAddCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherAddCataloguesKeySpecifier | (() => undefined | VoucherAddCataloguesKeySpecifier),
		fields?: VoucherAddCataloguesFieldPolicy,
	},
	VoucherBulkDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherBulkDeleteKeySpecifier | (() => undefined | VoucherBulkDeleteKeySpecifier),
		fields?: VoucherBulkDeleteFieldPolicy,
	},
	VoucherChannelListing?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherChannelListingKeySpecifier | (() => undefined | VoucherChannelListingKeySpecifier),
		fields?: VoucherChannelListingFieldPolicy,
	},
	VoucherChannelListingUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherChannelListingUpdateKeySpecifier | (() => undefined | VoucherChannelListingUpdateKeySpecifier),
		fields?: VoucherChannelListingUpdateFieldPolicy,
	},
	VoucherCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCountableConnectionKeySpecifier | (() => undefined | VoucherCountableConnectionKeySpecifier),
		fields?: VoucherCountableConnectionFieldPolicy,
	},
	VoucherCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCountableEdgeKeySpecifier | (() => undefined | VoucherCountableEdgeKeySpecifier),
		fields?: VoucherCountableEdgeFieldPolicy,
	},
	VoucherCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherCreateKeySpecifier | (() => undefined | VoucherCreateKeySpecifier),
		fields?: VoucherCreateFieldPolicy,
	},
	VoucherDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherDeleteKeySpecifier | (() => undefined | VoucherDeleteKeySpecifier),
		fields?: VoucherDeleteFieldPolicy,
	},
	VoucherRemoveCatalogues?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherRemoveCataloguesKeySpecifier | (() => undefined | VoucherRemoveCataloguesKeySpecifier),
		fields?: VoucherRemoveCataloguesFieldPolicy,
	},
	VoucherTranslatableContent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherTranslatableContentKeySpecifier | (() => undefined | VoucherTranslatableContentKeySpecifier),
		fields?: VoucherTranslatableContentFieldPolicy,
	},
	VoucherTranslate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherTranslateKeySpecifier | (() => undefined | VoucherTranslateKeySpecifier),
		fields?: VoucherTranslateFieldPolicy,
	},
	VoucherTranslation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherTranslationKeySpecifier | (() => undefined | VoucherTranslationKeySpecifier),
		fields?: VoucherTranslationFieldPolicy,
	},
	VoucherUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VoucherUpdateKeySpecifier | (() => undefined | VoucherUpdateKeySpecifier),
		fields?: VoucherUpdateFieldPolicy,
	},
	Warehouse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseKeySpecifier | (() => undefined | WarehouseKeySpecifier),
		fields?: WarehouseFieldPolicy,
	},
	WarehouseCountableConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCountableConnectionKeySpecifier | (() => undefined | WarehouseCountableConnectionKeySpecifier),
		fields?: WarehouseCountableConnectionFieldPolicy,
	},
	WarehouseCountableEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCountableEdgeKeySpecifier | (() => undefined | WarehouseCountableEdgeKeySpecifier),
		fields?: WarehouseCountableEdgeFieldPolicy,
	},
	WarehouseCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseCreateKeySpecifier | (() => undefined | WarehouseCreateKeySpecifier),
		fields?: WarehouseCreateFieldPolicy,
	},
	WarehouseDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseDeleteKeySpecifier | (() => undefined | WarehouseDeleteKeySpecifier),
		fields?: WarehouseDeleteFieldPolicy,
	},
	WarehouseError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseErrorKeySpecifier | (() => undefined | WarehouseErrorKeySpecifier),
		fields?: WarehouseErrorFieldPolicy,
	},
	WarehouseShippingZoneAssign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseShippingZoneAssignKeySpecifier | (() => undefined | WarehouseShippingZoneAssignKeySpecifier),
		fields?: WarehouseShippingZoneAssignFieldPolicy,
	},
	WarehouseShippingZoneUnassign?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseShippingZoneUnassignKeySpecifier | (() => undefined | WarehouseShippingZoneUnassignKeySpecifier),
		fields?: WarehouseShippingZoneUnassignFieldPolicy,
	},
	WarehouseUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WarehouseUpdateKeySpecifier | (() => undefined | WarehouseUpdateKeySpecifier),
		fields?: WarehouseUpdateFieldPolicy,
	},
	Webhook?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookKeySpecifier | (() => undefined | WebhookKeySpecifier),
		fields?: WebhookFieldPolicy,
	},
	WebhookCreate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookCreateKeySpecifier | (() => undefined | WebhookCreateKeySpecifier),
		fields?: WebhookCreateFieldPolicy,
	},
	WebhookDelete?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookDeleteKeySpecifier | (() => undefined | WebhookDeleteKeySpecifier),
		fields?: WebhookDeleteFieldPolicy,
	},
	WebhookError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookErrorKeySpecifier | (() => undefined | WebhookErrorKeySpecifier),
		fields?: WebhookErrorFieldPolicy,
	},
	WebhookEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookEventKeySpecifier | (() => undefined | WebhookEventKeySpecifier),
		fields?: WebhookEventFieldPolicy,
	},
	WebhookUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WebhookUpdateKeySpecifier | (() => undefined | WebhookUpdateKeySpecifier),
		fields?: WebhookUpdateFieldPolicy,
	},
	Weight?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WeightKeySpecifier | (() => undefined | WeightKeySpecifier),
		fields?: WeightFieldPolicy,
	},
	_Service?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | _ServiceKeySpecifier | (() => undefined | _ServiceKeySpecifier),
		fields?: _ServiceFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;