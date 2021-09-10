// THIS FILE IS GENERATED WITH `npm run generate`
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
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
  JSONString: any;
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
  /** A user instance for which the address was created. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  address?: Maybe<Address>;
};

/** Delete an address of the logged-in user. */
export type AccountAddressDelete = {
  __typename?: 'AccountAddressDelete';
  /** A user instance for which the address was deleted. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  address?: Maybe<Address>;
};

/** Updates an address of the logged-in user. */
export type AccountAddressUpdate = {
  __typename?: 'AccountAddressUpdate';
  /** A user object for which the address was edited. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  address?: Maybe<Address>;
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
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: AccountErrorCode;
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
};

/** An enumeration. */
export enum AccountErrorCode {
  ActivateOwnAccount = 'ACTIVATE_OWN_ACCOUNT',
  ActivateSuperuserAccount = 'ACTIVATE_SUPERUSER_ACCOUNT',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  DeactivateOwnAccount = 'DEACTIVATE_OWN_ACCOUNT',
  DeactivateSuperuserAccount = 'DEACTIVATE_SUPERUSER_ACCOUNT',
  DeleteNonStaffUser = 'DELETE_NON_STAFF_USER',
  DeleteOwnAccount = 'DELETE_OWN_ACCOUNT',
  DeleteStaffAccount = 'DELETE_STAFF_ACCOUNT',
  DeleteSuperuserAccount = 'DELETE_SUPERUSER_ACCOUNT',
  GraphqlError = 'GRAPHQL_ERROR',
  Inactive = 'INACTIVE',
  Invalid = 'INVALID',
  InvalidPassword = 'INVALID_PASSWORD',
  LeftNotManageablePermission = 'LEFT_NOT_MANAGEABLE_PERMISSION',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  NotFound = 'NOT_FOUND',
  OutOfScopeUser = 'OUT_OF_SCOPE_USER',
  OutOfScopeGroup = 'OUT_OF_SCOPE_GROUP',
  OutOfScopePermission = 'OUT_OF_SCOPE_PERMISSION',
  PasswordEntirelyNumeric = 'PASSWORD_ENTIRELY_NUMERIC',
  PasswordTooCommon = 'PASSWORD_TOO_COMMON',
  PasswordTooShort = 'PASSWORD_TOO_SHORT',
  PasswordTooSimilar = 'PASSWORD_TOO_SIMILAR',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  JwtSignatureExpired = 'JWT_SIGNATURE_EXPIRED',
  JwtInvalidToken = 'JWT_INVALID_TOKEN',
  JwtDecodeError = 'JWT_DECODE_ERROR',
  JwtMissingToken = 'JWT_MISSING_TOKEN',
  JwtInvalidCsrfToken = 'JWT_INVALID_CSRF_TOKEN',
  ChannelInactive = 'CHANNEL_INACTIVE',
  MissingChannelSlug = 'MISSING_CHANNEL_SLUG'
}

export type AccountInput = {
  /** Given name. */
  firstName?: Maybe<Scalars['String']>;
  /** Family name. */
  lastName?: Maybe<Scalars['String']>;
  /** Billing address of the customer. */
  defaultBillingAddress?: Maybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: Maybe<AddressInput>;
  /** User language code. */
  languageCode?: Maybe<LanguageCodeEnum>;
};

/** Register a new user. */
export type AccountRegister = {
  __typename?: 'AccountRegister';
  /** Informs whether users need to confirm their email address. */
  requiresConfirmation?: Maybe<Scalars['Boolean']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  user?: Maybe<User>;
};

export type AccountRegisterInput = {
  /** The email address of the user. */
  email: Scalars['String'];
  /** Password. */
  password: Scalars['String'];
  /** Base of frontend URL that will be needed to create confirmation URL. */
  redirectUrl?: Maybe<Scalars['String']>;
  /** User language code. */
  languageCode?: Maybe<LanguageCodeEnum>;
  /** User public metadata. */
  metadata?: Maybe<Array<MetadataInput>>;
  /** Slug of a channel which will be used to notify users. Optional when only one channel exists. */
  channel?: Maybe<Scalars['String']>;
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
  /** An updated user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  companyName: Scalars['String'];
  streetAddress1: Scalars['String'];
  streetAddress2: Scalars['String'];
  city: Scalars['String'];
  cityArea: Scalars['String'];
  postalCode: Scalars['String'];
  /** Shop's default country. */
  country: CountryDisplay;
  countryArea: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  /** Address is user's default shipping address. */
  isDefaultShippingAddress?: Maybe<Scalars['Boolean']>;
  /** Address is user's default billing address. */
  isDefaultBillingAddress?: Maybe<Scalars['Boolean']>;
};

/** Creates user address. */
export type AddressCreate = {
  __typename?: 'AddressCreate';
  /** A user instance for which the address was created. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  address?: Maybe<Address>;
};

/** Deletes an address. */
export type AddressDelete = {
  __typename?: 'AddressDelete';
  /** A user instance for which the address was deleted. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  address?: Maybe<Address>;
};

export type AddressInput = {
  /** Given name. */
  firstName?: Maybe<Scalars['String']>;
  /** Family name. */
  lastName?: Maybe<Scalars['String']>;
  /** Company or organization. */
  companyName?: Maybe<Scalars['String']>;
  /** Address. */
  streetAddress1?: Maybe<Scalars['String']>;
  /** Address. */
  streetAddress2?: Maybe<Scalars['String']>;
  /** City. */
  city?: Maybe<Scalars['String']>;
  /** District. */
  cityArea?: Maybe<Scalars['String']>;
  /** Postal code. */
  postalCode?: Maybe<Scalars['String']>;
  /** Country. */
  country?: Maybe<CountryCode>;
  /** State or province. */
  countryArea?: Maybe<Scalars['String']>;
  /** Phone number. */
  phone?: Maybe<Scalars['String']>;
};

/** Sets a default address for the given user. */
export type AddressSetDefault = {
  __typename?: 'AddressSetDefault';
  /** An updated user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** An enumeration. */
export enum AddressTypeEnum {
  Billing = 'BILLING',
  Shipping = 'SHIPPING'
}

/** Updates an address. */
export type AddressUpdate = {
  __typename?: 'AddressUpdate';
  /** A user object for which the address was edited. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
  address?: Maybe<Address>;
};

export type AddressValidationData = {
  __typename?: 'AddressValidationData';
  countryCode?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  addressFormat?: Maybe<Scalars['String']>;
  addressLatinFormat?: Maybe<Scalars['String']>;
  allowedFields?: Maybe<Array<Maybe<Scalars['String']>>>;
  requiredFields?: Maybe<Array<Maybe<Scalars['String']>>>;
  upperFields?: Maybe<Array<Maybe<Scalars['String']>>>;
  countryAreaType?: Maybe<Scalars['String']>;
  countryAreaChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  cityType?: Maybe<Scalars['String']>;
  cityChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  cityAreaType?: Maybe<Scalars['String']>;
  cityAreaChoices?: Maybe<Array<Maybe<ChoiceValue>>>;
  postalCodeType?: Maybe<Scalars['String']>;
  postalCodeMatchers?: Maybe<Array<Maybe<Scalars['String']>>>;
  postalCodeExamples?: Maybe<Array<Maybe<Scalars['String']>>>;
  postalCodePrefix?: Maybe<Scalars['String']>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Name of the app. */
  name?: Maybe<Scalars['String']>;
  /** The date and time when the app was created. */
  created?: Maybe<Scalars['DateTime']>;
  /** Determine if app will be set active or not. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** List of the app's permissions. */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** Last 4 characters of the tokens. */
  tokens?: Maybe<Array<Maybe<AppToken>>>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Type of the app. */
  type?: Maybe<AppTypeEnum>;
  /** List of webhooks assigned to this app. */
  webhooks?: Maybe<Array<Maybe<Webhook>>>;
  /** Description of this app. */
  aboutApp?: Maybe<Scalars['String']>;
  /** Description of the data privacy defined for this app. */
  dataPrivacy?: Maybe<Scalars['String']>;
  /** Url to details about the privacy policy on the app owner page. */
  dataPrivacyUrl?: Maybe<Scalars['String']>;
  /** Homepage of the app. */
  homepageUrl?: Maybe<Scalars['String']>;
  /** Support page for the app. */
  supportUrl?: Maybe<Scalars['String']>;
  /** Url to iframe with the configuration for the app. */
  configurationUrl?: Maybe<Scalars['String']>;
  /** Url to iframe with the app. */
  appUrl?: Maybe<Scalars['String']>;
  /** Version number of the app. */
  version?: Maybe<Scalars['String']>;
  /** JWT token used to authenticate by thridparty app. */
  accessToken?: Maybe<Scalars['String']>;
};

/** Activate the app. */
export type AppActivate = {
  __typename?: 'AppActivate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  app?: Maybe<App>;
};

export type AppCountableConnection = {
  __typename?: 'AppCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<AppCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AppCountableEdge = {
  __typename?: 'AppCountableEdge';
  /** The item at the end of the edge. */
  node: App;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new app. */
export type AppCreate = {
  __typename?: 'AppCreate';
  /** The newly created authentication token. */
  authToken?: Maybe<Scalars['String']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  app?: Maybe<App>;
};

/** Deactivate the app. */
export type AppDeactivate = {
  __typename?: 'AppDeactivate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  app?: Maybe<App>;
};

/** Deletes an app. */
export type AppDelete = {
  __typename?: 'AppDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  app?: Maybe<App>;
};

/** Delete failed installation. */
export type AppDeleteFailedInstallation = {
  __typename?: 'AppDeleteFailedInstallation';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
};

export type AppError = {
  __typename?: 'AppError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: AppErrorCode;
  /** List of permissions which causes the error. */
  permissions?: Maybe<Array<PermissionEnum>>;
};

/** An enumeration. */
export enum AppErrorCode {
  Forbidden = 'FORBIDDEN',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  InvalidStatus = 'INVALID_STATUS',
  InvalidPermission = 'INVALID_PERMISSION',
  InvalidUrlFormat = 'INVALID_URL_FORMAT',
  InvalidManifestFormat = 'INVALID_MANIFEST_FORMAT',
  ManifestUrlCantConnect = 'MANIFEST_URL_CANT_CONNECT',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  OutOfScopeApp = 'OUT_OF_SCOPE_APP',
  OutOfScopePermission = 'OUT_OF_SCOPE_PERMISSION'
}

/** Fetch and validate manifest. */
export type AppFetchManifest = {
  __typename?: 'AppFetchManifest';
  manifest?: Maybe<Manifest>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
};

export type AppFilterInput = {
  search?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  type?: Maybe<AppTypeEnum>;
};

export type AppInput = {
  /** Name of the app. */
  name?: Maybe<Scalars['String']>;
  /** List of permission code names to assign to this app. */
  permissions?: Maybe<Array<Maybe<PermissionEnum>>>;
};

/** Install new app by using app manifest. */
export type AppInstall = {
  __typename?: 'AppInstall';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
};

export type AppInstallInput = {
  /** Name of the app to install. */
  appName?: Maybe<Scalars['String']>;
  /** Url to app's manifest in JSON format. */
  manifestUrl?: Maybe<Scalars['String']>;
  /** Determine if app will be set active or not. */
  activateAfterInstallation?: Maybe<Scalars['Boolean']>;
  /** List of permission code names to assign to this app. */
  permissions?: Maybe<Array<Maybe<PermissionEnum>>>;
};

/** Represents ongoing installation of app. */
export type AppInstallation = Node & Job & {
  __typename?: 'AppInstallation';
  appName: Scalars['String'];
  manifestUrl: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Job status. */
  status: JobStatusEnum;
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
};

/** Retry failed installation of new app. */
export type AppRetryInstall = {
  __typename?: 'AppRetryInstall';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  appInstallation?: Maybe<AppInstallation>;
};

export enum AppSortField {
  /** Sort apps by name. */
  Name = 'NAME',
  /** Sort apps by creation date. */
  CreationDate = 'CREATION_DATE'
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
  /** Name of the authenticated token. */
  name?: Maybe<Scalars['String']>;
  /** Last 4 characters of the token. */
  authToken?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
};

/** Creates a new token. */
export type AppTokenCreate = {
  __typename?: 'AppTokenCreate';
  /** The newly created authentication token. */
  authToken?: Maybe<Scalars['String']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  appToken?: Maybe<AppToken>;
};

/** Deletes an authentication token assigned to app. */
export type AppTokenDelete = {
  __typename?: 'AppTokenDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  appToken?: Maybe<AppToken>;
};

export type AppTokenInput = {
  /** Name of the token. */
  name?: Maybe<Scalars['String']>;
  /** ID of app. */
  app: Scalars['ID'];
};

/** Verify provided app token. */
export type AppTokenVerify = {
  __typename?: 'AppTokenVerify';
  /** Determine if token is valid or not. */
  valid: Scalars['Boolean'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  appErrors: Array<AppError>;
  errors: Array<AppError>;
  app?: Maybe<App>;
};

/** An enumeration. */
export enum AreaUnitsEnum {
  SqCm = 'SQ_CM',
  SqM = 'SQ_M',
  SqKm = 'SQ_KM',
  SqFt = 'SQ_FT',
  SqYd = 'SQ_YD',
  SqInch = 'SQ_INCH'
}

/** Assigns storefront's navigation menus. */
export type AssignNavigation = {
  __typename?: 'AssignNavigation';
  /** Assigned navigation menu. */
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
};

/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type Attribute = Node & ObjectWithMetadata & {
  __typename?: 'Attribute';
  /** The ID of the object. */
  id: Scalars['ID'];
  productTypes: ProductTypeCountableConnection;
  productVariantTypes: ProductTypeCountableConnection;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: Maybe<AttributeInputTypeEnum>;
  /** The entity type which can be used as a reference. */
  entityType?: Maybe<AttributeEntityTypeEnum>;
  /** Name of an attribute displayed in the interface. */
  name?: Maybe<Scalars['String']>;
  /** Internal representation of an attribute name. */
  slug?: Maybe<Scalars['String']>;
  /** The attribute type. */
  type?: Maybe<AttributeTypeEnum>;
  /** The unit of attribute values. */
  unit?: Maybe<MeasurementUnitsEnum>;
  /** List of attribute's values. */
  choices?: Maybe<AttributeValueCountableConnection>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired: Scalars['Boolean'];
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront: Scalars['Boolean'];
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront: Scalars['Boolean'];
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard: Scalars['Boolean'];
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid: Scalars['Boolean'];
  /** Returns translated attribute fields for the given language code. */
  translation?: Maybe<AttributeTranslation>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition: Scalars['Int'];
  /** Flag indicating that attribute has predefined choices. */
  withChoices: Scalars['Boolean'];
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeProductTypesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeProductVariantTypesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeChoicesArgs = {
  sortBy?: Maybe<AttributeChoicesSortingInput>;
  filter?: Maybe<AttributeValueFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Custom attribute of a product. Attributes can be assigned to products and variants at the product type level. */
export type AttributeTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes attributes. */
export type AttributeBulkDelete = {
  __typename?: 'AttributeBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
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
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<AttributeCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AttributeCountableEdge = {
  __typename?: 'AttributeCountableEdge';
  /** The item at the end of the edge. */
  node: Attribute;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
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
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: Maybe<AttributeInputTypeEnum>;
  /** The entity type which can be used as a reference. */
  entityType?: Maybe<AttributeEntityTypeEnum>;
  /** Name of an attribute displayed in the interface. */
  name: Scalars['String'];
  /** Internal representation of an attribute name. */
  slug?: Maybe<Scalars['String']>;
  /** The attribute type. */
  type: AttributeTypeEnum;
  /** The unit of attribute values. */
  unit?: Maybe<MeasurementUnitsEnum>;
  /** List of attribute's values. */
  values?: Maybe<Array<Maybe<AttributeValueCreateInput>>>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute is for variants only. */
  isVariantOnly?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard?: Maybe<Scalars['Boolean']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition?: Maybe<Scalars['Int']>;
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid?: Maybe<Scalars['Boolean']>;
};

/** Deletes an attribute. */
export type AttributeDelete = {
  __typename?: 'AttributeDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
  attribute?: Maybe<Attribute>;
};

/** An enumeration. */
export enum AttributeEntityTypeEnum {
  Page = 'PAGE',
  Product = 'PRODUCT'
}

export type AttributeError = {
  __typename?: 'AttributeError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: AttributeErrorCode;
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
  valueRequired?: Maybe<Scalars['Boolean']>;
  isVariantOnly?: Maybe<Scalars['Boolean']>;
  visibleInStorefront?: Maybe<Scalars['Boolean']>;
  filterableInStorefront?: Maybe<Scalars['Boolean']>;
  filterableInDashboard?: Maybe<Scalars['Boolean']>;
  availableInGrid?: Maybe<Scalars['Boolean']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  search?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  type?: Maybe<AttributeTypeEnum>;
  inCollection?: Maybe<Scalars['ID']>;
  inCategory?: Maybe<Scalars['ID']>;
  /** Specifies the channel by which the data should be filtered. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
};

export type AttributeInput = {
  /** Internal representation of an attribute name. */
  slug: Scalars['String'];
  /** Internal representation of a value (unique per attribute). */
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The range that the returned values should be in. */
  valuesRange?: Maybe<IntRangeInput>;
  /** The date time range that the returned values should be in. */
  dateTime?: Maybe<DateTimeRangeInput>;
  /** The date range that the returned values should be in. */
  date?: Maybe<DateRangeInput>;
  /** The boolean value of the attribute. */
  boolean?: Maybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum AttributeInputTypeEnum {
  Dropdown = 'DROPDOWN',
  Multiselect = 'MULTISELECT',
  File = 'FILE',
  Reference = 'REFERENCE',
  Numeric = 'NUMERIC',
  RichText = 'RICH_TEXT',
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  DateTime = 'DATE_TIME'
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
  /** Sort attributes by name */
  Name = 'NAME',
  /** Sort attributes by slug */
  Slug = 'SLUG',
  /** Sort attributes by the value required flag */
  ValueRequired = 'VALUE_REQUIRED',
  /** Sort attributes by the variant only flag */
  IsVariantOnly = 'IS_VARIANT_ONLY',
  /** Sort attributes by visibility in the storefront */
  VisibleInStorefront = 'VISIBLE_IN_STOREFRONT',
  /** Sort attributes by the filterable in storefront flag */
  FilterableInStorefront = 'FILTERABLE_IN_STOREFRONT',
  /** Sort attributes by the filterable in dashboard flag */
  FilterableInDashboard = 'FILTERABLE_IN_DASHBOARD',
  /** Sort attributes by their position in storefront */
  StorefrontSearchPosition = 'STOREFRONT_SEARCH_POSITION',
  /** Sort attributes based on whether they can be displayed or not in a product grid. */
  AvailableInGrid = 'AVAILABLE_IN_GRID'
}

export type AttributeSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort attributes by the selected field. */
  field: AttributeSortField;
};

export type AttributeTranslatableContent = Node & {
  __typename?: 'AttributeTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Returns translated attribute fields for the given language code. */
  translation?: Maybe<AttributeTranslation>;
  /**
   * Custom attribute of a product.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  attribute?: Maybe<Attribute>;
};


export type AttributeTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for an attribute. */
export type AttributeTranslate = {
  __typename?: 'AttributeTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  attribute?: Maybe<Attribute>;
};

export type AttributeTranslation = Node & {
  __typename?: 'AttributeTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Translation language. */
  language: LanguageDisplay;
};

/** An enumeration. */
export enum AttributeTypeEnum {
  ProductType = 'PRODUCT_TYPE',
  PageType = 'PAGE_TYPE'
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
  /** Name of an attribute displayed in the interface. */
  name?: Maybe<Scalars['String']>;
  /** Internal representation of an attribute name. */
  slug?: Maybe<Scalars['String']>;
  /** The unit of attribute values. */
  unit?: Maybe<MeasurementUnitsEnum>;
  /** IDs of values to be removed from this attribute. */
  removeValues?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** New values to be created for this attribute. */
  addValues?: Maybe<Array<Maybe<AttributeValueCreateInput>>>;
  /** Whether the attribute requires values to be passed or not. */
  valueRequired?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute is for variants only. */
  isVariantOnly?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute should be visible or not in storefront. */
  visibleInStorefront?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in storefront. */
  filterableInStorefront?: Maybe<Scalars['Boolean']>;
  /** Whether the attribute can be filtered in dashboard. */
  filterableInDashboard?: Maybe<Scalars['Boolean']>;
  /** The position of the attribute in the storefront navigation (0 by default). */
  storefrontSearchPosition?: Maybe<Scalars['Int']>;
  /** Whether the attribute can be displayed in the admin product list. */
  availableInGrid?: Maybe<Scalars['Boolean']>;
};

/** Represents a value of an attribute. */
export type AttributeValue = Node & {
  __typename?: 'AttributeValue';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Name of a value displayed in the interface. */
  name?: Maybe<Scalars['String']>;
  /** Internal representation of a value (unique per attribute). */
  slug?: Maybe<Scalars['String']>;
  /** Represents the value of the attribute value. */
  value?: Maybe<Scalars['String']>;
  /** Returns translated attribute value fields for the given language code. */
  translation?: Maybe<AttributeValueTranslation>;
  /** The input type to use for entering attribute values in the dashboard. */
  inputType?: Maybe<AttributeInputTypeEnum>;
  /** The ID of the attribute reference. */
  reference?: Maybe<Scalars['ID']>;
  /** Represents file URL and content type (if attribute value is a file). */
  file?: Maybe<File>;
  /** Represents the text (JSON) of the attribute value. */
  richText?: Maybe<Scalars['JSONString']>;
  /** Represents the boolean value of the attribute value. */
  boolean?: Maybe<Scalars['Boolean']>;
  /** Represents the date value of the attribute value. */
  date?: Maybe<Scalars['Date']>;
  /** Represents the date time value of the attribute value. */
  dateTime?: Maybe<Scalars['DateTime']>;
};


/** Represents a value of an attribute. */
export type AttributeValueTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Deletes values of attributes. */
export type AttributeValueBulkDelete = {
  __typename?: 'AttributeValueBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
};

export type AttributeValueCountableConnection = {
  __typename?: 'AttributeValueCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<AttributeValueCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type AttributeValueCountableEdge = {
  __typename?: 'AttributeValueCountableEdge';
  /** The item at the end of the edge. */
  node: AttributeValue;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a value for an attribute. */
export type AttributeValueCreate = {
  __typename?: 'AttributeValueCreate';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
};

export type AttributeValueCreateInput = {
  /** Name of a value displayed in the interface. */
  name: Scalars['String'];
  /** Represents the value of the attribute value. */
  value?: Maybe<Scalars['String']>;
  /** Represents the text (JSON) of the attribute value. */
  richText?: Maybe<Scalars['JSONString']>;
};

/** Deletes a value of an attribute. */
export type AttributeValueDelete = {
  __typename?: 'AttributeValueDelete';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
};

export type AttributeValueFilterInput = {
  search?: Maybe<Scalars['String']>;
};

export type AttributeValueInput = {
  /** ID of the selected attribute. */
  id?: Maybe<Scalars['ID']>;
  /** The value or slug of an attribute to resolve. If the passed value is non-existent, it will be created. */
  values?: Maybe<Array<Scalars['String']>>;
  /** URL of the file attribute. Every time, a new value is created. */
  file?: Maybe<Scalars['String']>;
  /** File content type. */
  contentType?: Maybe<Scalars['String']>;
  /** List of entity IDs that will be used as references. */
  references?: Maybe<Array<Scalars['ID']>>;
  /** Text content in JSON format. */
  richText?: Maybe<Scalars['JSONString']>;
  /** Represents the boolean value of the attribute value. */
  boolean?: Maybe<Scalars['Boolean']>;
  /** Represents the date value of the attribute value. */
  date?: Maybe<Scalars['Date']>;
  /** Represents the date time value of the attribute value. */
  dateTime?: Maybe<Scalars['DateTime']>;
};

export type AttributeValueTranslatableContent = Node & {
  __typename?: 'AttributeValueTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  richText?: Maybe<Scalars['JSONString']>;
  /** Returns translated attribute value fields for the given language code. */
  translation?: Maybe<AttributeValueTranslation>;
  /**
   * Represents a value of an attribute.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  attributeValue?: Maybe<AttributeValue>;
};


export type AttributeValueTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for an attribute value. */
export type AttributeValueTranslate = {
  __typename?: 'AttributeValueTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  attributeValue?: Maybe<AttributeValue>;
};

export type AttributeValueTranslation = Node & {
  __typename?: 'AttributeValueTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  richText?: Maybe<Scalars['JSONString']>;
  /** Translation language. */
  language: LanguageDisplay;
};

export type AttributeValueTranslationInput = {
  name?: Maybe<Scalars['String']>;
  richText?: Maybe<Scalars['JSONString']>;
};

/** Updates value of an attribute. */
export type AttributeValueUpdate = {
  __typename?: 'AttributeValueUpdate';
  /** The updated attribute. */
  attribute?: Maybe<Attribute>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  attributeErrors: Array<AttributeError>;
  errors: Array<AttributeError>;
  attributeValue?: Maybe<AttributeValue>;
};

export type BulkAttributeValueInput = {
  /** ID of the selected attribute. */
  id?: Maybe<Scalars['ID']>;
  /** The value or slug of an attribute to resolve. If the passed value is non-existent, it will be created. */
  values?: Maybe<Array<Scalars['String']>>;
  /** The boolean value of an attribute to resolve. If the passed value is non-existent, it will be created. */
  boolean?: Maybe<Scalars['Boolean']>;
};

export type BulkProductError = {
  __typename?: 'BulkProductError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ProductErrorCode;
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
  /** Index of an input list item that caused the error. */
  index?: Maybe<Scalars['Int']>;
  /** List of warehouse IDs which causes the error. */
  warehouses?: Maybe<Array<Scalars['ID']>>;
  /** List of channel IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
};

export type BulkStockError = {
  __typename?: 'BulkStockError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ProductErrorCode;
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
  /** Index of an input list item that caused the error. */
  index?: Maybe<Scalars['Int']>;
};

export type CatalogueInput = {
  /** Products related to the discount. */
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Categories related to the discount. */
  categories?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Collections related to the discount. */
  collections?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type Category = Node & ObjectWithMetadata & {
  __typename?: 'Category';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  slug: Scalars['String'];
  parent?: Maybe<Category>;
  level: Scalars['Int'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /**
   * Description of the category (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** List of ancestors of the category. */
  ancestors?: Maybe<CategoryCountableConnection>;
  /** List of products in the category. */
  products?: Maybe<ProductCountableConnection>;
  /** List of children of the category. */
  children?: Maybe<CategoryCountableConnection>;
  backgroundImage?: Maybe<Image>;
  /** Returns translated category fields for the given language code. */
  translation?: Maybe<CategoryTranslation>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryAncestorsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryProductsArgs = {
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryChildrenArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents a single category of products. Categories allow to organize products in a tree-hierarchies which can be used for navigation in the storefront. */
export type CategoryBackgroundImageArgs = {
  size?: Maybe<Scalars['Int']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export type CategoryCountableConnection = {
  __typename?: 'CategoryCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<CategoryCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CategoryCountableEdge = {
  __typename?: 'CategoryCountableEdge';
  /** The item at the end of the edge. */
  node: Category;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new category. */
export type CategoryCreate = {
  __typename?: 'CategoryCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  category?: Maybe<Category>;
};

/** Deletes a category. */
export type CategoryDelete = {
  __typename?: 'CategoryDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  category?: Maybe<Category>;
};

export type CategoryFilterInput = {
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type CategoryInput = {
  /** Category description (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Category name. */
  name?: Maybe<Scalars['String']>;
  /** Category slug. */
  slug?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
  /** Background image file. */
  backgroundImage?: Maybe<Scalars['Upload']>;
  /** Alt text for a product media. */
  backgroundImageAlt?: Maybe<Scalars['String']>;
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
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
  /** Sort categories by the selected field. */
  field: CategorySortField;
};

export type CategoryTranslatableContent = Node & {
  __typename?: 'CategoryTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the category (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** Returns translated category fields for the given language code. */
  translation?: Maybe<CategoryTranslation>;
  /**
   * Represents a single category of products.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  category?: Maybe<Category>;
};


export type CategoryTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a category. */
export type CategoryTranslate = {
  __typename?: 'CategoryTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  category?: Maybe<Category>;
};

export type CategoryTranslation = Node & {
  __typename?: 'CategoryTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['JSONString']>;
  /** Translation language. */
  language: LanguageDisplay;
  /**
   * Translated description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
};

/** Updates a category. */
export type CategoryUpdate = {
  __typename?: 'CategoryUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  category?: Maybe<Category>;
};

/** Represents channel. */
export type Channel = Node & {
  __typename?: 'Channel';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  isActive: Scalars['Boolean'];
  slug: Scalars['String'];
  currencyCode: Scalars['String'];
  /** Whether a channel has associated orders. */
  hasOrders: Scalars['Boolean'];
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry: CountryDisplay;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
  channel?: Maybe<Channel>;
};

export type ChannelCreateInput = {
  /** isActive flag. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** Name of the channel. */
  name: Scalars['String'];
  /** Slug of the channel. */
  slug: Scalars['String'];
  /** Currency of the channel. */
  currencyCode: Scalars['String'];
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry: CountryCode;
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: Maybe<Array<Scalars['ID']>>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
  channel?: Maybe<Channel>;
};

export type ChannelDeleteInput = {
  /** ID of channel to migrate orders from origin channel. */
  channelId: Scalars['ID'];
};

export type ChannelError = {
  __typename?: 'ChannelError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ChannelErrorCode;
  /** List of shipping zone IDs which causes the error. */
  shippingZones?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum ChannelErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  ChannelsCurrencyMustBeTheSame = 'CHANNELS_CURRENCY_MUST_BE_THE_SAME',
  ChannelWithOrders = 'CHANNEL_WITH_ORDERS',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM'
}

/** Update a channel. */
export type ChannelUpdate = {
  __typename?: 'ChannelUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  channelErrors: Array<ChannelError>;
  errors: Array<ChannelError>;
  channel?: Maybe<Channel>;
};

export type ChannelUpdateInput = {
  /** isActive flag. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** Name of the channel. */
  name?: Maybe<Scalars['String']>;
  /** Slug of the channel. */
  slug?: Maybe<Scalars['String']>;
  /** Default country for the channel. Default country can be used in checkout to determine the stock quantities or calculate taxes when the country was not explicitly provided. */
  defaultCountry?: Maybe<CountryCode>;
  /** List of shipping zones to assign to the channel. */
  addShippingZones?: Maybe<Array<Scalars['ID']>>;
  /** List of shipping zones to unassign from the channel. */
  removeShippingZones?: Maybe<Array<Scalars['ID']>>;
};

/** Checkout object. */
export type Checkout = Node & ObjectWithMetadata & {
  __typename?: 'Checkout';
  created: Scalars['DateTime'];
  lastChange: Scalars['DateTime'];
  user?: Maybe<User>;
  channel: Channel;
  billingAddress?: Maybe<Address>;
  shippingAddress?: Maybe<Address>;
  note: Scalars['String'];
  discount?: Maybe<Money>;
  discountName?: Maybe<Scalars['String']>;
  translatedDiscountName?: Maybe<Scalars['String']>;
  voucherCode?: Maybe<Scalars['String']>;
  /** List of gift cards associated with this checkout. */
  giftCards?: Maybe<Array<Maybe<GiftCard>>>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Shipping methods that can be used with this order. */
  availableShippingMethods: Array<Maybe<ShippingMethod>>;
  /** List of available payment gateways. */
  availablePaymentGateways: Array<PaymentGateway>;
  /** Email of a customer. */
  email: Scalars['String'];
  /** Returns True, if checkout requires shipping. */
  isShippingRequired: Scalars['Boolean'];
  /** The number of items purchased. */
  quantity: Scalars['Int'];
  /** A list of checkout lines, each containing information about an item in the checkout. */
  lines?: Maybe<Array<Maybe<CheckoutLine>>>;
  /** The price of the shipping, with all the taxes included. */
  shippingPrice?: Maybe<TaxedMoney>;
  /** The shipping method related with checkout. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** The price of the checkout before shipping, with taxes included. */
  subtotalPrice?: Maybe<TaxedMoney>;
  /** The checkout's token. */
  token: Scalars['UUID'];
  /** The sum of the the checkout line prices, with all the taxes,shipping costs, and discounts included. */
  totalPrice?: Maybe<TaxedMoney>;
  /** Checkout language code. */
  languageCode: LanguageCodeEnum;
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
  /** Placed order. */
  order?: Maybe<Order>;
  /** Set to true if payment needs to be confirmed before checkout is complete. */
  confirmationNeeded: Scalars['Boolean'];
  /** Confirmation data used to process additional authorization steps. */
  confirmationData?: Maybe<Scalars['JSONString']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
};

export type CheckoutCountableConnection = {
  __typename?: 'CheckoutCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<CheckoutCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CheckoutCountableEdge = {
  __typename?: 'CheckoutCountableEdge';
  /** The item at the end of the edge. */
  node: Checkout;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Create a new checkout. */
export type CheckoutCreate = {
  __typename?: 'CheckoutCreate';
  /** Whether the checkout was created or the current active one was returned. Refer to checkoutLinesAdd and checkoutLinesUpdate to merge a cart with an active checkout.DEPRECATED: Will be removed in Saleor 4.0. Always returns True. */
  created?: Maybe<Scalars['Boolean']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  checkoutErrors: Array<CheckoutError>;
  errors: Array<CheckoutError>;
  checkout?: Maybe<Checkout>;
};

export type CheckoutCreateInput = {
  /** Slug of a channel in which to create a checkout. */
  channel?: Maybe<Scalars['String']>;
  /** A list of checkout lines, each containing information about an item in the checkout. */
  lines: Array<Maybe<CheckoutLineInput>>;
  /** The customer's email address. */
  email?: Maybe<Scalars['String']>;
  /** The mailing address to where the checkout will be shipped. Note: the address will be ignored if the checkout doesn't contain shippable items. */
  shippingAddress?: Maybe<AddressInput>;
  /** Billing address of the customer. */
  billingAddress?: Maybe<AddressInput>;
  /** Checkout language code. */
  languageCode?: Maybe<LanguageCodeEnum>;
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
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: CheckoutErrorCode;
  /** List of varint IDs which causes the error. */
  variants?: Maybe<Array<Scalars['ID']>>;
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
};

/** An enumeration. */
export enum CheckoutErrorCode {
  BillingAddressNotSet = 'BILLING_ADDRESS_NOT_SET',
  CheckoutNotFullyPaid = 'CHECKOUT_NOT_FULLY_PAID',
  GraphqlError = 'GRAPHQL_ERROR',
  ProductNotPublished = 'PRODUCT_NOT_PUBLISHED',
  ProductUnavailableForPurchase = 'PRODUCT_UNAVAILABLE_FOR_PURCHASE',
  InsufficientStock = 'INSUFFICIENT_STOCK',
  Invalid = 'INVALID',
  InvalidShippingMethod = 'INVALID_SHIPPING_METHOD',
  NotFound = 'NOT_FOUND',
  PaymentError = 'PAYMENT_ERROR',
  QuantityGreaterThanLimit = 'QUANTITY_GREATER_THAN_LIMIT',
  Required = 'REQUIRED',
  ShippingAddressNotSet = 'SHIPPING_ADDRESS_NOT_SET',
  ShippingMethodNotApplicable = 'SHIPPING_METHOD_NOT_APPLICABLE',
  ShippingMethodNotSet = 'SHIPPING_METHOD_NOT_SET',
  ShippingNotRequired = 'SHIPPING_NOT_REQUIRED',
  TaxError = 'TAX_ERROR',
  Unique = 'UNIQUE',
  VoucherNotApplicable = 'VOUCHER_NOT_APPLICABLE',
  ZeroQuantity = 'ZERO_QUANTITY',
  MissingChannelSlug = 'MISSING_CHANNEL_SLUG',
  ChannelInactive = 'CHANNEL_INACTIVE',
  UnavailableVariantInChannel = 'UNAVAILABLE_VARIANT_IN_CHANNEL'
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
  variant: ProductVariant;
  quantity: Scalars['Int'];
  /** The sum of the checkout line price, taxes and discounts. */
  totalPrice?: Maybe<TaxedMoney>;
  /** Indicates whether the item need to be delivered. */
  requiresShipping?: Maybe<Scalars['Boolean']>;
};

export type CheckoutLineCountableConnection = {
  __typename?: 'CheckoutLineCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<CheckoutLineCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CheckoutLineCountableEdge = {
  __typename?: 'CheckoutLineCountableEdge';
  /** The item at the end of the edge. */
  node: CheckoutLine;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
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
  /** A newly created payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
  errors: Array<PaymentError>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  slug: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /**
   * Description of the collection (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** List of products in this collection. */
  products?: Maybe<ProductCountableConnection>;
  backgroundImage?: Maybe<Image>;
  /** Returns translated collection fields for the given language code. */
  translation?: Maybe<CollectionTranslation>;
  /** List of channels in which the collection is available. */
  channelListings?: Maybe<Array<CollectionChannelListing>>;
};


/** Represents a collection of products. */
export type CollectionProductsArgs = {
  filter?: Maybe<ProductFilterInput>;
  sortBy?: Maybe<ProductOrder>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents a collection of products. */
export type CollectionBackgroundImageArgs = {
  size?: Maybe<Scalars['Int']>;
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
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
};

/** Represents collection channel listing. */
export type CollectionChannelListing = Node & {
  __typename?: 'CollectionChannelListing';
  /** The ID of the object. */
  id: Scalars['ID'];
  publicationDate?: Maybe<Scalars['Date']>;
  isPublished: Scalars['Boolean'];
  channel: Channel;
};

export type CollectionChannelListingError = {
  __typename?: 'CollectionChannelListingError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ProductErrorCode;
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
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
  addChannels?: Maybe<Array<PublishableChannelListingInput>>;
  /** List of channels from which the collection should be unassigned. */
  removeChannels?: Maybe<Array<Scalars['ID']>>;
};

export type CollectionCountableConnection = {
  __typename?: 'CollectionCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<CollectionCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type CollectionCountableEdge = {
  __typename?: 'CollectionCountableEdge';
  /** The item at the end of the edge. */
  node: Collection;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new collection. */
export type CollectionCreate = {
  __typename?: 'CollectionCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
  collection?: Maybe<Collection>;
};

export type CollectionCreateInput = {
  /** Informs whether a collection is published. */
  isPublished?: Maybe<Scalars['Boolean']>;
  /** Name of the collection. */
  name?: Maybe<Scalars['String']>;
  /** Slug of the collection. */
  slug?: Maybe<Scalars['String']>;
  /** Description of the collection (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Background image file. */
  backgroundImage?: Maybe<Scalars['Upload']>;
  /** Alt text for an image. */
  backgroundImageAlt?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: Maybe<Scalars['Date']>;
  /** List of products to be added to the collection. */
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Deletes a collection. */
export type CollectionDelete = {
  __typename?: 'CollectionDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
  collection?: Maybe<Collection>;
};

export type CollectionError = {
  __typename?: 'CollectionError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of products IDs which causes the error. */
  products?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: CollectionErrorCode;
};

/** An enumeration. */
export enum CollectionErrorCode {
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  CannotManageProductWithoutVariant = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT'
}

export type CollectionFilterInput = {
  published?: Maybe<CollectionPublished>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Specifies the channel by which the data should be filtered. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
};

export type CollectionInput = {
  /** Informs whether a collection is published. */
  isPublished?: Maybe<Scalars['Boolean']>;
  /** Name of the collection. */
  name?: Maybe<Scalars['String']>;
  /** Slug of the collection. */
  slug?: Maybe<Scalars['String']>;
  /** Description of the collection (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Background image file. */
  backgroundImage?: Maybe<Scalars['Upload']>;
  /** Alt text for an image. */
  backgroundImageAlt?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: Maybe<Scalars['Date']>;
};

export enum CollectionPublished {
  Published = 'PUBLISHED',
  Hidden = 'HIDDEN'
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
  /** Sort collections by name. */
  Name = 'NAME',
  /** Sort collections by availability. */
  Availability = 'AVAILABILITY',
  /** Sort collections by product count. */
  ProductCount = 'PRODUCT_COUNT',
  /** Sort collections by publication date. */
  PublicationDate = 'PUBLICATION_DATE'
}

export type CollectionSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
  /** Sort collections by the selected field. */
  field: CollectionSortField;
};

export type CollectionTranslatableContent = Node & {
  __typename?: 'CollectionTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the collection (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** Returns translated collection fields for the given language code. */
  translation?: Maybe<CollectionTranslation>;
  /**
   * Represents a collection of products.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  collection?: Maybe<Collection>;
};


export type CollectionTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a collection. */
export type CollectionTranslate = {
  __typename?: 'CollectionTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  collection?: Maybe<Collection>;
};

export type CollectionTranslation = Node & {
  __typename?: 'CollectionTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['JSONString']>;
  /** Translation language. */
  language: LanguageDisplay;
  /**
   * Translated description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
};

/** Updates a collection. */
export type CollectionUpdate = {
  __typename?: 'CollectionUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  collectionErrors: Array<CollectionError>;
  errors: Array<CollectionError>;
  collection?: Maybe<Collection>;
};

/** Stores information about a single configuration field. */
export type ConfigurationItem = {
  __typename?: 'ConfigurationItem';
  /** Name of the field. */
  name: Scalars['String'];
  /** Current value of the field. */
  value?: Maybe<Scalars['String']>;
  /** Type of the field. */
  type?: Maybe<ConfigurationTypeFieldEnum>;
  /** Help text for the field. */
  helpText?: Maybe<Scalars['String']>;
  /** Label for the field. */
  label?: Maybe<Scalars['String']>;
};

export type ConfigurationItemInput = {
  /** Name of the field to update. */
  name: Scalars['String'];
  /** Value of the given field to update. */
  value?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum ConfigurationTypeFieldEnum {
  String = 'STRING',
  Multiline = 'MULTILINE',
  Boolean = 'BOOLEAN',
  Secret = 'SECRET',
  Password = 'PASSWORD',
  Secretmultiline = 'SECRETMULTILINE',
  Output = 'OUTPUT'
}

/** Confirm user account with token sent by email during registration. */
export type ConfirmAccount = {
  __typename?: 'ConfirmAccount';
  /** An activated user account. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Confirm the email change of the logged-in user. */
export type ConfirmEmailChange = {
  __typename?: 'ConfirmEmailChange';
  /** A user instance with a new email. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** An enumeration. */
export enum CountryCode {
  Af = 'AF',
  Ax = 'AX',
  Al = 'AL',
  Dz = 'DZ',
  As = 'AS',
  Ad = 'AD',
  Ao = 'AO',
  Ai = 'AI',
  Aq = 'AQ',
  Ag = 'AG',
  Ar = 'AR',
  Am = 'AM',
  Aw = 'AW',
  Au = 'AU',
  At = 'AT',
  Az = 'AZ',
  Bs = 'BS',
  Bh = 'BH',
  Bd = 'BD',
  Bb = 'BB',
  By = 'BY',
  Be = 'BE',
  Bz = 'BZ',
  Bj = 'BJ',
  Bm = 'BM',
  Bt = 'BT',
  Bo = 'BO',
  Bq = 'BQ',
  Ba = 'BA',
  Bw = 'BW',
  Bv = 'BV',
  Br = 'BR',
  Io = 'IO',
  Bn = 'BN',
  Bg = 'BG',
  Bf = 'BF',
  Bi = 'BI',
  Cv = 'CV',
  Kh = 'KH',
  Cm = 'CM',
  Ca = 'CA',
  Ky = 'KY',
  Cf = 'CF',
  Td = 'TD',
  Cl = 'CL',
  Cn = 'CN',
  Cx = 'CX',
  Cc = 'CC',
  Co = 'CO',
  Km = 'KM',
  Cg = 'CG',
  Cd = 'CD',
  Ck = 'CK',
  Cr = 'CR',
  Ci = 'CI',
  Hr = 'HR',
  Cu = 'CU',
  Cw = 'CW',
  Cy = 'CY',
  Cz = 'CZ',
  Dk = 'DK',
  Dj = 'DJ',
  Dm = 'DM',
  Do = 'DO',
  Ec = 'EC',
  Eg = 'EG',
  Sv = 'SV',
  Gq = 'GQ',
  Er = 'ER',
  Ee = 'EE',
  Sz = 'SZ',
  Et = 'ET',
  Eu = 'EU',
  Fk = 'FK',
  Fo = 'FO',
  Fj = 'FJ',
  Fi = 'FI',
  Fr = 'FR',
  Gf = 'GF',
  Pf = 'PF',
  Tf = 'TF',
  Ga = 'GA',
  Gm = 'GM',
  Ge = 'GE',
  De = 'DE',
  Gh = 'GH',
  Gi = 'GI',
  Gr = 'GR',
  Gl = 'GL',
  Gd = 'GD',
  Gp = 'GP',
  Gu = 'GU',
  Gt = 'GT',
  Gg = 'GG',
  Gn = 'GN',
  Gw = 'GW',
  Gy = 'GY',
  Ht = 'HT',
  Hm = 'HM',
  Va = 'VA',
  Hn = 'HN',
  Hk = 'HK',
  Hu = 'HU',
  Is = 'IS',
  In = 'IN',
  Id = 'ID',
  Ir = 'IR',
  Iq = 'IQ',
  Ie = 'IE',
  Im = 'IM',
  Il = 'IL',
  It = 'IT',
  Jm = 'JM',
  Jp = 'JP',
  Je = 'JE',
  Jo = 'JO',
  Kz = 'KZ',
  Ke = 'KE',
  Ki = 'KI',
  Kw = 'KW',
  Kg = 'KG',
  La = 'LA',
  Lv = 'LV',
  Lb = 'LB',
  Ls = 'LS',
  Lr = 'LR',
  Ly = 'LY',
  Li = 'LI',
  Lt = 'LT',
  Lu = 'LU',
  Mo = 'MO',
  Mg = 'MG',
  Mw = 'MW',
  My = 'MY',
  Mv = 'MV',
  Ml = 'ML',
  Mt = 'MT',
  Mh = 'MH',
  Mq = 'MQ',
  Mr = 'MR',
  Mu = 'MU',
  Yt = 'YT',
  Mx = 'MX',
  Fm = 'FM',
  Md = 'MD',
  Mc = 'MC',
  Mn = 'MN',
  Me = 'ME',
  Ms = 'MS',
  Ma = 'MA',
  Mz = 'MZ',
  Mm = 'MM',
  Na = 'NA',
  Nr = 'NR',
  Np = 'NP',
  Nl = 'NL',
  Nc = 'NC',
  Nz = 'NZ',
  Ni = 'NI',
  Ne = 'NE',
  Ng = 'NG',
  Nu = 'NU',
  Nf = 'NF',
  Kp = 'KP',
  Mk = 'MK',
  Mp = 'MP',
  No = 'NO',
  Om = 'OM',
  Pk = 'PK',
  Pw = 'PW',
  Ps = 'PS',
  Pa = 'PA',
  Pg = 'PG',
  Py = 'PY',
  Pe = 'PE',
  Ph = 'PH',
  Pn = 'PN',
  Pl = 'PL',
  Pt = 'PT',
  Pr = 'PR',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Ru = 'RU',
  Rw = 'RW',
  Bl = 'BL',
  Sh = 'SH',
  Kn = 'KN',
  Lc = 'LC',
  Mf = 'MF',
  Pm = 'PM',
  Vc = 'VC',
  Ws = 'WS',
  Sm = 'SM',
  St = 'ST',
  Sa = 'SA',
  Sn = 'SN',
  Rs = 'RS',
  Sc = 'SC',
  Sl = 'SL',
  Sg = 'SG',
  Sx = 'SX',
  Sk = 'SK',
  Si = 'SI',
  Sb = 'SB',
  So = 'SO',
  Za = 'ZA',
  Gs = 'GS',
  Kr = 'KR',
  Ss = 'SS',
  Es = 'ES',
  Lk = 'LK',
  Sd = 'SD',
  Sr = 'SR',
  Sj = 'SJ',
  Se = 'SE',
  Ch = 'CH',
  Sy = 'SY',
  Tw = 'TW',
  Tj = 'TJ',
  Tz = 'TZ',
  Th = 'TH',
  Tl = 'TL',
  Tg = 'TG',
  Tk = 'TK',
  To = 'TO',
  Tt = 'TT',
  Tn = 'TN',
  Tr = 'TR',
  Tm = 'TM',
  Tc = 'TC',
  Tv = 'TV',
  Ug = 'UG',
  Ua = 'UA',
  Ae = 'AE',
  Gb = 'GB',
  Um = 'UM',
  Us = 'US',
  Uy = 'UY',
  Uz = 'UZ',
  Vu = 'VU',
  Ve = 'VE',
  Vn = 'VN',
  Vg = 'VG',
  Vi = 'VI',
  Wf = 'WF',
  Eh = 'EH',
  Ye = 'YE',
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
  /** JWT token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** JWT refresh token, required to re-generate access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** CSRF token required to re-generate access token. */
  csrfToken?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

export type CreditCard = {
  __typename?: 'CreditCard';
  /** Card brand. */
  brand: Scalars['String'];
  /** First 4 digits of the card number. */
  firstDigits?: Maybe<Scalars['String']>;
  /** Last 4 digits of the card number. */
  lastDigits: Scalars['String'];
  /** Two-digit number representing the card’s expiration month. */
  expMonth?: Maybe<Scalars['Int']>;
  /** Four-digit number representing the card’s expiration year. */
  expYear?: Maybe<Scalars['Int']>;
};

/** Deletes customers. */
export type CustomerBulkDelete = {
  __typename?: 'CustomerBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Date when event happened at in ISO 8601 format. */
  date?: Maybe<Scalars['DateTime']>;
  /** Customer event type. */
  type?: Maybe<CustomerEventsEnum>;
  /** User who performed the action. */
  user?: Maybe<User>;
  /** App that performed the action. */
  app?: Maybe<App>;
  /** Content of the event. */
  message?: Maybe<Scalars['String']>;
  /** Number of objects concerned by the event. */
  count?: Maybe<Scalars['Int']>;
  /** The concerned order. */
  order?: Maybe<Order>;
  /** The concerned order line. */
  orderLine?: Maybe<OrderLine>;
};

/** An enumeration. */
export enum CustomerEventsEnum {
  AccountCreated = 'ACCOUNT_CREATED',
  PasswordResetLinkSent = 'PASSWORD_RESET_LINK_SENT',
  PasswordReset = 'PASSWORD_RESET',
  EmailChangedRequest = 'EMAIL_CHANGED_REQUEST',
  PasswordChanged = 'PASSWORD_CHANGED',
  EmailChanged = 'EMAIL_CHANGED',
  PlacedOrder = 'PLACED_ORDER',
  NoteAddedToOrder = 'NOTE_ADDED_TO_ORDER',
  DigitalLinkDownloaded = 'DIGITAL_LINK_DOWNLOADED',
  CustomerDeleted = 'CUSTOMER_DELETED',
  NameAssigned = 'NAME_ASSIGNED',
  EmailAssigned = 'EMAIL_ASSIGNED',
  NoteAdded = 'NOTE_ADDED'
}

export type CustomerFilterInput = {
  dateJoined?: Maybe<DateRangeInput>;
  numberOfOrders?: Maybe<IntRangeInput>;
  placedOrders?: Maybe<DateRangeInput>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
};

export type CustomerInput = {
  /** Billing address of the customer. */
  defaultBillingAddress?: Maybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: Maybe<AddressInput>;
  /** Given name. */
  firstName?: Maybe<Scalars['String']>;
  /** Family name. */
  lastName?: Maybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** User account is active. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: Maybe<Scalars['String']>;
  /** User language code. */
  languageCode?: Maybe<LanguageCodeEnum>;
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
  gte?: Maybe<Scalars['Date']>;
  /** End date. */
  lte?: Maybe<Scalars['Date']>;
};


export type DateTimeRangeInput = {
  /** Start date. */
  gte?: Maybe<Scalars['DateTime']>;
  /** End date. */
  lte?: Maybe<Scalars['DateTime']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
};

/** Delete object's private metadata. */
export type DeletePrivateMetadata = {
  __typename?: 'DeletePrivateMetadata';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
};

export type DigitalContent = Node & ObjectWithMetadata & {
  __typename?: 'DigitalContent';
  useDefaultSettings: Scalars['Boolean'];
  automaticFulfillment: Scalars['Boolean'];
  contentFile: Scalars['String'];
  maxDownloads?: Maybe<Scalars['Int']>;
  urlValidDays?: Maybe<Scalars['Int']>;
  /** List of URLs for the digital variant. */
  urls?: Maybe<Array<Maybe<DigitalContentUrl>>>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Product variant assigned to digital content. */
  productVariant: ProductVariant;
};

export type DigitalContentCountableConnection = {
  __typename?: 'DigitalContentCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<DigitalContentCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type DigitalContentCountableEdge = {
  __typename?: 'DigitalContentCountableEdge';
  /** The item at the end of the edge. */
  node: DigitalContent;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Create new digital content. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type DigitalContentCreate = {
  __typename?: 'DigitalContentCreate';
  variant?: Maybe<ProductVariant>;
  content?: Maybe<DigitalContent>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Remove digital content assigned to given variant. */
export type DigitalContentDelete = {
  __typename?: 'DigitalContentDelete';
  variant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export type DigitalContentInput = {
  /** Use default digital content settings for this product. */
  useDefaultSettings: Scalars['Boolean'];
  /** Determines how many times a download link can be accessed by a customer. */
  maxDownloads?: Maybe<Scalars['Int']>;
  /** Determines for how many days a download link is active since it was generated. */
  urlValidDays?: Maybe<Scalars['Int']>;
  /** Overwrite default automatic_fulfillment setting for variant. */
  automaticFulfillment?: Maybe<Scalars['Boolean']>;
};

/** Update digital content. */
export type DigitalContentUpdate = {
  __typename?: 'DigitalContentUpdate';
  variant?: Maybe<ProductVariant>;
  content?: Maybe<DigitalContent>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export type DigitalContentUploadInput = {
  /** Use default digital content settings for this product. */
  useDefaultSettings: Scalars['Boolean'];
  /** Determines how many times a download link can be accessed by a customer. */
  maxDownloads?: Maybe<Scalars['Int']>;
  /** Determines for how many days a download link is active since it was generated. */
  urlValidDays?: Maybe<Scalars['Int']>;
  /** Overwrite default automatic_fulfillment setting for variant. */
  automaticFulfillment?: Maybe<Scalars['Boolean']>;
  /** Represents an file in a multipart request. */
  contentFile: Scalars['Upload'];
};

export type DigitalContentUrl = Node & {
  __typename?: 'DigitalContentUrl';
  content: DigitalContent;
  created: Scalars['DateTime'];
  downloadNum: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** URL for digital content. */
  url?: Maybe<Scalars['String']>;
  /** UUID of digital content. */
  token: Scalars['UUID'];
};

/** Generate new URL to digital content. */
export type DigitalContentUrlCreate = {
  __typename?: 'DigitalContentUrlCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  digitalContentUrl?: Maybe<DigitalContentUrl>;
};

export type DigitalContentUrlCreateInput = {
  /** Digital content ID which URL will belong to. */
  content: Scalars['ID'];
};

export type DiscountError = {
  __typename?: 'DiscountError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** List of products IDs which causes the error. */
  products?: Maybe<Array<Scalars['ID']>>;
  /** The error code. */
  code: DiscountErrorCode;
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum DiscountErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  CannotManageProductWithoutVariant = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM'
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
  M = 'M',
  Km = 'KM',
  Ft = 'FT',
  Yd = 'YD',
  Inch = 'INCH'
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Completes creating an order. */
export type DraftOrderComplete = {
  __typename?: 'DraftOrderComplete';
  /** Completed order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Creates a new draft order. */
export type DraftOrderCreate = {
  __typename?: 'DraftOrderCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
  order?: Maybe<Order>;
};

export type DraftOrderCreateInput = {
  /** Billing address of the customer. */
  billingAddress?: Maybe<AddressInput>;
  /** Customer associated with the draft order. */
  user?: Maybe<Scalars['ID']>;
  /** Email address of the customer. */
  userEmail?: Maybe<Scalars['String']>;
  /** Discount amount for the order. */
  discount?: Maybe<Scalars['PositiveDecimal']>;
  /** Shipping address of the customer. */
  shippingAddress?: Maybe<AddressInput>;
  /** ID of a selected shipping method. */
  shippingMethod?: Maybe<Scalars['ID']>;
  /** ID of the voucher associated with the order. */
  voucher?: Maybe<Scalars['ID']>;
  /** A note from a customer. Visible by customers in the order summary. */
  customerNote?: Maybe<Scalars['String']>;
  /** ID of the channel associated with the order. */
  channelId?: Maybe<Scalars['ID']>;
  /** URL of a view where users should be redirected to see the order details. URL in RFC 1808 format. */
  redirectUrl?: Maybe<Scalars['String']>;
  /** Variant line input consisting of variant ID and quantity of products. */
  lines?: Maybe<Array<Maybe<OrderLineCreateInput>>>;
};

/** Deletes a draft order. */
export type DraftOrderDelete = {
  __typename?: 'DraftOrderDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
  order?: Maybe<Order>;
};

export type DraftOrderInput = {
  /** Billing address of the customer. */
  billingAddress?: Maybe<AddressInput>;
  /** Customer associated with the draft order. */
  user?: Maybe<Scalars['ID']>;
  /** Email address of the customer. */
  userEmail?: Maybe<Scalars['String']>;
  /** Discount amount for the order. */
  discount?: Maybe<Scalars['PositiveDecimal']>;
  /** Shipping address of the customer. */
  shippingAddress?: Maybe<AddressInput>;
  /** ID of a selected shipping method. */
  shippingMethod?: Maybe<Scalars['ID']>;
  /** ID of the voucher associated with the order. */
  voucher?: Maybe<Scalars['ID']>;
  /** A note from a customer. Visible by customers in the order summary. */
  customerNote?: Maybe<Scalars['String']>;
  /** ID of the channel associated with the order. */
  channelId?: Maybe<Scalars['ID']>;
  /** URL of a view where users should be redirected to see the order details. URL in RFC 1808 format. */
  redirectUrl?: Maybe<Scalars['String']>;
};

/** Deletes order lines. */
export type DraftOrderLinesBulkDelete = {
  __typename?: 'DraftOrderLinesBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Updates a draft order. */
export type DraftOrderUpdate = {
  __typename?: 'DraftOrderUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
  order?: Maybe<Order>;
};

export type ExportError = {
  __typename?: 'ExportError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ExportErrorCode;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Date when event happened at in ISO 8601 format. */
  date: Scalars['DateTime'];
  /** Export event type. */
  type: ExportEventsEnum;
  /** User who performed the action. */
  user?: Maybe<User>;
  /** App which performed the action. */
  app?: Maybe<App>;
  /** Content of the event. */
  message: Scalars['String'];
};

/** An enumeration. */
export enum ExportEventsEnum {
  ExportPending = 'EXPORT_PENDING',
  ExportSuccess = 'EXPORT_SUCCESS',
  ExportFailed = 'EXPORT_FAILED',
  ExportDeleted = 'EXPORT_DELETED',
  ExportedFileSent = 'EXPORTED_FILE_SENT',
  ExportFailedInfoSent = 'EXPORT_FAILED_INFO_SENT'
}

/** Represents a job data of exported file. */
export type ExportFile = Node & Job & {
  __typename?: 'ExportFile';
  /** The ID of the object. */
  id: Scalars['ID'];
  user?: Maybe<User>;
  app?: Maybe<App>;
  /** Job status. */
  status: JobStatusEnum;
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** The URL of field to download. */
  url?: Maybe<Scalars['String']>;
  /** List of events associated with the export. */
  events?: Maybe<Array<ExportEvent>>;
};

export type ExportFileCountableConnection = {
  __typename?: 'ExportFileCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<ExportFileCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ExportFileCountableEdge = {
  __typename?: 'ExportFileCountableEdge';
  /** The item at the end of the edge. */
  node: ExportFile;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

export type ExportFileFilterInput = {
  createdAt?: Maybe<DateTimeRangeInput>;
  updatedAt?: Maybe<DateTimeRangeInput>;
  status?: Maybe<JobStatusEnum>;
  user?: Maybe<Scalars['String']>;
  app?: Maybe<Scalars['String']>;
};

export enum ExportFileSortField {
  /** Sort export file by status. */
  Status = 'STATUS',
  /** Sort export file by created at. */
  CreatedAt = 'CREATED_AT',
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
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of warehouse ids witch should be exported. */
  warehouses?: Maybe<Array<Scalars['ID']>>;
  /** List of channels ids which should be exported. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** List of product fields witch should be exported. */
  fields?: Maybe<Array<ProductFieldEnum>>;
};

/** Export products to csv file. */
export type ExportProducts = {
  __typename?: 'ExportProducts';
  /** The newly created export file job which is responsible for export data. */
  exportFile?: Maybe<ExportFile>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  exportErrors: Array<ExportError>;
  errors: Array<ExportError>;
};

export type ExportProductsInput = {
  /** Determine which products should be exported. */
  scope: ExportScope;
  /** Filtering options for products. */
  filter?: Maybe<ProductFilterInput>;
  /** List of products IDS to export. */
  ids?: Maybe<Array<Scalars['ID']>>;
  /** Input with info about fields which should be exported. */
  exportInfo?: Maybe<ExportInfoInput>;
  /** Type of exported file. */
  fileType: FileTypesEnum;
};

export enum ExportScope {
  /** Export all products. */
  All = 'ALL',
  /** Export products with given ids. */
  Ids = 'IDS',
  /** Export the filtered products. */
  Filter = 'FILTER'
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
  /** The data returned by authentication plugin. */
  authenticationData?: Maybe<Scalars['JSONString']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Logout user by custom plugin. */
export type ExternalLogout = {
  __typename?: 'ExternalLogout';
  /** The data returned by authentication plugin. */
  logoutData?: Maybe<Scalars['JSONString']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Obtain external access tokens for user by custom plugin. */
export type ExternalObtainAccessTokens = {
  __typename?: 'ExternalObtainAccessTokens';
  /** The token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** The refresh token, required to re-generate external access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** CSRF token required to re-generate external access token. */
  csrfToken?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Refresh user's access by custom plugin. */
export type ExternalRefresh = {
  __typename?: 'ExternalRefresh';
  /** The token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** The refresh token, required to re-generate external access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** CSRF token required to re-generate external access token. */
  csrfToken?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Verify external authentication data by plugin. */
export type ExternalVerify = {
  __typename?: 'ExternalVerify';
  /** User assigned to data. */
  user?: Maybe<User>;
  /** Determine if authentication data is valid or not. */
  isValid: Scalars['Boolean'];
  /** External data. */
  verifyData?: Maybe<Scalars['JSONString']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

export type File = {
  __typename?: 'File';
  /** The URL of the file. */
  url: Scalars['String'];
  /** Content type of the file. */
  contentType?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum FileTypesEnum {
  Csv = 'CSV',
  Xlsx = 'XLSX'
}

/** Upload a file. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type FileUpload = {
  __typename?: 'FileUpload';
  uploadedFile?: Maybe<File>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  uploadErrors: Array<UploadError>;
  errors: Array<UploadError>;
};

/** Represents order fulfillment. */
export type Fulfillment = Node & ObjectWithMetadata & {
  __typename?: 'Fulfillment';
  /** The ID of the object. */
  id: Scalars['ID'];
  fulfillmentOrder: Scalars['Int'];
  status: FulfillmentStatus;
  trackingNumber: Scalars['String'];
  created: Scalars['DateTime'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of lines for the fulfillment. */
  lines?: Maybe<Array<Maybe<FulfillmentLine>>>;
  /** User-friendly fulfillment status. */
  statusDisplay?: Maybe<Scalars['String']>;
  /** Warehouse from fulfillment was fulfilled. */
  warehouse?: Maybe<Warehouse>;
};

/** Cancels existing fulfillment and optionally restocks items. */
export type FulfillmentCancel = {
  __typename?: 'FulfillmentCancel';
  /** A canceled fulfillment. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was cancelled. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
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
  quantity: Scalars['Int'];
  orderLine?: Maybe<OrderLine>;
};

/** Refund products. */
export type FulfillmentRefundProducts = {
  __typename?: 'FulfillmentRefundProducts';
  /** A refunded fulfillment. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was refunded. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Return products. */
export type FulfillmentReturnProducts = {
  __typename?: 'FulfillmentReturnProducts';
  /** A return fulfillment. */
  returnFulfillment?: Maybe<Fulfillment>;
  /** A replace fulfillment. */
  replaceFulfillment?: Maybe<Fulfillment>;
  /** Order which fulfillment was returned. */
  order?: Maybe<Order>;
  /** A draft order which was created for products with replace flag. */
  replaceOrder?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** An enumeration. */
export enum FulfillmentStatus {
  /** Fulfilled */
  Fulfilled = 'FULFILLED',
  /** Refunded */
  Refunded = 'REFUNDED',
  /** Returned */
  Returned = 'RETURNED',
  /** Replaced */
  Replaced = 'REPLACED',
  /** Refunded and returned */
  RefundedAndReturned = 'REFUNDED_AND_RETURNED',
  /** Canceled */
  Canceled = 'CANCELED'
}

/** Updates a fulfillment for an order. */
export type FulfillmentUpdateTracking = {
  __typename?: 'FulfillmentUpdateTracking';
  /** A fulfillment with updated tracking. */
  fulfillment?: Maybe<Fulfillment>;
  /** Order for which fulfillment was updated. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type FulfillmentUpdateTrackingInput = {
  /** Fulfillment tracking number. */
  trackingNumber?: Maybe<Scalars['String']>;
  /** If true, send an email notification to the customer. */
  notifyCustomer?: Maybe<Scalars['Boolean']>;
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
  /** The customer who bought a gift card. */
  user?: Maybe<User>;
  created: Scalars['DateTime'];
  startDate: Scalars['Date'];
  endDate?: Maybe<Scalars['Date']>;
  lastUsedOn?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  initialBalance?: Maybe<Money>;
  currentBalance?: Maybe<Money>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Code in format which allows displaying in a user interface. */
  displayCode?: Maybe<Scalars['String']>;
};

/** Activate a gift card. */
export type GiftCardActivate = {
  __typename?: 'GiftCardActivate';
  /** A gift card to activate. */
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
  errors: Array<GiftCardError>;
};

export type GiftCardCountableConnection = {
  __typename?: 'GiftCardCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<GiftCardCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type GiftCardCountableEdge = {
  __typename?: 'GiftCardCountableEdge';
  /** The item at the end of the edge. */
  node: GiftCard;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new gift card. */
export type GiftCardCreate = {
  __typename?: 'GiftCardCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
  errors: Array<GiftCardError>;
  giftCard?: Maybe<GiftCard>;
};

export type GiftCardCreateInput = {
  /** Start date of the gift card in ISO 8601 format. */
  startDate?: Maybe<Scalars['Date']>;
  /** End date of the gift card in ISO 8601 format. */
  endDate?: Maybe<Scalars['Date']>;
  /** Value of the gift card. */
  balance?: Maybe<Scalars['PositiveDecimal']>;
  /** The customer's email of the gift card buyer. */
  userEmail?: Maybe<Scalars['String']>;
  /** Code to use the gift card. */
  code?: Maybe<Scalars['String']>;
};

/** Deactivate a gift card. */
export type GiftCardDeactivate = {
  __typename?: 'GiftCardDeactivate';
  /** A gift card to deactivate. */
  giftCard?: Maybe<GiftCard>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
  errors: Array<GiftCardError>;
};

export type GiftCardError = {
  __typename?: 'GiftCardError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: GiftCardErrorCode;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  giftCardErrors: Array<GiftCardError>;
  errors: Array<GiftCardError>;
  giftCard?: Maybe<GiftCard>;
};

export type GiftCardUpdateInput = {
  /** Start date of the gift card in ISO 8601 format. */
  startDate?: Maybe<Scalars['Date']>;
  /** End date of the gift card in ISO 8601 format. */
  endDate?: Maybe<Scalars['Date']>;
  /** Value of the gift card. */
  balance?: Maybe<Scalars['PositiveDecimal']>;
  /** The customer's email of the gift card buyer. */
  userEmail?: Maybe<Scalars['String']>;
};

/** Represents permission group data. */
export type Group = Node & {
  __typename?: 'Group';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** List of group permissions */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** List of group users */
  users?: Maybe<Array<Maybe<User>>>;
  /** True, if the currently authenticated user has rights to manage a group. */
  userCanManage: Scalars['Boolean'];
};

export type GroupCountableConnection = {
  __typename?: 'GroupCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<GroupCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type GroupCountableEdge = {
  __typename?: 'GroupCountableEdge';
  /** The item at the end of the edge. */
  node: Group;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Represents an image. */
export type Image = {
  __typename?: 'Image';
  /** The URL of the image. */
  url: Scalars['String'];
  /** Alt text for an image. */
  alt?: Maybe<Scalars['String']>;
};

export type IntRangeInput = {
  /** Value greater than or equal to. */
  gte?: Maybe<Scalars['Int']>;
  /** Value less than or equal to. */
  lte?: Maybe<Scalars['Int']>;
};

/** Represents an Invoice. */
export type Invoice = ObjectWithMetadata & Job & Node & {
  __typename?: 'Invoice';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Job status. */
  status: JobStatusEnum;
  number?: Maybe<Scalars['String']>;
  externalUrl?: Maybe<Scalars['String']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
  /** URL to download an invoice. */
  url?: Maybe<Scalars['String']>;
};

/** Creates a ready to send invoice. */
export type InvoiceCreate = {
  __typename?: 'InvoiceCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
};

export type InvoiceError = {
  __typename?: 'InvoiceError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: InvoiceErrorCode;
};

/** An enumeration. */
export enum InvoiceErrorCode {
  Required = 'REQUIRED',
  NotReady = 'NOT_READY',
  UrlNotSet = 'URL_NOT_SET',
  EmailNotSet = 'EMAIL_NOT_SET',
  NumberNotSet = 'NUMBER_NOT_SET',
  NotFound = 'NOT_FOUND',
  InvalidStatus = 'INVALID_STATUS'
}

/** Request an invoice for the order using plugin. */
export type InvoiceRequest = {
  __typename?: 'InvoiceRequest';
  /** Order related to an invoice. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
};

/** Requests deletion of an invoice. */
export type InvoiceRequestDelete = {
  __typename?: 'InvoiceRequestDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
};

/** Send an invoice notification to the customer. */
export type InvoiceSendNotification = {
  __typename?: 'InvoiceSendNotification';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
};

/** Updates an invoice. */
export type InvoiceUpdate = {
  __typename?: 'InvoiceUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  invoiceErrors: Array<InvoiceError>;
  errors: Array<InvoiceError>;
  invoice?: Maybe<Invoice>;
};


export type Job = {
  /** Job status. */
  status: JobStatusEnum;
  /** Created date time of job in ISO 8601 format. */
  createdAt: Scalars['DateTime'];
  /** Date time of job last update in ISO 8601 format. */
  updatedAt: Scalars['DateTime'];
  /** Job message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum JobStatusEnum {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Deleted = 'DELETED'
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
  AsIn = 'AS_IN',
  Asa = 'ASA',
  AsaTz = 'ASA_TZ',
  Ast = 'AST',
  AstEs = 'AST_ES',
  Az = 'AZ',
  AzCyrl = 'AZ_CYRL',
  AzCyrlAz = 'AZ_CYRL_AZ',
  AzLatn = 'AZ_LATN',
  AzLatnAz = 'AZ_LATN_AZ',
  Bas = 'BAS',
  BasCm = 'BAS_CM',
  Be = 'BE',
  BeBy = 'BE_BY',
  Bem = 'BEM',
  BemZm = 'BEM_ZM',
  Bez = 'BEZ',
  BezTz = 'BEZ_TZ',
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
  BrFr = 'BR_FR',
  Brx = 'BRX',
  BrxIn = 'BRX_IN',
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
  CeRu = 'CE_RU',
  Ceb = 'CEB',
  CebPh = 'CEB_PH',
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
  DaDk = 'DA_DK',
  DaGl = 'DA_GL',
  Dav = 'DAV',
  DavKe = 'DAV_KE',
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
  FiFi = 'FI_FI',
  Fil = 'FIL',
  FilPh = 'FIL_PH',
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
  GuIn = 'GU_IN',
  Guz = 'GUZ',
  GuzKe = 'GUZ_KE',
  Gv = 'GV',
  GvIm = 'GV_IM',
  Ha = 'HA',
  HaGh = 'HA_GH',
  HaNe = 'HA_NE',
  HaNg = 'HA_NG',
  Haw = 'HAW',
  HawUs = 'HAW_US',
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
  KaGe = 'KA_GE',
  Kab = 'KAB',
  KabDz = 'KAB_DZ',
  Kam = 'KAM',
  KamKe = 'KAM_KE',
  Kde = 'KDE',
  KdeTz = 'KDE_TZ',
  Kea = 'KEA',
  KeaCv = 'KEA_CV',
  Khq = 'KHQ',
  KhqMl = 'KHQ_ML',
  Ki = 'KI',
  KiKe = 'KI_KE',
  Kk = 'KK',
  KkKz = 'KK_KZ',
  Kkj = 'KKJ',
  KkjCm = 'KKJ_CM',
  Kl = 'KL',
  KlGl = 'KL_GL',
  Kln = 'KLN',
  KlnKe = 'KLN_KE',
  Km = 'KM',
  KmKh = 'KM_KH',
  Kn = 'KN',
  KnIn = 'KN_IN',
  Ko = 'KO',
  KoKp = 'KO_KP',
  KoKr = 'KO_KR',
  Kok = 'KOK',
  KokIn = 'KOK_IN',
  Ks = 'KS',
  KsArab = 'KS_ARAB',
  KsArabIn = 'KS_ARAB_IN',
  Ksb = 'KSB',
  KsbTz = 'KSB_TZ',
  Ksf = 'KSF',
  KsfCm = 'KSF_CM',
  Ksh = 'KSH',
  KshDe = 'KSH_DE',
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
  LuCd = 'LU_CD',
  Luo = 'LUO',
  LuoKe = 'LUO_KE',
  Luy = 'LUY',
  LuyKe = 'LUY_KE',
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
  MgMg = 'MG_MG',
  Mgh = 'MGH',
  MghMz = 'MGH_MZ',
  Mgo = 'MGO',
  MgoCm = 'MGO_CM',
  Mi = 'MI',
  MiNz = 'MI_NZ',
  Mk = 'MK',
  MkMk = 'MK_MK',
  Ml = 'ML',
  MlIn = 'ML_IN',
  Mn = 'MN',
  MnMn = 'MN_MN',
  Mni = 'MNI',
  MniBeng = 'MNI_BENG',
  MniBengIn = 'MNI_BENG_IN',
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
  NdZw = 'ND_ZW',
  Nds = 'NDS',
  NdsDe = 'NDS_DE',
  NdsNl = 'NDS_NL',
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
  NnNo = 'NN_NO',
  Nnh = 'NNH',
  NnhCm = 'NNH_CM',
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
  RoMd = 'RO_MD',
  RoRo = 'RO_RO',
  Rof = 'ROF',
  RofTz = 'ROF_TZ',
  Ru = 'RU',
  RuBy = 'RU_BY',
  RuKg = 'RU_KG',
  RuKz = 'RU_KZ',
  RuMd = 'RU_MD',
  RuRu = 'RU_RU',
  RuUa = 'RU_UA',
  Rw = 'RW',
  RwRw = 'RW_RW',
  Rwk = 'RWK',
  RwkTz = 'RWK_TZ',
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
  SeFi = 'SE_FI',
  SeNo = 'SE_NO',
  SeSe = 'SE_SE',
  Seh = 'SEH',
  SehMz = 'SEH_MZ',
  Ses = 'SES',
  SesMl = 'SES_ML',
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
  TeIn = 'TE_IN',
  Teo = 'TEO',
  TeoKe = 'TEO_KE',
  TeoUg = 'TEO_UG',
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
  /** Defines the current resource usage. */
  currentUsage: Limits;
  /** Defines the allowed maximum resource usage, null means unlimited. */
  allowedUsage: Limits;
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
  identifier: Scalars['String'];
  version: Scalars['String'];
  name: Scalars['String'];
  about?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  appUrl?: Maybe<Scalars['String']>;
  configurationUrl?: Maybe<Scalars['String']>;
  tokenTargetUrl?: Maybe<Scalars['String']>;
  dataPrivacy?: Maybe<Scalars['String']>;
  dataPrivacyUrl?: Maybe<Scalars['String']>;
  homepageUrl?: Maybe<Scalars['String']>;
  supportUrl?: Maybe<Scalars['String']>;
};

export type Margin = {
  __typename?: 'Margin';
  start?: Maybe<Scalars['Int']>;
  stop?: Maybe<Scalars['Int']>;
};

/** An enumeration. */
export enum MeasurementUnitsEnum {
  Cm = 'CM',
  M = 'M',
  Km = 'KM',
  Ft = 'FT',
  Yd = 'YD',
  Inch = 'INCH',
  SqCm = 'SQ_CM',
  SqM = 'SQ_M',
  SqKm = 'SQ_KM',
  SqFt = 'SQ_FT',
  SqYd = 'SQ_YD',
  SqInch = 'SQ_INCH',
  CubicMillimeter = 'CUBIC_MILLIMETER',
  CubicCentimeter = 'CUBIC_CENTIMETER',
  CubicDecimeter = 'CUBIC_DECIMETER',
  CubicMeter = 'CUBIC_METER',
  Liter = 'LITER',
  CubicFoot = 'CUBIC_FOOT',
  CubicInch = 'CUBIC_INCH',
  CubicYard = 'CUBIC_YARD',
  Qt = 'QT',
  Pint = 'PINT',
  FlOz = 'FL_OZ',
  AcreIn = 'ACRE_IN',
  AcreFt = 'ACRE_FT',
  G = 'G',
  Lb = 'LB',
  Oz = 'OZ',
  Kg = 'KG',
  Tonne = 'TONNE'
}

/** Represents a single menu - an object that is used to help navigate through the store. */
export type Menu = Node & ObjectWithMetadata & {
  __typename?: 'Menu';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  items?: Maybe<Array<Maybe<MenuItem>>>;
};

/** Deletes menus. */
export type MenuBulkDelete = {
  __typename?: 'MenuBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
};

export type MenuCountableConnection = {
  __typename?: 'MenuCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<MenuCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type MenuCountableEdge = {
  __typename?: 'MenuCountableEdge';
  /** The item at the end of the edge. */
  node: Menu;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new Menu. */
export type MenuCreate = {
  __typename?: 'MenuCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
  menu?: Maybe<Menu>;
};

export type MenuCreateInput = {
  /** Name of the menu. */
  name: Scalars['String'];
  /** Slug of the menu. Will be generated if not provided. */
  slug?: Maybe<Scalars['String']>;
  /** List of menu items. */
  items?: Maybe<Array<Maybe<MenuItemInput>>>;
};

/** Deletes a menu. */
export type MenuDelete = {
  __typename?: 'MenuDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
  menu?: Maybe<Menu>;
};

export type MenuError = {
  __typename?: 'MenuError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: MenuErrorCode;
};

/** An enumeration. */
export enum MenuErrorCode {
  CannotAssignNode = 'CANNOT_ASSIGN_NODE',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  InvalidMenuItem = 'INVALID_MENU_ITEM',
  NoMenuItemProvided = 'NO_MENU_ITEM_PROVIDED',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  TooManyMenuItems = 'TOO_MANY_MENU_ITEMS',
  Unique = 'UNIQUE'
}

export type MenuFilterInput = {
  search?: Maybe<Scalars['String']>;
  slug?: Maybe<Array<Maybe<Scalars['String']>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
};

export type MenuInput = {
  /** Name of the menu. */
  name?: Maybe<Scalars['String']>;
  /** Slug of the menu. */
  slug?: Maybe<Scalars['String']>;
};

/** Represents a single item of the related menu. Can store categories, collection or pages. */
export type MenuItem = Node & ObjectWithMetadata & {
  __typename?: 'MenuItem';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  menu: Menu;
  parent?: Maybe<MenuItem>;
  category?: Maybe<Category>;
  collection?: Maybe<Collection>;
  page?: Maybe<Page>;
  level: Scalars['Int'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  children?: Maybe<Array<Maybe<MenuItem>>>;
  /** URL to the menu item. */
  url?: Maybe<Scalars['String']>;
  /** Returns translated menu item fields for the given language code. */
  translation?: Maybe<MenuItemTranslation>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
};

export type MenuItemCountableConnection = {
  __typename?: 'MenuItemCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<MenuItemCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type MenuItemCountableEdge = {
  __typename?: 'MenuItemCountableEdge';
  /** The item at the end of the edge. */
  node: MenuItem;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new menu item. */
export type MenuItemCreate = {
  __typename?: 'MenuItemCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export type MenuItemCreateInput = {
  /** Name of the menu item. */
  name: Scalars['String'];
  /** URL of the pointed item. */
  url?: Maybe<Scalars['String']>;
  /** Category to which item points. */
  category?: Maybe<Scalars['ID']>;
  /** Collection to which item points. */
  collection?: Maybe<Scalars['ID']>;
  /** Page to which item points. */
  page?: Maybe<Scalars['ID']>;
  /** Menu to which item belongs. */
  menu: Scalars['ID'];
  /** ID of the parent menu. If empty, menu will be top level menu. */
  parent?: Maybe<Scalars['ID']>;
};

/** Deletes a menu item. */
export type MenuItemDelete = {
  __typename?: 'MenuItemDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export type MenuItemFilterInput = {
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
};

export type MenuItemInput = {
  /** Name of the menu item. */
  name?: Maybe<Scalars['String']>;
  /** URL of the pointed item. */
  url?: Maybe<Scalars['String']>;
  /** Category to which item points. */
  category?: Maybe<Scalars['ID']>;
  /** Collection to which item points. */
  collection?: Maybe<Scalars['ID']>;
  /** Page to which item points. */
  page?: Maybe<Scalars['ID']>;
};

/** Moves items of menus. */
export type MenuItemMove = {
  __typename?: 'MenuItemMove';
  /** Assigned menu to move within. */
  menu?: Maybe<Menu>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
};

export type MenuItemMoveInput = {
  /** The menu item ID to move. */
  itemId: Scalars['ID'];
  /** ID of the parent menu. If empty, menu will be top level menu. */
  parentId?: Maybe<Scalars['ID']>;
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: Maybe<Scalars['Int']>;
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
  name: Scalars['String'];
  /** Returns translated menu item fields for the given language code. */
  translation?: Maybe<MenuItemTranslation>;
  /**
   * Represents a single item of the related menu. Can store categories, collection or pages.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  menuItem?: Maybe<MenuItem>;
};


export type MenuItemTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a menu item. */
export type MenuItemTranslate = {
  __typename?: 'MenuItemTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  menuItem?: Maybe<MenuItem>;
};

export type MenuItemTranslation = Node & {
  __typename?: 'MenuItemTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Translation language. */
  language: LanguageDisplay;
};

/** Updates a menu item. */
export type MenuItemUpdate = {
  __typename?: 'MenuItemUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
  menuItem?: Maybe<MenuItem>;
};

export enum MenuItemsSortField {
  /** Sort menu items by name. */
  Name = 'NAME'
}

export enum MenuSortField {
  /** Sort menus by name. */
  Name = 'NAME',
  /** Sort menus by items count. */
  ItemsCount = 'ITEMS_COUNT'
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  menuErrors: Array<MenuError>;
  errors: Array<MenuError>;
  menu?: Maybe<Menu>;
};

export type MetadataError = {
  __typename?: 'MetadataError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: MetadataErrorCode;
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
  value?: Maybe<Scalars['String']>;
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
  /** Currency code. */
  currency: Scalars['String'];
  /** Amount of money. */
  amount: Scalars['Float'];
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
  sortOrder?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new webhook subscription. */
  webhookCreate?: Maybe<WebhookCreate>;
  /** Deletes a webhook subscription. */
  webhookDelete?: Maybe<WebhookDelete>;
  /** Updates a webhook subscription. */
  webhookUpdate?: Maybe<WebhookUpdate>;
  /** Creates new warehouse. */
  createWarehouse?: Maybe<WarehouseCreate>;
  /** Updates given warehouse. */
  updateWarehouse?: Maybe<WarehouseUpdate>;
  /** Deletes selected warehouse. */
  deleteWarehouse?: Maybe<WarehouseDelete>;
  /** Add shipping zone to given warehouse. */
  assignWarehouseShippingZone?: Maybe<WarehouseShippingZoneAssign>;
  /** Remove shipping zone from given warehouse. */
  unassignWarehouseShippingZone?: Maybe<WarehouseShippingZoneUnassign>;
  /** Creates a new staff notification recipient. */
  staffNotificationRecipientCreate?: Maybe<StaffNotificationRecipientCreate>;
  /** Updates a staff notification recipient. */
  staffNotificationRecipientUpdate?: Maybe<StaffNotificationRecipientUpdate>;
  /** Delete staff notification recipient. */
  staffNotificationRecipientDelete?: Maybe<StaffNotificationRecipientDelete>;
  /** Updates site domain of the shop. */
  shopDomainUpdate?: Maybe<ShopDomainUpdate>;
  /** Updates shop settings. */
  shopSettingsUpdate?: Maybe<ShopSettingsUpdate>;
  /** Fetch tax rates. */
  shopFetchTaxRates?: Maybe<ShopFetchTaxRates>;
  /** Creates/updates translations for shop settings. */
  shopSettingsTranslate?: Maybe<ShopSettingsTranslate>;
  /** Update the shop's address. If the `null` value is passed, the currently selected address will be deleted. */
  shopAddressUpdate?: Maybe<ShopAddressUpdate>;
  /** Update shop order settings. */
  orderSettingsUpdate?: Maybe<OrderSettingsUpdate>;
  /** Manage shipping method's availability in channels. */
  shippingMethodChannelListingUpdate?: Maybe<ShippingMethodChannelListingUpdate>;
  /** Creates a new shipping price. */
  shippingPriceCreate?: Maybe<ShippingPriceCreate>;
  /** Deletes a shipping price. */
  shippingPriceDelete?: Maybe<ShippingPriceDelete>;
  /** Deletes shipping prices. */
  shippingPriceBulkDelete?: Maybe<ShippingPriceBulkDelete>;
  /** Updates a new shipping price. */
  shippingPriceUpdate?: Maybe<ShippingPriceUpdate>;
  /** Creates/updates translations for a shipping method. */
  shippingPriceTranslate?: Maybe<ShippingPriceTranslate>;
  /** Exclude products from shipping price. */
  shippingPriceExcludeProducts?: Maybe<ShippingPriceExcludeProducts>;
  /** Remove product from excluded list for shipping price. */
  shippingPriceRemoveProductFromExclude?: Maybe<ShippingPriceRemoveProductFromExclude>;
  /** Creates a new shipping zone. */
  shippingZoneCreate?: Maybe<ShippingZoneCreate>;
  /** Deletes a shipping zone. */
  shippingZoneDelete?: Maybe<ShippingZoneDelete>;
  /** Deletes shipping zones. */
  shippingZoneBulkDelete?: Maybe<ShippingZoneBulkDelete>;
  /** Updates a new shipping zone. */
  shippingZoneUpdate?: Maybe<ShippingZoneUpdate>;
  /** Assign attributes to a given product type. */
  productAttributeAssign?: Maybe<ProductAttributeAssign>;
  /** Un-assign attributes from a given product type. */
  productAttributeUnassign?: Maybe<ProductAttributeUnassign>;
  /** Creates a new category. */
  categoryCreate?: Maybe<CategoryCreate>;
  /** Deletes a category. */
  categoryDelete?: Maybe<CategoryDelete>;
  /** Deletes categories. */
  categoryBulkDelete?: Maybe<CategoryBulkDelete>;
  /** Updates a category. */
  categoryUpdate?: Maybe<CategoryUpdate>;
  /** Creates/updates translations for a category. */
  categoryTranslate?: Maybe<CategoryTranslate>;
  /** Adds products to a collection. */
  collectionAddProducts?: Maybe<CollectionAddProducts>;
  /** Creates a new collection. */
  collectionCreate?: Maybe<CollectionCreate>;
  /** Deletes a collection. */
  collectionDelete?: Maybe<CollectionDelete>;
  /** Reorder the products of a collection. */
  collectionReorderProducts?: Maybe<CollectionReorderProducts>;
  /** Deletes collections. */
  collectionBulkDelete?: Maybe<CollectionBulkDelete>;
  /** Remove products from a collection. */
  collectionRemoveProducts?: Maybe<CollectionRemoveProducts>;
  /** Updates a collection. */
  collectionUpdate?: Maybe<CollectionUpdate>;
  /** Creates/updates translations for a collection. */
  collectionTranslate?: Maybe<CollectionTranslate>;
  /** Manage collection's availability in channels. */
  collectionChannelListingUpdate?: Maybe<CollectionChannelListingUpdate>;
  /** Creates a new product. */
  productCreate?: Maybe<ProductCreate>;
  /** Deletes a product. */
  productDelete?: Maybe<ProductDelete>;
  /** Deletes products. */
  productBulkDelete?: Maybe<ProductBulkDelete>;
  /** Updates an existing product. */
  productUpdate?: Maybe<ProductUpdate>;
  /** Creates/updates translations for a product. */
  productTranslate?: Maybe<ProductTranslate>;
  /** Manage product's availability in channels. */
  productChannelListingUpdate?: Maybe<ProductChannelListingUpdate>;
  /** Create a media object (image or video URL) associated with product. For image, this mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  productMediaCreate?: Maybe<ProductMediaCreate>;
  /** Reorder the variants of a product. Mutation updates updated_at on product and triggers PRODUCT_UPDATED webhook. */
  productVariantReorder?: Maybe<ProductVariantReorder>;
  /** Deletes a product media. */
  productMediaDelete?: Maybe<ProductMediaDelete>;
  /** Deletes product media. */
  productMediaBulkDelete?: Maybe<ProductMediaBulkDelete>;
  /** Changes ordering of the product media. */
  productMediaReorder?: Maybe<ProductMediaReorder>;
  /** Updates a product media. */
  productMediaUpdate?: Maybe<ProductMediaUpdate>;
  /** Creates a new product type. */
  productTypeCreate?: Maybe<ProductTypeCreate>;
  /** Deletes a product type. */
  productTypeDelete?: Maybe<ProductTypeDelete>;
  /** Deletes product types. */
  productTypeBulkDelete?: Maybe<ProductTypeBulkDelete>;
  /** Updates an existing product type. */
  productTypeUpdate?: Maybe<ProductTypeUpdate>;
  /** Reorder the attributes of a product type. */
  productTypeReorderAttributes?: Maybe<ProductTypeReorderAttributes>;
  /** Reorder product attribute values. */
  productReorderAttributeValues?: Maybe<ProductReorderAttributeValues>;
  /** Create new digital content. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  digitalContentCreate?: Maybe<DigitalContentCreate>;
  /** Remove digital content assigned to given variant. */
  digitalContentDelete?: Maybe<DigitalContentDelete>;
  /** Update digital content. */
  digitalContentUpdate?: Maybe<DigitalContentUpdate>;
  /** Generate new URL to digital content. */
  digitalContentUrlCreate?: Maybe<DigitalContentUrlCreate>;
  /** Creates a new variant for a product. */
  productVariantCreate?: Maybe<ProductVariantCreate>;
  /** Deletes a product variant. */
  productVariantDelete?: Maybe<ProductVariantDelete>;
  /** Creates product variants for a given product. */
  productVariantBulkCreate?: Maybe<ProductVariantBulkCreate>;
  /** Deletes product variants. */
  productVariantBulkDelete?: Maybe<ProductVariantBulkDelete>;
  /** Creates stocks for product variant. */
  productVariantStocksCreate?: Maybe<ProductVariantStocksCreate>;
  /** Delete stocks from product variant. */
  productVariantStocksDelete?: Maybe<ProductVariantStocksDelete>;
  /** Update stocks for product variant. */
  productVariantStocksUpdate?: Maybe<ProductVariantStocksUpdate>;
  /** Updates an existing variant for product. */
  productVariantUpdate?: Maybe<ProductVariantUpdate>;
  /** Set default variant for a product. Mutation triggers PRODUCT_UPDATED webhook. */
  productVariantSetDefault?: Maybe<ProductVariantSetDefault>;
  /** Creates/updates translations for a product variant. */
  productVariantTranslate?: Maybe<ProductVariantTranslate>;
  /** Manage product variant prices in channels. */
  productVariantChannelListingUpdate?: Maybe<ProductVariantChannelListingUpdate>;
  /** Reorder product variant attribute values. */
  productVariantReorderAttributeValues?: Maybe<ProductVariantReorderAttributeValues>;
  /** Assign an media to a product variant. */
  variantMediaAssign?: Maybe<VariantMediaAssign>;
  /** Unassign an media from a product variant. */
  variantMediaUnassign?: Maybe<VariantMediaUnassign>;
  /** Captures the authorized payment amount. */
  paymentCapture?: Maybe<PaymentCapture>;
  /** Refunds the captured payment amount. */
  paymentRefund?: Maybe<PaymentRefund>;
  /** Voids the authorized payment. */
  paymentVoid?: Maybe<PaymentVoid>;
  /** Initializes payment process when it is required by gateway. */
  paymentInitialize?: Maybe<PaymentInitialize>;
  /** Creates a new page. */
  pageCreate?: Maybe<PageCreate>;
  /** Deletes a page. */
  pageDelete?: Maybe<PageDelete>;
  /** Deletes pages. */
  pageBulkDelete?: Maybe<PageBulkDelete>;
  /** Publish pages. */
  pageBulkPublish?: Maybe<PageBulkPublish>;
  /** Updates an existing page. */
  pageUpdate?: Maybe<PageUpdate>;
  /** Creates/updates translations for a page. */
  pageTranslate?: Maybe<PageTranslate>;
  /** Create a new page type. */
  pageTypeCreate?: Maybe<PageTypeCreate>;
  /** Update page type. */
  pageTypeUpdate?: Maybe<PageTypeUpdate>;
  /** Delete a page type. */
  pageTypeDelete?: Maybe<PageTypeDelete>;
  /** Delete page types. */
  pageTypeBulkDelete?: Maybe<PageTypeBulkDelete>;
  /** Assign attributes to a given page type. */
  pageAttributeAssign?: Maybe<PageAttributeAssign>;
  /** Unassign attributes from a given page type. */
  pageAttributeUnassign?: Maybe<PageAttributeUnassign>;
  /** Reorder the attributes of a page type. */
  pageTypeReorderAttributes?: Maybe<PageTypeReorderAttributes>;
  /** Reorder page attribute values. */
  pageReorderAttributeValues?: Maybe<PageReorderAttributeValues>;
  /** Completes creating an order. */
  draftOrderComplete?: Maybe<DraftOrderComplete>;
  /** Creates a new draft order. */
  draftOrderCreate?: Maybe<DraftOrderCreate>;
  /** Deletes a draft order. */
  draftOrderDelete?: Maybe<DraftOrderDelete>;
  /** Deletes draft orders. */
  draftOrderBulkDelete?: Maybe<DraftOrderBulkDelete>;
  /** Deletes order lines. */
  draftOrderLinesBulkDelete?: Maybe<DraftOrderLinesBulkDelete>;
  /** Updates a draft order. */
  draftOrderUpdate?: Maybe<DraftOrderUpdate>;
  /** Adds note to the order. */
  orderAddNote?: Maybe<OrderAddNote>;
  /** Cancel an order. */
  orderCancel?: Maybe<OrderCancel>;
  /** Capture an order. */
  orderCapture?: Maybe<OrderCapture>;
  /** Confirms an unconfirmed order by changing status to unfulfilled. */
  orderConfirm?: Maybe<OrderConfirm>;
  /** Creates new fulfillments for an order. */
  orderFulfill?: Maybe<OrderFulfill>;
  /** Cancels existing fulfillment and optionally restocks items. */
  orderFulfillmentCancel?: Maybe<FulfillmentCancel>;
  /** Updates a fulfillment for an order. */
  orderFulfillmentUpdateTracking?: Maybe<FulfillmentUpdateTracking>;
  /** Refund products. */
  orderFulfillmentRefundProducts?: Maybe<FulfillmentRefundProducts>;
  /** Return products. */
  orderFulfillmentReturnProducts?: Maybe<FulfillmentReturnProducts>;
  /** Create order lines for an order. */
  orderLinesCreate?: Maybe<OrderLinesCreate>;
  /** Deletes an order line from an order. */
  orderLineDelete?: Maybe<OrderLineDelete>;
  /** Updates an order line of an order. */
  orderLineUpdate?: Maybe<OrderLineUpdate>;
  /** Adds discount to the order. */
  orderDiscountAdd?: Maybe<OrderDiscountAdd>;
  /** Update discount for the order. */
  orderDiscountUpdate?: Maybe<OrderDiscountUpdate>;
  /** Remove discount from the order. */
  orderDiscountDelete?: Maybe<OrderDiscountDelete>;
  /** Update discount for the order line. */
  orderLineDiscountUpdate?: Maybe<OrderLineDiscountUpdate>;
  /** Remove discount applied to the order line. */
  orderLineDiscountRemove?: Maybe<OrderLineDiscountRemove>;
  /** Mark order as manually paid. */
  orderMarkAsPaid?: Maybe<OrderMarkAsPaid>;
  /** Refund an order. */
  orderRefund?: Maybe<OrderRefund>;
  /** Updates an order. */
  orderUpdate?: Maybe<OrderUpdate>;
  /** Updates a shipping method of the order. */
  orderUpdateShipping?: Maybe<OrderUpdateShipping>;
  /** Void an order. */
  orderVoid?: Maybe<OrderVoid>;
  /** Cancels orders. */
  orderBulkCancel?: Maybe<OrderBulkCancel>;
  /** Delete metadata of an object. */
  deleteMetadata?: Maybe<DeleteMetadata>;
  /** Delete object's private metadata. */
  deletePrivateMetadata?: Maybe<DeletePrivateMetadata>;
  /** Updates metadata of an object. */
  updateMetadata?: Maybe<UpdateMetadata>;
  /** Updates private metadata of an object. */
  updatePrivateMetadata?: Maybe<UpdatePrivateMetadata>;
  /** Assigns storefront's navigation menus. */
  assignNavigation?: Maybe<AssignNavigation>;
  /** Creates a new Menu. */
  menuCreate?: Maybe<MenuCreate>;
  /** Deletes a menu. */
  menuDelete?: Maybe<MenuDelete>;
  /** Deletes menus. */
  menuBulkDelete?: Maybe<MenuBulkDelete>;
  /** Updates a menu. */
  menuUpdate?: Maybe<MenuUpdate>;
  /** Creates a new menu item. */
  menuItemCreate?: Maybe<MenuItemCreate>;
  /** Deletes a menu item. */
  menuItemDelete?: Maybe<MenuItemDelete>;
  /** Deletes menu items. */
  menuItemBulkDelete?: Maybe<MenuItemBulkDelete>;
  /** Updates a menu item. */
  menuItemUpdate?: Maybe<MenuItemUpdate>;
  /** Creates/updates translations for a menu item. */
  menuItemTranslate?: Maybe<MenuItemTranslate>;
  /** Moves items of menus. */
  menuItemMove?: Maybe<MenuItemMove>;
  /** Request an invoice for the order using plugin. */
  invoiceRequest?: Maybe<InvoiceRequest>;
  /** Requests deletion of an invoice. */
  invoiceRequestDelete?: Maybe<InvoiceRequestDelete>;
  /** Creates a ready to send invoice. */
  invoiceCreate?: Maybe<InvoiceCreate>;
  /** Deletes an invoice. */
  invoiceDelete?: Maybe<InvoiceDelete>;
  /** Updates an invoice. */
  invoiceUpdate?: Maybe<InvoiceUpdate>;
  /** Send an invoice notification to the customer. */
  invoiceSendNotification?: Maybe<InvoiceSendNotification>;
  /** Activate a gift card. */
  giftCardActivate?: Maybe<GiftCardActivate>;
  /** Creates a new gift card. */
  giftCardCreate?: Maybe<GiftCardCreate>;
  /** Deactivate a gift card. */
  giftCardDeactivate?: Maybe<GiftCardDeactivate>;
  /** Update a gift card. */
  giftCardUpdate?: Maybe<GiftCardUpdate>;
  /** Update plugin configuration. */
  pluginUpdate?: Maybe<PluginUpdate>;
  /** Creates a new sale. */
  saleCreate?: Maybe<SaleCreate>;
  /** Deletes a sale. */
  saleDelete?: Maybe<SaleDelete>;
  /** Deletes sales. */
  saleBulkDelete?: Maybe<SaleBulkDelete>;
  /** Updates a sale. */
  saleUpdate?: Maybe<SaleUpdate>;
  /** Adds products, categories, collections to a voucher. */
  saleCataloguesAdd?: Maybe<SaleAddCatalogues>;
  /** Removes products, categories, collections from a sale. */
  saleCataloguesRemove?: Maybe<SaleRemoveCatalogues>;
  /** Creates/updates translations for a sale. */
  saleTranslate?: Maybe<SaleTranslate>;
  /** Manage sale's availability in channels. */
  saleChannelListingUpdate?: Maybe<SaleChannelListingUpdate>;
  /** Creates a new voucher. */
  voucherCreate?: Maybe<VoucherCreate>;
  /** Deletes a voucher. */
  voucherDelete?: Maybe<VoucherDelete>;
  /** Deletes vouchers. */
  voucherBulkDelete?: Maybe<VoucherBulkDelete>;
  /** Updates a voucher. */
  voucherUpdate?: Maybe<VoucherUpdate>;
  /** Adds products, categories, collections to a voucher. */
  voucherCataloguesAdd?: Maybe<VoucherAddCatalogues>;
  /** Removes products, categories, collections from a voucher. */
  voucherCataloguesRemove?: Maybe<VoucherRemoveCatalogues>;
  /** Creates/updates translations for a voucher. */
  voucherTranslate?: Maybe<VoucherTranslate>;
  /** Manage voucher's availability in channels. */
  voucherChannelListingUpdate?: Maybe<VoucherChannelListingUpdate>;
  /** Export products to csv file. */
  exportProducts?: Maybe<ExportProducts>;
  /** Upload a file. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  fileUpload?: Maybe<FileUpload>;
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
  /** Deletes a CheckoutLine. */
  checkoutLineDelete?: Maybe<CheckoutLineDelete>;
  /** Adds a checkout line to the existing checkout.If line was already in checkout, its quantity will be increased. */
  checkoutLinesAdd?: Maybe<CheckoutLinesAdd>;
  /** Updates checkout line in the existing checkout. */
  checkoutLinesUpdate?: Maybe<CheckoutLinesUpdate>;
  /** Remove a gift card or a voucher from a checkout. */
  checkoutRemovePromoCode?: Maybe<CheckoutRemovePromoCode>;
  /** Create a new payment for given checkout. */
  checkoutPaymentCreate?: Maybe<CheckoutPaymentCreate>;
  /** Update shipping address in the existing checkout. */
  checkoutShippingAddressUpdate?: Maybe<CheckoutShippingAddressUpdate>;
  /** Updates the shipping address of the checkout. */
  checkoutShippingMethodUpdate?: Maybe<CheckoutShippingMethodUpdate>;
  /** Update language code in the existing checkout. */
  checkoutLanguageCodeUpdate?: Maybe<CheckoutLanguageCodeUpdate>;
  /** Creates new channel. */
  channelCreate?: Maybe<ChannelCreate>;
  /** Update a channel. */
  channelUpdate?: Maybe<ChannelUpdate>;
  /** Delete a channel. Orders associated with the deleted channel will be moved to the target channel. Checkouts, product availability, and pricing will be removed. */
  channelDelete?: Maybe<ChannelDelete>;
  /** Activate a channel. */
  channelActivate?: Maybe<ChannelActivate>;
  /** Deactivate a channel. */
  channelDeactivate?: Maybe<ChannelDeactivate>;
  /** Creates an attribute. */
  attributeCreate?: Maybe<AttributeCreate>;
  /** Deletes an attribute. */
  attributeDelete?: Maybe<AttributeDelete>;
  /** Updates attribute. */
  attributeUpdate?: Maybe<AttributeUpdate>;
  /** Creates/updates translations for an attribute. */
  attributeTranslate?: Maybe<AttributeTranslate>;
  /** Deletes attributes. */
  attributeBulkDelete?: Maybe<AttributeBulkDelete>;
  /** Deletes values of attributes. */
  attributeValueBulkDelete?: Maybe<AttributeValueBulkDelete>;
  /** Creates a value for an attribute. */
  attributeValueCreate?: Maybe<AttributeValueCreate>;
  /** Deletes a value of an attribute. */
  attributeValueDelete?: Maybe<AttributeValueDelete>;
  /** Updates value of an attribute. */
  attributeValueUpdate?: Maybe<AttributeValueUpdate>;
  /** Creates/updates translations for an attribute value. */
  attributeValueTranslate?: Maybe<AttributeValueTranslate>;
  /** Reorder the values of an attribute. */
  attributeReorderValues?: Maybe<AttributeReorderValues>;
  /** Creates a new app. */
  appCreate?: Maybe<AppCreate>;
  /** Updates an existing app. */
  appUpdate?: Maybe<AppUpdate>;
  /** Deletes an app. */
  appDelete?: Maybe<AppDelete>;
  /** Creates a new token. */
  appTokenCreate?: Maybe<AppTokenCreate>;
  /** Deletes an authentication token assigned to app. */
  appTokenDelete?: Maybe<AppTokenDelete>;
  /** Verify provided app token. */
  appTokenVerify?: Maybe<AppTokenVerify>;
  /** Install new app by using app manifest. */
  appInstall?: Maybe<AppInstall>;
  /** Retry failed installation of new app. */
  appRetryInstall?: Maybe<AppRetryInstall>;
  /** Delete failed installation. */
  appDeleteFailedInstallation?: Maybe<AppDeleteFailedInstallation>;
  /** Fetch and validate manifest. */
  appFetchManifest?: Maybe<AppFetchManifest>;
  /** Activate the app. */
  appActivate?: Maybe<AppActivate>;
  /** Deactivate the app. */
  appDeactivate?: Maybe<AppDeactivate>;
  /** Create JWT token. */
  tokenCreate?: Maybe<CreateToken>;
  /** Refresh JWT token. Mutation tries to take refreshToken from the input.If it fails it will try to take refreshToken from the http-only cookie -refreshToken. csrfToken is required when refreshToken is provided as a cookie. */
  tokenRefresh?: Maybe<RefreshToken>;
  /** Verify JWT token. */
  tokenVerify?: Maybe<VerifyToken>;
  /** Deactivate all JWT tokens of the currently authenticated user. */
  tokensDeactivateAll?: Maybe<DeactivateAllUserTokens>;
  /** Prepare external authentication url for user by custom plugin. */
  externalAuthenticationUrl?: Maybe<ExternalAuthenticationUrl>;
  /** Obtain external access tokens for user by custom plugin. */
  externalObtainAccessTokens?: Maybe<ExternalObtainAccessTokens>;
  /** Refresh user's access by custom plugin. */
  externalRefresh?: Maybe<ExternalRefresh>;
  /** Logout user by custom plugin. */
  externalLogout?: Maybe<ExternalLogout>;
  /** Verify external authentication data by plugin. */
  externalVerify?: Maybe<ExternalVerify>;
  /** Sends an email with the account password modification link. */
  requestPasswordReset?: Maybe<RequestPasswordReset>;
  /** Confirm user account with token sent by email during registration. */
  confirmAccount?: Maybe<ConfirmAccount>;
  /** Sets the user's password from the token sent by email using the RequestPasswordReset mutation. */
  setPassword?: Maybe<SetPassword>;
  /** Change the password of the logged in user. */
  passwordChange?: Maybe<PasswordChange>;
  /** Request email change of the logged in user. */
  requestEmailChange?: Maybe<RequestEmailChange>;
  /** Confirm the email change of the logged-in user. */
  confirmEmailChange?: Maybe<ConfirmEmailChange>;
  /** Create a new address for the customer. */
  accountAddressCreate?: Maybe<AccountAddressCreate>;
  /** Updates an address of the logged-in user. */
  accountAddressUpdate?: Maybe<AccountAddressUpdate>;
  /** Delete an address of the logged-in user. */
  accountAddressDelete?: Maybe<AccountAddressDelete>;
  /** Sets a default address for the authenticated user. */
  accountSetDefaultAddress?: Maybe<AccountSetDefaultAddress>;
  /** Register a new user. */
  accountRegister?: Maybe<AccountRegister>;
  /** Updates the account of the logged-in user. */
  accountUpdate?: Maybe<AccountUpdate>;
  /** Sends an email with the account removal link for the logged-in user. */
  accountRequestDeletion?: Maybe<AccountRequestDeletion>;
  /** Remove user account. */
  accountDelete?: Maybe<AccountDelete>;
  /** Creates user address. */
  addressCreate?: Maybe<AddressCreate>;
  /** Updates an address. */
  addressUpdate?: Maybe<AddressUpdate>;
  /** Deletes an address. */
  addressDelete?: Maybe<AddressDelete>;
  /** Sets a default address for the given user. */
  addressSetDefault?: Maybe<AddressSetDefault>;
  /** Creates a new customer. */
  customerCreate?: Maybe<CustomerCreate>;
  /** Updates an existing customer. */
  customerUpdate?: Maybe<CustomerUpdate>;
  /** Deletes a customer. */
  customerDelete?: Maybe<CustomerDelete>;
  /** Deletes customers. */
  customerBulkDelete?: Maybe<CustomerBulkDelete>;
  /** Creates a new staff user. */
  staffCreate?: Maybe<StaffCreate>;
  /** Updates an existing staff user. */
  staffUpdate?: Maybe<StaffUpdate>;
  /** Deletes a staff user. */
  staffDelete?: Maybe<StaffDelete>;
  /** Deletes staff users. */
  staffBulkDelete?: Maybe<StaffBulkDelete>;
  /** Create a user avatar. Only for staff members. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
  userAvatarUpdate?: Maybe<UserAvatarUpdate>;
  /** Deletes a user avatar. Only for staff members. */
  userAvatarDelete?: Maybe<UserAvatarDelete>;
  /** Activate or deactivate users. */
  userBulkSetActive?: Maybe<UserBulkSetActive>;
  /** Create new permission group. */
  permissionGroupCreate?: Maybe<PermissionGroupCreate>;
  /** Update permission group. */
  permissionGroupUpdate?: Maybe<PermissionGroupUpdate>;
  /** Delete permission group. */
  permissionGroupDelete?: Maybe<PermissionGroupDelete>;
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


export type MutationCreateWarehouseArgs = {
  input: WarehouseCreateInput;
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID'];
  input: WarehouseUpdateInput;
};


export type MutationDeleteWarehouseArgs = {
  id: Scalars['ID'];
};


export type MutationAssignWarehouseShippingZoneArgs = {
  id: Scalars['ID'];
  shippingZoneIds: Array<Scalars['ID']>;
};


export type MutationUnassignWarehouseShippingZoneArgs = {
  id: Scalars['ID'];
  shippingZoneIds: Array<Scalars['ID']>;
};


export type MutationStaffNotificationRecipientCreateArgs = {
  input: StaffNotificationRecipientInput;
};


export type MutationStaffNotificationRecipientUpdateArgs = {
  id: Scalars['ID'];
  input: StaffNotificationRecipientInput;
};


export type MutationStaffNotificationRecipientDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationShopDomainUpdateArgs = {
  input?: Maybe<SiteDomainInput>;
};


export type MutationShopSettingsUpdateArgs = {
  input: ShopSettingsInput;
};


export type MutationShopSettingsTranslateArgs = {
  input: ShopSettingsTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationShopAddressUpdateArgs = {
  input?: Maybe<AddressInput>;
};


export type MutationOrderSettingsUpdateArgs = {
  input: OrderSettingsUpdateInput;
};


export type MutationShippingMethodChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: ShippingMethodChannelListingInput;
};


export type MutationShippingPriceCreateArgs = {
  input: ShippingPriceInput;
};


export type MutationShippingPriceDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationShippingPriceBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationShippingPriceUpdateArgs = {
  id: Scalars['ID'];
  input: ShippingPriceInput;
};


export type MutationShippingPriceTranslateArgs = {
  id: Scalars['ID'];
  input: ShippingPriceTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationShippingPriceExcludeProductsArgs = {
  id: Scalars['ID'];
  input: ShippingPriceExcludeProductsInput;
};


export type MutationShippingPriceRemoveProductFromExcludeArgs = {
  id: Scalars['ID'];
  products: Array<Maybe<Scalars['ID']>>;
};


export type MutationShippingZoneCreateArgs = {
  input: ShippingZoneCreateInput;
};


export type MutationShippingZoneDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationShippingZoneBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationShippingZoneUpdateArgs = {
  id: Scalars['ID'];
  input: ShippingZoneUpdateInput;
};


export type MutationProductAttributeAssignArgs = {
  operations: Array<Maybe<ProductAttributeAssignInput>>;
  productTypeId: Scalars['ID'];
};


export type MutationProductAttributeUnassignArgs = {
  attributeIds: Array<Maybe<Scalars['ID']>>;
  productTypeId: Scalars['ID'];
};


export type MutationCategoryCreateArgs = {
  input: CategoryInput;
  parent?: Maybe<Scalars['ID']>;
};


export type MutationCategoryDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCategoryBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationCategoryUpdateArgs = {
  id: Scalars['ID'];
  input: CategoryInput;
};


export type MutationCategoryTranslateArgs = {
  id: Scalars['ID'];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationCollectionAddProductsArgs = {
  collectionId: Scalars['ID'];
  products: Array<Maybe<Scalars['ID']>>;
};


export type MutationCollectionCreateArgs = {
  input: CollectionCreateInput;
};


export type MutationCollectionDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCollectionReorderProductsArgs = {
  collectionId: Scalars['ID'];
  moves: Array<Maybe<MoveProductInput>>;
};


export type MutationCollectionBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationCollectionRemoveProductsArgs = {
  collectionId: Scalars['ID'];
  products: Array<Maybe<Scalars['ID']>>;
};


export type MutationCollectionUpdateArgs = {
  id: Scalars['ID'];
  input: CollectionInput;
};


export type MutationCollectionTranslateArgs = {
  id: Scalars['ID'];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationCollectionChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: CollectionChannelListingUpdateInput;
};


export type MutationProductCreateArgs = {
  input: ProductCreateInput;
};


export type MutationProductDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationProductUpdateArgs = {
  id: Scalars['ID'];
  input: ProductInput;
};


export type MutationProductTranslateArgs = {
  id: Scalars['ID'];
  input: TranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationProductChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: ProductChannelListingUpdateInput;
};


export type MutationProductMediaCreateArgs = {
  input: ProductMediaCreateInput;
};


export type MutationProductVariantReorderArgs = {
  moves: Array<Maybe<ReorderInput>>;
  productId: Scalars['ID'];
};


export type MutationProductMediaDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductMediaBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationProductMediaReorderArgs = {
  mediaIds: Array<Maybe<Scalars['ID']>>;
  productId: Scalars['ID'];
};


export type MutationProductMediaUpdateArgs = {
  id: Scalars['ID'];
  input: ProductMediaUpdateInput;
};


export type MutationProductTypeCreateArgs = {
  input: ProductTypeInput;
};


export type MutationProductTypeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductTypeBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationProductTypeUpdateArgs = {
  id: Scalars['ID'];
  input: ProductTypeInput;
};


export type MutationProductTypeReorderAttributesArgs = {
  moves: Array<Maybe<ReorderInput>>;
  productTypeId: Scalars['ID'];
  type: ProductAttributeType;
};


export type MutationProductReorderAttributeValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<Maybe<ReorderInput>>;
  productId: Scalars['ID'];
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


export type MutationProductVariantCreateArgs = {
  input: ProductVariantCreateInput;
};


export type MutationProductVariantDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProductVariantBulkCreateArgs = {
  product: Scalars['ID'];
  variants: Array<Maybe<ProductVariantBulkCreateInput>>;
};


export type MutationProductVariantBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationProductVariantStocksCreateArgs = {
  stocks: Array<StockInput>;
  variantId: Scalars['ID'];
};


export type MutationProductVariantStocksDeleteArgs = {
  variantId: Scalars['ID'];
  warehouseIds?: Maybe<Array<Scalars['ID']>>;
};


export type MutationProductVariantStocksUpdateArgs = {
  stocks: Array<StockInput>;
  variantId: Scalars['ID'];
};


export type MutationProductVariantUpdateArgs = {
  id: Scalars['ID'];
  input: ProductVariantInput;
};


export type MutationProductVariantSetDefaultArgs = {
  productId: Scalars['ID'];
  variantId: Scalars['ID'];
};


export type MutationProductVariantTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationProductVariantChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: Array<ProductVariantChannelListingAddInput>;
};


export type MutationProductVariantReorderAttributeValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<Maybe<ReorderInput>>;
  variantId: Scalars['ID'];
};


export type MutationVariantMediaAssignArgs = {
  mediaId: Scalars['ID'];
  variantId: Scalars['ID'];
};


export type MutationVariantMediaUnassignArgs = {
  mediaId: Scalars['ID'];
  variantId: Scalars['ID'];
};


export type MutationPaymentCaptureArgs = {
  amount?: Maybe<Scalars['PositiveDecimal']>;
  paymentId: Scalars['ID'];
};


export type MutationPaymentRefundArgs = {
  amount?: Maybe<Scalars['PositiveDecimal']>;
  paymentId: Scalars['ID'];
};


export type MutationPaymentVoidArgs = {
  paymentId: Scalars['ID'];
};


export type MutationPaymentInitializeArgs = {
  channel?: Maybe<Scalars['String']>;
  gateway: Scalars['String'];
  paymentData?: Maybe<Scalars['JSONString']>;
};


export type MutationPageCreateArgs = {
  input: PageCreateInput;
};


export type MutationPageDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationPageBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationPageBulkPublishArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
  isPublished: Scalars['Boolean'];
};


export type MutationPageUpdateArgs = {
  id: Scalars['ID'];
  input: PageInput;
};


export type MutationPageTranslateArgs = {
  id: Scalars['ID'];
  input: PageTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationPageTypeCreateArgs = {
  input: PageTypeCreateInput;
};


export type MutationPageTypeUpdateArgs = {
  id?: Maybe<Scalars['ID']>;
  input: PageTypeUpdateInput;
};


export type MutationPageTypeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationPageTypeBulkDeleteArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationPageAttributeAssignArgs = {
  attributeIds: Array<Scalars['ID']>;
  pageTypeId: Scalars['ID'];
};


export type MutationPageAttributeUnassignArgs = {
  attributeIds: Array<Scalars['ID']>;
  pageTypeId: Scalars['ID'];
};


export type MutationPageTypeReorderAttributesArgs = {
  moves: Array<ReorderInput>;
  pageTypeId: Scalars['ID'];
};


export type MutationPageReorderAttributeValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<Maybe<ReorderInput>>;
  pageId: Scalars['ID'];
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


export type MutationDraftOrderBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationDraftOrderLinesBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationDraftOrderUpdateArgs = {
  id: Scalars['ID'];
  input: DraftOrderInput;
};


export type MutationOrderAddNoteArgs = {
  order: Scalars['ID'];
  input: OrderAddNoteInput;
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


export type MutationOrderFulfillArgs = {
  input: OrderFulfillInput;
  order?: Maybe<Scalars['ID']>;
};


export type MutationOrderFulfillmentCancelArgs = {
  id: Scalars['ID'];
  input: FulfillmentCancelInput;
};


export type MutationOrderFulfillmentUpdateTrackingArgs = {
  id: Scalars['ID'];
  input: FulfillmentUpdateTrackingInput;
};


export type MutationOrderFulfillmentRefundProductsArgs = {
  input: OrderRefundProductsInput;
  order: Scalars['ID'];
};


export type MutationOrderFulfillmentReturnProductsArgs = {
  input: OrderReturnProductsInput;
  order: Scalars['ID'];
};


export type MutationOrderLinesCreateArgs = {
  id: Scalars['ID'];
  input: Array<Maybe<OrderLineCreateInput>>;
};


export type MutationOrderLineDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationOrderLineUpdateArgs = {
  id: Scalars['ID'];
  input: OrderLineInput;
};


export type MutationOrderDiscountAddArgs = {
  input: OrderDiscountCommonInput;
  orderId: Scalars['ID'];
};


export type MutationOrderDiscountUpdateArgs = {
  discountId: Scalars['ID'];
  input: OrderDiscountCommonInput;
};


export type MutationOrderDiscountDeleteArgs = {
  discountId: Scalars['ID'];
};


export type MutationOrderLineDiscountUpdateArgs = {
  input: OrderDiscountCommonInput;
  orderLineId: Scalars['ID'];
};


export type MutationOrderLineDiscountRemoveArgs = {
  orderLineId: Scalars['ID'];
};


export type MutationOrderMarkAsPaidArgs = {
  id: Scalars['ID'];
  transactionReference?: Maybe<Scalars['String']>;
};


export type MutationOrderRefundArgs = {
  amount: Scalars['PositiveDecimal'];
  id: Scalars['ID'];
};


export type MutationOrderUpdateArgs = {
  id: Scalars['ID'];
  input: OrderUpdateInput;
};


export type MutationOrderUpdateShippingArgs = {
  order: Scalars['ID'];
  input?: Maybe<OrderUpdateShippingInput>;
};


export type MutationOrderVoidArgs = {
  id: Scalars['ID'];
};


export type MutationOrderBulkCancelArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationDeleteMetadataArgs = {
  id: Scalars['ID'];
  keys: Array<Scalars['String']>;
};


export type MutationDeletePrivateMetadataArgs = {
  id: Scalars['ID'];
  keys: Array<Scalars['String']>;
};


export type MutationUpdateMetadataArgs = {
  id: Scalars['ID'];
  input: Array<MetadataInput>;
};


export type MutationUpdatePrivateMetadataArgs = {
  id: Scalars['ID'];
  input: Array<MetadataInput>;
};


export type MutationAssignNavigationArgs = {
  menu?: Maybe<Scalars['ID']>;
  navigationType: NavigationType;
};


export type MutationMenuCreateArgs = {
  input: MenuCreateInput;
};


export type MutationMenuDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationMenuBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationMenuUpdateArgs = {
  id: Scalars['ID'];
  input: MenuInput;
};


export type MutationMenuItemCreateArgs = {
  input: MenuItemCreateInput;
};


export type MutationMenuItemDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationMenuItemBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationMenuItemUpdateArgs = {
  id: Scalars['ID'];
  input: MenuItemInput;
};


export type MutationMenuItemTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationMenuItemMoveArgs = {
  menu: Scalars['ID'];
  moves: Array<Maybe<MenuItemMoveInput>>;
};


export type MutationInvoiceRequestArgs = {
  number?: Maybe<Scalars['String']>;
  orderId: Scalars['ID'];
};


export type MutationInvoiceRequestDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationInvoiceCreateArgs = {
  input: InvoiceCreateInput;
  orderId: Scalars['ID'];
};


export type MutationInvoiceDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationInvoiceUpdateArgs = {
  id: Scalars['ID'];
  input: UpdateInvoiceInput;
};


export type MutationInvoiceSendNotificationArgs = {
  id: Scalars['ID'];
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


export type MutationPluginUpdateArgs = {
  channelId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  input: PluginUpdateInput;
};


export type MutationSaleCreateArgs = {
  input: SaleInput;
};


export type MutationSaleDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSaleBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationSaleUpdateArgs = {
  id: Scalars['ID'];
  input: SaleInput;
};


export type MutationSaleCataloguesAddArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationSaleCataloguesRemoveArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationSaleTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationSaleChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: SaleChannelListingInput;
};


export type MutationVoucherCreateArgs = {
  input: VoucherInput;
};


export type MutationVoucherDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationVoucherBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationVoucherUpdateArgs = {
  id: Scalars['ID'];
  input: VoucherInput;
};


export type MutationVoucherCataloguesAddArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationVoucherCataloguesRemoveArgs = {
  id: Scalars['ID'];
  input: CatalogueInput;
};


export type MutationVoucherTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationVoucherChannelListingUpdateArgs = {
  id: Scalars['ID'];
  input: VoucherChannelListingInput;
};


export type MutationExportProductsArgs = {
  input: ExportProductsInput;
};


export type MutationFileUploadArgs = {
  file: Scalars['Upload'];
};


export type MutationCheckoutAddPromoCodeArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  promoCode: Scalars['String'];
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutBillingAddressUpdateArgs = {
  billingAddress: AddressInput;
  checkoutId?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutCompleteArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  paymentData?: Maybe<Scalars['JSONString']>;
  redirectUrl?: Maybe<Scalars['String']>;
  storeSource?: Maybe<Scalars['Boolean']>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutCreateArgs = {
  input: CheckoutCreateInput;
};


export type MutationCheckoutCustomerAttachArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  customerId?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutCustomerDetachArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutEmailUpdateArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  email: Scalars['String'];
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutLineDeleteArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  lineId?: Maybe<Scalars['ID']>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutLinesAddArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  lines: Array<Maybe<CheckoutLineInput>>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutLinesUpdateArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  lines: Array<Maybe<CheckoutLineInput>>;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutRemovePromoCodeArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  promoCode: Scalars['String'];
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutPaymentCreateArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  input: PaymentInput;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutShippingAddressUpdateArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  shippingAddress: AddressInput;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutShippingMethodUpdateArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  shippingMethodId: Scalars['ID'];
  token?: Maybe<Scalars['UUID']>;
};


export type MutationCheckoutLanguageCodeUpdateArgs = {
  checkoutId?: Maybe<Scalars['ID']>;
  languageCode: LanguageCodeEnum;
  token?: Maybe<Scalars['UUID']>;
};


export type MutationChannelCreateArgs = {
  input: ChannelCreateInput;
};


export type MutationChannelUpdateArgs = {
  id: Scalars['ID'];
  input: ChannelUpdateInput;
};


export type MutationChannelDeleteArgs = {
  id: Scalars['ID'];
  input?: Maybe<ChannelDeleteInput>;
};


export type MutationChannelActivateArgs = {
  id: Scalars['ID'];
};


export type MutationChannelDeactivateArgs = {
  id: Scalars['ID'];
};


export type MutationAttributeCreateArgs = {
  input: AttributeCreateInput;
};


export type MutationAttributeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAttributeUpdateArgs = {
  id: Scalars['ID'];
  input: AttributeUpdateInput;
};


export type MutationAttributeTranslateArgs = {
  id: Scalars['ID'];
  input: NameTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationAttributeBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationAttributeValueBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationAttributeValueCreateArgs = {
  attribute: Scalars['ID'];
  input: AttributeValueCreateInput;
};


export type MutationAttributeValueDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAttributeValueUpdateArgs = {
  id: Scalars['ID'];
  input: AttributeValueCreateInput;
};


export type MutationAttributeValueTranslateArgs = {
  id: Scalars['ID'];
  input: AttributeValueTranslationInput;
  languageCode: LanguageCodeEnum;
};


export type MutationAttributeReorderValuesArgs = {
  attributeId: Scalars['ID'];
  moves: Array<Maybe<ReorderInput>>;
};


export type MutationAppCreateArgs = {
  input: AppInput;
};


export type MutationAppUpdateArgs = {
  id: Scalars['ID'];
  input: AppInput;
};


export type MutationAppDeleteArgs = {
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


export type MutationAppInstallArgs = {
  input: AppInstallInput;
};


export type MutationAppRetryInstallArgs = {
  activateAfterInstallation?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};


export type MutationAppDeleteFailedInstallationArgs = {
  id: Scalars['ID'];
};


export type MutationAppFetchManifestArgs = {
  manifestUrl: Scalars['String'];
};


export type MutationAppActivateArgs = {
  id: Scalars['ID'];
};


export type MutationAppDeactivateArgs = {
  id: Scalars['ID'];
};


export type MutationTokenCreateArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationTokenRefreshArgs = {
  csrfToken?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
};


export type MutationTokenVerifyArgs = {
  token: Scalars['String'];
};


export type MutationExternalAuthenticationUrlArgs = {
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


export type MutationExternalLogoutArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationExternalVerifyArgs = {
  input: Scalars['JSONString'];
  pluginId: Scalars['String'];
};


export type MutationRequestPasswordResetArgs = {
  channel?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationConfirmAccountArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSetPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationPasswordChangeArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationRequestEmailChangeArgs = {
  channel?: Maybe<Scalars['String']>;
  newEmail: Scalars['String'];
  password: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationConfirmEmailChangeArgs = {
  channel?: Maybe<Scalars['String']>;
  token: Scalars['String'];
};


export type MutationAccountAddressCreateArgs = {
  input: AddressInput;
  type?: Maybe<AddressTypeEnum>;
};


export type MutationAccountAddressUpdateArgs = {
  id: Scalars['ID'];
  input: AddressInput;
};


export type MutationAccountAddressDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAccountSetDefaultAddressArgs = {
  id: Scalars['ID'];
  type: AddressTypeEnum;
};


export type MutationAccountRegisterArgs = {
  input: AccountRegisterInput;
};


export type MutationAccountUpdateArgs = {
  input: AccountInput;
};


export type MutationAccountRequestDeletionArgs = {
  channel?: Maybe<Scalars['String']>;
  redirectUrl: Scalars['String'];
};


export type MutationAccountDeleteArgs = {
  token: Scalars['String'];
};


export type MutationAddressCreateArgs = {
  input: AddressInput;
  userId: Scalars['ID'];
};


export type MutationAddressUpdateArgs = {
  id: Scalars['ID'];
  input: AddressInput;
};


export type MutationAddressDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationAddressSetDefaultArgs = {
  addressId: Scalars['ID'];
  type: AddressTypeEnum;
  userId: Scalars['ID'];
};


export type MutationCustomerCreateArgs = {
  input: UserCreateInput;
};


export type MutationCustomerUpdateArgs = {
  id: Scalars['ID'];
  input: CustomerInput;
};


export type MutationCustomerDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCustomerBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationStaffCreateArgs = {
  input: StaffCreateInput;
};


export type MutationStaffUpdateArgs = {
  id: Scalars['ID'];
  input: StaffUpdateInput;
};


export type MutationStaffDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationStaffBulkDeleteArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
};


export type MutationUserAvatarUpdateArgs = {
  image: Scalars['Upload'];
};


export type MutationUserBulkSetActiveArgs = {
  ids: Array<Maybe<Scalars['ID']>>;
  isActive: Scalars['Boolean'];
};


export type MutationPermissionGroupCreateArgs = {
  input: PermissionGroupCreateInput;
};


export type MutationPermissionGroupUpdateArgs = {
  id: Scalars['ID'];
  input: PermissionGroupUpdateInput;
};


export type MutationPermissionGroupDeleteArgs = {
  id: Scalars['ID'];
};

export type NameTranslationInput = {
  name?: Maybe<Scalars['String']>;
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
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
};

/** Represents an order in the shop. */
export type Order = Node & ObjectWithMetadata & {
  __typename?: 'Order';
  /** The ID of the object. */
  id: Scalars['ID'];
  created: Scalars['DateTime'];
  status: OrderStatus;
  user?: Maybe<User>;
  trackingClientId: Scalars['String'];
  billingAddress?: Maybe<Address>;
  shippingAddress?: Maybe<Address>;
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethodName?: Maybe<Scalars['String']>;
  channel: Channel;
  /** Total price of shipping. */
  shippingPrice: TaxedMoney;
  shippingTaxRate: Scalars['Float'];
  token: Scalars['String'];
  voucher?: Maybe<Voucher>;
  /** List of user gift cards. */
  giftCards?: Maybe<Array<Maybe<GiftCard>>>;
  displayGrossPrices: Scalars['Boolean'];
  customerNote: Scalars['String'];
  weight?: Maybe<Weight>;
  redirectUrl?: Maybe<Scalars['String']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of shipments for the order. */
  fulfillments: Array<Maybe<Fulfillment>>;
  /** List of order lines. */
  lines: Array<Maybe<OrderLine>>;
  /** List of actions that can be performed in the current state of an order. */
  actions: Array<Maybe<OrderAction>>;
  /** Shipping methods that can be used with this order. */
  availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  /** List of order invoices. */
  invoices?: Maybe<Array<Maybe<Invoice>>>;
  /** User-friendly number of an order. */
  number?: Maybe<Scalars['String']>;
  /** The ID of the order that was the base for this order. */
  original?: Maybe<Scalars['ID']>;
  /** The order origin. */
  origin: OrderOriginEnum;
  /** Informs if an order is fully paid. */
  isPaid: Scalars['Boolean'];
  /** Internal payment status. */
  paymentStatus: PaymentChargeStatusEnum;
  /** User-friendly payment status. */
  paymentStatusDisplay: Scalars['String'];
  /** List of payments for the order. */
  payments?: Maybe<Array<Maybe<Payment>>>;
  /** Total amount of the order. */
  total: TaxedMoney;
  /** Undiscounted total amount of the order. */
  undiscountedTotal: TaxedMoney;
  /** The sum of line prices not including shipping. */
  subtotal: TaxedMoney;
  /** User-friendly order status. */
  statusDisplay?: Maybe<Scalars['String']>;
  /** Informs whether a draft order can be finalized(turned into a regular order). */
  canFinalize: Scalars['Boolean'];
  /** Amount authorized for the order. */
  totalAuthorized: Money;
  /** Amount captured by payment. */
  totalCaptured: Money;
  /** List of events associated with the order. */
  events?: Maybe<Array<Maybe<OrderEvent>>>;
  /** The difference between the paid and the order total amount. */
  totalBalance: Money;
  /** Email address of the customer. */
  userEmail?: Maybe<Scalars['String']>;
  /** Returns True, if order requires shipping. */
  isShippingRequired: Scalars['Boolean'];
  /** @deprecated Use the `languageCodeEnum` field to fetch the language code. This field will be removed in Saleor 4.0. */
  languageCode: Scalars['String'];
  /** Order language code. */
  languageCodeEnum: LanguageCodeEnum;
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
  /**
   * Translated discount name.
   * @deprecated Use discounts field. This field will be removed in Saleor 4.0.
   */
  translatedDiscountName?: Maybe<Scalars['String']>;
  /** List of all discounts assigned to the order. */
  discounts?: Maybe<Array<OrderDiscount>>;
  /** List of errors that occurred during order validation. */
  errors: Array<OrderError>;
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
  /** Order with the note added. */
  order?: Maybe<Order>;
  /** Order note created. */
  event?: Maybe<OrderEvent>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Cancel an order. */
export type OrderCancel = {
  __typename?: 'OrderCancel';
  /** Canceled order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Capture an order. */
export type OrderCapture = {
  __typename?: 'OrderCapture';
  /** Captured order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Confirms an unconfirmed order by changing status to unfulfilled. */
export type OrderConfirm = {
  __typename?: 'OrderConfirm';
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type OrderCountableConnection = {
  __typename?: 'OrderCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<OrderCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrderCountableEdge = {
  __typename?: 'OrderCountableEdge';
  /** The item at the end of the edge. */
  node: Order;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
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
  /** The ID of the object. */
  id: Scalars['ID'];
  type: OrderDiscountType;
  /** Type of the discount: fixed or percent */
  valueType: DiscountValueTypeEnum;
  /** Value of the discount. Can store fixed value or percent value */
  value: Scalars['PositiveDecimal'];
  name?: Maybe<Scalars['String']>;
  translatedName?: Maybe<Scalars['String']>;
  /** Explanation for the applied discount. */
  reason?: Maybe<Scalars['String']>;
  /** Returns amount of discount. */
  amount: Money;
};

/** Adds discount to the order. */
export type OrderDiscountAdd = {
  __typename?: 'OrderDiscountAdd';
  /** Order which has been discounted. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type OrderDiscountCommonInput = {
  /** Type of the discount: fixed or percent */
  valueType: DiscountValueTypeEnum;
  /** Value of the discount. Can store fixed value or percent value */
  value: Scalars['PositiveDecimal'];
  /** Explanation for the applied discount. */
  reason?: Maybe<Scalars['String']>;
};

/** Remove discount from the order. */
export type OrderDiscountDelete = {
  __typename?: 'OrderDiscountDelete';
  /** Order which has removed discount. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** An enumeration. */
export enum OrderDiscountType {
  /** Voucher */
  Voucher = 'VOUCHER',
  /** Manual */
  Manual = 'MANUAL'
}

/** Update discount for the order. */
export type OrderDiscountUpdate = {
  __typename?: 'OrderDiscountUpdate';
  /** Order which has been discounted. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type OrderDraftFilterInput = {
  customer?: Maybe<Scalars['String']>;
  created?: Maybe<DateRangeInput>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  channels?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type OrderError = {
  __typename?: 'OrderError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: OrderErrorCode;
  /** Warehouse ID which causes the error. */
  warehouse?: Maybe<Scalars['ID']>;
  /** List of order line IDs that cause the error. */
  orderLines?: Maybe<Array<Scalars['ID']>>;
  /** List of product variants that are associated with the error */
  variants?: Maybe<Array<Scalars['ID']>>;
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
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
  NotEditable = 'NOT_EDITABLE',
  FulfillOrderLine = 'FULFILL_ORDER_LINE',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  ProductNotPublished = 'PRODUCT_NOT_PUBLISHED',
  ProductUnavailableForPurchase = 'PRODUCT_UNAVAILABLE_FOR_PURCHASE',
  NotFound = 'NOT_FOUND',
  OrderNoShippingAddress = 'ORDER_NO_SHIPPING_ADDRESS',
  PaymentError = 'PAYMENT_ERROR',
  PaymentMissing = 'PAYMENT_MISSING',
  Required = 'REQUIRED',
  ShippingMethodNotApplicable = 'SHIPPING_METHOD_NOT_APPLICABLE',
  ShippingMethodRequired = 'SHIPPING_METHOD_REQUIRED',
  TaxError = 'TAX_ERROR',
  Unique = 'UNIQUE',
  VoidInactivePayment = 'VOID_INACTIVE_PAYMENT',
  ZeroQuantity = 'ZERO_QUANTITY',
  InvalidQuantity = 'INVALID_QUANTITY',
  InsufficientStock = 'INSUFFICIENT_STOCK',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  NotAvailableInChannel = 'NOT_AVAILABLE_IN_CHANNEL',
  ChannelInactive = 'CHANNEL_INACTIVE'
}

/** History log of the order. */
export type OrderEvent = Node & {
  __typename?: 'OrderEvent';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Date when event happened at in ISO 8601 format. */
  date?: Maybe<Scalars['DateTime']>;
  /** Order event type. */
  type?: Maybe<OrderEventsEnum>;
  /** User who performed the action. */
  user?: Maybe<User>;
  /** App that performed the action. */
  app?: Maybe<App>;
  /** Content of the event. */
  message?: Maybe<Scalars['String']>;
  /** Email of the customer. */
  email?: Maybe<Scalars['String']>;
  /** Type of an email sent to the customer. */
  emailType?: Maybe<OrderEventsEmailsEnum>;
  /** Amount of money. */
  amount?: Maybe<Scalars['Float']>;
  /** The payment ID from the payment gateway. */
  paymentId?: Maybe<Scalars['String']>;
  /** The payment gateway of the payment. */
  paymentGateway?: Maybe<Scalars['String']>;
  /** Number of items. */
  quantity?: Maybe<Scalars['Int']>;
  /** Composed ID of the Fulfillment. */
  composedId?: Maybe<Scalars['String']>;
  /** User-friendly number of an order. */
  orderNumber?: Maybe<Scalars['String']>;
  /** Number of an invoice related to the order. */
  invoiceNumber?: Maybe<Scalars['String']>;
  /** List of oversold lines names. */
  oversoldItems?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The concerned lines. */
  lines?: Maybe<Array<Maybe<OrderEventOrderLineObject>>>;
  /** The lines fulfilled. */
  fulfilledItems?: Maybe<Array<Maybe<FulfillmentLine>>>;
  /** The warehouse were items were restocked. */
  warehouse?: Maybe<Warehouse>;
  /** The transaction reference of captured payment. */
  transactionReference?: Maybe<Scalars['String']>;
  /** Define if shipping costs were included to the refund. */
  shippingCostsIncluded?: Maybe<Scalars['Boolean']>;
  /** The order which is related to this order. */
  relatedOrder?: Maybe<Order>;
  /** The discount applied to the order. */
  discount?: Maybe<OrderEventDiscountObject>;
};

export type OrderEventCountableConnection = {
  __typename?: 'OrderEventCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<OrderEventCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrderEventCountableEdge = {
  __typename?: 'OrderEventCountableEdge';
  /** The item at the end of the edge. */
  node: OrderEvent;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

export type OrderEventDiscountObject = {
  __typename?: 'OrderEventDiscountObject';
  /** Type of the discount: fixed or percent. */
  valueType: DiscountValueTypeEnum;
  /** Value of the discount. Can store fixed value or percent value. */
  value: Scalars['PositiveDecimal'];
  /** Explanation for the applied discount. */
  reason?: Maybe<Scalars['String']>;
  /** Returns amount of discount. */
  amount?: Maybe<Money>;
  /** Type of the discount: fixed or percent. */
  oldValueType?: Maybe<DiscountValueTypeEnum>;
  /** Value of the discount. Can store fixed value or percent value. */
  oldValue?: Maybe<Scalars['PositiveDecimal']>;
  /** Returns amount of discount. */
  oldAmount?: Maybe<Money>;
};

export type OrderEventOrderLineObject = {
  __typename?: 'OrderEventOrderLineObject';
  /** The variant quantity. */
  quantity?: Maybe<Scalars['Int']>;
  /** The order line. */
  orderLine?: Maybe<OrderLine>;
  /** The variant name. */
  itemName?: Maybe<Scalars['String']>;
  /** The discount applied to the order line. */
  discount?: Maybe<OrderEventDiscountObject>;
};

/** An enumeration. */
export enum OrderEventsEmailsEnum {
  PaymentConfirmation = 'PAYMENT_CONFIRMATION',
  Confirmed = 'CONFIRMED',
  ShippingConfirmation = 'SHIPPING_CONFIRMATION',
  TrackingUpdated = 'TRACKING_UPDATED',
  OrderConfirmation = 'ORDER_CONFIRMATION',
  OrderCancel = 'ORDER_CANCEL',
  OrderRefund = 'ORDER_REFUND',
  FulfillmentConfirmation = 'FULFILLMENT_CONFIRMATION',
  DigitalLinks = 'DIGITAL_LINKS'
}

/** An enumeration. */
export enum OrderEventsEnum {
  DraftCreated = 'DRAFT_CREATED',
  DraftCreatedFromReplace = 'DRAFT_CREATED_FROM_REPLACE',
  AddedProducts = 'ADDED_PRODUCTS',
  RemovedProducts = 'REMOVED_PRODUCTS',
  Placed = 'PLACED',
  PlacedFromDraft = 'PLACED_FROM_DRAFT',
  OversoldItems = 'OVERSOLD_ITEMS',
  Canceled = 'CANCELED',
  OrderMarkedAsPaid = 'ORDER_MARKED_AS_PAID',
  OrderFullyPaid = 'ORDER_FULLY_PAID',
  OrderReplacementCreated = 'ORDER_REPLACEMENT_CREATED',
  OrderDiscountAdded = 'ORDER_DISCOUNT_ADDED',
  OrderDiscountAutomaticallyUpdated = 'ORDER_DISCOUNT_AUTOMATICALLY_UPDATED',
  OrderDiscountUpdated = 'ORDER_DISCOUNT_UPDATED',
  OrderDiscountDeleted = 'ORDER_DISCOUNT_DELETED',
  OrderLineDiscountUpdated = 'ORDER_LINE_DISCOUNT_UPDATED',
  OrderLineDiscountRemoved = 'ORDER_LINE_DISCOUNT_REMOVED',
  OrderLineProductDeleted = 'ORDER_LINE_PRODUCT_DELETED',
  OrderLineVariantDeleted = 'ORDER_LINE_VARIANT_DELETED',
  UpdatedAddress = 'UPDATED_ADDRESS',
  EmailSent = 'EMAIL_SENT',
  Confirmed = 'CONFIRMED',
  PaymentAuthorized = 'PAYMENT_AUTHORIZED',
  PaymentCaptured = 'PAYMENT_CAPTURED',
  ExternalServiceNotification = 'EXTERNAL_SERVICE_NOTIFICATION',
  PaymentRefunded = 'PAYMENT_REFUNDED',
  PaymentVoided = 'PAYMENT_VOIDED',
  PaymentFailed = 'PAYMENT_FAILED',
  InvoiceRequested = 'INVOICE_REQUESTED',
  InvoiceGenerated = 'INVOICE_GENERATED',
  InvoiceUpdated = 'INVOICE_UPDATED',
  InvoiceSent = 'INVOICE_SENT',
  FulfillmentCanceled = 'FULFILLMENT_CANCELED',
  FulfillmentRestockedItems = 'FULFILLMENT_RESTOCKED_ITEMS',
  FulfillmentFulfilledItems = 'FULFILLMENT_FULFILLED_ITEMS',
  FulfillmentRefunded = 'FULFILLMENT_REFUNDED',
  FulfillmentReturned = 'FULFILLMENT_RETURNED',
  FulfillmentReplaced = 'FULFILLMENT_REPLACED',
  TrackingUpdated = 'TRACKING_UPDATED',
  NoteAdded = 'NOTE_ADDED',
  Other = 'OTHER'
}

export type OrderFilterInput = {
  paymentStatus?: Maybe<Array<Maybe<PaymentChargeStatusEnum>>>;
  status?: Maybe<Array<Maybe<OrderStatusFilter>>>;
  customer?: Maybe<Scalars['String']>;
  created?: Maybe<DateRangeInput>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  channels?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Creates new fulfillments for an order. */
export type OrderFulfill = {
  __typename?: 'OrderFulfill';
  /** List of created fulfillments. */
  fulfillments?: Maybe<Array<Maybe<Fulfillment>>>;
  /** Fulfilled order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type OrderFulfillInput = {
  /** List of items informing how to fulfill the order. */
  lines: Array<OrderFulfillLineInput>;
  /** If true, send an email notification to the customer. */
  notifyCustomer?: Maybe<Scalars['Boolean']>;
};

export type OrderFulfillLineInput = {
  /** The ID of the order line. */
  orderLineId?: Maybe<Scalars['ID']>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  productName: Scalars['String'];
  variantName: Scalars['String'];
  productSku: Scalars['String'];
  isShippingRequired: Scalars['Boolean'];
  quantity: Scalars['Int'];
  quantityFulfilled: Scalars['Int'];
  unitDiscountReason?: Maybe<Scalars['String']>;
  taxRate: Scalars['Float'];
  digitalContentUrl?: Maybe<DigitalContentUrl>;
  /** The main thumbnail for the ordered product. */
  thumbnail?: Maybe<Image>;
  /** Price of the single item in the order line. */
  unitPrice: TaxedMoney;
  /** Price of the single item in the order line without applied an order line discount. */
  undiscountedUnitPrice: TaxedMoney;
  /** The discount applied to the single order line. */
  unitDiscount: Money;
  /** Value of the discount. Can store fixed value or percent value */
  unitDiscountValue: Scalars['PositiveDecimal'];
  /** Price of the order line. */
  totalPrice: TaxedMoney;
  /** A purchased product variant. Note: this field may be null if the variant has been removed from stock at all. */
  variant?: Maybe<ProductVariant>;
  /** Product name in the customer's language */
  translatedProductName: Scalars['String'];
  /** Variant name in the customer's language */
  translatedVariantName: Scalars['String'];
  /** List of allocations across warehouses. */
  allocations?: Maybe<Array<Allocation>>;
  /** Type of the discount: fixed or percent */
  unitDiscountType?: Maybe<DiscountValueTypeEnum>;
};


/** Represents order line of particular order. */
export type OrderLineThumbnailArgs = {
  size?: Maybe<Scalars['Int']>;
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
  /** A related order. */
  order?: Maybe<Order>;
  /** An order line that was deleted. */
  orderLine?: Maybe<OrderLine>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Remove discount applied to the order line. */
export type OrderLineDiscountRemove = {
  __typename?: 'OrderLineDiscountRemove';
  /** Order line which has removed discount. */
  orderLine?: Maybe<OrderLine>;
  /** Order which is related to line which has removed discount. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Update discount for the order line. */
export type OrderLineDiscountUpdate = {
  __typename?: 'OrderLineDiscountUpdate';
  /** Order line which has been discounted. */
  orderLine?: Maybe<OrderLine>;
  /** Order which is related to the discounted line. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type OrderLineInput = {
  /** Number of variant items ordered. */
  quantity: Scalars['Int'];
};

/** Updates an order line of an order. */
export type OrderLineUpdate = {
  __typename?: 'OrderLineUpdate';
  /** Related order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
  orderLine?: Maybe<OrderLine>;
};

/** Create order lines for an order. */
export type OrderLinesCreate = {
  __typename?: 'OrderLinesCreate';
  /** Related order. */
  order?: Maybe<Order>;
  /** List of added order lines. */
  orderLines?: Maybe<Array<OrderLine>>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** Mark order as manually paid. */
export type OrderMarkAsPaid = {
  __typename?: 'OrderMarkAsPaid';
  /** Order marked as paid. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
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
  /** A refunded order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
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
  /** List of unfulfilled lines to refund. */
  orderLines?: Maybe<Array<OrderRefundLineInput>>;
  /** List of fulfilled lines to refund. */
  fulfillmentLines?: Maybe<Array<OrderRefundFulfillmentLineInput>>;
  /** The total amount of refund when the value is provided manually. */
  amountToRefund?: Maybe<Scalars['PositiveDecimal']>;
  /** If true, Saleor will refund shipping costs. If amountToRefund is providedincludeShippingCosts will be ignored. */
  includeShippingCosts?: Maybe<Scalars['Boolean']>;
};

export type OrderReturnFulfillmentLineInput = {
  /** The ID of the fulfillment line to return. */
  fulfillmentLineId: Scalars['ID'];
  /** The number of items to be returned. */
  quantity: Scalars['Int'];
  /** Determines, if the line should be added to replace order. */
  replace?: Maybe<Scalars['Boolean']>;
};

export type OrderReturnLineInput = {
  /** The ID of the order line to return. */
  orderLineId: Scalars['ID'];
  /** The number of items to be returned. */
  quantity: Scalars['Int'];
  /** Determines, if the line should be added to replace order. */
  replace?: Maybe<Scalars['Boolean']>;
};

export type OrderReturnProductsInput = {
  /** List of unfulfilled lines to return. */
  orderLines?: Maybe<Array<OrderReturnLineInput>>;
  /** List of fulfilled lines to return. */
  fulfillmentLines?: Maybe<Array<OrderReturnFulfillmentLineInput>>;
  /** The total amount of refund when the value is provided manually. */
  amountToRefund?: Maybe<Scalars['PositiveDecimal']>;
  /** If true, Saleor will refund shipping costs. If amountToRefund is providedincludeShippingCosts will be ignored. */
  includeShippingCosts?: Maybe<Scalars['Boolean']>;
  /** If true, Saleor will call refund action for all lines. */
  refund?: Maybe<Scalars['Boolean']>;
};

/** Order related settings from site settings. */
export type OrderSettings = {
  __typename?: 'OrderSettings';
  automaticallyConfirmAllNewOrders: Scalars['Boolean'];
};

export type OrderSettingsError = {
  __typename?: 'OrderSettingsError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: OrderSettingsErrorCode;
};

/** An enumeration. */
export enum OrderSettingsErrorCode {
  Invalid = 'INVALID'
}

/** Update shop order settings. */
export type OrderSettingsUpdate = {
  __typename?: 'OrderSettingsUpdate';
  /** Order settings. */
  orderSettings?: Maybe<OrderSettings>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderSettingsErrors: Array<OrderSettingsError>;
  errors: Array<OrderSettingsError>;
};

export type OrderSettingsUpdateInput = {
  /** When disabled, all new orders from checkout will be marked as unconfirmed. When enabled orders from checkout will become unfulfilled immediately. */
  automaticallyConfirmAllNewOrders: Scalars['Boolean'];
};

export enum OrderSortField {
  /** Sort orders by number. */
  Number = 'NUMBER',
  /** Sort orders by creation date. */
  CreationDate = 'CREATION_DATE',
  /** Sort orders by customer. */
  Customer = 'CUSTOMER',
  /** Sort orders by payment. */
  Payment = 'PAYMENT',
  /** Sort orders by fulfillment status. */
  FulfillmentStatus = 'FULFILLMENT_STATUS'
}

export type OrderSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort orders by the selected field. */
  field: OrderSortField;
};

/** An enumeration. */
export enum OrderStatus {
  /** Draft */
  Draft = 'DRAFT',
  /** Unconfirmed */
  Unconfirmed = 'UNCONFIRMED',
  /** Unfulfilled */
  Unfulfilled = 'UNFULFILLED',
  /** Partially fulfilled */
  PartiallyFulfilled = 'PARTIALLY_FULFILLED',
  /** Partially returned */
  PartiallyReturned = 'PARTIALLY_RETURNED',
  /** Returned */
  Returned = 'RETURNED',
  /** Fulfilled */
  Fulfilled = 'FULFILLED',
  /** Canceled */
  Canceled = 'CANCELED'
}

export enum OrderStatusFilter {
  ReadyToFulfill = 'READY_TO_FULFILL',
  ReadyToCapture = 'READY_TO_CAPTURE',
  Unfulfilled = 'UNFULFILLED',
  Unconfirmed = 'UNCONFIRMED',
  PartiallyFulfilled = 'PARTIALLY_FULFILLED',
  Fulfilled = 'FULFILLED',
  Canceled = 'CANCELED'
}

/** Updates an order. */
export type OrderUpdate = {
  __typename?: 'OrderUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
  order?: Maybe<Order>;
};

export type OrderUpdateInput = {
  /** Billing address of the customer. */
  billingAddress?: Maybe<AddressInput>;
  /** Email address of the customer. */
  userEmail?: Maybe<Scalars['String']>;
  /** Shipping address of the customer. */
  shippingAddress?: Maybe<AddressInput>;
};

/** Updates a shipping method of the order. */
export type OrderUpdateShipping = {
  __typename?: 'OrderUpdateShipping';
  /** Order with updated shipping method. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

export type OrderUpdateShippingInput = {
  /** ID of the selected shipping method. */
  shippingMethod?: Maybe<Scalars['ID']>;
};

/** Void an order. */
export type OrderVoid = {
  __typename?: 'OrderVoid';
  /** A voided order. */
  order?: Maybe<Order>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  orderErrors: Array<OrderError>;
  errors: Array<OrderError>;
};

/** A static page that can be manually added by a shop operator through the dashboard. */
export type Page = Node & ObjectWithMetadata & {
  __typename?: 'Page';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  content?: Maybe<Scalars['JSONString']>;
  publicationDate?: Maybe<Scalars['Date']>;
  isPublished: Scalars['Boolean'];
  slug: Scalars['String'];
  pageType: PageType;
  created: Scalars['DateTime'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /**
   * Content of the page (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson: Scalars['JSONString'];
  /** Returns translated page fields for the given language code. */
  translation?: Maybe<PageTranslation>;
  /** List of attributes assigned to this product. */
  attributes: Array<SelectedAttribute>;
};


/** A static page that can be manually added by a shop operator through the dashboard. */
export type PageTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Assign attributes to a given page type. */
export type PageAttributeAssign = {
  __typename?: 'PageAttributeAssign';
  /** The updated page type. */
  pageType?: Maybe<PageType>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
};

/** Unassign attributes from a given page type. */
export type PageAttributeUnassign = {
  __typename?: 'PageAttributeUnassign';
  /** The updated page type. */
  pageType?: Maybe<PageType>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
};

/** Deletes pages. */
export type PageBulkDelete = {
  __typename?: 'PageBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
};

/** Publish pages. */
export type PageBulkPublish = {
  __typename?: 'PageBulkPublish';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
};

export type PageCountableConnection = {
  __typename?: 'PageCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<PageCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PageCountableEdge = {
  __typename?: 'PageCountableEdge';
  /** The item at the end of the edge. */
  node: Page;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new page. */
export type PageCreate = {
  __typename?: 'PageCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
  page?: Maybe<Page>;
};

export type PageCreateInput = {
  /** Page internal name. */
  slug?: Maybe<Scalars['String']>;
  /** Page title. */
  title?: Maybe<Scalars['String']>;
  /** Page content in JSON format. */
  content?: Maybe<Scalars['JSONString']>;
  /** List of attributes. */
  attributes?: Maybe<Array<AttributeValueInput>>;
  /** Determines if page is visible in the storefront. */
  isPublished?: Maybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
  /** ID of the page type that page belongs to. */
  pageType: Scalars['ID'];
};

/** Deletes a page. */
export type PageDelete = {
  __typename?: 'PageDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
  page?: Maybe<Page>;
};

export type PageError = {
  __typename?: 'PageError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: PageErrorCode;
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum PageErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  AttributeAlreadyAssigned = 'ATTRIBUTE_ALREADY_ASSIGNED'
}

export type PageFilterInput = {
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  pageTypes?: Maybe<Array<Maybe<Scalars['ID']>>>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

export type PageInput = {
  /** Page internal name. */
  slug?: Maybe<Scalars['String']>;
  /** Page title. */
  title?: Maybe<Scalars['String']>;
  /** Page content in JSON format. */
  content?: Maybe<Scalars['JSONString']>;
  /** List of attributes. */
  attributes?: Maybe<Array<AttributeValueInput>>;
  /** Determines if page is visible in the storefront. */
  isPublished?: Maybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
};

/** Reorder page attribute values. */
export type PageReorderAttributeValues = {
  __typename?: 'PageReorderAttributeValues';
  /** Page from which attribute values are reordered. */
  page?: Maybe<Page>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
};

export enum PageSortField {
  /** Sort pages by title. */
  Title = 'TITLE',
  /** Sort pages by slug. */
  Slug = 'SLUG',
  /** Sort pages by visibility. */
  Visibility = 'VISIBILITY',
  /** Sort pages by creation date. */
  CreationDate = 'CREATION_DATE',
  /** Sort pages by publication date. */
  PublicationDate = 'PUBLICATION_DATE'
}

export type PageSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Sort pages by the selected field. */
  field: PageSortField;
};

export type PageTranslatableContent = Node & {
  __typename?: 'PageTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  content?: Maybe<Scalars['JSONString']>;
  /**
   * Content of the page (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson?: Maybe<Scalars['JSONString']>;
  /** Returns translated page fields for the given language code. */
  translation?: Maybe<PageTranslation>;
  /**
   * ('A static page that can be manually added by a shop operator ', 'through the dashboard.')
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  page?: Maybe<Page>;
  /** List of page content attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
};


export type PageTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a page. */
export type PageTranslate = {
  __typename?: 'PageTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  page?: Maybe<PageTranslatableContent>;
};

export type PageTranslation = Node & {
  __typename?: 'PageTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSONString']>;
  /** Translation language. */
  language: LanguageDisplay;
  /**
   * Translated description of the page (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `content` field instead.
   */
  contentJson?: Maybe<Scalars['JSONString']>;
};

export type PageTranslationInput = {
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JSONString']>;
};

/** Represents a type of page. It defines what attributes are available to pages of this type. */
export type PageType = Node & ObjectWithMetadata & {
  __typename?: 'PageType';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Page attributes of that page type. */
  attributes?: Maybe<Array<Maybe<Attribute>>>;
  /** Attributes that can be assigned to the page type. */
  availableAttributes?: Maybe<AttributeCountableConnection>;
  /** Whether page type has pages assigned. */
  hasPages?: Maybe<Scalars['Boolean']>;
};


/** Represents a type of page. It defines what attributes are available to pages of this type. */
export type PageTypeAvailableAttributesArgs = {
  filter?: Maybe<AttributeFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** Delete page types. */
export type PageTypeBulkDelete = {
  __typename?: 'PageTypeBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
};

export type PageTypeCountableConnection = {
  __typename?: 'PageTypeCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<PageTypeCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PageTypeCountableEdge = {
  __typename?: 'PageTypeCountableEdge';
  /** The item at the end of the edge. */
  node: PageType;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Create a new page type. */
export type PageTypeCreate = {
  __typename?: 'PageTypeCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
  pageType?: Maybe<PageType>;
};

export type PageTypeCreateInput = {
  /** Name of the page type. */
  name?: Maybe<Scalars['String']>;
  /** Page type slug. */
  slug?: Maybe<Scalars['String']>;
  /** List of attribute IDs to be assigned to the page type. */
  addAttributes?: Maybe<Array<Scalars['ID']>>;
};

/** Delete a page type. */
export type PageTypeDelete = {
  __typename?: 'PageTypeDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
  pageType?: Maybe<PageType>;
};

export type PageTypeFilterInput = {
  search?: Maybe<Scalars['String']>;
};

/** Reorder the attributes of a page type. */
export type PageTypeReorderAttributes = {
  __typename?: 'PageTypeReorderAttributes';
  /** Page type from which attributes are reordered. */
  pageType?: Maybe<PageType>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
  pageType?: Maybe<PageType>;
};

export type PageTypeUpdateInput = {
  /** Name of the page type. */
  name?: Maybe<Scalars['String']>;
  /** Page type slug. */
  slug?: Maybe<Scalars['String']>;
  /** List of attribute IDs to be assigned to the page type. */
  addAttributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute IDs to be assigned to the page type. */
  removeAttributes?: Maybe<Array<Scalars['ID']>>;
};

/** Updates an existing page. */
export type PageUpdate = {
  __typename?: 'PageUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pageErrors: Array<PageError>;
  errors: Array<PageError>;
  page?: Maybe<Page>;
};

/** Change the password of the logged in user. */
export type PasswordChange = {
  __typename?: 'PasswordChange';
  /** A user instance with a new password. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Represents a payment of a given type. */
export type Payment = Node & {
  __typename?: 'Payment';
  /** The ID of the object. */
  id: Scalars['ID'];
  gateway: Scalars['String'];
  isActive: Scalars['Boolean'];
  created: Scalars['DateTime'];
  modified: Scalars['DateTime'];
  token: Scalars['String'];
  checkout?: Maybe<Checkout>;
  order?: Maybe<Order>;
  paymentMethodType: Scalars['String'];
  customerIpAddress?: Maybe<Scalars['String']>;
  /** Internal payment status. */
  chargeStatus: PaymentChargeStatusEnum;
  /** List of actions that can be performed in the current state of a payment. */
  actions: Array<Maybe<OrderAction>>;
  /** Total amount of the payment. */
  total?: Maybe<Money>;
  /** Total amount captured for this payment. */
  capturedAmount?: Maybe<Money>;
  /** List of all transactions within this payment. */
  transactions?: Maybe<Array<Maybe<Transaction>>>;
  /** Maximum amount of money that can be captured. */
  availableCaptureAmount?: Maybe<Money>;
  /** Maximum amount of money that can be refunded. */
  availableRefundAmount?: Maybe<Money>;
  /** The details of the card used for this payment. */
  creditCard?: Maybe<CreditCard>;
};

/** Captures the authorized payment amount. */
export type PaymentCapture = {
  __typename?: 'PaymentCapture';
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
  errors: Array<PaymentError>;
};

/** An enumeration. */
export enum PaymentChargeStatusEnum {
  NotCharged = 'NOT_CHARGED',
  Pending = 'PENDING',
  PartiallyCharged = 'PARTIALLY_CHARGED',
  FullyCharged = 'FULLY_CHARGED',
  PartiallyRefunded = 'PARTIALLY_REFUNDED',
  FullyRefunded = 'FULLY_REFUNDED',
  Refused = 'REFUSED',
  Cancelled = 'CANCELLED'
}

export type PaymentCountableConnection = {
  __typename?: 'PaymentCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<PaymentCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PaymentCountableEdge = {
  __typename?: 'PaymentCountableEdge';
  /** The item at the end of the edge. */
  node: Payment;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

export type PaymentError = {
  __typename?: 'PaymentError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: PaymentErrorCode;
};

/** An enumeration. */
export enum PaymentErrorCode {
  BillingAddressNotSet = 'BILLING_ADDRESS_NOT_SET',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  PartialPaymentNotAllowed = 'PARTIAL_PAYMENT_NOT_ALLOWED',
  ShippingAddressNotSet = 'SHIPPING_ADDRESS_NOT_SET',
  InvalidShippingMethod = 'INVALID_SHIPPING_METHOD',
  ShippingMethodNotSet = 'SHIPPING_METHOD_NOT_SET',
  PaymentError = 'PAYMENT_ERROR',
  NotSupportedGateway = 'NOT_SUPPORTED_GATEWAY',
  ChannelInactive = 'CHANNEL_INACTIVE'
}

export type PaymentFilterInput = {
  checkouts?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Available payment gateway backend with configuration necessary to setup client. */
export type PaymentGateway = {
  __typename?: 'PaymentGateway';
  /** Payment gateway name. */
  name: Scalars['String'];
  /** Payment gateway ID. */
  id: Scalars['ID'];
  /** Payment gateway client configuration. */
  config: Array<GatewayConfigLine>;
  /** Payment gateway supported currencies. */
  currencies: Array<Maybe<Scalars['String']>>;
};

/** Initializes payment process when it is required by gateway. */
export type PaymentInitialize = {
  __typename?: 'PaymentInitialize';
  initializedPayment?: Maybe<PaymentInitialized>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
  errors: Array<PaymentError>;
};

/** Server-side data generated by a payment gateway. Optional step when the payment provider requires an additional action to initialize payment session. */
export type PaymentInitialized = {
  __typename?: 'PaymentInitialized';
  /** ID of a payment gateway. */
  gateway: Scalars['String'];
  /** Payment gateway name. */
  name: Scalars['String'];
  /** Initialized data by gateway. */
  data?: Maybe<Scalars['JSONString']>;
};

export type PaymentInput = {
  /** A gateway to use with that payment. */
  gateway: Scalars['String'];
  /** Client-side generated payment token, representing customer's billing data in a secure manner. */
  token?: Maybe<Scalars['String']>;
  /** Total amount of the transaction, including all taxes and discounts. If no amount is provided, the checkout total will be used. */
  amount?: Maybe<Scalars['PositiveDecimal']>;
  /** URL of a storefront view where user should be redirected after requiring additional actions. Payment with additional actions will not be finished if this field is not provided. */
  returnUrl?: Maybe<Scalars['String']>;
};

/** Refunds the captured payment amount. */
export type PaymentRefund = {
  __typename?: 'PaymentRefund';
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
  errors: Array<PaymentError>;
};

/** Represents a payment source stored for user in payment gateway, such as credit card. */
export type PaymentSource = {
  __typename?: 'PaymentSource';
  /** Payment gateway name. */
  gateway: Scalars['String'];
  /** ID of stored payment method. */
  paymentMethodId?: Maybe<Scalars['String']>;
  /** Stored credit card details if available. */
  creditCardInfo?: Maybe<CreditCard>;
};

/** Voids the authorized payment. */
export type PaymentVoid = {
  __typename?: 'PaymentVoid';
  /** Updated payment. */
  payment?: Maybe<Payment>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  paymentErrors: Array<PaymentError>;
  errors: Array<PaymentError>;
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
  ManageUsers = 'MANAGE_USERS',
  ManageStaff = 'MANAGE_STAFF',
  ImpersonateUser = 'IMPERSONATE_USER',
  ManageApps = 'MANAGE_APPS',
  ManageChannels = 'MANAGE_CHANNELS',
  ManageDiscounts = 'MANAGE_DISCOUNTS',
  ManagePlugins = 'MANAGE_PLUGINS',
  ManageGiftCard = 'MANAGE_GIFT_CARD',
  ManageMenus = 'MANAGE_MENUS',
  ManageOrders = 'MANAGE_ORDERS',
  ManagePages = 'MANAGE_PAGES',
  ManagePageTypesAndAttributes = 'MANAGE_PAGE_TYPES_AND_ATTRIBUTES',
  HandlePayments = 'HANDLE_PAYMENTS',
  ManageProducts = 'MANAGE_PRODUCTS',
  ManageProductTypesAndAttributes = 'MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES',
  ManageShipping = 'MANAGE_SHIPPING',
  ManageSettings = 'MANAGE_SETTINGS',
  ManageTranslations = 'MANAGE_TRANSLATIONS',
  ManageCheckouts = 'MANAGE_CHECKOUTS'
}

/** Create new permission group. */
export type PermissionGroupCreate = {
  __typename?: 'PermissionGroupCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  permissionGroupErrors: Array<PermissionGroupError>;
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
};

export type PermissionGroupCreateInput = {
  /** List of permission code names to assign to this group. */
  addPermissions?: Maybe<Array<PermissionEnum>>;
  /** List of users to assign to this group. */
  addUsers?: Maybe<Array<Scalars['ID']>>;
  /** Group name. */
  name: Scalars['String'];
};

/** Delete permission group. */
export type PermissionGroupDelete = {
  __typename?: 'PermissionGroupDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  permissionGroupErrors: Array<PermissionGroupError>;
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
};

export type PermissionGroupError = {
  __typename?: 'PermissionGroupError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: PermissionGroupErrorCode;
  /** List of permissions which causes the error. */
  permissions?: Maybe<Array<PermissionEnum>>;
  /** List of user IDs which causes the error. */
  users?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum PermissionGroupErrorCode {
  AssignNonStaffMember = 'ASSIGN_NON_STAFF_MEMBER',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  CannotRemoveFromLastGroup = 'CANNOT_REMOVE_FROM_LAST_GROUP',
  LeftNotManageablePermission = 'LEFT_NOT_MANAGEABLE_PERMISSION',
  OutOfScopePermission = 'OUT_OF_SCOPE_PERMISSION',
  OutOfScopeUser = 'OUT_OF_SCOPE_USER',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type PermissionGroupFilterInput = {
  search?: Maybe<Scalars['String']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  permissionGroupErrors: Array<PermissionGroupError>;
  errors: Array<PermissionGroupError>;
  group?: Maybe<Group>;
};

export type PermissionGroupUpdateInput = {
  /** List of permission code names to assign to this group. */
  addPermissions?: Maybe<Array<PermissionEnum>>;
  /** List of users to assign to this group. */
  addUsers?: Maybe<Array<Scalars['ID']>>;
  /** Group name. */
  name?: Maybe<Scalars['String']>;
  /** List of permission code names to unassign from this group. */
  removePermissions?: Maybe<Array<PermissionEnum>>;
  /** List of users to unassign from this group. */
  removeUsers?: Maybe<Array<Scalars['ID']>>;
};

/** Plugin. */
export type Plugin = {
  __typename?: 'Plugin';
  /** Identifier of the plugin. */
  id: Scalars['ID'];
  /** Name of the plugin. */
  name: Scalars['String'];
  /** Description of the plugin. */
  description: Scalars['String'];
  /** Global configuration of the plugin (not channel-specific). */
  globalConfiguration?: Maybe<PluginConfiguration>;
  /** Channel-specific plugin configuration. */
  channelConfigurations: Array<PluginConfiguration>;
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
  PerChannel = 'PER_CHANNEL',
  Global = 'GLOBAL'
}

export type PluginCountableConnection = {
  __typename?: 'PluginCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<PluginCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PluginCountableEdge = {
  __typename?: 'PluginCountableEdge';
  /** The item at the end of the edge. */
  node: Plugin;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

export type PluginError = {
  __typename?: 'PluginError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: PluginErrorCode;
};

/** An enumeration. */
export enum PluginErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  PluginMisconfigured = 'PLUGIN_MISCONFIGURED',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type PluginFilterInput = {
  statusInChannels?: Maybe<PluginStatusInChannelsInput>;
  search?: Maybe<Scalars['String']>;
  type?: Maybe<PluginConfigurationType>;
};

export enum PluginSortField {
  Name = 'NAME',
  IsActive = 'IS_ACTIVE'
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
  plugin?: Maybe<Plugin>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  pluginsErrors: Array<PluginError>;
  errors: Array<PluginError>;
};

export type PluginUpdateInput = {
  /** Indicates whether the plugin should be enabled. */
  active?: Maybe<Scalars['Boolean']>;
  /** Configuration of the plugin. */
  configuration?: Maybe<Array<Maybe<ConfigurationItemInput>>>;
};


/** An enumeration. */
export enum PostalCodeRuleInclusionTypeEnum {
  Include = 'INCLUDE',
  Exclude = 'EXCLUDE'
}

export type PriceRangeInput = {
  /** Price greater than or equal to. */
  gte?: Maybe<Scalars['Float']>;
  /** Price less than or equal to. */
  lte?: Maybe<Scalars['Float']>;
};

/** Represents an individual item for sale in the storefront. */
export type Product = Node & ObjectWithMetadata & {
  __typename?: 'Product';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  productType: ProductType;
  slug: Scalars['String'];
  category?: Maybe<Category>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  chargeTaxes: Scalars['Boolean'];
  weight?: Maybe<Weight>;
  defaultVariant?: Maybe<ProductVariant>;
  rating?: Maybe<Scalars['Float']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /**
   * Description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** The main thumbnail for a product. */
  thumbnail?: Maybe<Image>;
  /** Lists the storefront product's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<ProductPricingInfo>;
  /** Whether the product is in stock and visible or not. */
  isAvailable?: Maybe<Scalars['Boolean']>;
  /** A type of tax. Assigned by enabled tax gateway */
  taxType?: Maybe<TaxType>;
  /** List of attributes assigned to this product. */
  attributes: Array<SelectedAttribute>;
  /** List of availability in channels for the product. */
  channelListings?: Maybe<Array<ProductChannelListing>>;
  /** Get a single product media by ID. */
  mediaById?: Maybe<ProductMedia>;
  /**
   * Get a single product image by ID.
   * @deprecated Will be removed in Saleor 4.0. Use the `mediaById` field instead.
   */
  imageById?: Maybe<ProductImage>;
  /** List of variants for the product. */
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
  /** List of media for the product. */
  media?: Maybe<Array<ProductMedia>>;
  /**
   * List of images for the product.
   * @deprecated Will be removed in Saleor 4.0. Use the `media` field instead.
   */
  images?: Maybe<Array<Maybe<ProductImage>>>;
  /** List of collections for the product. */
  collections?: Maybe<Array<Maybe<Collection>>>;
  /** Returns translated product fields for the given language code. */
  translation?: Maybe<ProductTranslation>;
  /** Date when product is available for purchase.  */
  availableForPurchase?: Maybe<Scalars['Date']>;
  /** Whether the product is available for purchase. */
  isAvailableForPurchase?: Maybe<Scalars['Boolean']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductThumbnailArgs = {
  size?: Maybe<Scalars['Int']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductPricingArgs = {
  address?: Maybe<AddressInput>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductIsAvailableArgs = {
  address?: Maybe<AddressInput>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductMediaByIdArgs = {
  id?: Maybe<Scalars['ID']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductImageByIdArgs = {
  id?: Maybe<Scalars['ID']>;
};


/** Represents an individual item for sale in the storefront. */
export type ProductTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Assign attributes to a given product type. */
export type ProductAttributeAssign = {
  __typename?: 'ProductAttributeAssign';
  /** The updated product type. */
  productType?: Maybe<ProductType>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
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
  /** The updated product type. */
  productType?: Maybe<ProductType>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Deletes products. */
export type ProductBulkDelete = {
  __typename?: 'ProductBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Represents product channel listing. */
export type ProductChannelListing = Node & {
  __typename?: 'ProductChannelListing';
  /** The ID of the object. */
  id: Scalars['ID'];
  publicationDate?: Maybe<Scalars['Date']>;
  isPublished: Scalars['Boolean'];
  channel: Channel;
  visibleInListings: Scalars['Boolean'];
  availableForPurchase?: Maybe<Scalars['Date']>;
  /** The price of the cheapest variant (including discounts). */
  discountedPrice?: Maybe<Money>;
  /** Purchase cost of product. */
  purchaseCost?: Maybe<MoneyRange>;
  /** Range of margin percentage value. */
  margin?: Maybe<Margin>;
  /** Whether the product is available for purchase. */
  isAvailableForPurchase?: Maybe<Scalars['Boolean']>;
  /** Lists the storefront product's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<ProductPricingInfo>;
};


/** Represents product channel listing. */
export type ProductChannelListingPricingArgs = {
  address?: Maybe<AddressInput>;
};

export type ProductChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Determines if object is visible to customers. */
  isPublished?: Maybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: Maybe<Scalars['Date']>;
  /** Determines if product is visible in product listings (doesn't apply to product collections). */
  visibleInListings?: Maybe<Scalars['Boolean']>;
  /** Determine if product should be available for purchase. */
  isAvailableForPurchase?: Maybe<Scalars['Boolean']>;
  /** A start date from which a product will be available for purchase. When not set and isAvailable is set to True, the current day is assumed. */
  availableForPurchaseDate?: Maybe<Scalars['Date']>;
  /** List of variants to which the channel should be assigned. */
  addVariants?: Maybe<Array<Scalars['ID']>>;
  /** List of variants from which the channel should be unassigned. */
  removeVariants?: Maybe<Array<Scalars['ID']>>;
};

export type ProductChannelListingError = {
  __typename?: 'ProductChannelListingError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ProductErrorCode;
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
  /** List of variants IDs which causes the error. */
  variants?: Maybe<Array<Scalars['ID']>>;
};

/** Manage product's availability in channels. */
export type ProductChannelListingUpdate = {
  __typename?: 'ProductChannelListingUpdate';
  /** An updated product instance. */
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productChannelListingErrors: Array<ProductChannelListingError>;
  errors: Array<ProductChannelListingError>;
};

export type ProductChannelListingUpdateInput = {
  /** List of channels to which the product should be assigned or updated. */
  updateChannels?: Maybe<Array<ProductChannelListingAddInput>>;
  /** List of channels from which the product should be unassigned. */
  removeChannels?: Maybe<Array<Scalars['ID']>>;
};

export type ProductCountableConnection = {
  __typename?: 'ProductCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<ProductCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductCountableEdge = {
  __typename?: 'ProductCountableEdge';
  /** The item at the end of the edge. */
  node: Product;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new product. */
export type ProductCreate = {
  __typename?: 'ProductCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  product?: Maybe<Product>;
};

export type ProductCreateInput = {
  /** List of attributes. */
  attributes?: Maybe<Array<AttributeValueInput>>;
  /** ID of the product's category. */
  category?: Maybe<Scalars['ID']>;
  /** Determine if taxes are being charged for the product. */
  chargeTaxes?: Maybe<Scalars['Boolean']>;
  /** List of IDs of collections that the product belongs to. */
  collections?: Maybe<Array<Scalars['ID']>>;
  /** Product description (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Product name. */
  name?: Maybe<Scalars['String']>;
  /** Product slug. */
  slug?: Maybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
  /** Weight of the Product. */
  weight?: Maybe<Scalars['WeightScalar']>;
  /** Defines the product rating value. */
  rating?: Maybe<Scalars['Float']>;
  /** ID of the type that product belongs to. */
  productType: Scalars['ID'];
};

/** Deletes a product. */
export type ProductDelete = {
  __typename?: 'ProductDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  product?: Maybe<Product>;
};

export type ProductError = {
  __typename?: 'ProductError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ProductErrorCode;
  /** List of attributes IDs which causes the error. */
  attributes?: Maybe<Array<Scalars['ID']>>;
  /** List of attribute values IDs which causes the error. */
  values?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum ProductErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  AttributeAlreadyAssigned = 'ATTRIBUTE_ALREADY_ASSIGNED',
  AttributeCannotBeAssigned = 'ATTRIBUTE_CANNOT_BE_ASSIGNED',
  AttributeVariantsDisabled = 'ATTRIBUTE_VARIANTS_DISABLED',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  ProductWithoutCategory = 'PRODUCT_WITHOUT_CATEGORY',
  NotProductsImage = 'NOT_PRODUCTS_IMAGE',
  NotProductsVariant = 'NOT_PRODUCTS_VARIANT',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  VariantNoDigitalContent = 'VARIANT_NO_DIGITAL_CONTENT',
  CannotManageProductWithoutVariant = 'CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT',
  ProductNotAssignedToChannel = 'PRODUCT_NOT_ASSIGNED_TO_CHANNEL',
  UnsupportedMediaProvider = 'UNSUPPORTED_MEDIA_PROVIDER'
}

export enum ProductFieldEnum {
  Name = 'NAME',
  Description = 'DESCRIPTION',
  ProductType = 'PRODUCT_TYPE',
  Category = 'CATEGORY',
  ProductWeight = 'PRODUCT_WEIGHT',
  Collections = 'COLLECTIONS',
  ChargeTaxes = 'CHARGE_TAXES',
  ProductMedia = 'PRODUCT_MEDIA',
  VariantSku = 'VARIANT_SKU',
  VariantWeight = 'VARIANT_WEIGHT',
  VariantMedia = 'VARIANT_MEDIA'
}

export type ProductFilterInput = {
  isPublished?: Maybe<Scalars['Boolean']>;
  collections?: Maybe<Array<Maybe<Scalars['ID']>>>;
  categories?: Maybe<Array<Maybe<Scalars['ID']>>>;
  hasCategory?: Maybe<Scalars['Boolean']>;
  attributes?: Maybe<Array<Maybe<AttributeInput>>>;
  stockAvailability?: Maybe<StockAvailability>;
  stocks?: Maybe<ProductStockFilterInput>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  price?: Maybe<PriceRangeInput>;
  minimalPrice?: Maybe<PriceRangeInput>;
  productTypes?: Maybe<Array<Maybe<Scalars['ID']>>>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Specifies the channel by which the data should be filtered. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
};

/** Represents a product image. */
export type ProductImage = {
  __typename?: 'ProductImage';
  /** The ID of the image. */
  id: Scalars['ID'];
  /** The alt text of the image. */
  alt?: Maybe<Scalars['String']>;
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: Maybe<Scalars['Int']>;
  /** The URL of the image. */
  url: Scalars['String'];
};


/** Represents a product image. */
export type ProductImageUrlArgs = {
  size?: Maybe<Scalars['Int']>;
};

export type ProductInput = {
  /** List of attributes. */
  attributes?: Maybe<Array<AttributeValueInput>>;
  /** ID of the product's category. */
  category?: Maybe<Scalars['ID']>;
  /** Determine if taxes are being charged for the product. */
  chargeTaxes?: Maybe<Scalars['Boolean']>;
  /** List of IDs of collections that the product belongs to. */
  collections?: Maybe<Array<Scalars['ID']>>;
  /** Product description (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Product name. */
  name?: Maybe<Scalars['String']>;
  /** Product slug. */
  slug?: Maybe<Scalars['String']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: Maybe<Scalars['String']>;
  /** Search engine optimization fields. */
  seo?: Maybe<SeoInput>;
  /** Weight of the Product. */
  weight?: Maybe<Scalars['WeightScalar']>;
  /** Defines the product rating value. */
  rating?: Maybe<Scalars['Float']>;
};

/** Represents a product media. */
export type ProductMedia = Node & {
  __typename?: 'ProductMedia';
  /** The ID of the object. */
  id: Scalars['ID'];
  sortOrder?: Maybe<Scalars['Int']>;
  alt: Scalars['String'];
  type: ProductMediaType;
  oembedData: Scalars['JSONString'];
  /** The URL of the media. */
  url: Scalars['String'];
};


/** Represents a product media. */
export type ProductMediaUrlArgs = {
  size?: Maybe<Scalars['Int']>;
};

/** Deletes product media. */
export type ProductMediaBulkDelete = {
  __typename?: 'ProductMediaBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Create a media object (image or video URL) associated with product. For image, this mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type ProductMediaCreate = {
  __typename?: 'ProductMediaCreate';
  product?: Maybe<Product>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export type ProductMediaCreateInput = {
  /** Alt text for a product media. */
  alt?: Maybe<Scalars['String']>;
  /** Represents an image file in a multipart request. */
  image?: Maybe<Scalars['Upload']>;
  /** ID of an product. */
  product: Scalars['ID'];
  /** Represents an URL to an external media. */
  mediaUrl?: Maybe<Scalars['String']>;
};

/** Deletes a product media. */
export type ProductMediaDelete = {
  __typename?: 'ProductMediaDelete';
  product?: Maybe<Product>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Changes ordering of the product media. */
export type ProductMediaReorder = {
  __typename?: 'ProductMediaReorder';
  product?: Maybe<Product>;
  media?: Maybe<Array<ProductMedia>>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
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
  product?: Maybe<Product>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export type ProductMediaUpdateInput = {
  /** Alt text for a product media. */
  alt?: Maybe<Scalars['String']>;
};

export type ProductOrder = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
  /**
   * Sort product by the selected attribute's values.
   * Note: this doesn't take translations into account yet.
   */
  attributeId?: Maybe<Scalars['ID']>;
  /** Sort products by the selected field. */
  field?: Maybe<ProductOrderField>;
};

export enum ProductOrderField {
  /** Sort products by name. */
  Name = 'NAME',
  /** Sort products by rank. Note: This option is available only with the `search` filter. */
  Rank = 'RANK',
  /** Sort products by price. */
  Price = 'PRICE',
  /** Sort products by a minimal price of a product's variant. */
  MinimalPrice = 'MINIMAL_PRICE',
  /** Sort products by update date. */
  Date = 'DATE',
  /** Sort products by type. */
  Type = 'TYPE',
  /** Sort products by publication status. */
  Published = 'PUBLISHED',
  /** Sort products by publication date. */
  PublicationDate = 'PUBLICATION_DATE',
  /** Sort products by collection. Note: This option is available only for the `Collection.products` query. */
  Collection = 'COLLECTION',
  /** Sort products by rating. */
  Rating = 'RATING'
}

/** Represents availability of a product in the storefront. */
export type ProductPricingInfo = {
  __typename?: 'ProductPricingInfo';
  /** Whether it is in sale or not. */
  onSale?: Maybe<Scalars['Boolean']>;
  /** The discount amount if in sale (null otherwise). */
  discount?: Maybe<TaxedMoney>;
  /** The discount amount in the local currency. */
  discountLocalCurrency?: Maybe<TaxedMoney>;
  /** The discounted price range of the product variants. */
  priceRange?: Maybe<TaxedMoneyRange>;
  /** The undiscounted price range of the product variants. */
  priceRangeUndiscounted?: Maybe<TaxedMoneyRange>;
  /** The discounted price range of the product variants in the local currency. */
  priceRangeLocalCurrency?: Maybe<TaxedMoneyRange>;
};

/** Reorder product attribute values. */
export type ProductReorderAttributeValues = {
  __typename?: 'ProductReorderAttributeValues';
  /** Product from which attribute values are reordered. */
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export type ProductStockFilterInput = {
  warehouseIds?: Maybe<Array<Scalars['ID']>>;
  quantity?: Maybe<IntRangeInput>;
};

export type ProductTranslatableContent = Node & {
  __typename?: 'ProductTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  /**
   * Description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
  /** Returns translated product fields for the given language code. */
  translation?: Maybe<ProductTranslation>;
  /**
   * Represents an individual item for sale in the storefront.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  product?: Maybe<Product>;
  /** List of product attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
};


export type ProductTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a product. */
export type ProductTranslate = {
  __typename?: 'ProductTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  product?: Maybe<Product>;
};

export type ProductTranslation = Node & {
  __typename?: 'ProductTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['JSONString']>;
  /** Translation language. */
  language: LanguageDisplay;
  /**
   * Translated description of the product (JSON).
   * @deprecated Will be removed in Saleor 4.0. Use the `description` field instead.
   */
  descriptionJson?: Maybe<Scalars['JSONString']>;
};

/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductType = Node & ObjectWithMetadata & {
  __typename?: 'ProductType';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  hasVariants: Scalars['Boolean'];
  isShippingRequired: Scalars['Boolean'];
  isDigital: Scalars['Boolean'];
  weight?: Maybe<Weight>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /**
   * List of products of this type.
   * @deprecated Will be removed in Saleor 4.0. Use the top-level `products` query with the `productTypes` filter.
   */
  products?: Maybe<ProductCountableConnection>;
  /** A type of tax. Assigned by enabled tax gateway */
  taxType?: Maybe<TaxType>;
  /** Variant attributes of that product type. */
  variantAttributes?: Maybe<Array<Maybe<Attribute>>>;
  /** Product attributes of that product type. */
  productAttributes?: Maybe<Array<Maybe<Attribute>>>;
  availableAttributes?: Maybe<AttributeCountableConnection>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeProductsArgs = {
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeVariantAttributesArgs = {
  variantSelection?: Maybe<VariantAttributeScope>;
};


/** Represents a type of product. It defines what attributes are available to products of this type. */
export type ProductTypeAvailableAttributesArgs = {
  filter?: Maybe<AttributeFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** Deletes product types. */
export type ProductTypeBulkDelete = {
  __typename?: 'ProductTypeBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export enum ProductTypeConfigurable {
  Configurable = 'CONFIGURABLE',
  Simple = 'SIMPLE'
}

export type ProductTypeCountableConnection = {
  __typename?: 'ProductTypeCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<ProductTypeCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductTypeCountableEdge = {
  __typename?: 'ProductTypeCountableEdge';
  /** The item at the end of the edge. */
  node: ProductType;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new product type. */
export type ProductTypeCreate = {
  __typename?: 'ProductTypeCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

/** Deletes a product type. */
export type ProductTypeDelete = {
  __typename?: 'ProductTypeDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

export enum ProductTypeEnum {
  Digital = 'DIGITAL',
  Shippable = 'SHIPPABLE'
}

export type ProductTypeFilterInput = {
  search?: Maybe<Scalars['String']>;
  configurable?: Maybe<ProductTypeConfigurable>;
  productType?: Maybe<ProductTypeEnum>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type ProductTypeInput = {
  /** Name of the product type. */
  name?: Maybe<Scalars['String']>;
  /** Product type slug. */
  slug?: Maybe<Scalars['String']>;
  /** Determines if product of this type has multiple variants. This option mainly simplifies product management in the dashboard. There is always at least one variant created under the hood. */
  hasVariants?: Maybe<Scalars['Boolean']>;
  /** List of attributes shared among all product variants. */
  productAttributes?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** List of attributes used to distinguish between different variants of a product. */
  variantAttributes?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Determines if shipping is required for products of this variant. */
  isShippingRequired?: Maybe<Scalars['Boolean']>;
  /** Determines if products are digital. */
  isDigital?: Maybe<Scalars['Boolean']>;
  /** Weight of the ProductType items. */
  weight?: Maybe<Scalars['WeightScalar']>;
  /** Tax rate for enabled tax gateway. */
  taxCode?: Maybe<Scalars['String']>;
};

/** Reorder the attributes of a product type. */
export type ProductTypeReorderAttributes = {
  __typename?: 'ProductTypeReorderAttributes';
  /** Product type from which attributes are reordered. */
  productType?: Maybe<ProductType>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

export enum ProductTypeSortField {
  /** Sort products by name. */
  Name = 'NAME',
  /** Sort products by type. */
  Digital = 'DIGITAL',
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  productType?: Maybe<ProductType>;
};

/** Updates an existing product. */
export type ProductUpdate = {
  __typename?: 'ProductUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  product?: Maybe<Product>;
};

/** Represents a version of a product such as different size or color. */
export type ProductVariant = Node & ObjectWithMetadata & {
  __typename?: 'ProductVariant';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  sku: Scalars['String'];
  product: Product;
  trackInventory: Scalars['Boolean'];
  weight?: Maybe<Weight>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of price information in channels for the product. */
  channelListings?: Maybe<Array<ProductVariantChannelListing>>;
  /** Lists the storefront variant's pricing, the current price and discounts, only meant for displaying. */
  pricing?: Maybe<VariantPricingInfo>;
  /** List of attributes assigned to this variant. */
  attributes: Array<SelectedAttribute>;
  /** Gross margin percentage value. */
  margin?: Maybe<Scalars['Int']>;
  /** Total quantity ordered. */
  quantityOrdered?: Maybe<Scalars['Int']>;
  /** Total revenue generated by a variant in given period of time. Note: this field should be queried using `reportProductSales` query as it uses optimizations suitable for such calculations. */
  revenue?: Maybe<TaxedMoney>;
  /**
   * List of images for the product variant.
   * @deprecated Will be removed in Saleor 4.0. Use the `media` instead.
   */
  images?: Maybe<Array<Maybe<ProductImage>>>;
  /** List of media for the product variant. */
  media?: Maybe<Array<ProductMedia>>;
  /** Returns translated product variant fields for the given language code. */
  translation?: Maybe<ProductVariantTranslation>;
  /** Digital content for the product variant. */
  digitalContent?: Maybe<DigitalContent>;
  /** Stocks for the product variant. */
  stocks?: Maybe<Array<Maybe<Stock>>>;
  /** Quantity of a product available for sale in one checkout. */
  quantityAvailable: Scalars['Int'];
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantPricingArgs = {
  address?: Maybe<AddressInput>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantAttributesArgs = {
  variantSelection?: Maybe<VariantAttributeScope>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantRevenueArgs = {
  period?: Maybe<ReportingPeriod>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantTranslationArgs = {
  languageCode: LanguageCodeEnum;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantStocksArgs = {
  address?: Maybe<AddressInput>;
  countryCode?: Maybe<CountryCode>;
};


/** Represents a version of a product such as different size or color. */
export type ProductVariantQuantityAvailableArgs = {
  address?: Maybe<AddressInput>;
  countryCode?: Maybe<CountryCode>;
};

/** Creates product variants for a given product. */
export type ProductVariantBulkCreate = {
  __typename?: 'ProductVariantBulkCreate';
  /** Returns how many objects were created. */
  count: Scalars['Int'];
  /** List of the created variants. */
  productVariants: Array<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkProductErrors: Array<BulkProductError>;
  errors: Array<BulkProductError>;
};

export type ProductVariantBulkCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<BulkAttributeValueInput>;
  /** Stock keeping unit. */
  sku: Scalars['String'];
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: Maybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: Maybe<Scalars['WeightScalar']>;
  /** Stocks of a product available for sale. */
  stocks?: Maybe<Array<StockInput>>;
  /** List of prices assigned to channels. */
  channelListings?: Maybe<Array<ProductVariantChannelListingAddInput>>;
};

/** Deletes product variants. */
export type ProductVariantBulkDelete = {
  __typename?: 'ProductVariantBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Represents product varaint channel listing. */
export type ProductVariantChannelListing = Node & {
  __typename?: 'ProductVariantChannelListing';
  /** The ID of the object. */
  id: Scalars['ID'];
  channel: Channel;
  price?: Maybe<Money>;
  /** Cost price of the variant. */
  costPrice?: Maybe<Money>;
  /** Gross margin percentage value. */
  margin?: Maybe<Scalars['Int']>;
};

export type ProductVariantChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Price of the particular variant in channel. */
  price: Scalars['PositiveDecimal'];
  /** Cost price of the variant in channel. */
  costPrice?: Maybe<Scalars['PositiveDecimal']>;
};

/** Manage product variant prices in channels. */
export type ProductVariantChannelListingUpdate = {
  __typename?: 'ProductVariantChannelListingUpdate';
  /** An updated product variant instance. */
  variant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productChannelListingErrors: Array<ProductChannelListingError>;
  errors: Array<ProductChannelListingError>;
};

export type ProductVariantCountableConnection = {
  __typename?: 'ProductVariantCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<ProductVariantCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProductVariantCountableEdge = {
  __typename?: 'ProductVariantCountableEdge';
  /** The item at the end of the edge. */
  node: ProductVariant;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new variant for a product. */
export type ProductVariantCreate = {
  __typename?: 'ProductVariantCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantCreateInput = {
  /** List of attributes specific to this variant. */
  attributes: Array<AttributeValueInput>;
  /** Stock keeping unit. */
  sku?: Maybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: Maybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: Maybe<Scalars['WeightScalar']>;
  /** Product ID of which type is the variant. */
  product: Scalars['ID'];
  /** Stocks of a product available for sale. */
  stocks?: Maybe<Array<StockInput>>;
};

/** Deletes a product variant. */
export type ProductVariantDelete = {
  __typename?: 'ProductVariantDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantFilterInput = {
  search?: Maybe<Scalars['String']>;
  sku?: Maybe<Array<Maybe<Scalars['String']>>>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
};

export type ProductVariantInput = {
  /** List of attributes specific to this variant. */
  attributes?: Maybe<Array<AttributeValueInput>>;
  /** Stock keeping unit. */
  sku?: Maybe<Scalars['String']>;
  /** Determines if the inventory of this variant should be tracked. If false, the quantity won't change when customers buy this item. */
  trackInventory?: Maybe<Scalars['Boolean']>;
  /** Weight of the Product Variant. */
  weight?: Maybe<Scalars['WeightScalar']>;
};

/** Reorder the variants of a product. Mutation updates updated_at on product and triggers PRODUCT_UPDATED webhook. */
export type ProductVariantReorder = {
  __typename?: 'ProductVariantReorder';
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Reorder product variant attribute values. */
export type ProductVariantReorderAttributeValues = {
  __typename?: 'ProductVariantReorderAttributeValues';
  /** Product variant from which attribute values are reordered. */
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Set default variant for a product. Mutation triggers PRODUCT_UPDATED webhook. */
export type ProductVariantSetDefault = {
  __typename?: 'ProductVariantSetDefault';
  product?: Maybe<Product>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Creates stocks for product variant. */
export type ProductVariantStocksCreate = {
  __typename?: 'ProductVariantStocksCreate';
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkStockErrors: Array<BulkStockError>;
  errors: Array<BulkStockError>;
};

/** Delete stocks from product variant. */
export type ProductVariantStocksDelete = {
  __typename?: 'ProductVariantStocksDelete';
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  stockErrors: Array<StockError>;
  errors: Array<StockError>;
};

/** Update stocks for product variant. */
export type ProductVariantStocksUpdate = {
  __typename?: 'ProductVariantStocksUpdate';
  /** Updated product variant. */
  productVariant?: Maybe<ProductVariant>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  bulkStockErrors: Array<BulkStockError>;
  errors: Array<BulkStockError>;
};

export type ProductVariantTranslatableContent = Node & {
  __typename?: 'ProductVariantTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Returns translated product variant fields for the given language code. */
  translation?: Maybe<ProductVariantTranslation>;
  /**
   * Represents a version of a product such as different size or color.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  productVariant?: Maybe<ProductVariant>;
  /** List of product variant attribute values that can be translated. */
  attributeValues: Array<AttributeValueTranslatableContent>;
};


export type ProductVariantTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a product variant. */
export type ProductVariantTranslate = {
  __typename?: 'ProductVariantTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  productVariant?: Maybe<ProductVariant>;
};

export type ProductVariantTranslation = Node & {
  __typename?: 'ProductVariantTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Translation language. */
  language: LanguageDisplay;
};

/** Updates an existing variant for product. */
export type ProductVariantUpdate = {
  __typename?: 'ProductVariantUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
  productVariant?: Maybe<ProductVariant>;
};

export type PublishableChannelListingInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Determines if object is visible to customers. */
  isPublished?: Maybe<Scalars['Boolean']>;
  /** Publication date. ISO 8601 standard. */
  publicationDate?: Maybe<Scalars['Date']>;
};

export type Query = {
  __typename?: 'Query';
  /** Look up a webhook by ID. */
  webhook?: Maybe<Webhook>;
  /** List of all available webhook events. */
  webhookEvents?: Maybe<Array<Maybe<WebhookEvent>>>;
  /** Retrieve a sample payload for a given webhook event based on real data. It can be useful for some integrations where sample payload is required. */
  webhookSamplePayload?: Maybe<Scalars['JSONString']>;
  /** Look up a warehouse by ID. */
  warehouse?: Maybe<Warehouse>;
  /** List of warehouses. */
  warehouses?: Maybe<WarehouseCountableConnection>;
  /** Returns a list of all translatable items of a given kind. */
  translations?: Maybe<TranslatableItemConnection>;
  translation?: Maybe<TranslatableItem>;
  /** Look up a stock by ID */
  stock?: Maybe<Stock>;
  /** List of stocks. */
  stocks?: Maybe<StockCountableConnection>;
  /** Return information about the shop. */
  shop: Shop;
  /** Order related settings from site settings. */
  orderSettings?: Maybe<OrderSettings>;
  /** Look up a shipping zone by ID. */
  shippingZone?: Maybe<ShippingZone>;
  /** List of the shop's shipping zones. */
  shippingZones?: Maybe<ShippingZoneCountableConnection>;
  /** Look up digital content by ID. */
  digitalContent?: Maybe<DigitalContent>;
  /** List of digital content. */
  digitalContents?: Maybe<DigitalContentCountableConnection>;
  /** List of the shop's categories. */
  categories?: Maybe<CategoryCountableConnection>;
  /** Look up a category by ID or slug. */
  category?: Maybe<Category>;
  /** Look up a collection by ID. */
  collection?: Maybe<Collection>;
  /** List of the shop's collections. */
  collections?: Maybe<CollectionCountableConnection>;
  /** Look up a product by ID. */
  product?: Maybe<Product>;
  /** List of the shop's products. */
  products?: Maybe<ProductCountableConnection>;
  /** Look up a product type by ID. */
  productType?: Maybe<ProductType>;
  /** List of the shop's product types. */
  productTypes?: Maybe<ProductTypeCountableConnection>;
  /** Look up a product variant by ID or SKU. */
  productVariant?: Maybe<ProductVariant>;
  /** List of product variants. */
  productVariants?: Maybe<ProductVariantCountableConnection>;
  /** List of top selling products. */
  reportProductSales?: Maybe<ProductVariantCountableConnection>;
  /** Look up a payment by ID. */
  payment?: Maybe<Payment>;
  /** List of payments. */
  payments?: Maybe<PaymentCountableConnection>;
  /** Look up a page by ID or slug. */
  page?: Maybe<Page>;
  /** List of the shop's pages. */
  pages?: Maybe<PageCountableConnection>;
  /** Look up a page type by ID. */
  pageType?: Maybe<PageType>;
  /** List of the page types. */
  pageTypes?: Maybe<PageTypeCountableConnection>;
  /** List of activity events to display on homepage (at the moment it only contains order-events). */
  homepageEvents?: Maybe<OrderEventCountableConnection>;
  /** Look up an order by ID. */
  order?: Maybe<Order>;
  /** List of orders. */
  orders?: Maybe<OrderCountableConnection>;
  /** List of draft orders. */
  draftOrders?: Maybe<OrderCountableConnection>;
  /** Return the total sales amount from a specific period. */
  ordersTotal?: Maybe<TaxedMoney>;
  /** Look up an order by token. */
  orderByToken?: Maybe<Order>;
  /** Look up a navigation menu by ID or name. */
  menu?: Maybe<Menu>;
  /** List of the storefront's menus. */
  menus?: Maybe<MenuCountableConnection>;
  /** Look up a menu item by ID. */
  menuItem?: Maybe<MenuItem>;
  /** List of the storefronts's menu items. */
  menuItems?: Maybe<MenuItemCountableConnection>;
  /** Look up a gift card by ID. */
  giftCard?: Maybe<GiftCard>;
  /** List of gift cards. */
  giftCards?: Maybe<GiftCardCountableConnection>;
  /** Look up a plugin by ID. */
  plugin?: Maybe<Plugin>;
  /** List of plugins. */
  plugins?: Maybe<PluginCountableConnection>;
  /** Look up a sale by ID. */
  sale?: Maybe<Sale>;
  /** List of the shop's sales. */
  sales?: Maybe<SaleCountableConnection>;
  /** Look up a voucher by ID. */
  voucher?: Maybe<Voucher>;
  /** List of the shop's vouchers. */
  vouchers?: Maybe<VoucherCountableConnection>;
  /** Look up a export file by ID. */
  exportFile?: Maybe<ExportFile>;
  /** List of export files. */
  exportFiles?: Maybe<ExportFileCountableConnection>;
  /** List of all tax rates available from tax gateway. */
  taxTypes?: Maybe<Array<Maybe<TaxType>>>;
  /** Look up a checkout by token and slug of channel. */
  checkout?: Maybe<Checkout>;
  /** List of checkouts. */
  checkouts?: Maybe<CheckoutCountableConnection>;
  /** List of checkout lines. */
  checkoutLines?: Maybe<CheckoutLineCountableConnection>;
  /** Look up a channel by ID. */
  channel?: Maybe<Channel>;
  /** List of all channels. */
  channels?: Maybe<Array<Channel>>;
  /** List of the shop's attributes. */
  attributes?: Maybe<AttributeCountableConnection>;
  /** Look up an attribute by ID. */
  attribute?: Maybe<Attribute>;
  /** List of all apps installations */
  appsInstallations: Array<AppInstallation>;
  /** List of the apps. */
  apps?: Maybe<AppCountableConnection>;
  /** Look up an app by ID. If ID is not provided, return the currently authenticated app. */
  app?: Maybe<App>;
  /** Returns address validation rules. */
  addressValidationRules?: Maybe<AddressValidationData>;
  /** Look up an address by ID. */
  address?: Maybe<Address>;
  /** List of the shop's customers. */
  customers?: Maybe<UserCountableConnection>;
  /** List of permission groups. */
  permissionGroups?: Maybe<GroupCountableConnection>;
  /** Look up permission group by ID. */
  permissionGroup?: Maybe<Group>;
  /** Return the currently authenticated user. */
  me?: Maybe<User>;
  /** List of the shop's staff users. */
  staffUsers?: Maybe<UserCountableConnection>;
  /** Look up a user by ID or email address. */
  user?: Maybe<User>;
  _entities?: Maybe<Array<Maybe<_Entity>>>;
  _service?: Maybe<_Service>;
};


export type QueryWebhookArgs = {
  id: Scalars['ID'];
};


export type QueryWebhookSamplePayloadArgs = {
  eventType: WebhookSampleEventTypeEnum;
};


export type QueryWarehouseArgs = {
  id: Scalars['ID'];
};


export type QueryWarehousesArgs = {
  filter?: Maybe<WarehouseFilterInput>;
  sortBy?: Maybe<WarehouseSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryTranslationsArgs = {
  kind: TranslatableKinds;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryTranslationArgs = {
  id: Scalars['ID'];
  kind: TranslatableKinds;
};


export type QueryStockArgs = {
  id: Scalars['ID'];
};


export type QueryStocksArgs = {
  filter?: Maybe<StockFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryShippingZoneArgs = {
  id: Scalars['ID'];
  channel?: Maybe<Scalars['String']>;
};


export type QueryShippingZonesArgs = {
  filter?: Maybe<ShippingZoneFilterInput>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryDigitalContentArgs = {
  id: Scalars['ID'];
};


export type QueryDigitalContentsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCategoriesArgs = {
  filter?: Maybe<CategoryFilterInput>;
  sortBy?: Maybe<CategorySortingInput>;
  level?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCategoryArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryCollectionArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
};


export type QueryCollectionsArgs = {
  filter?: Maybe<CollectionFilterInput>;
  sortBy?: Maybe<CollectionSortingInput>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryProductArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
};


export type QueryProductsArgs = {
  filter?: Maybe<ProductFilterInput>;
  sortBy?: Maybe<ProductOrder>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryProductTypeArgs = {
  id: Scalars['ID'];
};


export type QueryProductTypesArgs = {
  filter?: Maybe<ProductTypeFilterInput>;
  sortBy?: Maybe<ProductTypeSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryProductVariantArgs = {
  id?: Maybe<Scalars['ID']>;
  sku?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
};


export type QueryProductVariantsArgs = {
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  channel?: Maybe<Scalars['String']>;
  filter?: Maybe<ProductVariantFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryReportProductSalesArgs = {
  period: ReportingPeriod;
  channel: Scalars['String'];
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryPaymentArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentsArgs = {
  filter?: Maybe<PaymentFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryPageArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryPagesArgs = {
  sortBy?: Maybe<PageSortingInput>;
  filter?: Maybe<PageFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryPageTypeArgs = {
  id: Scalars['ID'];
};


export type QueryPageTypesArgs = {
  sortBy?: Maybe<PageTypeSortingInput>;
  filter?: Maybe<PageTypeFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryHomepageEventsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  sortBy?: Maybe<OrderSortingInput>;
  filter?: Maybe<OrderFilterInput>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryDraftOrdersArgs = {
  sortBy?: Maybe<OrderSortingInput>;
  filter?: Maybe<OrderDraftFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryOrdersTotalArgs = {
  period?: Maybe<ReportingPeriod>;
  channel?: Maybe<Scalars['String']>;
};


export type QueryOrderByTokenArgs = {
  token: Scalars['UUID'];
};


export type QueryMenuArgs = {
  channel?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryMenusArgs = {
  channel?: Maybe<Scalars['String']>;
  sortBy?: Maybe<MenuSortingInput>;
  filter?: Maybe<MenuFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryMenuItemArgs = {
  id: Scalars['ID'];
  channel?: Maybe<Scalars['String']>;
};


export type QueryMenuItemsArgs = {
  channel?: Maybe<Scalars['String']>;
  sortBy?: Maybe<MenuItemSortingInput>;
  filter?: Maybe<MenuItemFilterInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryGiftCardArgs = {
  id: Scalars['ID'];
};


export type QueryGiftCardsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryPluginArgs = {
  id: Scalars['ID'];
};


export type QueryPluginsArgs = {
  filter?: Maybe<PluginFilterInput>;
  sortBy?: Maybe<PluginSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuerySaleArgs = {
  id: Scalars['ID'];
  channel?: Maybe<Scalars['String']>;
};


export type QuerySalesArgs = {
  filter?: Maybe<SaleFilterInput>;
  sortBy?: Maybe<SaleSortingInput>;
  query?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryVoucherArgs = {
  id: Scalars['ID'];
  channel?: Maybe<Scalars['String']>;
};


export type QueryVouchersArgs = {
  filter?: Maybe<VoucherFilterInput>;
  sortBy?: Maybe<VoucherSortingInput>;
  query?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryExportFileArgs = {
  id: Scalars['ID'];
};


export type QueryExportFilesArgs = {
  filter?: Maybe<ExportFileFilterInput>;
  sortBy?: Maybe<ExportFileSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCheckoutArgs = {
  token?: Maybe<Scalars['UUID']>;
};


export type QueryCheckoutsArgs = {
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCheckoutLinesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryChannelArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryAttributesArgs = {
  filter?: Maybe<AttributeFilterInput>;
  sortBy?: Maybe<AttributeSortingInput>;
  channel?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryAttributeArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryAppsArgs = {
  filter?: Maybe<AppFilterInput>;
  sortBy?: Maybe<AppSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryAppArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryAddressValidationRulesArgs = {
  countryCode: CountryCode;
  countryArea?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  cityArea?: Maybe<Scalars['String']>;
};


export type QueryAddressArgs = {
  id: Scalars['ID'];
};


export type QueryCustomersArgs = {
  filter?: Maybe<CustomerFilterInput>;
  sortBy?: Maybe<UserSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryPermissionGroupsArgs = {
  filter?: Maybe<PermissionGroupFilterInput>;
  sortBy?: Maybe<PermissionGroupSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryPermissionGroupArgs = {
  id: Scalars['ID'];
};


export type QueryStaffUsersArgs = {
  filter?: Maybe<StaffUserInput>;
  sortBy?: Maybe<UserSortingInput>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
};


export type Query_EntitiesArgs = {
  representations?: Maybe<Array<Maybe<Scalars['_Any']>>>;
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
  /** JWT token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

export type ReorderInput = {
  /** The ID of the item to move. */
  id: Scalars['ID'];
  /** The new relative sorting position of the item (from -inf to +inf). 1 moves the item one position forward, -1 moves the item one position backward, 0 leaves the item unchanged. */
  sortOrder?: Maybe<Scalars['Int']>;
};

export enum ReportingPeriod {
  Today = 'TODAY',
  ThisMonth = 'THIS_MONTH'
}

/** Request email change of the logged in user. */
export type RequestEmailChange = {
  __typename?: 'RequestEmailChange';
  /** A user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  type: SaleType;
  startDate: Scalars['DateTime'];
  endDate?: Maybe<Scalars['DateTime']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of categories this sale applies to. */
  categories?: Maybe<CategoryCountableConnection>;
  /** List of collections this sale applies to. */
  collections?: Maybe<CollectionCountableConnection>;
  /** List of products this sale applies to. */
  products?: Maybe<ProductCountableConnection>;
  /** Returns translated sale fields for the given language code. */
  translation?: Maybe<SaleTranslation>;
  /** List of channels available for the sale. */
  channelListings?: Maybe<Array<SaleChannelListing>>;
  /** Sale value. */
  discountValue?: Maybe<Scalars['Float']>;
  /** Currency code for sale. */
  currency?: Maybe<Scalars['String']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleCategoriesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleCollectionsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleProductsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Sales allow creating discounts for categories, collections or products and are visible to all the customers. */
export type SaleTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Adds products, categories, collections to a voucher. */
export type SaleAddCatalogues = {
  __typename?: 'SaleAddCatalogues';
  /** Sale of which catalogue IDs will be modified. */
  sale?: Maybe<Sale>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  channel: Channel;
  discountValue: Scalars['Float'];
  currency: Scalars['String'];
};

export type SaleChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** The value of the discount. */
  discountValue: Scalars['PositiveDecimal'];
};

export type SaleChannelListingInput = {
  /** List of channels to which the sale should be assigned. */
  addChannels?: Maybe<Array<SaleChannelListingAddInput>>;
  /** List of channels from which the sale should be unassigned. */
  removeChannels?: Maybe<Array<Scalars['ID']>>;
};

/** Manage sale's availability in channels. */
export type SaleChannelListingUpdate = {
  __typename?: 'SaleChannelListingUpdate';
  /** An updated sale instance. */
  sale?: Maybe<Sale>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

export type SaleCountableConnection = {
  __typename?: 'SaleCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<SaleCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SaleCountableEdge = {
  __typename?: 'SaleCountableEdge';
  /** The item at the end of the edge. */
  node: Sale;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
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
  status?: Maybe<Array<Maybe<DiscountStatusEnum>>>;
  saleType?: Maybe<DiscountValueTypeEnum>;
  started?: Maybe<DateTimeRangeInput>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
};

export type SaleInput = {
  /** Voucher name. */
  name?: Maybe<Scalars['String']>;
  /** Fixed or percentage. */
  type?: Maybe<DiscountValueTypeEnum>;
  /** Value of the voucher. */
  value?: Maybe<Scalars['PositiveDecimal']>;
  /** Products related to the discount. */
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Categories related to the discount. */
  categories?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Collections related to the discount. */
  collections?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Start date of the voucher in ISO 8601 format. */
  startDate?: Maybe<Scalars['DateTime']>;
  /** End date of the voucher in ISO 8601 format. */
  endDate?: Maybe<Scalars['DateTime']>;
};

/** Removes products, categories, collections from a sale. */
export type SaleRemoveCatalogues = {
  __typename?: 'SaleRemoveCatalogues';
  /** Sale of which catalogue IDs will be modified. */
  sale?: Maybe<Sale>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

export enum SaleSortField {
  /** Sort sales by name. */
  Name = 'NAME',
  /** Sort sales by start date. */
  StartDate = 'START_DATE',
  /** Sort sales by end date. */
  EndDate = 'END_DATE',
  /** Sort sales by value. */
  Value = 'VALUE',
  /** Sort sales by type. */
  Type = 'TYPE'
}

export type SaleSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
  /** Sort sales by the selected field. */
  field: SaleSortField;
};

export type SaleTranslatableContent = Node & {
  __typename?: 'SaleTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Returns translated sale fields for the given language code. */
  translation?: Maybe<SaleTranslation>;
  /**
   * Sales allow creating discounts for categories, collections or products and are visible to all the customers.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  sale?: Maybe<Sale>;
};


export type SaleTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Creates/updates translations for a sale. */
export type SaleTranslate = {
  __typename?: 'SaleTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  sale?: Maybe<Sale>;
};

export type SaleTranslation = Node & {
  __typename?: 'SaleTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Translation language. */
  language: LanguageDisplay;
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
  /** SEO title. */
  title?: Maybe<Scalars['String']>;
  /** SEO description. */
  description?: Maybe<Scalars['String']>;
};

/** Sets the user's password from the token sent by email using the RequestPasswordReset mutation. */
export type SetPassword = {
  __typename?: 'SetPassword';
  /** JWT token, required to authenticate. */
  token?: Maybe<Scalars['String']>;
  /** JWT refresh token, required to re-generate access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** CSRF token required to re-generate access token. */
  csrfToken?: Maybe<Scalars['String']>;
  /** A user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

export type ShippingError = {
  __typename?: 'ShippingError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ShippingErrorCode;
  /** List of warehouse IDs which causes the error. */
  warehouses?: Maybe<Array<Scalars['ID']>>;
  /** List of channels IDs which causes the error. */
  channels?: Maybe<Array<Scalars['ID']>>;
};

/** An enumeration. */
export enum ShippingErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  MaxLessThanMin = 'MAX_LESS_THAN_MIN',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE',
  DuplicatedInputItem = 'DUPLICATED_INPUT_ITEM'
}

/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethod = Node & ObjectWithMetadata & {
  __typename?: 'ShippingMethod';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  minimumOrderWeight?: Maybe<Weight>;
  maximumOrderWeight?: Maybe<Weight>;
  maximumDeliveryDays?: Maybe<Scalars['Int']>;
  minimumDeliveryDays?: Maybe<Scalars['Int']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Type of the shipping method. */
  type?: Maybe<ShippingMethodTypeEnum>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
  /** List of channels available for the method. */
  channelListings?: Maybe<Array<ShippingMethodChannelListing>>;
  /** The price of the cheapest variant (including discounts). */
  price?: Maybe<Money>;
  /** The price of the cheapest variant (including discounts). */
  maximumOrderPrice?: Maybe<Money>;
  /** The price of the cheapest variant (including discounts). */
  minimumOrderPrice?: Maybe<Money>;
  /** Postal code ranges rule of exclusion or inclusion of the shipping method. */
  postalCodeRules?: Maybe<Array<Maybe<ShippingMethodPostalCodeRule>>>;
  /** List of excluded products for the shipping method. */
  excludedProducts?: Maybe<ProductCountableConnection>;
};


/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodTranslationArgs = {
  languageCode: LanguageCodeEnum;
};


/** Shipping method are the methods you'll use to get customer's orders to them. They are directly exposed to the customers. */
export type ShippingMethodExcludedProductsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** Represents shipping method channel listing. */
export type ShippingMethodChannelListing = Node & {
  __typename?: 'ShippingMethodChannelListing';
  /** The ID of the object. */
  id: Scalars['ID'];
  channel: Channel;
  minimumOrderPrice?: Maybe<Money>;
  maximumOrderPrice?: Maybe<Money>;
  price?: Maybe<Money>;
};

export type ShippingMethodChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Shipping price of the shipping method in this channel. */
  price?: Maybe<Scalars['PositiveDecimal']>;
  /** Minimum order price to use this shipping method. */
  minimumOrderPrice?: Maybe<Scalars['PositiveDecimal']>;
  /** Maximum order price to use this shipping method. */
  maximumOrderPrice?: Maybe<Scalars['PositiveDecimal']>;
};

export type ShippingMethodChannelListingInput = {
  /** List of channels to which the shipping method should be assigned. */
  addChannels?: Maybe<Array<ShippingMethodChannelListingAddInput>>;
  /** List of channels from which the shipping method should be unassigned. */
  removeChannels?: Maybe<Array<Scalars['ID']>>;
};

/** Manage shipping method's availability in channels. */
export type ShippingMethodChannelListingUpdate = {
  __typename?: 'ShippingMethodChannelListingUpdate';
  /** An updated shipping method instance. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

/** Represents shipping method postal code rule. */
export type ShippingMethodPostalCodeRule = Node & {
  __typename?: 'ShippingMethodPostalCodeRule';
  /** Start address range. */
  start?: Maybe<Scalars['String']>;
  /** End address range. */
  end?: Maybe<Scalars['String']>;
  /** Inclusion type of the postal code rule. */
  inclusionType?: Maybe<PostalCodeRuleInclusionTypeEnum>;
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type ShippingMethodTranslatableContent = Node & {
  __typename?: 'ShippingMethodTranslatableContent';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['JSONString']>;
  /** Returns translated shipping method fields for the given language code. */
  translation?: Maybe<ShippingMethodTranslation>;
  /**
   * Shipping method are the methods you'll use to get customer's orders  to them. They are directly exposed to the customers.
   * @deprecated Will be removed in Saleor 4.0. Get model fields from the root level.
   */
  shippingMethod?: Maybe<ShippingMethod>;
};


export type ShippingMethodTranslatableContentTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

export type ShippingMethodTranslation = Node & {
  __typename?: 'ShippingMethodTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['JSONString']>;
  /** Translation language. */
  language: LanguageDisplay;
};

/** An enumeration. */
export enum ShippingMethodTypeEnum {
  Price = 'PRICE',
  Weight = 'WEIGHT'
}

export type ShippingPostalCodeRulesCreateInputRange = {
  /** Start range of the postal code. */
  start: Scalars['String'];
  /** End range of the postal code. */
  end?: Maybe<Scalars['String']>;
};

/** Deletes shipping prices. */
export type ShippingPriceBulkDelete = {
  __typename?: 'ShippingPriceBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

/** Creates a new shipping price. */
export type ShippingPriceCreate = {
  __typename?: 'ShippingPriceCreate';
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

/** Deletes a shipping price. */
export type ShippingPriceDelete = {
  __typename?: 'ShippingPriceDelete';
  /** A shipping method to delete. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

/** Exclude products from shipping price. */
export type ShippingPriceExcludeProducts = {
  __typename?: 'ShippingPriceExcludeProducts';
  /** A shipping method with new list of excluded products. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

export type ShippingPriceExcludeProductsInput = {
  /** List of products which will be excluded. */
  products: Array<Maybe<Scalars['ID']>>;
};

export type ShippingPriceInput = {
  /** Name of the shipping method. */
  name?: Maybe<Scalars['String']>;
  /** Shipping method description (JSON). */
  description?: Maybe<Scalars['JSONString']>;
  /** Minimum order weight to use this shipping method. */
  minimumOrderWeight?: Maybe<Scalars['WeightScalar']>;
  /** Maximum order weight to use this shipping method. */
  maximumOrderWeight?: Maybe<Scalars['WeightScalar']>;
  /** Maximum number of days for delivery. */
  maximumDeliveryDays?: Maybe<Scalars['Int']>;
  /** Minimal number of days for delivery. */
  minimumDeliveryDays?: Maybe<Scalars['Int']>;
  /** Shipping type: price or weight based. */
  type?: Maybe<ShippingMethodTypeEnum>;
  /** Shipping zone this method belongs to. */
  shippingZone?: Maybe<Scalars['ID']>;
  /** Postal code rules to add. */
  addPostalCodeRules?: Maybe<Array<ShippingPostalCodeRulesCreateInputRange>>;
  /** Postal code rules to delete. */
  deletePostalCodeRules?: Maybe<Array<Scalars['ID']>>;
  /** Inclusion type for currently assigned postal code rules. */
  inclusionType?: Maybe<PostalCodeRuleInclusionTypeEnum>;
};

/** Remove product from excluded list for shipping price. */
export type ShippingPriceRemoveProductFromExclude = {
  __typename?: 'ShippingPriceRemoveProductFromExclude';
  /** A shipping method with new list of excluded products. */
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

/** Creates/updates translations for a shipping method. */
export type ShippingPriceTranslate = {
  __typename?: 'ShippingPriceTranslate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  shippingMethod?: Maybe<ShippingMethod>;
};

export type ShippingPriceTranslationInput = {
  name?: Maybe<Scalars['String']>;
  /** Translated shipping method description (JSON). */
  description?: Maybe<Scalars['JSONString']>;
};

/** Updates a new shipping price. */
export type ShippingPriceUpdate = {
  __typename?: 'ShippingPriceUpdate';
  /** A shipping zone to which the shipping method belongs. */
  shippingZone?: Maybe<ShippingZone>;
  shippingMethod?: Maybe<ShippingMethod>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

/** Represents a shipping zone in the shop. Zones are the concept used only for grouping shipping methods in the dashboard, and are never exposed to the customers directly. */
export type ShippingZone = Node & ObjectWithMetadata & {
  __typename?: 'ShippingZone';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  default: Scalars['Boolean'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** Lowest and highest prices for the shipping. */
  priceRange?: Maybe<MoneyRange>;
  /** List of countries available for the method. */
  countries?: Maybe<Array<Maybe<CountryDisplay>>>;
  /** List of shipping methods available for orders shipped to countries within this shipping zone. */
  shippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  /** List of warehouses for shipping zone. */
  warehouses: Array<Warehouse>;
  /** List of channels for shipping zone. */
  channels: Array<Channel>;
  /** Description of a shipping zone. */
  description?: Maybe<Scalars['String']>;
};

/** Deletes shipping zones. */
export type ShippingZoneBulkDelete = {
  __typename?: 'ShippingZoneBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
};

export type ShippingZoneCountableConnection = {
  __typename?: 'ShippingZoneCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<ShippingZoneCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ShippingZoneCountableEdge = {
  __typename?: 'ShippingZoneCountableEdge';
  /** The item at the end of the edge. */
  node: ShippingZone;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates a new shipping zone. */
export type ShippingZoneCreate = {
  __typename?: 'ShippingZoneCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
  shippingZone?: Maybe<ShippingZone>;
};

export type ShippingZoneCreateInput = {
  /** Shipping zone's name. Visible only to the staff. */
  name?: Maybe<Scalars['String']>;
  /** Description of the shipping zone. */
  description?: Maybe<Scalars['String']>;
  /** List of countries in this shipping zone. */
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Default shipping zone will be used for countries not covered by other zones. */
  default?: Maybe<Scalars['Boolean']>;
  /** List of warehouses to assign to a shipping zone */
  addWarehouses?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** List of channels to assign to the shipping zone. */
  addChannels?: Maybe<Array<Scalars['ID']>>;
};

/** Deletes a shipping zone. */
export type ShippingZoneDelete = {
  __typename?: 'ShippingZoneDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
  shippingZone?: Maybe<ShippingZone>;
};

export type ShippingZoneFilterInput = {
  search?: Maybe<Scalars['String']>;
  channels?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Updates a new shipping zone. */
export type ShippingZoneUpdate = {
  __typename?: 'ShippingZoneUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shippingErrors: Array<ShippingError>;
  errors: Array<ShippingError>;
  shippingZone?: Maybe<ShippingZone>;
};

export type ShippingZoneUpdateInput = {
  /** Shipping zone's name. Visible only to the staff. */
  name?: Maybe<Scalars['String']>;
  /** Description of the shipping zone. */
  description?: Maybe<Scalars['String']>;
  /** List of countries in this shipping zone. */
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Default shipping zone will be used for countries not covered by other zones. */
  default?: Maybe<Scalars['Boolean']>;
  /** List of warehouses to assign to a shipping zone */
  addWarehouses?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** List of channels to assign to the shipping zone. */
  addChannels?: Maybe<Array<Scalars['ID']>>;
  /** List of warehouses to unassign from a shipping zone */
  removeWarehouses?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** List of channels to unassign from the shipping zone. */
  removeChannels?: Maybe<Array<Scalars['ID']>>;
};

/** Represents a shop resource containing general shop data and configuration. */
export type Shop = {
  __typename?: 'Shop';
  /** List of available payment gateways. */
  availablePaymentGateways: Array<PaymentGateway>;
  /** List of available external authentications. */
  availableExternalAuthentications: Array<ExternalAuthentication>;
  /** Shipping methods that are available for the shop. */
  availableShippingMethods?: Maybe<Array<Maybe<ShippingMethod>>>;
  /** List of countries available in the shop. */
  countries: Array<CountryDisplay>;
  /** Shop's default country. */
  defaultCountry?: Maybe<CountryDisplay>;
  /** Default shop's email sender's name. */
  defaultMailSenderName?: Maybe<Scalars['String']>;
  /** Default shop's email sender's address. */
  defaultMailSenderAddress?: Maybe<Scalars['String']>;
  /** Shop's description. */
  description?: Maybe<Scalars['String']>;
  /** Shop's domain data. */
  domain: Domain;
  /** List of the shops's supported languages. */
  languages: Array<Maybe<LanguageDisplay>>;
  /** Shop's name. */
  name: Scalars['String'];
  /** List of available permissions. */
  permissions: Array<Maybe<Permission>>;
  /** List of possible phone prefixes. */
  phonePrefixes: Array<Maybe<Scalars['String']>>;
  /** Header text. */
  headerText?: Maybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices: Scalars['Boolean'];
  /** Display prices with tax in store. */
  displayGrossPrices: Scalars['Boolean'];
  /** Charge taxes on shipping. */
  chargeTaxesOnShipping: Scalars['Boolean'];
  /** Enable inventory tracking. */
  trackInventoryByDefault?: Maybe<Scalars['Boolean']>;
  /** Default weight unit. */
  defaultWeightUnit?: Maybe<WeightUnitsEnum>;
  /** Returns translated shop fields for the given language code. */
  translation?: Maybe<ShopTranslation>;
  /** Enable automatic fulfillment for all digital products. */
  automaticFulfillmentDigitalProducts?: Maybe<Scalars['Boolean']>;
  /** Default number of max downloads per digital content URL. */
  defaultDigitalMaxDownloads?: Maybe<Scalars['Int']>;
  /** Default number of days which digital content URL will be valid. */
  defaultDigitalUrlValidDays?: Maybe<Scalars['Int']>;
  /** Company address. */
  companyAddress?: Maybe<Address>;
  /** URL of a view where customers can set their password. */
  customerSetPasswordUrl?: Maybe<Scalars['String']>;
  /** List of staff notification recipients. */
  staffNotificationRecipients?: Maybe<Array<Maybe<StaffNotificationRecipient>>>;
  /** Resource limitations and current usage if any set for a shop */
  limits: LimitInfo;
  /** Saleor API version. */
  version: Scalars['String'];
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopAvailablePaymentGatewaysArgs = {
  currency?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopAvailableShippingMethodsArgs = {
  channel: Scalars['String'];
  address?: Maybe<AddressInput>;
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopCountriesArgs = {
  languageCode?: Maybe<LanguageCodeEnum>;
};


/** Represents a shop resource containing general shop data and configuration. */
export type ShopTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Update the shop's address. If the `null` value is passed, the currently selected address will be deleted. */
export type ShopAddressUpdate = {
  __typename?: 'ShopAddressUpdate';
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
};

/** Updates site domain of the shop. */
export type ShopDomainUpdate = {
  __typename?: 'ShopDomainUpdate';
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
};

export type ShopError = {
  __typename?: 'ShopError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: ShopErrorCode;
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
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
};

export type ShopSettingsInput = {
  /** Header text. */
  headerText?: Maybe<Scalars['String']>;
  /** SEO description. */
  description?: Maybe<Scalars['String']>;
  /** Include taxes in prices. */
  includeTaxesInPrices?: Maybe<Scalars['Boolean']>;
  /** Display prices with tax in store. */
  displayGrossPrices?: Maybe<Scalars['Boolean']>;
  /** Charge taxes on shipping. */
  chargeTaxesOnShipping?: Maybe<Scalars['Boolean']>;
  /** Enable inventory tracking. */
  trackInventoryByDefault?: Maybe<Scalars['Boolean']>;
  /** Default weight unit. */
  defaultWeightUnit?: Maybe<WeightUnitsEnum>;
  /** Enable automatic fulfillment for all digital products. */
  automaticFulfillmentDigitalProducts?: Maybe<Scalars['Boolean']>;
  /** Default number of max downloads per digital content URL. */
  defaultDigitalMaxDownloads?: Maybe<Scalars['Int']>;
  /** Default number of days which digital content URL will be valid. */
  defaultDigitalUrlValidDays?: Maybe<Scalars['Int']>;
  /** Default email sender's name. */
  defaultMailSenderName?: Maybe<Scalars['String']>;
  /** Default email sender's address. */
  defaultMailSenderAddress?: Maybe<Scalars['String']>;
  /** URL of a view where customers can set their password. */
  customerSetPasswordUrl?: Maybe<Scalars['String']>;
};

/** Creates/updates translations for shop settings. */
export type ShopSettingsTranslate = {
  __typename?: 'ShopSettingsTranslate';
  /** Updated shop settings. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
};

export type ShopSettingsTranslationInput = {
  headerText?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

/** Updates shop settings. */
export type ShopSettingsUpdate = {
  __typename?: 'ShopSettingsUpdate';
  /** Updated shop. */
  shop?: Maybe<Shop>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
};

export type ShopTranslation = Node & {
  __typename?: 'ShopTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  headerText: Scalars['String'];
  description: Scalars['String'];
  /** Translation language. */
  language: LanguageDisplay;
};

export type SiteDomainInput = {
  /** Domain name for shop. */
  domain?: Maybe<Scalars['String']>;
  /** Shop site name. */
  name?: Maybe<Scalars['String']>;
};

/** Deletes staff users. */
export type StaffBulkDelete = {
  __typename?: 'StaffBulkDelete';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: Array<StaffError>;
  errors: Array<StaffError>;
};

/** Creates a new staff user. */
export type StaffCreate = {
  __typename?: 'StaffCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: Array<StaffError>;
  errors: Array<StaffError>;
  user?: Maybe<User>;
};

export type StaffCreateInput = {
  /** Given name. */
  firstName?: Maybe<Scalars['String']>;
  /** Family name. */
  lastName?: Maybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** User account is active. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: Maybe<Scalars['String']>;
  /** List of permission group IDs to which user should be assigned. */
  addGroups?: Maybe<Array<Scalars['ID']>>;
  /** URL of a view where users should be redirected to set the password. URL in RFC 1808 format. */
  redirectUrl?: Maybe<Scalars['String']>;
};

/** Deletes a staff user. */
export type StaffDelete = {
  __typename?: 'StaffDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: Array<StaffError>;
  errors: Array<StaffError>;
  user?: Maybe<User>;
};

export type StaffError = {
  __typename?: 'StaffError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: AccountErrorCode;
  /** A type of address that causes the error. */
  addressType?: Maybe<AddressTypeEnum>;
  /** List of permissions which causes the error. */
  permissions?: Maybe<Array<PermissionEnum>>;
  /** List of permission group IDs which cause the error. */
  groups?: Maybe<Array<Scalars['ID']>>;
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
  /** Returns a user subscribed to email notifications. */
  user?: Maybe<User>;
  /** Determines if a notification active. */
  active?: Maybe<Scalars['Boolean']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Returns email address of a user subscribed to email notifications. */
  email?: Maybe<Scalars['String']>;
};

/** Creates a new staff notification recipient. */
export type StaffNotificationRecipientCreate = {
  __typename?: 'StaffNotificationRecipientCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

/** Delete staff notification recipient. */
export type StaffNotificationRecipientDelete = {
  __typename?: 'StaffNotificationRecipientDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

export type StaffNotificationRecipientInput = {
  /** The ID of the user subscribed to email notifications.. */
  user?: Maybe<Scalars['ID']>;
  /** Email address of a user subscribed to email notifications. */
  email?: Maybe<Scalars['String']>;
  /** Determines if a notification active. */
  active?: Maybe<Scalars['Boolean']>;
};

/** Updates a staff notification recipient. */
export type StaffNotificationRecipientUpdate = {
  __typename?: 'StaffNotificationRecipientUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  shopErrors: Array<ShopError>;
  errors: Array<ShopError>;
  staffNotificationRecipient?: Maybe<StaffNotificationRecipient>;
};

/** Updates an existing staff user. */
export type StaffUpdate = {
  __typename?: 'StaffUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  staffErrors: Array<StaffError>;
  errors: Array<StaffError>;
  user?: Maybe<User>;
};

export type StaffUpdateInput = {
  /** Given name. */
  firstName?: Maybe<Scalars['String']>;
  /** Family name. */
  lastName?: Maybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** User account is active. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: Maybe<Scalars['String']>;
  /** List of permission group IDs to which user should be assigned. */
  addGroups?: Maybe<Array<Scalars['ID']>>;
  /** List of permission group IDs from which user should be unassigned. */
  removeGroups?: Maybe<Array<Scalars['ID']>>;
};

export type StaffUserInput = {
  status?: Maybe<StaffMemberStatus>;
  search?: Maybe<Scalars['String']>;
};

/** Represents stock. */
export type Stock = Node & {
  __typename?: 'Stock';
  warehouse: Warehouse;
  productVariant: ProductVariant;
  /** Quantity of a product in the warehouse's possession, including the allocated stock that is waiting for shipment. */
  quantity: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Quantity allocated for orders */
  quantityAllocated: Scalars['Int'];
};

export enum StockAvailability {
  InStock = 'IN_STOCK',
  OutOfStock = 'OUT_OF_STOCK'
}

export type StockCountableConnection = {
  __typename?: 'StockCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<StockCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type StockCountableEdge = {
  __typename?: 'StockCountableEdge';
  /** The item at the end of the edge. */
  node: Stock;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

export type StockError = {
  __typename?: 'StockError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: StockErrorCode;
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
  quantity?: Maybe<Scalars['Float']>;
  search?: Maybe<Scalars['String']>;
};

export type StockInput = {
  /** Warehouse in which stock is located. */
  warehouse: Scalars['ID'];
  /** Quantity of items available for sell. */
  quantity: Scalars['Int'];
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
  /** The ID of the object. */
  id: Scalars['ID'];
  created: Scalars['DateTime'];
  payment: Payment;
  token: Scalars['String'];
  kind: TransactionKind;
  isSuccess: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  gatewayResponse: Scalars['JSONString'];
  /** Total amount of the transaction. */
  amount?: Maybe<Money>;
};

/** An enumeration. */
export enum TransactionKind {
  /** External reference */
  External = 'EXTERNAL',
  /** Authorization */
  Auth = 'AUTH',
  /** Pending */
  Pending = 'PENDING',
  /** Action to confirm */
  ActionToConfirm = 'ACTION_TO_CONFIRM',
  /** Refund */
  Refund = 'REFUND',
  /** Refund in progress */
  RefundOngoing = 'REFUND_ONGOING',
  /** Capture */
  Capture = 'CAPTURE',
  /** Void */
  Void = 'VOID',
  /** Confirm */
  Confirm = 'CONFIRM',
  /** Cancel */
  Cancel = 'CANCEL'
}

export type TranslatableItem = ProductTranslatableContent | CollectionTranslatableContent | CategoryTranslatableContent | AttributeTranslatableContent | AttributeValueTranslatableContent | ProductVariantTranslatableContent | PageTranslatableContent | ShippingMethodTranslatableContent | SaleTranslatableContent | VoucherTranslatableContent | MenuItemTranslatableContent;

export type TranslatableItemConnection = {
  __typename?: 'TranslatableItemConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<TranslatableItemEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type TranslatableItemEdge = {
  __typename?: 'TranslatableItemEdge';
  /** The item at the end of the edge. */
  node: TranslatableItem;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
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
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: TranslationErrorCode;
};

/** An enumeration. */
export enum TranslationErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED'
}

export type TranslationInput = {
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['JSONString']>;
};


export type UpdateInvoiceInput = {
  /** Invoice number */
  number?: Maybe<Scalars['String']>;
  /** URL of an invoice to download. */
  url?: Maybe<Scalars['String']>;
};

/** Updates metadata of an object. */
export type UpdateMetadata = {
  __typename?: 'UpdateMetadata';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
};

/** Updates private metadata of an object. */
export type UpdatePrivateMetadata = {
  __typename?: 'UpdatePrivateMetadata';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  metadataErrors: Array<MetadataError>;
  errors: Array<MetadataError>;
  item?: Maybe<ObjectWithMetadata>;
};


export type UploadError = {
  __typename?: 'UploadError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: UploadErrorCode;
};

/** An enumeration. */
export enum UploadErrorCode {
  GraphqlError = 'GRAPHQL_ERROR'
}

/** Represents user data. */
export type User = Node & ObjectWithMetadata & {
  __typename?: 'User';
  /** The ID of the object. */
  id: Scalars['ID'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isStaff: Scalars['Boolean'];
  isActive: Scalars['Boolean'];
  /** A note about the customer. */
  note?: Maybe<Scalars['String']>;
  dateJoined: Scalars['DateTime'];
  defaultShippingAddress?: Maybe<Address>;
  defaultBillingAddress?: Maybe<Address>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of all user's addresses. */
  addresses?: Maybe<Array<Maybe<Address>>>;
  /**
   * Returns the last open checkout of this user.
   * @deprecated Will be removed in Saleor 4.0. Use the `checkout_tokens` field to fetch the user checkouts.
   */
  checkout?: Maybe<Checkout>;
  /** Returns the checkout UUID's assigned to this user. */
  checkoutTokens?: Maybe<Array<Scalars['UUID']>>;
  /** List of the user gift cards. */
  giftCards?: Maybe<GiftCardCountableConnection>;
  /** List of user's orders. */
  orders?: Maybe<OrderCountableConnection>;
  /** List of user's permissions. */
  userPermissions?: Maybe<Array<Maybe<UserPermission>>>;
  /** List of user's permission groups. */
  permissionGroups?: Maybe<Array<Maybe<Group>>>;
  /** List of user's permission groups which user can manage. */
  editableGroups?: Maybe<Array<Maybe<Group>>>;
  avatar?: Maybe<Image>;
  /** List of events associated with the user. */
  events?: Maybe<Array<Maybe<CustomerEvent>>>;
  /** List of stored payment sources. */
  storedPaymentSources?: Maybe<Array<Maybe<PaymentSource>>>;
  /** User language code. */
  languageCode: LanguageCodeEnum;
};


/** Represents user data. */
export type UserCheckoutTokensArgs = {
  channel?: Maybe<Scalars['String']>;
};


/** Represents user data. */
export type UserGiftCardsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserOrdersArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserAvatarArgs = {
  size?: Maybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserStoredPaymentSourcesArgs = {
  channel?: Maybe<Scalars['String']>;
};

/** Deletes a user avatar. Only for staff members. */
export type UserAvatarDelete = {
  __typename?: 'UserAvatarDelete';
  /** An updated user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Create a user avatar. Only for staff members. This mutation must be sent as a `multipart` request. More detailed specs of the upload format can be found here: https://github.com/jaydenseric/graphql-multipart-request-spec */
export type UserAvatarUpdate = {
  __typename?: 'UserAvatarUpdate';
  /** An updated user instance. */
  user?: Maybe<User>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** Activate or deactivate users. */
export type UserBulkSetActive = {
  __typename?: 'UserBulkSetActive';
  /** Returns how many objects were affected. */
  count: Scalars['Int'];
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

export type UserCountableConnection = {
  __typename?: 'UserCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<UserCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type UserCountableEdge = {
  __typename?: 'UserCountableEdge';
  /** The item at the end of the edge. */
  node: User;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

export type UserCreateInput = {
  /** Billing address of the customer. */
  defaultBillingAddress?: Maybe<AddressInput>;
  /** Shipping address of the customer. */
  defaultShippingAddress?: Maybe<AddressInput>;
  /** Given name. */
  firstName?: Maybe<Scalars['String']>;
  /** Family name. */
  lastName?: Maybe<Scalars['String']>;
  /** The unique email address of the user. */
  email?: Maybe<Scalars['String']>;
  /** User account is active. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** A note about the user. */
  note?: Maybe<Scalars['String']>;
  /** User language code. */
  languageCode?: Maybe<LanguageCodeEnum>;
  /** URL of a view where users should be redirected to set the password. URL in RFC 1808 format. */
  redirectUrl?: Maybe<Scalars['String']>;
  /** Slug of a channel which will be used for notify user. Optional when only one channel exists. */
  channel?: Maybe<Scalars['String']>;
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
  /** Sort users by first name. */
  FirstName = 'FIRST_NAME',
  /** Sort users by last name. */
  LastName = 'LAST_NAME',
  /** Sort users by email. */
  Email = 'EMAIL',
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
  /** Standard VAT rate in percent. */
  standardRate?: Maybe<Scalars['Float']>;
  /** Country's VAT rate exceptions for specific types of goods. */
  reducedRates: Array<Maybe<ReducedRate>>;
};

export enum VariantAttributeScope {
  All = 'ALL',
  VariantSelection = 'VARIANT_SELECTION',
  NotVariantSelection = 'NOT_VARIANT_SELECTION'
}

/** Assign an media to a product variant. */
export type VariantMediaAssign = {
  __typename?: 'VariantMediaAssign';
  productVariant?: Maybe<ProductVariant>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Unassign an media from a product variant. */
export type VariantMediaUnassign = {
  __typename?: 'VariantMediaUnassign';
  productVariant?: Maybe<ProductVariant>;
  media?: Maybe<ProductMedia>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  productErrors: Array<ProductError>;
  errors: Array<ProductError>;
};

/** Represents availability of a variant in the storefront. */
export type VariantPricingInfo = {
  __typename?: 'VariantPricingInfo';
  /** Whether it is in sale or not. */
  onSale?: Maybe<Scalars['Boolean']>;
  /** The discount amount if in sale (null otherwise). */
  discount?: Maybe<TaxedMoney>;
  /** The discount amount in the local currency. */
  discountLocalCurrency?: Maybe<TaxedMoney>;
  /** The price, with any discount subtracted. */
  price?: Maybe<TaxedMoney>;
  /** The price without any discount. */
  priceUndiscounted?: Maybe<TaxedMoney>;
  /** The discounted price in the local currency. */
  priceLocalCurrency?: Maybe<TaxedMoney>;
};

/** Verify JWT token. */
export type VerifyToken = {
  __typename?: 'VerifyToken';
  /** User assigned to token. */
  user?: Maybe<User>;
  /** Determine if token is valid or not. */
  isValid: Scalars['Boolean'];
  /** JWT payload. */
  payload?: Maybe<Scalars['GenericScalar']>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  accountErrors: Array<AccountError>;
  errors: Array<AccountError>;
};

/** An enumeration. */
export enum VolumeUnitsEnum {
  CubicMillimeter = 'CUBIC_MILLIMETER',
  CubicCentimeter = 'CUBIC_CENTIMETER',
  CubicDecimeter = 'CUBIC_DECIMETER',
  CubicMeter = 'CUBIC_METER',
  Liter = 'LITER',
  CubicFoot = 'CUBIC_FOOT',
  CubicInch = 'CUBIC_INCH',
  CubicYard = 'CUBIC_YARD',
  Qt = 'QT',
  Pint = 'PINT',
  FlOz = 'FL_OZ',
  AcreIn = 'ACRE_IN',
  AcreFt = 'ACRE_FT'
}

/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type Voucher = Node & ObjectWithMetadata & {
  __typename?: 'Voucher';
  /** The ID of the object. */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Determines a type of voucher. */
  type: VoucherTypeEnum;
  code: Scalars['String'];
  usageLimit?: Maybe<Scalars['Int']>;
  used: Scalars['Int'];
  startDate: Scalars['DateTime'];
  endDate?: Maybe<Scalars['DateTime']>;
  applyOncePerOrder: Scalars['Boolean'];
  applyOncePerCustomer: Scalars['Boolean'];
  onlyForStaff: Scalars['Boolean'];
  /** Determines a type of discount for voucher - value or percentage */
  discountValueType: DiscountValueTypeEnum;
  minCheckoutItemsQuantity?: Maybe<Scalars['Int']>;
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /** List of categories this voucher applies to. */
  categories?: Maybe<CategoryCountableConnection>;
  /** List of collections this voucher applies to. */
  collections?: Maybe<CollectionCountableConnection>;
  /** List of products this voucher applies to. */
  products?: Maybe<ProductCountableConnection>;
  /** List of countries available for the shipping voucher. */
  countries?: Maybe<Array<Maybe<CountryDisplay>>>;
  /** Returns translated voucher fields for the given language code. */
  translation?: Maybe<VoucherTranslation>;
  /** Voucher value. */
  discountValue?: Maybe<Scalars['Float']>;
  /** Currency code for voucher. */
  currency?: Maybe<Scalars['String']>;
  /** Minimum order value to apply voucher. */
  minSpent?: Maybe<Money>;
  /** List of availability in channels for the voucher. */
  channelListings?: Maybe<Array<VoucherChannelListing>>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherCategoriesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherCollectionsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherProductsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Vouchers allow giving discounts to particular customers on categories, collections or specific products. They can be used during checkout by providing valid voucher codes. */
export type VoucherTranslationArgs = {
  languageCode: LanguageCodeEnum;
};

/** Adds products, categories, collections to a voucher. */
export type VoucherAddCatalogues = {
  __typename?: 'VoucherAddCatalogues';
  /** Voucher of which catalogue IDs will be modified. */
  voucher?: Maybe<Voucher>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
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
  /** The ID of the object. */
  id: Scalars['ID'];
  channel: Channel;
  discountValue: Scalars['Float'];
  currency: Scalars['String'];
  minSpent?: Maybe<Money>;
};

export type VoucherChannelListingAddInput = {
  /** ID of a channel. */
  channelId: Scalars['ID'];
  /** Value of the voucher. */
  discountValue?: Maybe<Scalars['PositiveDecimal']>;
  /** Min purchase amount required to apply the voucher. */
  minAmountSpent?: Maybe<Scalars['PositiveDecimal']>;
};

export type VoucherChannelListingInput = {
  /** List of channels to which the voucher should be assigned. */
  addChannels?: Maybe<Array<VoucherChannelListingAddInput>>;
  /** List of channels from which the voucher should be unassigned. */
  removeChannels?: Maybe<Array<Scalars['ID']>>;
};

/** Manage voucher's availability in channels. */
export type VoucherChannelListingUpdate = {
  __typename?: 'VoucherChannelListingUpdate';
  /** An updated voucher instance. */
  voucher?: Maybe<Voucher>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

export type VoucherCountableConnection = {
  __typename?: 'VoucherCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<VoucherCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type VoucherCountableEdge = {
  __typename?: 'VoucherCountableEdge';
  /** The item at the end of the edge. */
  node: Voucher;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
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
  status?: Maybe<Array<Maybe<DiscountStatusEnum>>>;
  timesUsed?: Maybe<IntRangeInput>;
  discountType?: Maybe<Array<Maybe<VoucherDiscountType>>>;
  started?: Maybe<DateTimeRangeInput>;
  search?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataFilter>>>;
};

export type VoucherInput = {
  /** Voucher type: PRODUCT, CATEGORY SHIPPING or ENTIRE_ORDER. */
  type?: Maybe<VoucherTypeEnum>;
  /** Voucher name. */
  name?: Maybe<Scalars['String']>;
  /** Code to use the voucher. */
  code?: Maybe<Scalars['String']>;
  /** Start date of the voucher in ISO 8601 format. */
  startDate?: Maybe<Scalars['DateTime']>;
  /** End date of the voucher in ISO 8601 format. */
  endDate?: Maybe<Scalars['DateTime']>;
  /** Choices: fixed or percentage. */
  discountValueType?: Maybe<DiscountValueTypeEnum>;
  /** Products discounted by the voucher. */
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Collections discounted by the voucher. */
  collections?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Categories discounted by the voucher. */
  categories?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Minimal quantity of checkout items required to apply the voucher. */
  minCheckoutItemsQuantity?: Maybe<Scalars['Int']>;
  /** Country codes that can be used with the shipping voucher. */
  countries?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Voucher should be applied to the cheapest item or entire order. */
  applyOncePerOrder?: Maybe<Scalars['Boolean']>;
  /** Voucher should be applied once per customer. */
  applyOncePerCustomer?: Maybe<Scalars['Boolean']>;
  /** Voucher can be used only by staff user. */
  onlyForStaff?: Maybe<Scalars['Boolean']>;
  /** Limit number of times this voucher can be used in total. */
  usageLimit?: Maybe<Scalars['Int']>;
};

/** Removes products, categories, collections from a voucher. */
export type VoucherRemoveCatalogues = {
  __typename?: 'VoucherRemoveCatalogues';
  /** Voucher of which catalogue IDs will be modified. */
  voucher?: Maybe<Voucher>;
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  discountErrors: Array<DiscountError>;
  errors: Array<DiscountError>;
};

export enum VoucherSortField {
  /** Sort vouchers by code. */
  Code = 'CODE',
  /** Sort vouchers by start date. */
  StartDate = 'START_DATE',
  /** Sort vouchers by end date. */
  EndDate = 'END_DATE',
  /** Sort vouchers by value. */
  Value = 'VALUE',
  /** Sort vouchers by type. */
  Type = 'TYPE',
  /** Sort vouchers by usage limit. */
  UsageLimit = 'USAGE_LIMIT',
  /** Sort vouchers by minimum spent amount. */
  MinimumSpentAmount = 'MINIMUM_SPENT_AMOUNT'
}

export type VoucherSortingInput = {
  /** Specifies the direction in which to sort products. */
  direction: OrderDirection;
  /** Specifies the channel in which to sort the data. DEPRECATED: Will be removed in Saleor 4.0.Use root-level channel argument instead. */
  channel?: Maybe<Scalars['String']>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  translationErrors: Array<TranslationError>;
  errors: Array<TranslationError>;
  voucher?: Maybe<Voucher>;
};

export type VoucherTranslation = Node & {
  __typename?: 'VoucherTranslation';
  /** The ID of the object. */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** Translation language. */
  language: LanguageDisplay;
};

export enum VoucherTypeEnum {
  Shipping = 'SHIPPING',
  EntireOrder = 'ENTIRE_ORDER',
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
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  shippingZones: ShippingZoneCountableConnection;
  address: Address;
  email: Scalars['String'];
  /** List of private metadata items.Requires proper staff permissions to access. */
  privateMetadata: Array<Maybe<MetadataItem>>;
  /** List of public metadata items. Can be accessed without permissions. */
  metadata: Array<Maybe<MetadataItem>>;
  /**
   * Warehouse company name.
   * @deprecated Use address.CompanyName. This field will be removed in Saleor 4.0.
   */
  companyName: Scalars['String'];
};


/** Represents warehouse. */
export type WarehouseShippingZonesArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type WarehouseCountableConnection = {
  __typename?: 'WarehouseCountableConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  edges: Array<WarehouseCountableEdge>;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type WarehouseCountableEdge = {
  __typename?: 'WarehouseCountableEdge';
  /** The item at the end of the edge. */
  node: Warehouse;
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
};

/** Creates new warehouse. */
export type WarehouseCreate = {
  __typename?: 'WarehouseCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
};

export type WarehouseCreateInput = {
  /** Warehouse slug. */
  slug?: Maybe<Scalars['String']>;
  /** The email address of the warehouse. */
  email?: Maybe<Scalars['String']>;
  /** Warehouse name. */
  name: Scalars['String'];
  /** Address of the warehouse. */
  address: AddressInput;
  /** Shipping zones supported by the warehouse. */
  shippingZones?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Deletes selected warehouse. */
export type WarehouseDelete = {
  __typename?: 'WarehouseDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
};

export type WarehouseError = {
  __typename?: 'WarehouseError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: WarehouseErrorCode;
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
  search?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Add shipping zone to given warehouse. */
export type WarehouseShippingZoneAssign = {
  __typename?: 'WarehouseShippingZoneAssign';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
};

/** Remove shipping zone from given warehouse. */
export type WarehouseShippingZoneUnassign = {
  __typename?: 'WarehouseShippingZoneUnassign';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
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
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  warehouseErrors: Array<WarehouseError>;
  errors: Array<WarehouseError>;
  warehouse?: Maybe<Warehouse>;
};

export type WarehouseUpdateInput = {
  /** Warehouse slug. */
  slug?: Maybe<Scalars['String']>;
  /** The email address of the warehouse. */
  email?: Maybe<Scalars['String']>;
  /** Warehouse name. */
  name?: Maybe<Scalars['String']>;
  /** Address of the warehouse. */
  address?: Maybe<AddressInput>;
};

/** Webhook. */
export type Webhook = Node & {
  __typename?: 'Webhook';
  name: Scalars['String'];
  targetUrl: Scalars['String'];
  isActive: Scalars['Boolean'];
  secretKey?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  /** List of webhook events. */
  events: Array<WebhookEvent>;
  app: App;
};

/** Creates a new webhook subscription. */
export type WebhookCreate = {
  __typename?: 'WebhookCreate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: Array<WebhookError>;
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
};

export type WebhookCreateInput = {
  /** The name of the webhook. */
  name?: Maybe<Scalars['String']>;
  /** The url to receive the payload. */
  targetUrl?: Maybe<Scalars['String']>;
  /** The events that webhook wants to subscribe. */
  events?: Maybe<Array<Maybe<WebhookEventTypeEnum>>>;
  /** ID of the app to which webhook belongs. */
  app?: Maybe<Scalars['ID']>;
  /** Determine if webhook will be set active or not. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** The secret key used to create a hash signature with each payload. */
  secretKey?: Maybe<Scalars['String']>;
};

/** Deletes a webhook subscription. */
export type WebhookDelete = {
  __typename?: 'WebhookDelete';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: Array<WebhookError>;
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
};

export type WebhookError = {
  __typename?: 'WebhookError';
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
  /** The error code. */
  code: WebhookErrorCode;
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
  /** A new order is placed. */
  OrderCreated = 'ORDER_CREATED',
  /** An order is confirmed (status change unconfirmed -> unfulfilled) by a staff user using the OrderConfirm mutation. It also triggers when the user completes the checkout and the shop setting `automatically_confirm_all_new_orders` is enabled. */
  OrderConfirmed = 'ORDER_CONFIRMED',
  /** Payment is made and an order is fully paid. */
  OrderFullyPaid = 'ORDER_FULLY_PAID',
  /** An order is updated; triggered for all changes related to an order; covers all other order webhooks, except for ORDER_CREATED. */
  OrderUpdated = 'ORDER_UPDATED',
  /** An order is cancelled. */
  OrderCancelled = 'ORDER_CANCELLED',
  /** An order is fulfilled. */
  OrderFulfilled = 'ORDER_FULFILLED',
  /** An invoice for order requested. */
  InvoiceRequested = 'INVOICE_REQUESTED',
  /** An invoice is deleted. */
  InvoiceDeleted = 'INVOICE_DELETED',
  /** Invoice has been sent. */
  InvoiceSent = 'INVOICE_SENT',
  /** A new customer account is created. */
  CustomerCreated = 'CUSTOMER_CREATED',
  /** A customer account is updated. */
  CustomerUpdated = 'CUSTOMER_UPDATED',
  /** A new product is created. */
  ProductCreated = 'PRODUCT_CREATED',
  /** A product is updated. */
  ProductUpdated = 'PRODUCT_UPDATED',
  /** A product is deleted. */
  ProductDeleted = 'PRODUCT_DELETED',
  /** A new product variant is created. */
  ProductVariantCreated = 'PRODUCT_VARIANT_CREATED',
  /** A product variant is updated. */
  ProductVariantUpdated = 'PRODUCT_VARIANT_UPDATED',
  /** A product variant is deleted. */
  ProductVariantDeleted = 'PRODUCT_VARIANT_DELETED',
  /** A new checkout is created. */
  CheckoutCreated = 'CHECKOUT_CREATED',
  /** A checkout is updated. It also triggers all updates related to the checkout. */
  CheckoutUpdated = 'CHECKOUT_UPDATED',
  /** A new fulfillment is created. */
  FulfillmentCreated = 'FULFILLMENT_CREATED',
  /** User notification triggered. */
  NotifyUser = 'NOTIFY_USER',
  /** A new page is created. */
  PageCreated = 'PAGE_CREATED',
  /** A page is updated. */
  PageUpdated = 'PAGE_UPDATED',
  /** A page is deleted. */
  PageDeleted = 'PAGE_DELETED',
  PaymentAuthorize = 'PAYMENT_AUTHORIZE',
  PaymentCapture = 'PAYMENT_CAPTURE',
  PaymentConfirm = 'PAYMENT_CONFIRM',
  PaymentListGateways = 'PAYMENT_LIST_GATEWAYS',
  PaymentProcess = 'PAYMENT_PROCESS',
  PaymentRefund = 'PAYMENT_REFUND',
  PaymentVoid = 'PAYMENT_VOID',
  TranslationCreated = 'TRANSLATION_CREATED',
  TranslationUpdated = 'TRANSLATION_UPDATED'
}

/** An enumeration. */
export enum WebhookSampleEventTypeEnum {
  OrderCreated = 'ORDER_CREATED',
  OrderConfirmed = 'ORDER_CONFIRMED',
  OrderFullyPaid = 'ORDER_FULLY_PAID',
  OrderUpdated = 'ORDER_UPDATED',
  OrderCancelled = 'ORDER_CANCELLED',
  OrderFulfilled = 'ORDER_FULFILLED',
  InvoiceRequested = 'INVOICE_REQUESTED',
  InvoiceDeleted = 'INVOICE_DELETED',
  InvoiceSent = 'INVOICE_SENT',
  CustomerCreated = 'CUSTOMER_CREATED',
  CustomerUpdated = 'CUSTOMER_UPDATED',
  ProductCreated = 'PRODUCT_CREATED',
  ProductUpdated = 'PRODUCT_UPDATED',
  ProductDeleted = 'PRODUCT_DELETED',
  ProductVariantCreated = 'PRODUCT_VARIANT_CREATED',
  ProductVariantUpdated = 'PRODUCT_VARIANT_UPDATED',
  ProductVariantDeleted = 'PRODUCT_VARIANT_DELETED',
  CheckoutCreated = 'CHECKOUT_CREATED',
  CheckoutUpdated = 'CHECKOUT_UPDATED',
  FulfillmentCreated = 'FULFILLMENT_CREATED',
  NotifyUser = 'NOTIFY_USER',
  PageCreated = 'PAGE_CREATED',
  PageUpdated = 'PAGE_UPDATED',
  PageDeleted = 'PAGE_DELETED',
  PaymentAuthorize = 'PAYMENT_AUTHORIZE',
  PaymentCapture = 'PAYMENT_CAPTURE',
  PaymentConfirm = 'PAYMENT_CONFIRM',
  PaymentListGateways = 'PAYMENT_LIST_GATEWAYS',
  PaymentProcess = 'PAYMENT_PROCESS',
  PaymentRefund = 'PAYMENT_REFUND',
  PaymentVoid = 'PAYMENT_VOID',
  TranslationCreated = 'TRANSLATION_CREATED',
  TranslationUpdated = 'TRANSLATION_UPDATED'
}

/** Updates a webhook subscription. */
export type WebhookUpdate = {
  __typename?: 'WebhookUpdate';
  /** @deprecated Use errors field instead. This field will be removed in Saleor 4.0. */
  webhookErrors: Array<WebhookError>;
  errors: Array<WebhookError>;
  webhook?: Maybe<Webhook>;
};

export type WebhookUpdateInput = {
  /** The new name of the webhook. */
  name?: Maybe<Scalars['String']>;
  /** The url to receive the payload. */
  targetUrl?: Maybe<Scalars['String']>;
  /** The events that webhook wants to subscribe. */
  events?: Maybe<Array<Maybe<WebhookEventTypeEnum>>>;
  /** ID of the app to which webhook belongs. */
  app?: Maybe<Scalars['ID']>;
  /** Determine if webhook will be set active or not. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** Use to create a hash signature with each payload. */
  secretKey?: Maybe<Scalars['String']>;
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
  Lb = 'LB',
  Oz = 'OZ',
  Kg = 'KG',
  Tonne = 'TONNE'
}


export type _Entity = App | Address | User | Group | ProductVariant | Product | ProductType | Collection | Category | ProductMedia | ProductImage | PageType;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export type PriceFragment = { __typename?: 'Money', currency: string, amount: number };

export type AddressFragment = { __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } };

export type CheckoutDetailsFragment = { __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> };

export type RemoveProductFromCheckoutMutationVariables = Exact<{
  checkoutToken: Scalars['UUID'];
  lineId: Scalars['ID'];
}>;


export type RemoveProductFromCheckoutMutation = { __typename?: 'Mutation', checkoutLineDelete?: Maybe<{ __typename?: 'CheckoutLineDelete', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }>, errors: Array<{ __typename?: 'CheckoutError', field?: Maybe<string>, message?: Maybe<string> }> }> };

export type CreateCheckoutMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateCheckoutMutation = { __typename?: 'Mutation', checkoutCreate?: Maybe<{ __typename?: 'CheckoutCreate', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any }>, errors: Array<{ __typename?: 'CheckoutError', field?: Maybe<string>, code: CheckoutErrorCode }> }> };

export type AddProductToCheckoutMutationVariables = Exact<{
  checkoutToken: Scalars['UUID'];
  variantId: Scalars['ID'];
}>;


export type AddProductToCheckoutMutation = { __typename?: 'Mutation', checkoutLinesAdd?: Maybe<{ __typename?: 'CheckoutLinesAdd', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }>, errors: Array<{ __typename?: 'CheckoutError', message?: Maybe<string> }> }> };

export type CheckoutByTokenQueryVariables = Exact<{
  checkoutToken: Scalars['UUID'];
}>;


export type CheckoutByTokenQuery = { __typename?: 'Query', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }> };

export type ProductBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type ProductBySlugQuery = { __typename?: 'Query', product?: Maybe<{ __typename?: 'Product', id: string, name: string, description?: Maybe<any>, category?: Maybe<{ __typename?: 'Category', name: string }>, variants?: Maybe<Array<Maybe<{ __typename?: 'ProductVariant', id: string, name: string }>>>, pricing?: Maybe<{ __typename?: 'ProductPricingInfo', priceRange?: Maybe<{ __typename?: 'TaxedMoneyRange', start?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }> }>, media?: Maybe<Array<{ __typename?: 'ProductMedia', url: string }>>, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> }> };

export type ProductPathsQueryVariables = Exact<{
  after?: Maybe<Scalars['String']>;
}>;


export type ProductPathsQuery = { __typename?: 'Query', products?: Maybe<{ __typename?: 'ProductCountableConnection', edges: Array<{ __typename?: 'ProductCountableEdge', cursor: string, node: { __typename?: 'Product', id: string, slug: string } }> }> };

export type ProductCollectionQueryVariables = Exact<{
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
}>;


export type ProductCollectionQuery = { __typename?: 'Query', products?: Maybe<{ __typename?: 'ProductCountableConnection', edges: Array<{ __typename?: 'ProductCountableEdge', cursor: string, node: { __typename?: 'Product', id: string, slug: string, name: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }>, category?: Maybe<{ __typename?: 'Category', name: string }>, variants?: Maybe<Array<Maybe<{ __typename?: 'ProductVariant', id: string, name: string }>>>, pricing?: Maybe<{ __typename?: 'ProductPricingInfo', priceRange?: Maybe<{ __typename?: 'TaxedMoneyRange', start?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, stop?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }> }> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: Maybe<string>, endCursor?: Maybe<string> } }> };

export type CheckoutEmailUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  email: Scalars['String'];
}>;


export type CheckoutEmailUpdateMutation = { __typename?: 'Mutation', checkoutEmailUpdate?: Maybe<{ __typename?: 'CheckoutEmailUpdate', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }>, errors: Array<{ __typename?: 'CheckoutError', field?: Maybe<string>, message?: Maybe<string> }> }> };

export type CheckoutBillingAddressUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  address: AddressInput;
}>;


export type CheckoutBillingAddressUpdateMutation = { __typename?: 'Mutation', checkoutBillingAddressUpdate?: Maybe<{ __typename?: 'CheckoutBillingAddressUpdate', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }>, errors: Array<{ __typename?: 'CheckoutError', field?: Maybe<string>, message?: Maybe<string>, code: CheckoutErrorCode }> }> };

export type CheckoutShippingAddressUpdateMutationVariables = Exact<{
  token: Scalars['UUID'];
  address: AddressInput;
}>;


export type CheckoutShippingAddressUpdateMutation = { __typename?: 'Mutation', checkoutShippingAddressUpdate?: Maybe<{ __typename?: 'CheckoutShippingAddressUpdate', checkout?: Maybe<{ __typename?: 'Checkout', id: string, token: any, email: string, isShippingRequired: boolean, billingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, shippingAddress?: Maybe<{ __typename?: 'Address', phone?: Maybe<string>, firstName: string, lastName: string, streetAddress1: string, city: string, postalCode: string, country: { __typename?: 'CountryDisplay', code: string, country: string } }>, lines?: Maybe<Array<Maybe<{ __typename?: 'CheckoutLine', id: string, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, variant: { __typename?: 'ProductVariant', name: string, product: { __typename?: 'Product', id: string, name: string, slug: string, thumbnail?: Maybe<{ __typename?: 'Image', url: string }> } } }>>>, subtotalPrice?: Maybe<{ __typename?: 'TaxedMoney', net: { __typename?: 'Money', currency: string, amount: number }, tax: { __typename?: 'Money', currency: string, amount: number } }>, shippingPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }>, totalPrice?: Maybe<{ __typename?: 'TaxedMoney', gross: { __typename?: 'Money', currency: string, amount: number } }> }>, errors: Array<{ __typename?: 'CheckoutError', field?: Maybe<string>, message?: Maybe<string>, code: CheckoutErrorCode }> }> };

export const AddressFragmentDoc = gql`
    fragment AddressFragment on Address {
  phone
  firstName
  lastName
  streetAddress1
  city
  postalCode
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
}
    `;
export const CheckoutDetailsFragmentDoc = gql`
    fragment CheckoutDetailsFragment on Checkout {
  id
  token
  email
  billingAddress {
    ...AddressFragment
  }
  shippingAddress {
    ...AddressFragment
  }
  isShippingRequired
  lines {
    id
    totalPrice {
      gross {
        ...PriceFragment
      }
    }
    variant {
      product {
        id
        name
        slug
        thumbnail {
          url
        }
      }
      name
    }
  }
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
    ${AddressFragmentDoc}
${PriceFragmentDoc}`;
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
export const CreateCheckoutDocument = gql`
    mutation CreateCheckout {
  checkoutCreate(
    input: {channel: "default-channel", email: "customer@example.com", lines: []}
  ) {
    checkout {
      id
      token
    }
    errors {
      field
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
export const AddProductToCheckoutDocument = gql`
    mutation AddProductToCheckout($checkoutToken: UUID!, $variantId: ID!) {
  checkoutLinesAdd(
    token: $checkoutToken
    lines: [{quantity: 1, variantId: $variantId}]
  ) {
    checkout {
      ...CheckoutDetailsFragment
    }
    errors {
      message
    }
  }
}
    ${CheckoutDetailsFragmentDoc}`;
export type AddProductToCheckoutMutationFn = Apollo.MutationFunction<AddProductToCheckoutMutation, AddProductToCheckoutMutationVariables>;

/**
 * __useAddProductToCheckoutMutation__
 *
 * To run a mutation, you first call `useAddProductToCheckoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductToCheckoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductToCheckoutMutation, { data, loading, error }] = useAddProductToCheckoutMutation({
 *   variables: {
 *      checkoutToken: // value for 'checkoutToken'
 *      variantId: // value for 'variantId'
 *   },
 * });
 */
export function useAddProductToCheckoutMutation(baseOptions?: Apollo.MutationHookOptions<AddProductToCheckoutMutation, AddProductToCheckoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductToCheckoutMutation, AddProductToCheckoutMutationVariables>(AddProductToCheckoutDocument, options);
      }
export type AddProductToCheckoutMutationHookResult = ReturnType<typeof useAddProductToCheckoutMutation>;
export type AddProductToCheckoutMutationResult = Apollo.MutationResult<AddProductToCheckoutMutation>;
export type AddProductToCheckoutMutationOptions = Apollo.BaseMutationOptions<AddProductToCheckoutMutation, AddProductToCheckoutMutationVariables>;
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
export const ProductBySlugDocument = gql`
    query ProductBySlug($slug: String!) {
  product(slug: $slug, channel: "default-channel") {
    id
    name
    description
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
            ...PriceFragment
          }
        }
      }
    }
    media {
      url
    }
    thumbnail {
      url
    }
    category {
      name
    }
  }
}
    ${PriceFragmentDoc}`;

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
export const ProductPathsDocument = gql`
    query ProductPaths($after: String) {
  products(first: 50, channel: "default-channel", after: $after) {
    edges {
      cursor
      node {
        id
        slug
      }
    }
  }
}
    `;

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
 *   },
 * });
 */
export function useProductPathsQuery(baseOptions?: Apollo.QueryHookOptions<ProductPathsQuery, ProductPathsQueryVariables>) {
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
export const ProductCollectionDocument = gql`
    query ProductCollection($before: String, $after: String) {
  products(first: 8, channel: "default-channel", after: $after, before: $before) {
    edges {
      cursor
      node {
        id
        slug
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
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    ${PriceFragmentDoc}`;

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
 *   },
 * });
 */
export function useProductCollectionQuery(baseOptions?: Apollo.QueryHookOptions<ProductCollectionQuery, ProductCollectionQueryVariables>) {
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
export type AccountAddressCreateKeySpecifier = ('user' | 'accountErrors' | 'errors' | 'address' | AccountAddressCreateKeySpecifier)[];
export type AccountAddressCreateFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountAddressDeleteKeySpecifier = ('user' | 'accountErrors' | 'errors' | 'address' | AccountAddressDeleteKeySpecifier)[];
export type AccountAddressDeleteFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountAddressUpdateKeySpecifier = ('user' | 'accountErrors' | 'errors' | 'address' | AccountAddressUpdateKeySpecifier)[];
export type AccountAddressUpdateFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountDeleteKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountDeleteKeySpecifier)[];
export type AccountDeleteFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountErrorKeySpecifier = ('field' | 'message' | 'code' | 'addressType' | AccountErrorKeySpecifier)[];
export type AccountErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	addressType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountRegisterKeySpecifier = ('requiresConfirmation' | 'accountErrors' | 'errors' | 'user' | AccountRegisterKeySpecifier)[];
export type AccountRegisterFieldPolicy = {
	requiresConfirmation?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountRequestDeletionKeySpecifier = ('accountErrors' | 'errors' | AccountRequestDeletionKeySpecifier)[];
export type AccountRequestDeletionFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountSetDefaultAddressKeySpecifier = ('user' | 'accountErrors' | 'errors' | AccountSetDefaultAddressKeySpecifier)[];
export type AccountSetDefaultAddressFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AccountUpdateKeySpecifier = ('accountErrors' | 'errors' | 'user' | AccountUpdateKeySpecifier)[];
export type AccountUpdateFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressKeySpecifier = ('id' | 'firstName' | 'lastName' | 'companyName' | 'streetAddress1' | 'streetAddress2' | 'city' | 'cityArea' | 'postalCode' | 'country' | 'countryArea' | 'phone' | 'isDefaultShippingAddress' | 'isDefaultBillingAddress' | AddressKeySpecifier)[];
export type AddressFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	companyName?: FieldPolicy<any> | FieldReadFunction<any>,
	streetAddress1?: FieldPolicy<any> | FieldReadFunction<any>,
	streetAddress2?: FieldPolicy<any> | FieldReadFunction<any>,
	city?: FieldPolicy<any> | FieldReadFunction<any>,
	cityArea?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCode?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	countryArea?: FieldPolicy<any> | FieldReadFunction<any>,
	phone?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	isDefaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressCreateKeySpecifier = ('user' | 'accountErrors' | 'errors' | 'address' | AddressCreateKeySpecifier)[];
export type AddressCreateFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressDeleteKeySpecifier = ('user' | 'accountErrors' | 'errors' | 'address' | AddressDeleteKeySpecifier)[];
export type AddressDeleteFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressSetDefaultKeySpecifier = ('user' | 'accountErrors' | 'errors' | AddressSetDefaultKeySpecifier)[];
export type AddressSetDefaultFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressUpdateKeySpecifier = ('user' | 'accountErrors' | 'errors' | 'address' | AddressUpdateKeySpecifier)[];
export type AddressUpdateFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AddressValidationDataKeySpecifier = ('countryCode' | 'countryName' | 'addressFormat' | 'addressLatinFormat' | 'allowedFields' | 'requiredFields' | 'upperFields' | 'countryAreaType' | 'countryAreaChoices' | 'cityType' | 'cityChoices' | 'cityAreaType' | 'cityAreaChoices' | 'postalCodeType' | 'postalCodeMatchers' | 'postalCodeExamples' | 'postalCodePrefix' | AddressValidationDataKeySpecifier)[];
export type AddressValidationDataFieldPolicy = {
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	countryName?: FieldPolicy<any> | FieldReadFunction<any>,
	addressFormat?: FieldPolicy<any> | FieldReadFunction<any>,
	addressLatinFormat?: FieldPolicy<any> | FieldReadFunction<any>,
	allowedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	requiredFields?: FieldPolicy<any> | FieldReadFunction<any>,
	upperFields?: FieldPolicy<any> | FieldReadFunction<any>,
	countryAreaType?: FieldPolicy<any> | FieldReadFunction<any>,
	countryAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	cityType?: FieldPolicy<any> | FieldReadFunction<any>,
	cityChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	cityAreaType?: FieldPolicy<any> | FieldReadFunction<any>,
	cityAreaChoices?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeType?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeMatchers?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeExamples?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodePrefix?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AllocationKeySpecifier = ('id' | 'quantity' | 'warehouse' | AllocationKeySpecifier)[];
export type AllocationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppKeySpecifier = ('id' | 'name' | 'created' | 'isActive' | 'permissions' | 'tokens' | 'privateMetadata' | 'metadata' | 'type' | 'webhooks' | 'aboutApp' | 'dataPrivacy' | 'dataPrivacyUrl' | 'homepageUrl' | 'supportUrl' | 'configurationUrl' | 'appUrl' | 'version' | 'accessToken' | AppKeySpecifier)[];
export type AppFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	tokens?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	webhooks?: FieldPolicy<any> | FieldReadFunction<any>,
	aboutApp?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	supportUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	appUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	accessToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppActivateKeySpecifier = ('appErrors' | 'errors' | 'app' | AppActivateKeySpecifier)[];
export type AppActivateFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | AppCountableConnectionKeySpecifier)[];
export type AppCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCountableEdgeKeySpecifier = ('node' | 'cursor' | AppCountableEdgeKeySpecifier)[];
export type AppCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppCreateKeySpecifier = ('authToken' | 'appErrors' | 'errors' | 'app' | AppCreateKeySpecifier)[];
export type AppCreateFieldPolicy = {
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeactivateKeySpecifier = ('appErrors' | 'errors' | 'app' | AppDeactivateKeySpecifier)[];
export type AppDeactivateFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeleteKeySpecifier = ('appErrors' | 'errors' | 'app' | AppDeleteKeySpecifier)[];
export type AppDeleteFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppDeleteFailedInstallationKeySpecifier = ('appErrors' | 'errors' | 'appInstallation' | AppDeleteFailedInstallationKeySpecifier)[];
export type AppDeleteFailedInstallationFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppErrorKeySpecifier = ('field' | 'message' | 'code' | 'permissions' | AppErrorKeySpecifier)[];
export type AppErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppFetchManifestKeySpecifier = ('manifest' | 'appErrors' | 'errors' | AppFetchManifestKeySpecifier)[];
export type AppFetchManifestFieldPolicy = {
	manifest?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstallKeySpecifier = ('appErrors' | 'errors' | 'appInstallation' | AppInstallKeySpecifier)[];
export type AppInstallFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppInstallationKeySpecifier = ('appName' | 'manifestUrl' | 'id' | 'status' | 'createdAt' | 'updatedAt' | 'message' | AppInstallationKeySpecifier)[];
export type AppInstallationFieldPolicy = {
	appName?: FieldPolicy<any> | FieldReadFunction<any>,
	manifestUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppRetryInstallKeySpecifier = ('appErrors' | 'errors' | 'appInstallation' | AppRetryInstallKeySpecifier)[];
export type AppRetryInstallFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstallation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenKeySpecifier = ('name' | 'authToken' | 'id' | AppTokenKeySpecifier)[];
export type AppTokenFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenCreateKeySpecifier = ('authToken' | 'appErrors' | 'errors' | 'appToken' | AppTokenCreateKeySpecifier)[];
export type AppTokenCreateFieldPolicy = {
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	appToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenDeleteKeySpecifier = ('appErrors' | 'errors' | 'appToken' | AppTokenDeleteKeySpecifier)[];
export type AppTokenDeleteFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	appToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppTokenVerifyKeySpecifier = ('valid' | 'appErrors' | 'errors' | AppTokenVerifyKeySpecifier)[];
export type AppTokenVerifyFieldPolicy = {
	valid?: FieldPolicy<any> | FieldReadFunction<any>,
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AppUpdateKeySpecifier = ('appErrors' | 'errors' | 'app' | AppUpdateKeySpecifier)[];
export type AppUpdateFieldPolicy = {
	appErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AssignNavigationKeySpecifier = ('menu' | 'menuErrors' | 'errors' | AssignNavigationKeySpecifier)[];
export type AssignNavigationFieldPolicy = {
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeKeySpecifier = ('id' | 'productTypes' | 'productVariantTypes' | 'privateMetadata' | 'metadata' | 'inputType' | 'entityType' | 'name' | 'slug' | 'type' | 'unit' | 'choices' | 'valueRequired' | 'visibleInStorefront' | 'filterableInStorefront' | 'filterableInDashboard' | 'availableInGrid' | 'translation' | 'storefrontSearchPosition' | 'withChoices' | AttributeKeySpecifier)[];
export type AttributeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	inputType?: FieldPolicy<any> | FieldReadFunction<any>,
	entityType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	unit?: FieldPolicy<any> | FieldReadFunction<any>,
	choices?: FieldPolicy<any> | FieldReadFunction<any>,
	valueRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	visibleInStorefront?: FieldPolicy<any> | FieldReadFunction<any>,
	filterableInStorefront?: FieldPolicy<any> | FieldReadFunction<any>,
	filterableInDashboard?: FieldPolicy<any> | FieldReadFunction<any>,
	availableInGrid?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	storefrontSearchPosition?: FieldPolicy<any> | FieldReadFunction<any>,
	withChoices?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeBulkDeleteKeySpecifier = ('count' | 'attributeErrors' | 'errors' | AttributeBulkDeleteKeySpecifier)[];
export type AttributeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | AttributeCountableConnectionKeySpecifier)[];
export type AttributeCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCountableEdgeKeySpecifier = ('node' | 'cursor' | AttributeCountableEdgeKeySpecifier)[];
export type AttributeCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeCreateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeCreateKeySpecifier)[];
export type AttributeCreateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeDeleteKeySpecifier = ('attributeErrors' | 'errors' | 'attribute' | AttributeDeleteKeySpecifier)[];
export type AttributeDeleteFieldPolicy = {
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeErrorKeySpecifier = ('field' | 'message' | 'code' | AttributeErrorKeySpecifier)[];
export type AttributeErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeReorderValuesKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeReorderValuesKeySpecifier)[];
export type AttributeReorderValuesFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'attribute' | AttributeTranslatableContentKeySpecifier)[];
export type AttributeTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslateKeySpecifier = ('translationErrors' | 'errors' | 'attribute' | AttributeTranslateKeySpecifier)[];
export type AttributeTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeTranslationKeySpecifier = ('id' | 'name' | 'language' | AttributeTranslationKeySpecifier)[];
export type AttributeTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeUpdateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | AttributeUpdateKeySpecifier)[];
export type AttributeUpdateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueKeySpecifier = ('id' | 'name' | 'slug' | 'value' | 'translation' | 'inputType' | 'reference' | 'file' | 'richText' | 'boolean' | 'date' | 'dateTime' | AttributeValueKeySpecifier)[];
export type AttributeValueFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	inputType?: FieldPolicy<any> | FieldReadFunction<any>,
	reference?: FieldPolicy<any> | FieldReadFunction<any>,
	file?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	boolean?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	dateTime?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueBulkDeleteKeySpecifier = ('count' | 'attributeErrors' | 'errors' | AttributeValueBulkDeleteKeySpecifier)[];
export type AttributeValueBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | AttributeValueCountableConnectionKeySpecifier)[];
export type AttributeValueCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCountableEdgeKeySpecifier = ('node' | 'cursor' | AttributeValueCountableEdgeKeySpecifier)[];
export type AttributeValueCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueCreateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | 'attributeValue' | AttributeValueCreateKeySpecifier)[];
export type AttributeValueCreateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueDeleteKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | 'attributeValue' | AttributeValueDeleteKeySpecifier)[];
export type AttributeValueDeleteFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslatableContentKeySpecifier = ('id' | 'name' | 'richText' | 'translation' | 'attributeValue' | AttributeValueTranslatableContentKeySpecifier)[];
export type AttributeValueTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslateKeySpecifier = ('translationErrors' | 'errors' | 'attributeValue' | AttributeValueTranslateKeySpecifier)[];
export type AttributeValueTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueTranslationKeySpecifier = ('id' | 'name' | 'richText' | 'language' | AttributeValueTranslationKeySpecifier)[];
export type AttributeValueTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	richText?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AttributeValueUpdateKeySpecifier = ('attribute' | 'attributeErrors' | 'errors' | 'attributeValue' | AttributeValueUpdateKeySpecifier)[];
export type AttributeValueUpdateFieldPolicy = {
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BulkProductErrorKeySpecifier = ('field' | 'message' | 'code' | 'attributes' | 'values' | 'index' | 'warehouses' | 'channels' | BulkProductErrorKeySpecifier)[];
export type BulkProductErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BulkStockErrorKeySpecifier = ('field' | 'message' | 'code' | 'attributes' | 'values' | 'index' | BulkStockErrorKeySpecifier)[];
export type BulkStockErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'slug' | 'parent' | 'level' | 'privateMetadata' | 'metadata' | 'descriptionJson' | 'ancestors' | 'products' | 'children' | 'backgroundImage' | 'translation' | CategoryKeySpecifier)[];
export type CategoryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	ancestors?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryBulkDeleteKeySpecifier = ('count' | 'productErrors' | 'errors' | CategoryBulkDeleteKeySpecifier)[];
export type CategoryBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | CategoryCountableConnectionKeySpecifier)[];
export type CategoryCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCountableEdgeKeySpecifier = ('node' | 'cursor' | CategoryCountableEdgeKeySpecifier)[];
export type CategoryCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryCreateKeySpecifier = ('productErrors' | 'errors' | 'category' | CategoryCreateKeySpecifier)[];
export type CategoryCreateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryDeleteKeySpecifier = ('productErrors' | 'errors' | 'category' | CategoryDeleteKeySpecifier)[];
export type CategoryDeleteFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslatableContentKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'descriptionJson' | 'translation' | 'category' | CategoryTranslatableContentKeySpecifier)[];
export type CategoryTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslateKeySpecifier = ('translationErrors' | 'errors' | 'category' | CategoryTranslateKeySpecifier)[];
export type CategoryTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryTranslationKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'language' | 'descriptionJson' | CategoryTranslationKeySpecifier)[];
export type CategoryTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CategoryUpdateKeySpecifier = ('productErrors' | 'errors' | 'category' | CategoryUpdateKeySpecifier)[];
export type CategoryUpdateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelKeySpecifier = ('id' | 'name' | 'isActive' | 'slug' | 'currencyCode' | 'hasOrders' | 'defaultCountry' | ChannelKeySpecifier)[];
export type ChannelFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	currencyCode?: FieldPolicy<any> | FieldReadFunction<any>,
	hasOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelActivateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelActivateKeySpecifier)[];
export type ChannelActivateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelCreateKeySpecifier = ('channelErrors' | 'errors' | 'channel' | ChannelCreateKeySpecifier)[];
export type ChannelCreateFieldPolicy = {
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeactivateKeySpecifier = ('channel' | 'channelErrors' | 'errors' | ChannelDeactivateKeySpecifier)[];
export type ChannelDeactivateFieldPolicy = {
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelDeleteKeySpecifier = ('channelErrors' | 'errors' | 'channel' | ChannelDeleteKeySpecifier)[];
export type ChannelDeleteFieldPolicy = {
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelErrorKeySpecifier = ('field' | 'message' | 'code' | 'shippingZones' | ChannelErrorKeySpecifier)[];
export type ChannelErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ChannelUpdateKeySpecifier = ('channelErrors' | 'errors' | 'channel' | ChannelUpdateKeySpecifier)[];
export type ChannelUpdateFieldPolicy = {
	channelErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutKeySpecifier = ('created' | 'lastChange' | 'user' | 'channel' | 'billingAddress' | 'shippingAddress' | 'note' | 'discount' | 'discountName' | 'translatedDiscountName' | 'voucherCode' | 'giftCards' | 'id' | 'privateMetadata' | 'metadata' | 'availableShippingMethods' | 'availablePaymentGateways' | 'email' | 'isShippingRequired' | 'quantity' | 'lines' | 'shippingPrice' | 'shippingMethod' | 'subtotalPrice' | 'token' | 'totalPrice' | 'languageCode' | CheckoutKeySpecifier)[];
export type CheckoutFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	lastChange?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	billingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountName?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCode?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	subtotalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>
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
export type CheckoutCompleteKeySpecifier = ('order' | 'confirmationNeeded' | 'confirmationData' | 'checkoutErrors' | 'errors' | CheckoutCompleteKeySpecifier)[];
export type CheckoutCompleteFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmationNeeded?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmationData?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | CheckoutCountableConnectionKeySpecifier)[];
export type CheckoutCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCountableEdgeKeySpecifier = ('node' | 'cursor' | CheckoutCountableEdgeKeySpecifier)[];
export type CheckoutCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutCreateKeySpecifier = ('created' | 'checkoutErrors' | 'errors' | 'checkout' | CheckoutCreateKeySpecifier)[];
export type CheckoutCreateFieldPolicy = {
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>
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
export type CheckoutErrorKeySpecifier = ('field' | 'message' | 'code' | 'variants' | 'addressType' | CheckoutErrorKeySpecifier)[];
export type CheckoutErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	addressType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLanguageCodeUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLanguageCodeUpdateKeySpecifier)[];
export type CheckoutLanguageCodeUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineKeySpecifier = ('id' | 'variant' | 'quantity' | 'totalPrice' | 'requiresShipping' | CheckoutLineKeySpecifier)[];
export type CheckoutLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	requiresShipping?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | CheckoutLineCountableConnectionKeySpecifier)[];
export type CheckoutLineCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutLineCountableEdgeKeySpecifier = ('node' | 'cursor' | CheckoutLineCountableEdgeKeySpecifier)[];
export type CheckoutLineCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
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
export type CheckoutLinesUpdateKeySpecifier = ('checkout' | 'checkoutErrors' | 'errors' | CheckoutLinesUpdateKeySpecifier)[];
export type CheckoutLinesUpdateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CheckoutPaymentCreateKeySpecifier = ('checkout' | 'payment' | 'paymentErrors' | 'errors' | CheckoutPaymentCreateKeySpecifier)[];
export type CheckoutPaymentCreateFieldPolicy = {
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
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
export type CollectionKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'slug' | 'privateMetadata' | 'metadata' | 'descriptionJson' | 'products' | 'backgroundImage' | 'translation' | 'channelListings' | CollectionKeySpecifier)[];
export type CollectionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	backgroundImage?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionAddProductsKeySpecifier = ('collection' | 'collectionErrors' | 'errors' | CollectionAddProductsKeySpecifier)[];
export type CollectionAddProductsFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionBulkDeleteKeySpecifier = ('count' | 'collectionErrors' | 'errors' | CollectionBulkDeleteKeySpecifier)[];
export type CollectionBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingKeySpecifier = ('id' | 'publicationDate' | 'isPublished' | 'channel' | CollectionChannelListingKeySpecifier)[];
export type CollectionChannelListingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingErrorKeySpecifier = ('field' | 'message' | 'code' | 'attributes' | 'values' | 'channels' | CollectionChannelListingErrorKeySpecifier)[];
export type CollectionChannelListingErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionChannelListingUpdateKeySpecifier = ('collection' | 'collectionChannelListingErrors' | 'errors' | CollectionChannelListingUpdateKeySpecifier)[];
export type CollectionChannelListingUpdateFieldPolicy = {
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | CollectionCountableConnectionKeySpecifier)[];
export type CollectionCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCountableEdgeKeySpecifier = ('node' | 'cursor' | CollectionCountableEdgeKeySpecifier)[];
export type CollectionCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionCreateKeySpecifier = ('collectionErrors' | 'errors' | 'collection' | CollectionCreateKeySpecifier)[];
export type CollectionCreateFieldPolicy = {
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionDeleteKeySpecifier = ('collectionErrors' | 'errors' | 'collection' | CollectionDeleteKeySpecifier)[];
export type CollectionDeleteFieldPolicy = {
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionErrorKeySpecifier = ('field' | 'message' | 'products' | 'code' | CollectionErrorKeySpecifier)[];
export type CollectionErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
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
export type CollectionTranslatableContentKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'descriptionJson' | 'translation' | 'collection' | CollectionTranslatableContentKeySpecifier)[];
export type CollectionTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslateKeySpecifier = ('translationErrors' | 'errors' | 'collection' | CollectionTranslateKeySpecifier)[];
export type CollectionTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionTranslationKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'language' | 'descriptionJson' | CollectionTranslationKeySpecifier)[];
export type CollectionTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CollectionUpdateKeySpecifier = ('collectionErrors' | 'errors' | 'collection' | CollectionUpdateKeySpecifier)[];
export type CollectionUpdateFieldPolicy = {
	collectionErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfigurationItemKeySpecifier = ('name' | 'value' | 'type' | 'helpText' | 'label' | ConfigurationItemKeySpecifier)[];
export type ConfigurationItemFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	helpText?: FieldPolicy<any> | FieldReadFunction<any>,
	label?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfirmAccountKeySpecifier = ('user' | 'accountErrors' | 'errors' | ConfirmAccountKeySpecifier)[];
export type ConfirmAccountFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConfirmEmailChangeKeySpecifier = ('user' | 'accountErrors' | 'errors' | ConfirmEmailChangeKeySpecifier)[];
export type ConfirmEmailChangeFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CountryDisplayKeySpecifier = ('code' | 'country' | 'vat' | CountryDisplayKeySpecifier)[];
export type CountryDisplayFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	country?: FieldPolicy<any> | FieldReadFunction<any>,
	vat?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateTokenKeySpecifier = ('token' | 'refreshToken' | 'csrfToken' | 'user' | 'accountErrors' | 'errors' | CreateTokenKeySpecifier)[];
export type CreateTokenFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreditCardKeySpecifier = ('brand' | 'firstDigits' | 'lastDigits' | 'expMonth' | 'expYear' | CreditCardKeySpecifier)[];
export type CreditCardFieldPolicy = {
	brand?: FieldPolicy<any> | FieldReadFunction<any>,
	firstDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	lastDigits?: FieldPolicy<any> | FieldReadFunction<any>,
	expMonth?: FieldPolicy<any> | FieldReadFunction<any>,
	expYear?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CustomerBulkDeleteKeySpecifier = ('count' | 'accountErrors' | 'errors' | CustomerBulkDeleteKeySpecifier)[];
export type CustomerBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type CustomerEventKeySpecifier = ('id' | 'date' | 'type' | 'user' | 'app' | 'message' | 'count' | 'order' | 'orderLine' | CustomerEventKeySpecifier)[];
export type CustomerEventFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
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
export type DeleteMetadataKeySpecifier = ('metadataErrors' | 'errors' | 'item' | DeleteMetadataKeySpecifier)[];
export type DeleteMetadataFieldPolicy = {
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeletePrivateMetadataKeySpecifier = ('metadataErrors' | 'errors' | 'item' | DeletePrivateMetadataKeySpecifier)[];
export type DeletePrivateMetadataFieldPolicy = {
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentKeySpecifier = ('useDefaultSettings' | 'automaticFulfillment' | 'contentFile' | 'maxDownloads' | 'urlValidDays' | 'urls' | 'id' | 'privateMetadata' | 'metadata' | 'productVariant' | DigitalContentKeySpecifier)[];
export type DigitalContentFieldPolicy = {
	useDefaultSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	automaticFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	contentFile?: FieldPolicy<any> | FieldReadFunction<any>,
	maxDownloads?: FieldPolicy<any> | FieldReadFunction<any>,
	urlValidDays?: FieldPolicy<any> | FieldReadFunction<any>,
	urls?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | DigitalContentCountableConnectionKeySpecifier)[];
export type DigitalContentCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCountableEdgeKeySpecifier = ('node' | 'cursor' | DigitalContentCountableEdgeKeySpecifier)[];
export type DigitalContentCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentCreateKeySpecifier = ('variant' | 'content' | 'productErrors' | 'errors' | DigitalContentCreateKeySpecifier)[];
export type DigitalContentCreateFieldPolicy = {
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentDeleteKeySpecifier = ('variant' | 'productErrors' | 'errors' | DigitalContentDeleteKeySpecifier)[];
export type DigitalContentDeleteFieldPolicy = {
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUpdateKeySpecifier = ('variant' | 'content' | 'productErrors' | 'errors' | DigitalContentUpdateKeySpecifier)[];
export type DigitalContentUpdateFieldPolicy = {
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUrlKeySpecifier = ('content' | 'created' | 'downloadNum' | 'id' | 'url' | 'token' | DigitalContentUrlKeySpecifier)[];
export type DigitalContentUrlFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	downloadNum?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DigitalContentUrlCreateKeySpecifier = ('productErrors' | 'errors' | 'digitalContentUrl' | DigitalContentUrlCreateKeySpecifier)[];
export type DigitalContentUrlCreateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DiscountErrorKeySpecifier = ('field' | 'message' | 'products' | 'code' | 'channels' | DiscountErrorKeySpecifier)[];
export type DiscountErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DomainKeySpecifier = ('host' | 'sslEnabled' | 'url' | DomainKeySpecifier)[];
export type DomainFieldPolicy = {
	host?: FieldPolicy<any> | FieldReadFunction<any>,
	sslEnabled?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderBulkDeleteKeySpecifier = ('count' | 'orderErrors' | 'errors' | DraftOrderBulkDeleteKeySpecifier)[];
export type DraftOrderBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCompleteKeySpecifier = ('order' | 'orderErrors' | 'errors' | DraftOrderCompleteKeySpecifier)[];
export type DraftOrderCompleteFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderCreateKeySpecifier = ('orderErrors' | 'errors' | 'order' | DraftOrderCreateKeySpecifier)[];
export type DraftOrderCreateFieldPolicy = {
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderDeleteKeySpecifier = ('orderErrors' | 'errors' | 'order' | DraftOrderDeleteKeySpecifier)[];
export type DraftOrderDeleteFieldPolicy = {
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderLinesBulkDeleteKeySpecifier = ('count' | 'orderErrors' | 'errors' | DraftOrderLinesBulkDeleteKeySpecifier)[];
export type DraftOrderLinesBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DraftOrderUpdateKeySpecifier = ('orderErrors' | 'errors' | 'order' | DraftOrderUpdateKeySpecifier)[];
export type DraftOrderUpdateFieldPolicy = {
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportErrorKeySpecifier = ('field' | 'message' | 'code' | ExportErrorKeySpecifier)[];
export type ExportErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportEventKeySpecifier = ('id' | 'date' | 'type' | 'user' | 'app' | 'message' | ExportEventKeySpecifier)[];
export type ExportEventFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileKeySpecifier = ('id' | 'user' | 'app' | 'status' | 'createdAt' | 'updatedAt' | 'message' | 'url' | 'events' | ExportFileKeySpecifier)[];
export type ExportFileFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | ExportFileCountableConnectionKeySpecifier)[];
export type ExportFileCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportFileCountableEdgeKeySpecifier = ('node' | 'cursor' | ExportFileCountableEdgeKeySpecifier)[];
export type ExportFileCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExportProductsKeySpecifier = ('exportFile' | 'exportErrors' | 'errors' | ExportProductsKeySpecifier)[];
export type ExportProductsFieldPolicy = {
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>,
	exportErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalAuthenticationKeySpecifier = ('id' | 'name' | ExternalAuthenticationKeySpecifier)[];
export type ExternalAuthenticationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalAuthenticationUrlKeySpecifier = ('authenticationData' | 'accountErrors' | 'errors' | ExternalAuthenticationUrlKeySpecifier)[];
export type ExternalAuthenticationUrlFieldPolicy = {
	authenticationData?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalLogoutKeySpecifier = ('logoutData' | 'accountErrors' | 'errors' | ExternalLogoutKeySpecifier)[];
export type ExternalLogoutFieldPolicy = {
	logoutData?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalObtainAccessTokensKeySpecifier = ('token' | 'refreshToken' | 'csrfToken' | 'user' | 'accountErrors' | 'errors' | ExternalObtainAccessTokensKeySpecifier)[];
export type ExternalObtainAccessTokensFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalRefreshKeySpecifier = ('token' | 'refreshToken' | 'csrfToken' | 'user' | 'accountErrors' | 'errors' | ExternalRefreshKeySpecifier)[];
export type ExternalRefreshFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExternalVerifyKeySpecifier = ('user' | 'isValid' | 'verifyData' | 'accountErrors' | 'errors' | ExternalVerifyKeySpecifier)[];
export type ExternalVerifyFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	isValid?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyData?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('url' | 'contentType' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	contentType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileUploadKeySpecifier = ('uploadedFile' | 'uploadErrors' | 'errors' | FileUploadKeySpecifier)[];
export type FileUploadFieldPolicy = {
	uploadedFile?: FieldPolicy<any> | FieldReadFunction<any>,
	uploadErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentKeySpecifier = ('id' | 'fulfillmentOrder' | 'status' | 'trackingNumber' | 'created' | 'privateMetadata' | 'metadata' | 'lines' | 'statusDisplay' | 'warehouse' | FulfillmentKeySpecifier)[];
export type FulfillmentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillmentOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	trackingNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentCancelKeySpecifier = ('fulfillment' | 'order' | 'orderErrors' | 'errors' | FulfillmentCancelKeySpecifier)[];
export type FulfillmentCancelFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentLineKeySpecifier = ('id' | 'quantity' | 'orderLine' | FulfillmentLineKeySpecifier)[];
export type FulfillmentLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentRefundProductsKeySpecifier = ('fulfillment' | 'order' | 'orderErrors' | 'errors' | FulfillmentRefundProductsKeySpecifier)[];
export type FulfillmentRefundProductsFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentReturnProductsKeySpecifier = ('returnFulfillment' | 'replaceFulfillment' | 'order' | 'replaceOrder' | 'orderErrors' | 'errors' | FulfillmentReturnProductsKeySpecifier)[];
export type FulfillmentReturnProductsFieldPolicy = {
	returnFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	replaceFulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	replaceOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FulfillmentUpdateTrackingKeySpecifier = ('fulfillment' | 'order' | 'orderErrors' | 'errors' | FulfillmentUpdateTrackingKeySpecifier)[];
export type FulfillmentUpdateTrackingFieldPolicy = {
	fulfillment?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GatewayConfigLineKeySpecifier = ('field' | 'value' | GatewayConfigLineKeySpecifier)[];
export type GatewayConfigLineFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardKeySpecifier = ('code' | 'user' | 'created' | 'startDate' | 'endDate' | 'lastUsedOn' | 'isActive' | 'initialBalance' | 'currentBalance' | 'id' | 'displayCode' | GiftCardKeySpecifier)[];
export type GiftCardFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUsedOn?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	initialBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	currentBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	displayCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardActivateKeySpecifier = ('giftCard' | 'giftCardErrors' | 'errors' | GiftCardActivateKeySpecifier)[];
export type GiftCardActivateFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | GiftCardCountableConnectionKeySpecifier)[];
export type GiftCardCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCountableEdgeKeySpecifier = ('node' | 'cursor' | GiftCardCountableEdgeKeySpecifier)[];
export type GiftCardCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardCreateKeySpecifier = ('giftCardErrors' | 'errors' | 'giftCard' | GiftCardCreateKeySpecifier)[];
export type GiftCardCreateFieldPolicy = {
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardDeactivateKeySpecifier = ('giftCard' | 'giftCardErrors' | 'errors' | GiftCardDeactivateKeySpecifier)[];
export type GiftCardDeactivateFieldPolicy = {
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardErrorKeySpecifier = ('field' | 'message' | 'code' | GiftCardErrorKeySpecifier)[];
export type GiftCardErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GiftCardUpdateKeySpecifier = ('giftCardErrors' | 'errors' | 'giftCard' | GiftCardUpdateKeySpecifier)[];
export type GiftCardUpdateFieldPolicy = {
	giftCardErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupKeySpecifier = ('id' | 'name' | 'permissions' | 'users' | 'userCanManage' | GroupKeySpecifier)[];
export type GroupFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	userCanManage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | GroupCountableConnectionKeySpecifier)[];
export type GroupCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GroupCountableEdgeKeySpecifier = ('node' | 'cursor' | GroupCountableEdgeKeySpecifier)[];
export type GroupCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ImageKeySpecifier = ('url' | 'alt' | ImageKeySpecifier)[];
export type ImageFieldPolicy = {
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	alt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceKeySpecifier = ('id' | 'metadata' | 'status' | 'number' | 'externalUrl' | 'privateMetadata' | 'createdAt' | 'updatedAt' | 'message' | 'url' | InvoiceKeySpecifier)[];
export type InvoiceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	externalUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceCreateKeySpecifier = ('invoiceErrors' | 'errors' | 'invoice' | InvoiceCreateKeySpecifier)[];
export type InvoiceCreateFieldPolicy = {
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceDeleteKeySpecifier = ('invoiceErrors' | 'errors' | 'invoice' | InvoiceDeleteKeySpecifier)[];
export type InvoiceDeleteFieldPolicy = {
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceErrorKeySpecifier = ('field' | 'message' | 'code' | InvoiceErrorKeySpecifier)[];
export type InvoiceErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestKeySpecifier = ('order' | 'invoiceErrors' | 'errors' | 'invoice' | InvoiceRequestKeySpecifier)[];
export type InvoiceRequestFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceRequestDeleteKeySpecifier = ('invoiceErrors' | 'errors' | 'invoice' | InvoiceRequestDeleteKeySpecifier)[];
export type InvoiceRequestDeleteFieldPolicy = {
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceSendNotificationKeySpecifier = ('invoiceErrors' | 'errors' | 'invoice' | InvoiceSendNotificationKeySpecifier)[];
export type InvoiceSendNotificationFieldPolicy = {
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InvoiceUpdateKeySpecifier = ('invoiceErrors' | 'errors' | 'invoice' | InvoiceUpdateKeySpecifier)[];
export type InvoiceUpdateFieldPolicy = {
	invoiceErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	invoice?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JobKeySpecifier = ('status' | 'createdAt' | 'updatedAt' | 'message' | JobKeySpecifier)[];
export type JobFieldPolicy = {
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LanguageDisplayKeySpecifier = ('code' | 'language' | LanguageDisplayKeySpecifier)[];
export type LanguageDisplayFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitInfoKeySpecifier = ('currentUsage' | 'allowedUsage' | LimitInfoKeySpecifier)[];
export type LimitInfoFieldPolicy = {
	currentUsage?: FieldPolicy<any> | FieldReadFunction<any>,
	allowedUsage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LimitsKeySpecifier = ('channels' | 'orders' | 'productVariants' | 'staffUsers' | 'warehouses' | LimitsKeySpecifier)[];
export type LimitsFieldPolicy = {
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ManifestKeySpecifier = ('identifier' | 'version' | 'name' | 'about' | 'permissions' | 'appUrl' | 'configurationUrl' | 'tokenTargetUrl' | 'dataPrivacy' | 'dataPrivacyUrl' | 'homepageUrl' | 'supportUrl' | ManifestKeySpecifier)[];
export type ManifestFieldPolicy = {
	identifier?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	about?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	appUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	configurationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenTargetUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacy?: FieldPolicy<any> | FieldReadFunction<any>,
	dataPrivacyUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	supportUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MarginKeySpecifier = ('start' | 'stop' | MarginKeySpecifier)[];
export type MarginFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuKeySpecifier = ('id' | 'name' | 'slug' | 'privateMetadata' | 'metadata' | 'items' | MenuKeySpecifier)[];
export type MenuFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	items?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuBulkDeleteKeySpecifier = ('count' | 'menuErrors' | 'errors' | MenuBulkDeleteKeySpecifier)[];
export type MenuBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | MenuCountableConnectionKeySpecifier)[];
export type MenuCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCountableEdgeKeySpecifier = ('node' | 'cursor' | MenuCountableEdgeKeySpecifier)[];
export type MenuCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuCreateKeySpecifier = ('menuErrors' | 'errors' | 'menu' | MenuCreateKeySpecifier)[];
export type MenuCreateFieldPolicy = {
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuDeleteKeySpecifier = ('menuErrors' | 'errors' | 'menu' | MenuDeleteKeySpecifier)[];
export type MenuDeleteFieldPolicy = {
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuErrorKeySpecifier = ('field' | 'message' | 'code' | MenuErrorKeySpecifier)[];
export type MenuErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemKeySpecifier = ('id' | 'name' | 'menu' | 'parent' | 'category' | 'collection' | 'page' | 'level' | 'privateMetadata' | 'metadata' | 'children' | 'url' | 'translation' | MenuItemKeySpecifier)[];
export type MenuItemFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	level?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	children?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemBulkDeleteKeySpecifier = ('count' | 'menuErrors' | 'errors' | MenuItemBulkDeleteKeySpecifier)[];
export type MenuItemBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | MenuItemCountableConnectionKeySpecifier)[];
export type MenuItemCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCountableEdgeKeySpecifier = ('node' | 'cursor' | MenuItemCountableEdgeKeySpecifier)[];
export type MenuItemCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemCreateKeySpecifier = ('menuErrors' | 'errors' | 'menuItem' | MenuItemCreateKeySpecifier)[];
export type MenuItemCreateFieldPolicy = {
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemDeleteKeySpecifier = ('menuErrors' | 'errors' | 'menuItem' | MenuItemDeleteKeySpecifier)[];
export type MenuItemDeleteFieldPolicy = {
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemMoveKeySpecifier = ('menu' | 'menuErrors' | 'errors' | MenuItemMoveKeySpecifier)[];
export type MenuItemMoveFieldPolicy = {
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'menuItem' | MenuItemTranslatableContentKeySpecifier)[];
export type MenuItemTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslateKeySpecifier = ('translationErrors' | 'errors' | 'menuItem' | MenuItemTranslateKeySpecifier)[];
export type MenuItemTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemTranslationKeySpecifier = ('id' | 'name' | 'language' | MenuItemTranslationKeySpecifier)[];
export type MenuItemTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuItemUpdateKeySpecifier = ('menuErrors' | 'errors' | 'menuItem' | MenuItemUpdateKeySpecifier)[];
export type MenuItemUpdateFieldPolicy = {
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MenuUpdateKeySpecifier = ('menuErrors' | 'errors' | 'menu' | MenuUpdateKeySpecifier)[];
export type MenuUpdateFieldPolicy = {
	menuErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetadataErrorKeySpecifier = ('field' | 'message' | 'code' | MetadataErrorKeySpecifier)[];
export type MetadataErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MetadataItemKeySpecifier = ('key' | 'value' | MetadataItemKeySpecifier)[];
export type MetadataItemFieldPolicy = {
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MoneyKeySpecifier = ('currency' | 'amount' | MoneyKeySpecifier)[];
export type MoneyFieldPolicy = {
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MoneyRangeKeySpecifier = ('start' | 'stop' | MoneyRangeKeySpecifier)[];
export type MoneyRangeFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	stop?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('webhookCreate' | 'webhookDelete' | 'webhookUpdate' | 'createWarehouse' | 'updateWarehouse' | 'deleteWarehouse' | 'assignWarehouseShippingZone' | 'unassignWarehouseShippingZone' | 'staffNotificationRecipientCreate' | 'staffNotificationRecipientUpdate' | 'staffNotificationRecipientDelete' | 'shopDomainUpdate' | 'shopSettingsUpdate' | 'shopFetchTaxRates' | 'shopSettingsTranslate' | 'shopAddressUpdate' | 'orderSettingsUpdate' | 'shippingMethodChannelListingUpdate' | 'shippingPriceCreate' | 'shippingPriceDelete' | 'shippingPriceBulkDelete' | 'shippingPriceUpdate' | 'shippingPriceTranslate' | 'shippingPriceExcludeProducts' | 'shippingPriceRemoveProductFromExclude' | 'shippingZoneCreate' | 'shippingZoneDelete' | 'shippingZoneBulkDelete' | 'shippingZoneUpdate' | 'productAttributeAssign' | 'productAttributeUnassign' | 'categoryCreate' | 'categoryDelete' | 'categoryBulkDelete' | 'categoryUpdate' | 'categoryTranslate' | 'collectionAddProducts' | 'collectionCreate' | 'collectionDelete' | 'collectionReorderProducts' | 'collectionBulkDelete' | 'collectionRemoveProducts' | 'collectionUpdate' | 'collectionTranslate' | 'collectionChannelListingUpdate' | 'productCreate' | 'productDelete' | 'productBulkDelete' | 'productUpdate' | 'productTranslate' | 'productChannelListingUpdate' | 'productMediaCreate' | 'productVariantReorder' | 'productMediaDelete' | 'productMediaBulkDelete' | 'productMediaReorder' | 'productMediaUpdate' | 'productTypeCreate' | 'productTypeDelete' | 'productTypeBulkDelete' | 'productTypeUpdate' | 'productTypeReorderAttributes' | 'productReorderAttributeValues' | 'digitalContentCreate' | 'digitalContentDelete' | 'digitalContentUpdate' | 'digitalContentUrlCreate' | 'productVariantCreate' | 'productVariantDelete' | 'productVariantBulkCreate' | 'productVariantBulkDelete' | 'productVariantStocksCreate' | 'productVariantStocksDelete' | 'productVariantStocksUpdate' | 'productVariantUpdate' | 'productVariantSetDefault' | 'productVariantTranslate' | 'productVariantChannelListingUpdate' | 'productVariantReorderAttributeValues' | 'variantMediaAssign' | 'variantMediaUnassign' | 'paymentCapture' | 'paymentRefund' | 'paymentVoid' | 'paymentInitialize' | 'pageCreate' | 'pageDelete' | 'pageBulkDelete' | 'pageBulkPublish' | 'pageUpdate' | 'pageTranslate' | 'pageTypeCreate' | 'pageTypeUpdate' | 'pageTypeDelete' | 'pageTypeBulkDelete' | 'pageAttributeAssign' | 'pageAttributeUnassign' | 'pageTypeReorderAttributes' | 'pageReorderAttributeValues' | 'draftOrderComplete' | 'draftOrderCreate' | 'draftOrderDelete' | 'draftOrderBulkDelete' | 'draftOrderLinesBulkDelete' | 'draftOrderUpdate' | 'orderAddNote' | 'orderCancel' | 'orderCapture' | 'orderConfirm' | 'orderFulfill' | 'orderFulfillmentCancel' | 'orderFulfillmentUpdateTracking' | 'orderFulfillmentRefundProducts' | 'orderFulfillmentReturnProducts' | 'orderLinesCreate' | 'orderLineDelete' | 'orderLineUpdate' | 'orderDiscountAdd' | 'orderDiscountUpdate' | 'orderDiscountDelete' | 'orderLineDiscountUpdate' | 'orderLineDiscountRemove' | 'orderMarkAsPaid' | 'orderRefund' | 'orderUpdate' | 'orderUpdateShipping' | 'orderVoid' | 'orderBulkCancel' | 'deleteMetadata' | 'deletePrivateMetadata' | 'updateMetadata' | 'updatePrivateMetadata' | 'assignNavigation' | 'menuCreate' | 'menuDelete' | 'menuBulkDelete' | 'menuUpdate' | 'menuItemCreate' | 'menuItemDelete' | 'menuItemBulkDelete' | 'menuItemUpdate' | 'menuItemTranslate' | 'menuItemMove' | 'invoiceRequest' | 'invoiceRequestDelete' | 'invoiceCreate' | 'invoiceDelete' | 'invoiceUpdate' | 'invoiceSendNotification' | 'giftCardActivate' | 'giftCardCreate' | 'giftCardDeactivate' | 'giftCardUpdate' | 'pluginUpdate' | 'saleCreate' | 'saleDelete' | 'saleBulkDelete' | 'saleUpdate' | 'saleCataloguesAdd' | 'saleCataloguesRemove' | 'saleTranslate' | 'saleChannelListingUpdate' | 'voucherCreate' | 'voucherDelete' | 'voucherBulkDelete' | 'voucherUpdate' | 'voucherCataloguesAdd' | 'voucherCataloguesRemove' | 'voucherTranslate' | 'voucherChannelListingUpdate' | 'exportProducts' | 'fileUpload' | 'checkoutAddPromoCode' | 'checkoutBillingAddressUpdate' | 'checkoutComplete' | 'checkoutCreate' | 'checkoutCustomerAttach' | 'checkoutCustomerDetach' | 'checkoutEmailUpdate' | 'checkoutLineDelete' | 'checkoutLinesAdd' | 'checkoutLinesUpdate' | 'checkoutRemovePromoCode' | 'checkoutPaymentCreate' | 'checkoutShippingAddressUpdate' | 'checkoutShippingMethodUpdate' | 'checkoutLanguageCodeUpdate' | 'channelCreate' | 'channelUpdate' | 'channelDelete' | 'channelActivate' | 'channelDeactivate' | 'attributeCreate' | 'attributeDelete' | 'attributeUpdate' | 'attributeTranslate' | 'attributeBulkDelete' | 'attributeValueBulkDelete' | 'attributeValueCreate' | 'attributeValueDelete' | 'attributeValueUpdate' | 'attributeValueTranslate' | 'attributeReorderValues' | 'appCreate' | 'appUpdate' | 'appDelete' | 'appTokenCreate' | 'appTokenDelete' | 'appTokenVerify' | 'appInstall' | 'appRetryInstall' | 'appDeleteFailedInstallation' | 'appFetchManifest' | 'appActivate' | 'appDeactivate' | 'tokenCreate' | 'tokenRefresh' | 'tokenVerify' | 'tokensDeactivateAll' | 'externalAuthenticationUrl' | 'externalObtainAccessTokens' | 'externalRefresh' | 'externalLogout' | 'externalVerify' | 'requestPasswordReset' | 'confirmAccount' | 'setPassword' | 'passwordChange' | 'requestEmailChange' | 'confirmEmailChange' | 'accountAddressCreate' | 'accountAddressUpdate' | 'accountAddressDelete' | 'accountSetDefaultAddress' | 'accountRegister' | 'accountUpdate' | 'accountRequestDeletion' | 'accountDelete' | 'addressCreate' | 'addressUpdate' | 'addressDelete' | 'addressSetDefault' | 'customerCreate' | 'customerUpdate' | 'customerDelete' | 'customerBulkDelete' | 'staffCreate' | 'staffUpdate' | 'staffDelete' | 'staffBulkDelete' | 'userAvatarUpdate' | 'userAvatarDelete' | 'userBulkSetActive' | 'permissionGroupCreate' | 'permissionGroupUpdate' | 'permissionGroupDelete' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	webhookCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	createWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	updateWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteWarehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	assignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	unassignWarehouseShippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipientDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shopDomainUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopFetchTaxRates?: FieldPolicy<any> | FieldReadFunction<any>,
	shopSettingsTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	shopAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettingsUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceExcludeProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPriceRemoveProductFromExclude?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZoneUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	categoryTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionAddProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionReorderProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionRemoveProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	collectionChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantReorder?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaReorder?: FieldPolicy<any> | FieldReadFunction<any>,
	productMediaUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	productReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrlCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantStocksUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantSetDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariantReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	variantMediaAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	variantMediaUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentCapture?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentVoid?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentInitialize?: FieldPolicy<any> | FieldReadFunction<any>,
	pageCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageBulkPublish?: FieldPolicy<any> | FieldReadFunction<any>,
	pageUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	pageAttributeAssign?: FieldPolicy<any> | FieldReadFunction<any>,
	pageAttributeUnassign?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypeReorderAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageReorderAttributeValues?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderComplete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderLinesBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrderUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderAddNote?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderCapture?: FieldPolicy<any> | FieldReadFunction<any>,
	orderConfirm?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfill?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentUpdateTracking?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentRefundProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	orderFulfillmentReturnProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLinesCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderDiscountDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDiscountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLineDiscountRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	orderMarkAsPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	orderRefund?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	orderUpdateShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	orderVoid?: FieldPolicy<any> | FieldReadFunction<any>,
	orderBulkCancel?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	deletePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	updateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePrivateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	assignNavigation?: FieldPolicy<any> | FieldReadFunction<any>,
	menuCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItemMove?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceRequest?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceRequestDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceSendNotification?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCardUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	pluginUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	saleBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	saleUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	saleCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	saleTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	saleChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCataloguesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherCataloguesRemove?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	voucherChannelListingUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	exportProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	fileUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutAddPromoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutBillingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutComplete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerAttach?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutCustomerDetach?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutEmailUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLineDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesAdd?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLinesUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutRemovePromoCode?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutPaymentCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutShippingAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutShippingMethodUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLanguageCodeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	channelActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	channelDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValueTranslate?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeReorderValues?: FieldPolicy<any> | FieldReadFunction<any>,
	appCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	appUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	appDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	appTokenVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	appInstall?: FieldPolicy<any> | FieldReadFunction<any>,
	appRetryInstall?: FieldPolicy<any> | FieldReadFunction<any>,
	appDeleteFailedInstallation?: FieldPolicy<any> | FieldReadFunction<any>,
	appFetchManifest?: FieldPolicy<any> | FieldReadFunction<any>,
	appActivate?: FieldPolicy<any> | FieldReadFunction<any>,
	appDeactivate?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenRefresh?: FieldPolicy<any> | FieldReadFunction<any>,
	tokenVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	tokensDeactivateAll?: FieldPolicy<any> | FieldReadFunction<any>,
	externalAuthenticationUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	externalObtainAccessTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	externalRefresh?: FieldPolicy<any> | FieldReadFunction<any>,
	externalLogout?: FieldPolicy<any> | FieldReadFunction<any>,
	externalVerify?: FieldPolicy<any> | FieldReadFunction<any>,
	requestPasswordReset?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	setPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	passwordChange?: FieldPolicy<any> | FieldReadFunction<any>,
	requestEmailChange?: FieldPolicy<any> | FieldReadFunction<any>,
	confirmEmailChange?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountAddressDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	accountSetDefaultAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	accountRegister?: FieldPolicy<any> | FieldReadFunction<any>,
	accountUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	accountRequestDeletion?: FieldPolicy<any> | FieldReadFunction<any>,
	accountDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	addressCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	addressUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	addressDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	addressSetDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	customerCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	customerUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	customerDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	customerBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	staffDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	staffBulkDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	userAvatarUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	userAvatarDelete?: FieldPolicy<any> | FieldReadFunction<any>,
	userBulkSetActive?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupCreate?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupUpdate?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroupDelete?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ObjectWithMetadataKeySpecifier = ('privateMetadata' | 'metadata' | ObjectWithMetadataKeySpecifier)[];
export type ObjectWithMetadataFieldPolicy = {
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderKeySpecifier = ('id' | 'created' | 'status' | 'user' | 'trackingClientId' | 'billingAddress' | 'shippingAddress' | 'shippingMethod' | 'shippingMethodName' | 'channel' | 'shippingPrice' | 'shippingTaxRate' | 'token' | 'voucher' | 'giftCards' | 'displayGrossPrices' | 'customerNote' | 'weight' | 'redirectUrl' | 'privateMetadata' | 'metadata' | 'fulfillments' | 'lines' | 'actions' | 'availableShippingMethods' | 'invoices' | 'number' | 'original' | 'origin' | 'isPaid' | 'paymentStatus' | 'paymentStatusDisplay' | 'payments' | 'total' | 'undiscountedTotal' | 'subtotal' | 'statusDisplay' | 'canFinalize' | 'totalAuthorized' | 'totalCaptured' | 'events' | 'totalBalance' | 'userEmail' | 'isShippingRequired' | 'languageCode' | 'languageCodeEnum' | 'discount' | 'discountName' | 'translatedDiscountName' | 'discounts' | 'errors' | OrderKeySpecifier)[];
export type OrderFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	trackingClientId?: FieldPolicy<any> | FieldReadFunction<any>,
	billingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethodName?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingTaxRate?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	customerNote?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>,
	redirectUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfillments?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	invoices?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	original?: FieldPolicy<any> | FieldReadFunction<any>,
	origin?: FieldPolicy<any> | FieldReadFunction<any>,
	isPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentStatusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	subtotal?: FieldPolicy<any> | FieldReadFunction<any>,
	statusDisplay?: FieldPolicy<any> | FieldReadFunction<any>,
	canFinalize?: FieldPolicy<any> | FieldReadFunction<any>,
	totalAuthorized?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCaptured?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	totalBalance?: FieldPolicy<any> | FieldReadFunction<any>,
	userEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCodeEnum?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountName?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedDiscountName?: FieldPolicy<any> | FieldReadFunction<any>,
	discounts?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderAddNoteKeySpecifier = ('order' | 'event' | 'orderErrors' | 'errors' | OrderAddNoteKeySpecifier)[];
export type OrderAddNoteFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderBulkCancelKeySpecifier = ('count' | 'orderErrors' | 'errors' | OrderBulkCancelKeySpecifier)[];
export type OrderBulkCancelFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCancelKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderCancelKeySpecifier)[];
export type OrderCancelFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCaptureKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderCaptureKeySpecifier)[];
export type OrderCaptureFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderConfirmKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderConfirmKeySpecifier)[];
export type OrderConfirmFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | OrderCountableConnectionKeySpecifier)[];
export type OrderCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderCountableEdgeKeySpecifier = ('node' | 'cursor' | OrderCountableEdgeKeySpecifier)[];
export type OrderCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountKeySpecifier = ('id' | 'type' | 'valueType' | 'value' | 'name' | 'translatedName' | 'reason' | 'amount' | OrderDiscountKeySpecifier)[];
export type OrderDiscountFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	valueType?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedName?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountAddKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderDiscountAddKeySpecifier)[];
export type OrderDiscountAddFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountDeleteKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderDiscountDeleteKeySpecifier)[];
export type OrderDiscountDeleteFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderDiscountUpdateKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderDiscountUpdateKeySpecifier)[];
export type OrderDiscountUpdateFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderErrorKeySpecifier = ('field' | 'message' | 'code' | 'warehouse' | 'orderLines' | 'variants' | 'addressType' | OrderErrorKeySpecifier)[];
export type OrderErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLines?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	addressType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventKeySpecifier = ('id' | 'date' | 'type' | 'user' | 'app' | 'message' | 'email' | 'emailType' | 'amount' | 'paymentId' | 'paymentGateway' | 'quantity' | 'composedId' | 'orderNumber' | 'invoiceNumber' | 'oversoldItems' | 'lines' | 'fulfilledItems' | 'warehouse' | 'transactionReference' | 'shippingCostsIncluded' | 'relatedOrder' | 'discount' | OrderEventKeySpecifier)[];
export type OrderEventFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	emailType?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentId?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentGateway?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	composedId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	invoiceNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	oversoldItems?: FieldPolicy<any> | FieldReadFunction<any>,
	lines?: FieldPolicy<any> | FieldReadFunction<any>,
	fulfilledItems?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	transactionReference?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingCostsIncluded?: FieldPolicy<any> | FieldReadFunction<any>,
	relatedOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | OrderEventCountableConnectionKeySpecifier)[];
export type OrderEventCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventCountableEdgeKeySpecifier = ('node' | 'cursor' | OrderEventCountableEdgeKeySpecifier)[];
export type OrderEventCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventDiscountObjectKeySpecifier = ('valueType' | 'value' | 'reason' | 'amount' | 'oldValueType' | 'oldValue' | 'oldAmount' | OrderEventDiscountObjectKeySpecifier)[];
export type OrderEventDiscountObjectFieldPolicy = {
	valueType?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>,
	reason?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	oldValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	oldValue?: FieldPolicy<any> | FieldReadFunction<any>,
	oldAmount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderEventOrderLineObjectKeySpecifier = ('quantity' | 'orderLine' | 'itemName' | 'discount' | OrderEventOrderLineObjectKeySpecifier)[];
export type OrderEventOrderLineObjectFieldPolicy = {
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	itemName?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderFulfillKeySpecifier = ('fulfillments' | 'order' | 'orderErrors' | 'errors' | OrderFulfillKeySpecifier)[];
export type OrderFulfillFieldPolicy = {
	fulfillments?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineKeySpecifier = ('id' | 'productName' | 'variantName' | 'productSku' | 'isShippingRequired' | 'quantity' | 'quantityFulfilled' | 'unitDiscountReason' | 'taxRate' | 'digitalContentUrl' | 'thumbnail' | 'unitPrice' | 'undiscountedUnitPrice' | 'unitDiscount' | 'unitDiscountValue' | 'totalPrice' | 'variant' | 'translatedProductName' | 'translatedVariantName' | 'allocations' | 'unitDiscountType' | OrderLineKeySpecifier)[];
export type OrderLineFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	productName?: FieldPolicy<any> | FieldReadFunction<any>,
	variantName?: FieldPolicy<any> | FieldReadFunction<any>,
	productSku?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityFulfilled?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountReason?: FieldPolicy<any> | FieldReadFunction<any>,
	taxRate?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContentUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	unitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	undiscountedUnitPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscount?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	totalPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedProductName?: FieldPolicy<any> | FieldReadFunction<any>,
	translatedVariantName?: FieldPolicy<any> | FieldReadFunction<any>,
	allocations?: FieldPolicy<any> | FieldReadFunction<any>,
	unitDiscountType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDeleteKeySpecifier = ('order' | 'orderLine' | 'orderErrors' | 'errors' | OrderLineDeleteKeySpecifier)[];
export type OrderLineDeleteFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountRemoveKeySpecifier = ('orderLine' | 'order' | 'orderErrors' | 'errors' | OrderLineDiscountRemoveKeySpecifier)[];
export type OrderLineDiscountRemoveFieldPolicy = {
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineDiscountUpdateKeySpecifier = ('orderLine' | 'order' | 'orderErrors' | 'errors' | OrderLineDiscountUpdateKeySpecifier)[];
export type OrderLineDiscountUpdateFieldPolicy = {
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLineUpdateKeySpecifier = ('order' | 'orderErrors' | 'errors' | 'orderLine' | OrderLineUpdateKeySpecifier)[];
export type OrderLineUpdateFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLine?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderLinesCreateKeySpecifier = ('order' | 'orderLines' | 'orderErrors' | 'errors' | OrderLinesCreateKeySpecifier)[];
export type OrderLinesCreateFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderLines?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderMarkAsPaidKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderMarkAsPaidKeySpecifier)[];
export type OrderMarkAsPaidFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderRefundKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderRefundKeySpecifier)[];
export type OrderRefundFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsKeySpecifier = ('automaticallyConfirmAllNewOrders' | OrderSettingsKeySpecifier)[];
export type OrderSettingsFieldPolicy = {
	automaticallyConfirmAllNewOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsErrorKeySpecifier = ('field' | 'message' | 'code' | OrderSettingsErrorKeySpecifier)[];
export type OrderSettingsErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderSettingsUpdateKeySpecifier = ('orderSettings' | 'orderSettingsErrors' | 'errors' | OrderSettingsUpdateKeySpecifier)[];
export type OrderSettingsUpdateFieldPolicy = {
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettingsErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdateKeySpecifier = ('orderErrors' | 'errors' | 'order' | OrderUpdateKeySpecifier)[];
export type OrderUpdateFieldPolicy = {
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderUpdateShippingKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderUpdateShippingKeySpecifier)[];
export type OrderUpdateShippingFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OrderVoidKeySpecifier = ('order' | 'orderErrors' | 'errors' | OrderVoidKeySpecifier)[];
export type OrderVoidFieldPolicy = {
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orderErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'title' | 'content' | 'publicationDate' | 'isPublished' | 'slug' | 'pageType' | 'created' | 'privateMetadata' | 'metadata' | 'contentJson' | 'translation' | 'attributes' | PageKeySpecifier)[];
export type PageFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageAttributeAssignKeySpecifier = ('pageType' | 'pageErrors' | 'errors' | PageAttributeAssignKeySpecifier)[];
export type PageAttributeAssignFieldPolicy = {
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageAttributeUnassignKeySpecifier = ('pageType' | 'pageErrors' | 'errors' | PageAttributeUnassignKeySpecifier)[];
export type PageAttributeUnassignFieldPolicy = {
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageBulkDeleteKeySpecifier = ('count' | 'pageErrors' | 'errors' | PageBulkDeleteKeySpecifier)[];
export type PageBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageBulkPublishKeySpecifier = ('count' | 'pageErrors' | 'errors' | PageBulkPublishKeySpecifier)[];
export type PageBulkPublishFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | PageCountableConnectionKeySpecifier)[];
export type PageCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCountableEdgeKeySpecifier = ('node' | 'cursor' | PageCountableEdgeKeySpecifier)[];
export type PageCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageCreateKeySpecifier = ('pageErrors' | 'errors' | 'page' | PageCreateKeySpecifier)[];
export type PageCreateFieldPolicy = {
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageDeleteKeySpecifier = ('pageErrors' | 'errors' | 'page' | PageDeleteKeySpecifier)[];
export type PageDeleteFieldPolicy = {
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageErrorKeySpecifier = ('field' | 'message' | 'code' | 'attributes' | 'values' | PageErrorKeySpecifier)[];
export type PageErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageReorderAttributeValuesKeySpecifier = ('page' | 'pageErrors' | 'errors' | PageReorderAttributeValuesKeySpecifier)[];
export type PageReorderAttributeValuesFieldPolicy = {
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslatableContentKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'title' | 'content' | 'contentJson' | 'translation' | 'page' | 'attributeValues' | PageTranslatableContentKeySpecifier)[];
export type PageTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslateKeySpecifier = ('translationErrors' | 'errors' | 'page' | PageTranslateKeySpecifier)[];
export type PageTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTranslationKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'title' | 'content' | 'language' | 'contentJson' | PageTranslationKeySpecifier)[];
export type PageTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	contentJson?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeKeySpecifier = ('id' | 'name' | 'slug' | 'privateMetadata' | 'metadata' | 'attributes' | 'availableAttributes' | 'hasPages' | PageTypeKeySpecifier)[];
export type PageTypeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeBulkDeleteKeySpecifier = ('count' | 'pageErrors' | 'errors' | PageTypeBulkDeleteKeySpecifier)[];
export type PageTypeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | PageTypeCountableConnectionKeySpecifier)[];
export type PageTypeCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCountableEdgeKeySpecifier = ('node' | 'cursor' | PageTypeCountableEdgeKeySpecifier)[];
export type PageTypeCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeCreateKeySpecifier = ('pageErrors' | 'errors' | 'pageType' | PageTypeCreateKeySpecifier)[];
export type PageTypeCreateFieldPolicy = {
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeDeleteKeySpecifier = ('pageErrors' | 'errors' | 'pageType' | PageTypeDeleteKeySpecifier)[];
export type PageTypeDeleteFieldPolicy = {
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeReorderAttributesKeySpecifier = ('pageType' | 'pageErrors' | 'errors' | PageTypeReorderAttributesKeySpecifier)[];
export type PageTypeReorderAttributesFieldPolicy = {
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageTypeUpdateKeySpecifier = ('pageErrors' | 'errors' | 'pageType' | PageTypeUpdateKeySpecifier)[];
export type PageTypeUpdateFieldPolicy = {
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageUpdateKeySpecifier = ('pageErrors' | 'errors' | 'page' | PageUpdateKeySpecifier)[];
export type PageUpdateFieldPolicy = {
	pageErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PasswordChangeKeySpecifier = ('user' | 'accountErrors' | 'errors' | PasswordChangeKeySpecifier)[];
export type PasswordChangeFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentKeySpecifier = ('id' | 'gateway' | 'isActive' | 'created' | 'modified' | 'token' | 'checkout' | 'order' | 'paymentMethodType' | 'customerIpAddress' | 'chargeStatus' | 'actions' | 'total' | 'capturedAmount' | 'transactions' | 'availableCaptureAmount' | 'availableRefundAmount' | 'creditCard' | PaymentKeySpecifier)[];
export type PaymentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	modified?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodType?: FieldPolicy<any> | FieldReadFunction<any>,
	customerIpAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	actions?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>,
	capturedAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	transactions?: FieldPolicy<any> | FieldReadFunction<any>,
	availableCaptureAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	availableRefundAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	creditCard?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCaptureKeySpecifier = ('payment' | 'paymentErrors' | 'errors' | PaymentCaptureKeySpecifier)[];
export type PaymentCaptureFieldPolicy = {
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | PaymentCountableConnectionKeySpecifier)[];
export type PaymentCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentCountableEdgeKeySpecifier = ('node' | 'cursor' | PaymentCountableEdgeKeySpecifier)[];
export type PaymentCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentErrorKeySpecifier = ('field' | 'message' | 'code' | PaymentErrorKeySpecifier)[];
export type PaymentErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentGatewayKeySpecifier = ('name' | 'id' | 'config' | 'currencies' | PaymentGatewayKeySpecifier)[];
export type PaymentGatewayFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	config?: FieldPolicy<any> | FieldReadFunction<any>,
	currencies?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentInitializeKeySpecifier = ('initializedPayment' | 'paymentErrors' | 'errors' | PaymentInitializeKeySpecifier)[];
export type PaymentInitializeFieldPolicy = {
	initializedPayment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentInitializedKeySpecifier = ('gateway' | 'name' | 'data' | PaymentInitializedKeySpecifier)[];
export type PaymentInitializedFieldPolicy = {
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentRefundKeySpecifier = ('payment' | 'paymentErrors' | 'errors' | PaymentRefundKeySpecifier)[];
export type PaymentRefundFieldPolicy = {
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentSourceKeySpecifier = ('gateway' | 'paymentMethodId' | 'creditCardInfo' | PaymentSourceKeySpecifier)[];
export type PaymentSourceFieldPolicy = {
	gateway?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentMethodId?: FieldPolicy<any> | FieldReadFunction<any>,
	creditCardInfo?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaymentVoidKeySpecifier = ('payment' | 'paymentErrors' | 'errors' | PaymentVoidKeySpecifier)[];
export type PaymentVoidFieldPolicy = {
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	paymentErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionKeySpecifier = ('code' | 'name' | PermissionKeySpecifier)[];
export type PermissionFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupCreateKeySpecifier = ('permissionGroupErrors' | 'errors' | 'group' | PermissionGroupCreateKeySpecifier)[];
export type PermissionGroupCreateFieldPolicy = {
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupDeleteKeySpecifier = ('permissionGroupErrors' | 'errors' | 'group' | PermissionGroupDeleteKeySpecifier)[];
export type PermissionGroupDeleteFieldPolicy = {
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupErrorKeySpecifier = ('field' | 'message' | 'code' | 'permissions' | 'users' | PermissionGroupErrorKeySpecifier)[];
export type PermissionGroupErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PermissionGroupUpdateKeySpecifier = ('permissionGroupErrors' | 'errors' | 'group' | PermissionGroupUpdateKeySpecifier)[];
export type PermissionGroupUpdateFieldPolicy = {
	permissionGroupErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	group?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginKeySpecifier = ('id' | 'name' | 'description' | 'globalConfiguration' | 'channelConfigurations' | PluginKeySpecifier)[];
export type PluginFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	globalConfiguration?: FieldPolicy<any> | FieldReadFunction<any>,
	channelConfigurations?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginConfigurationKeySpecifier = ('active' | 'channel' | 'configuration' | PluginConfigurationKeySpecifier)[];
export type PluginConfigurationFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	configuration?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | PluginCountableConnectionKeySpecifier)[];
export type PluginCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginCountableEdgeKeySpecifier = ('node' | 'cursor' | PluginCountableEdgeKeySpecifier)[];
export type PluginCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginErrorKeySpecifier = ('field' | 'message' | 'code' | PluginErrorKeySpecifier)[];
export type PluginErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PluginUpdateKeySpecifier = ('plugin' | 'pluginsErrors' | 'errors' | PluginUpdateKeySpecifier)[];
export type PluginUpdateFieldPolicy = {
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	pluginsErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'productType' | 'slug' | 'category' | 'updatedAt' | 'chargeTaxes' | 'weight' | 'defaultVariant' | 'rating' | 'privateMetadata' | 'metadata' | 'descriptionJson' | 'thumbnail' | 'pricing' | 'isAvailable' | 'taxType' | 'attributes' | 'channelListings' | 'mediaById' | 'imageById' | 'variants' | 'media' | 'images' | 'collections' | 'translation' | 'availableForPurchase' | 'isAvailableForPurchase' | ProductKeySpecifier)[];
export type ProductFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxes?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	rating?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailable?: FieldPolicy<any> | FieldReadFunction<any>,
	taxType?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	mediaById?: FieldPolicy<any> | FieldReadFunction<any>,
	imageById?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeAssignKeySpecifier = ('productType' | 'productErrors' | 'errors' | ProductAttributeAssignKeySpecifier)[];
export type ProductAttributeAssignFieldPolicy = {
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductAttributeUnassignKeySpecifier = ('productType' | 'productErrors' | 'errors' | ProductAttributeUnassignKeySpecifier)[];
export type ProductAttributeUnassignFieldPolicy = {
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductBulkDeleteKeySpecifier = ('count' | 'productErrors' | 'errors' | ProductBulkDeleteKeySpecifier)[];
export type ProductBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingKeySpecifier = ('id' | 'publicationDate' | 'isPublished' | 'channel' | 'visibleInListings' | 'availableForPurchase' | 'discountedPrice' | 'purchaseCost' | 'margin' | 'isAvailableForPurchase' | 'pricing' | ProductChannelListingKeySpecifier)[];
export type ProductChannelListingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	publicationDate?: FieldPolicy<any> | FieldReadFunction<any>,
	isPublished?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	visibleInListings?: FieldPolicy<any> | FieldReadFunction<any>,
	availableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	discountedPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	purchaseCost?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	isAvailableForPurchase?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingErrorKeySpecifier = ('field' | 'message' | 'code' | 'attributes' | 'values' | 'channels' | 'variants' | ProductChannelListingErrorKeySpecifier)[];
export type ProductChannelListingErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	variants?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductChannelListingUpdateKeySpecifier = ('product' | 'productChannelListingErrors' | 'errors' | ProductChannelListingUpdateKeySpecifier)[];
export type ProductChannelListingUpdateFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | ProductCountableConnectionKeySpecifier)[];
export type ProductCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCountableEdgeKeySpecifier = ('node' | 'cursor' | ProductCountableEdgeKeySpecifier)[];
export type ProductCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductCreateKeySpecifier = ('productErrors' | 'errors' | 'product' | ProductCreateKeySpecifier)[];
export type ProductCreateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductDeleteKeySpecifier = ('productErrors' | 'errors' | 'product' | ProductDeleteKeySpecifier)[];
export type ProductDeleteFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductErrorKeySpecifier = ('field' | 'message' | 'code' | 'attributes' | 'values' | ProductErrorKeySpecifier)[];
export type ProductErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	values?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductImageKeySpecifier = ('id' | 'alt' | 'sortOrder' | 'url' | ProductImageKeySpecifier)[];
export type ProductImageFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	sortOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaKeySpecifier = ('id' | 'sortOrder' | 'alt' | 'type' | 'oembedData' | 'url' | ProductMediaKeySpecifier)[];
export type ProductMediaFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sortOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	alt?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	oembedData?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaBulkDeleteKeySpecifier = ('count' | 'productErrors' | 'errors' | ProductMediaBulkDeleteKeySpecifier)[];
export type ProductMediaBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaCreateKeySpecifier = ('product' | 'media' | 'productErrors' | 'errors' | ProductMediaCreateKeySpecifier)[];
export type ProductMediaCreateFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaDeleteKeySpecifier = ('product' | 'media' | 'productErrors' | 'errors' | ProductMediaDeleteKeySpecifier)[];
export type ProductMediaDeleteFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaReorderKeySpecifier = ('product' | 'media' | 'productErrors' | 'errors' | ProductMediaReorderKeySpecifier)[];
export type ProductMediaReorderFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductMediaUpdateKeySpecifier = ('product' | 'media' | 'productErrors' | 'errors' | ProductMediaUpdateKeySpecifier)[];
export type ProductMediaUpdateFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductPricingInfoKeySpecifier = ('onSale' | 'discount' | 'discountLocalCurrency' | 'priceRange' | 'priceRangeUndiscounted' | 'priceRangeLocalCurrency' | ProductPricingInfoKeySpecifier)[];
export type ProductPricingInfoFieldPolicy = {
	onSale?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRange?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangeUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRangeLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductReorderAttributeValuesKeySpecifier = ('product' | 'productErrors' | 'errors' | ProductReorderAttributeValuesKeySpecifier)[];
export type ProductReorderAttributeValuesFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslatableContentKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'descriptionJson' | 'translation' | 'product' | 'attributeValues' | ProductTranslatableContentKeySpecifier)[];
export type ProductTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslateKeySpecifier = ('translationErrors' | 'errors' | 'product' | ProductTranslateKeySpecifier)[];
export type ProductTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTranslationKeySpecifier = ('id' | 'seoTitle' | 'seoDescription' | 'name' | 'description' | 'language' | 'descriptionJson' | ProductTranslationKeySpecifier)[];
export type ProductTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	seoTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	seoDescription?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionJson?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeKeySpecifier = ('id' | 'name' | 'slug' | 'hasVariants' | 'isShippingRequired' | 'isDigital' | 'weight' | 'privateMetadata' | 'metadata' | 'products' | 'taxType' | 'variantAttributes' | 'productAttributes' | 'availableAttributes' | ProductTypeKeySpecifier)[];
export type ProductTypeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	hasVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	isShippingRequired?: FieldPolicy<any> | FieldReadFunction<any>,
	isDigital?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	taxType?: FieldPolicy<any> | FieldReadFunction<any>,
	variantAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	productAttributes?: FieldPolicy<any> | FieldReadFunction<any>,
	availableAttributes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeBulkDeleteKeySpecifier = ('count' | 'productErrors' | 'errors' | ProductTypeBulkDeleteKeySpecifier)[];
export type ProductTypeBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | ProductTypeCountableConnectionKeySpecifier)[];
export type ProductTypeCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCountableEdgeKeySpecifier = ('node' | 'cursor' | ProductTypeCountableEdgeKeySpecifier)[];
export type ProductTypeCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeCreateKeySpecifier = ('productErrors' | 'errors' | 'productType' | ProductTypeCreateKeySpecifier)[];
export type ProductTypeCreateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeDeleteKeySpecifier = ('productErrors' | 'errors' | 'productType' | ProductTypeDeleteKeySpecifier)[];
export type ProductTypeDeleteFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeReorderAttributesKeySpecifier = ('productType' | 'productErrors' | 'errors' | ProductTypeReorderAttributesKeySpecifier)[];
export type ProductTypeReorderAttributesFieldPolicy = {
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductTypeUpdateKeySpecifier = ('productErrors' | 'errors' | 'productType' | ProductTypeUpdateKeySpecifier)[];
export type ProductTypeUpdateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductUpdateKeySpecifier = ('productErrors' | 'errors' | 'product' | ProductUpdateKeySpecifier)[];
export type ProductUpdateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantKeySpecifier = ('id' | 'name' | 'sku' | 'product' | 'trackInventory' | 'weight' | 'privateMetadata' | 'metadata' | 'channelListings' | 'pricing' | 'attributes' | 'margin' | 'quantityOrdered' | 'revenue' | 'images' | 'media' | 'translation' | 'digitalContent' | 'stocks' | 'quantityAvailable' | ProductVariantKeySpecifier)[];
export type ProductVariantFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sku?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	trackInventory?: FieldPolicy<any> | FieldReadFunction<any>,
	weight?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	pricing?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityOrdered?: FieldPolicy<any> | FieldReadFunction<any>,
	revenue?: FieldPolicy<any> | FieldReadFunction<any>,
	images?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContent?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityAvailable?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkCreateKeySpecifier = ('count' | 'productVariants' | 'bulkProductErrors' | 'errors' | ProductVariantBulkCreateKeySpecifier)[];
export type ProductVariantBulkCreateFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	bulkProductErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantBulkDeleteKeySpecifier = ('count' | 'productErrors' | 'errors' | ProductVariantBulkDeleteKeySpecifier)[];
export type ProductVariantBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantChannelListingKeySpecifier = ('id' | 'channel' | 'price' | 'costPrice' | 'margin' | ProductVariantChannelListingKeySpecifier)[];
export type ProductVariantChannelListingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	costPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	margin?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantChannelListingUpdateKeySpecifier = ('variant' | 'productChannelListingErrors' | 'errors' | ProductVariantChannelListingUpdateKeySpecifier)[];
export type ProductVariantChannelListingUpdateFieldPolicy = {
	variant?: FieldPolicy<any> | FieldReadFunction<any>,
	productChannelListingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | ProductVariantCountableConnectionKeySpecifier)[];
export type ProductVariantCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCountableEdgeKeySpecifier = ('node' | 'cursor' | ProductVariantCountableEdgeKeySpecifier)[];
export type ProductVariantCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantCreateKeySpecifier = ('productErrors' | 'errors' | 'productVariant' | ProductVariantCreateKeySpecifier)[];
export type ProductVariantCreateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantDeleteKeySpecifier = ('productErrors' | 'errors' | 'productVariant' | ProductVariantDeleteKeySpecifier)[];
export type ProductVariantDeleteFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantReorderKeySpecifier = ('product' | 'productErrors' | 'errors' | ProductVariantReorderKeySpecifier)[];
export type ProductVariantReorderFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantReorderAttributeValuesKeySpecifier = ('productVariant' | 'productErrors' | 'errors' | ProductVariantReorderAttributeValuesKeySpecifier)[];
export type ProductVariantReorderAttributeValuesFieldPolicy = {
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantSetDefaultKeySpecifier = ('product' | 'productErrors' | 'errors' | ProductVariantSetDefaultKeySpecifier)[];
export type ProductVariantSetDefaultFieldPolicy = {
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksCreateKeySpecifier = ('productVariant' | 'bulkStockErrors' | 'errors' | ProductVariantStocksCreateKeySpecifier)[];
export type ProductVariantStocksCreateFieldPolicy = {
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksDeleteKeySpecifier = ('productVariant' | 'stockErrors' | 'errors' | ProductVariantStocksDeleteKeySpecifier)[];
export type ProductVariantStocksDeleteFieldPolicy = {
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	stockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantStocksUpdateKeySpecifier = ('productVariant' | 'bulkStockErrors' | 'errors' | ProductVariantStocksUpdateKeySpecifier)[];
export type ProductVariantStocksUpdateFieldPolicy = {
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	bulkStockErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'productVariant' | 'attributeValues' | ProductVariantTranslatableContentKeySpecifier)[];
export type ProductVariantTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	attributeValues?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslateKeySpecifier = ('translationErrors' | 'errors' | 'productVariant' | ProductVariantTranslateKeySpecifier)[];
export type ProductVariantTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantTranslationKeySpecifier = ('id' | 'name' | 'language' | ProductVariantTranslationKeySpecifier)[];
export type ProductVariantTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ProductVariantUpdateKeySpecifier = ('productErrors' | 'errors' | 'productVariant' | ProductVariantUpdateKeySpecifier)[];
export type ProductVariantUpdateFieldPolicy = {
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('webhook' | 'webhookEvents' | 'webhookSamplePayload' | 'warehouse' | 'warehouses' | 'translations' | 'translation' | 'stock' | 'stocks' | 'shop' | 'orderSettings' | 'shippingZone' | 'shippingZones' | 'digitalContent' | 'digitalContents' | 'categories' | 'category' | 'collection' | 'collections' | 'product' | 'products' | 'productType' | 'productTypes' | 'productVariant' | 'productVariants' | 'reportProductSales' | 'payment' | 'payments' | 'page' | 'pages' | 'pageType' | 'pageTypes' | 'homepageEvents' | 'order' | 'orders' | 'draftOrders' | 'ordersTotal' | 'orderByToken' | 'menu' | 'menus' | 'menuItem' | 'menuItems' | 'giftCard' | 'giftCards' | 'plugin' | 'plugins' | 'sale' | 'sales' | 'voucher' | 'vouchers' | 'exportFile' | 'exportFiles' | 'taxTypes' | 'checkout' | 'checkouts' | 'checkoutLines' | 'channel' | 'channels' | 'attributes' | 'attribute' | 'appsInstallations' | 'apps' | 'app' | 'addressValidationRules' | 'address' | 'customers' | 'permissionGroups' | 'permissionGroup' | 'me' | 'staffUsers' | 'user' | '_entities' | '_service' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	webhook?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	webhookSamplePayload?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	translations?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	stock?: FieldPolicy<any> | FieldReadFunction<any>,
	stocks?: FieldPolicy<any> | FieldReadFunction<any>,
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	orderSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContent?: FieldPolicy<any> | FieldReadFunction<any>,
	digitalContents?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	category?: FieldPolicy<any> | FieldReadFunction<any>,
	collection?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	productType?: FieldPolicy<any> | FieldReadFunction<any>,
	productTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariants?: FieldPolicy<any> | FieldReadFunction<any>,
	reportProductSales?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	payments?: FieldPolicy<any> | FieldReadFunction<any>,
	page?: FieldPolicy<any> | FieldReadFunction<any>,
	pages?: FieldPolicy<any> | FieldReadFunction<any>,
	pageType?: FieldPolicy<any> | FieldReadFunction<any>,
	pageTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	homepageEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	order?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	draftOrders?: FieldPolicy<any> | FieldReadFunction<any>,
	ordersTotal?: FieldPolicy<any> | FieldReadFunction<any>,
	orderByToken?: FieldPolicy<any> | FieldReadFunction<any>,
	menu?: FieldPolicy<any> | FieldReadFunction<any>,
	menus?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItem?: FieldPolicy<any> | FieldReadFunction<any>,
	menuItems?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCard?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	plugin?: FieldPolicy<any> | FieldReadFunction<any>,
	plugins?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	sales?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	vouchers?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFile?: FieldPolicy<any> | FieldReadFunction<any>,
	exportFiles?: FieldPolicy<any> | FieldReadFunction<any>,
	taxTypes?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkouts?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutLines?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	attributes?: FieldPolicy<any> | FieldReadFunction<any>,
	attribute?: FieldPolicy<any> | FieldReadFunction<any>,
	appsInstallations?: FieldPolicy<any> | FieldReadFunction<any>,
	apps?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>,
	addressValidationRules?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	customers?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroup?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	staffUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	_entities?: FieldPolicy<any> | FieldReadFunction<any>,
	_service?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReducedRateKeySpecifier = ('rate' | 'rateType' | ReducedRateKeySpecifier)[];
export type ReducedRateFieldPolicy = {
	rate?: FieldPolicy<any> | FieldReadFunction<any>,
	rateType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefreshTokenKeySpecifier = ('token' | 'user' | 'accountErrors' | 'errors' | RefreshTokenKeySpecifier)[];
export type RefreshTokenFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RequestEmailChangeKeySpecifier = ('user' | 'accountErrors' | 'errors' | RequestEmailChangeKeySpecifier)[];
export type RequestEmailChangeFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RequestPasswordResetKeySpecifier = ('accountErrors' | 'errors' | RequestPasswordResetKeySpecifier)[];
export type RequestPasswordResetFieldPolicy = {
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleKeySpecifier = ('id' | 'name' | 'type' | 'startDate' | 'endDate' | 'privateMetadata' | 'metadata' | 'categories' | 'collections' | 'products' | 'translation' | 'channelListings' | 'discountValue' | 'currency' | SaleKeySpecifier)[];
export type SaleFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleAddCataloguesKeySpecifier = ('sale' | 'discountErrors' | 'errors' | SaleAddCataloguesKeySpecifier)[];
export type SaleAddCataloguesFieldPolicy = {
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleBulkDeleteKeySpecifier = ('count' | 'discountErrors' | 'errors' | SaleBulkDeleteKeySpecifier)[];
export type SaleBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleChannelListingKeySpecifier = ('id' | 'channel' | 'discountValue' | 'currency' | SaleChannelListingKeySpecifier)[];
export type SaleChannelListingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleChannelListingUpdateKeySpecifier = ('sale' | 'discountErrors' | 'errors' | SaleChannelListingUpdateKeySpecifier)[];
export type SaleChannelListingUpdateFieldPolicy = {
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | SaleCountableConnectionKeySpecifier)[];
export type SaleCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleCountableEdgeKeySpecifier = ('node' | 'cursor' | SaleCountableEdgeKeySpecifier)[];
export type SaleCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
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
export type SaleRemoveCataloguesKeySpecifier = ('sale' | 'discountErrors' | 'errors' | SaleRemoveCataloguesKeySpecifier)[];
export type SaleRemoveCataloguesFieldPolicy = {
	sale?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'sale' | SaleTranslatableContentKeySpecifier)[];
export type SaleTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslateKeySpecifier = ('translationErrors' | 'errors' | 'sale' | SaleTranslateKeySpecifier)[];
export type SaleTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	sale?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SaleTranslationKeySpecifier = ('id' | 'name' | 'language' | SaleTranslationKeySpecifier)[];
export type SaleTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
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
export type SetPasswordKeySpecifier = ('token' | 'refreshToken' | 'csrfToken' | 'user' | 'accountErrors' | 'errors' | SetPasswordKeySpecifier)[];
export type SetPasswordFieldPolicy = {
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshToken?: FieldPolicy<any> | FieldReadFunction<any>,
	csrfToken?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingErrorKeySpecifier = ('field' | 'message' | 'code' | 'warehouses' | 'channels' | ShippingErrorKeySpecifier)[];
export type ShippingErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodKeySpecifier = ('id' | 'name' | 'description' | 'minimumOrderWeight' | 'maximumOrderWeight' | 'maximumDeliveryDays' | 'minimumDeliveryDays' | 'privateMetadata' | 'metadata' | 'type' | 'translation' | 'channelListings' | 'price' | 'maximumOrderPrice' | 'minimumOrderPrice' | 'postalCodeRules' | 'excludedProducts' | ShippingMethodKeySpecifier)[];
export type ShippingMethodFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderWeight?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumDeliveryDays?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	postalCodeRules?: FieldPolicy<any> | FieldReadFunction<any>,
	excludedProducts?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodChannelListingKeySpecifier = ('id' | 'channel' | 'minimumOrderPrice' | 'maximumOrderPrice' | 'price' | ShippingMethodChannelListingKeySpecifier)[];
export type ShippingMethodChannelListingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumOrderPrice?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodChannelListingUpdateKeySpecifier = ('shippingMethod' | 'shippingErrors' | 'errors' | ShippingMethodChannelListingUpdateKeySpecifier)[];
export type ShippingMethodChannelListingUpdateFieldPolicy = {
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodPostalCodeRuleKeySpecifier = ('start' | 'end' | 'inclusionType' | 'id' | ShippingMethodPostalCodeRuleKeySpecifier)[];
export type ShippingMethodPostalCodeRuleFieldPolicy = {
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	end?: FieldPolicy<any> | FieldReadFunction<any>,
	inclusionType?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTranslatableContentKeySpecifier = ('id' | 'name' | 'description' | 'translation' | 'shippingMethod' | ShippingMethodTranslatableContentKeySpecifier)[];
export type ShippingMethodTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingMethodTranslationKeySpecifier = ('id' | 'name' | 'description' | 'language' | ShippingMethodTranslationKeySpecifier)[];
export type ShippingMethodTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceBulkDeleteKeySpecifier = ('count' | 'shippingErrors' | 'errors' | ShippingPriceBulkDeleteKeySpecifier)[];
export type ShippingPriceBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceCreateKeySpecifier = ('shippingZone' | 'shippingMethod' | 'shippingErrors' | 'errors' | ShippingPriceCreateKeySpecifier)[];
export type ShippingPriceCreateFieldPolicy = {
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceDeleteKeySpecifier = ('shippingMethod' | 'shippingZone' | 'shippingErrors' | 'errors' | ShippingPriceDeleteKeySpecifier)[];
export type ShippingPriceDeleteFieldPolicy = {
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceExcludeProductsKeySpecifier = ('shippingMethod' | 'shippingErrors' | 'errors' | ShippingPriceExcludeProductsKeySpecifier)[];
export type ShippingPriceExcludeProductsFieldPolicy = {
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceRemoveProductFromExcludeKeySpecifier = ('shippingMethod' | 'shippingErrors' | 'errors' | ShippingPriceRemoveProductFromExcludeKeySpecifier)[];
export type ShippingPriceRemoveProductFromExcludeFieldPolicy = {
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceTranslateKeySpecifier = ('translationErrors' | 'errors' | 'shippingMethod' | ShippingPriceTranslateKeySpecifier)[];
export type ShippingPriceTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingPriceUpdateKeySpecifier = ('shippingZone' | 'shippingMethod' | 'shippingErrors' | 'errors' | ShippingPriceUpdateKeySpecifier)[];
export type ShippingPriceUpdateFieldPolicy = {
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethod?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneKeySpecifier = ('id' | 'name' | 'default' | 'privateMetadata' | 'metadata' | 'priceRange' | 'countries' | 'shippingMethods' | 'warehouses' | 'channels' | 'description' | ShippingZoneKeySpecifier)[];
export type ShippingZoneFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	default?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	priceRange?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouses?: FieldPolicy<any> | FieldReadFunction<any>,
	channels?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneBulkDeleteKeySpecifier = ('count' | 'shippingErrors' | 'errors' | ShippingZoneBulkDeleteKeySpecifier)[];
export type ShippingZoneBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | ShippingZoneCountableConnectionKeySpecifier)[];
export type ShippingZoneCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCountableEdgeKeySpecifier = ('node' | 'cursor' | ShippingZoneCountableEdgeKeySpecifier)[];
export type ShippingZoneCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneCreateKeySpecifier = ('shippingErrors' | 'errors' | 'shippingZone' | ShippingZoneCreateKeySpecifier)[];
export type ShippingZoneCreateFieldPolicy = {
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneDeleteKeySpecifier = ('shippingErrors' | 'errors' | 'shippingZone' | ShippingZoneDeleteKeySpecifier)[];
export type ShippingZoneDeleteFieldPolicy = {
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShippingZoneUpdateKeySpecifier = ('shippingErrors' | 'errors' | 'shippingZone' | ShippingZoneUpdateKeySpecifier)[];
export type ShippingZoneUpdateFieldPolicy = {
	shippingErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopKeySpecifier = ('availablePaymentGateways' | 'availableExternalAuthentications' | 'availableShippingMethods' | 'countries' | 'defaultCountry' | 'defaultMailSenderName' | 'defaultMailSenderAddress' | 'description' | 'domain' | 'languages' | 'name' | 'permissions' | 'phonePrefixes' | 'headerText' | 'includeTaxesInPrices' | 'displayGrossPrices' | 'chargeTaxesOnShipping' | 'trackInventoryByDefault' | 'defaultWeightUnit' | 'translation' | 'automaticFulfillmentDigitalProducts' | 'defaultDigitalMaxDownloads' | 'defaultDigitalUrlValidDays' | 'companyAddress' | 'customerSetPasswordUrl' | 'staffNotificationRecipients' | 'limits' | 'version' | ShopKeySpecifier)[];
export type ShopFieldPolicy = {
	availablePaymentGateways?: FieldPolicy<any> | FieldReadFunction<any>,
	availableExternalAuthentications?: FieldPolicy<any> | FieldReadFunction<any>,
	availableShippingMethods?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultCountry?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultMailSenderName?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultMailSenderAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	domain?: FieldPolicy<any> | FieldReadFunction<any>,
	languages?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	phonePrefixes?: FieldPolicy<any> | FieldReadFunction<any>,
	headerText?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTaxesInPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	displayGrossPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	chargeTaxesOnShipping?: FieldPolicy<any> | FieldReadFunction<any>,
	trackInventoryByDefault?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultWeightUnit?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	automaticFulfillmentDigitalProducts?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultDigitalMaxDownloads?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultDigitalUrlValidDays?: FieldPolicy<any> | FieldReadFunction<any>,
	companyAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	customerSetPasswordUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipients?: FieldPolicy<any> | FieldReadFunction<any>,
	limits?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopAddressUpdateKeySpecifier = ('shop' | 'shopErrors' | 'errors' | ShopAddressUpdateKeySpecifier)[];
export type ShopAddressUpdateFieldPolicy = {
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopDomainUpdateKeySpecifier = ('shop' | 'shopErrors' | 'errors' | ShopDomainUpdateKeySpecifier)[];
export type ShopDomainUpdateFieldPolicy = {
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopErrorKeySpecifier = ('field' | 'message' | 'code' | ShopErrorKeySpecifier)[];
export type ShopErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopFetchTaxRatesKeySpecifier = ('shop' | 'shopErrors' | 'errors' | ShopFetchTaxRatesKeySpecifier)[];
export type ShopFetchTaxRatesFieldPolicy = {
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopSettingsTranslateKeySpecifier = ('shop' | 'translationErrors' | 'errors' | ShopSettingsTranslateKeySpecifier)[];
export type ShopSettingsTranslateFieldPolicy = {
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopSettingsUpdateKeySpecifier = ('shop' | 'shopErrors' | 'errors' | ShopSettingsUpdateKeySpecifier)[];
export type ShopSettingsUpdateFieldPolicy = {
	shop?: FieldPolicy<any> | FieldReadFunction<any>,
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShopTranslationKeySpecifier = ('id' | 'headerText' | 'description' | 'language' | ShopTranslationKeySpecifier)[];
export type ShopTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	headerText?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffBulkDeleteKeySpecifier = ('count' | 'staffErrors' | 'errors' | StaffBulkDeleteKeySpecifier)[];
export type StaffBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffCreateKeySpecifier = ('staffErrors' | 'errors' | 'user' | StaffCreateKeySpecifier)[];
export type StaffCreateFieldPolicy = {
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffDeleteKeySpecifier = ('staffErrors' | 'errors' | 'user' | StaffDeleteKeySpecifier)[];
export type StaffDeleteFieldPolicy = {
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffErrorKeySpecifier = ('field' | 'message' | 'code' | 'addressType' | 'permissions' | 'groups' | 'users' | StaffErrorKeySpecifier)[];
export type StaffErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	addressType?: FieldPolicy<any> | FieldReadFunction<any>,
	permissions?: FieldPolicy<any> | FieldReadFunction<any>,
	groups?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientKeySpecifier = ('user' | 'active' | 'id' | 'email' | StaffNotificationRecipientKeySpecifier)[];
export type StaffNotificationRecipientFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientCreateKeySpecifier = ('shopErrors' | 'errors' | 'staffNotificationRecipient' | StaffNotificationRecipientCreateKeySpecifier)[];
export type StaffNotificationRecipientCreateFieldPolicy = {
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientDeleteKeySpecifier = ('shopErrors' | 'errors' | 'staffNotificationRecipient' | StaffNotificationRecipientDeleteKeySpecifier)[];
export type StaffNotificationRecipientDeleteFieldPolicy = {
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffNotificationRecipientUpdateKeySpecifier = ('shopErrors' | 'errors' | 'staffNotificationRecipient' | StaffNotificationRecipientUpdateKeySpecifier)[];
export type StaffNotificationRecipientUpdateFieldPolicy = {
	shopErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	staffNotificationRecipient?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StaffUpdateKeySpecifier = ('staffErrors' | 'errors' | 'user' | StaffUpdateKeySpecifier)[];
export type StaffUpdateFieldPolicy = {
	staffErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockKeySpecifier = ('warehouse' | 'productVariant' | 'quantity' | 'id' | 'quantityAllocated' | StockKeySpecifier)[];
export type StockFieldPolicy = {
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>,
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	quantity?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	quantityAllocated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | StockCountableConnectionKeySpecifier)[];
export type StockCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockCountableEdgeKeySpecifier = ('node' | 'cursor' | StockCountableEdgeKeySpecifier)[];
export type StockCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StockErrorKeySpecifier = ('field' | 'message' | 'code' | StockErrorKeySpecifier)[];
export type StockErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
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
export type TransactionKeySpecifier = ('id' | 'created' | 'payment' | 'token' | 'kind' | 'isSuccess' | 'error' | 'gatewayResponse' | 'amount' | TransactionKeySpecifier)[];
export type TransactionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	created?: FieldPolicy<any> | FieldReadFunction<any>,
	payment?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	kind?: FieldPolicy<any> | FieldReadFunction<any>,
	isSuccess?: FieldPolicy<any> | FieldReadFunction<any>,
	error?: FieldPolicy<any> | FieldReadFunction<any>,
	gatewayResponse?: FieldPolicy<any> | FieldReadFunction<any>,
	amount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslatableItemConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | TranslatableItemConnectionKeySpecifier)[];
export type TranslatableItemConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslatableItemEdgeKeySpecifier = ('node' | 'cursor' | TranslatableItemEdgeKeySpecifier)[];
export type TranslatableItemEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TranslationErrorKeySpecifier = ('field' | 'message' | 'code' | TranslationErrorKeySpecifier)[];
export type TranslationErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateMetadataKeySpecifier = ('metadataErrors' | 'errors' | 'item' | UpdateMetadataKeySpecifier)[];
export type UpdateMetadataFieldPolicy = {
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdatePrivateMetadataKeySpecifier = ('metadataErrors' | 'errors' | 'item' | UpdatePrivateMetadataKeySpecifier)[];
export type UpdatePrivateMetadataFieldPolicy = {
	metadataErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	item?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UploadErrorKeySpecifier = ('field' | 'message' | 'code' | UploadErrorKeySpecifier)[];
export type UploadErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'lastLogin' | 'email' | 'firstName' | 'lastName' | 'isStaff' | 'isActive' | 'note' | 'dateJoined' | 'defaultShippingAddress' | 'defaultBillingAddress' | 'privateMetadata' | 'metadata' | 'addresses' | 'checkout' | 'checkoutTokens' | 'giftCards' | 'orders' | 'userPermissions' | 'permissionGroups' | 'editableGroups' | 'avatar' | 'events' | 'storedPaymentSources' | 'languageCode' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	lastLogin?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	isStaff?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	dateJoined?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultShippingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	defaultBillingAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	addresses?: FieldPolicy<any> | FieldReadFunction<any>,
	checkout?: FieldPolicy<any> | FieldReadFunction<any>,
	checkoutTokens?: FieldPolicy<any> | FieldReadFunction<any>,
	giftCards?: FieldPolicy<any> | FieldReadFunction<any>,
	orders?: FieldPolicy<any> | FieldReadFunction<any>,
	userPermissions?: FieldPolicy<any> | FieldReadFunction<any>,
	permissionGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	editableGroups?: FieldPolicy<any> | FieldReadFunction<any>,
	avatar?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	storedPaymentSources?: FieldPolicy<any> | FieldReadFunction<any>,
	languageCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAvatarDeleteKeySpecifier = ('user' | 'accountErrors' | 'errors' | UserAvatarDeleteKeySpecifier)[];
export type UserAvatarDeleteFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAvatarUpdateKeySpecifier = ('user' | 'accountErrors' | 'errors' | UserAvatarUpdateKeySpecifier)[];
export type UserAvatarUpdateFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserBulkSetActiveKeySpecifier = ('count' | 'accountErrors' | 'errors' | UserBulkSetActiveKeySpecifier)[];
export type UserBulkSetActiveFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | UserCountableConnectionKeySpecifier)[];
export type UserCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserCountableEdgeKeySpecifier = ('node' | 'cursor' | UserCountableEdgeKeySpecifier)[];
export type UserCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserPermissionKeySpecifier = ('code' | 'name' | 'sourcePermissionGroups' | UserPermissionKeySpecifier)[];
export type UserPermissionFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	sourcePermissionGroups?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VATKeySpecifier = ('countryCode' | 'standardRate' | 'reducedRates' | VATKeySpecifier)[];
export type VATFieldPolicy = {
	countryCode?: FieldPolicy<any> | FieldReadFunction<any>,
	standardRate?: FieldPolicy<any> | FieldReadFunction<any>,
	reducedRates?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantMediaAssignKeySpecifier = ('productVariant' | 'media' | 'productErrors' | 'errors' | VariantMediaAssignKeySpecifier)[];
export type VariantMediaAssignFieldPolicy = {
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantMediaUnassignKeySpecifier = ('productVariant' | 'media' | 'productErrors' | 'errors' | VariantMediaUnassignKeySpecifier)[];
export type VariantMediaUnassignFieldPolicy = {
	productVariant?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	productErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VariantPricingInfoKeySpecifier = ('onSale' | 'discount' | 'discountLocalCurrency' | 'price' | 'priceUndiscounted' | 'priceLocalCurrency' | VariantPricingInfoKeySpecifier)[];
export type VariantPricingInfoFieldPolicy = {
	onSale?: FieldPolicy<any> | FieldReadFunction<any>,
	discount?: FieldPolicy<any> | FieldReadFunction<any>,
	discountLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>,
	price?: FieldPolicy<any> | FieldReadFunction<any>,
	priceUndiscounted?: FieldPolicy<any> | FieldReadFunction<any>,
	priceLocalCurrency?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VerifyTokenKeySpecifier = ('user' | 'isValid' | 'payload' | 'accountErrors' | 'errors' | VerifyTokenKeySpecifier)[];
export type VerifyTokenFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	isValid?: FieldPolicy<any> | FieldReadFunction<any>,
	payload?: FieldPolicy<any> | FieldReadFunction<any>,
	accountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherKeySpecifier = ('id' | 'name' | 'type' | 'code' | 'usageLimit' | 'used' | 'startDate' | 'endDate' | 'applyOncePerOrder' | 'applyOncePerCustomer' | 'onlyForStaff' | 'discountValueType' | 'minCheckoutItemsQuantity' | 'privateMetadata' | 'metadata' | 'categories' | 'collections' | 'products' | 'countries' | 'translation' | 'discountValue' | 'currency' | 'minSpent' | 'channelListings' | VoucherKeySpecifier)[];
export type VoucherFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	usageLimit?: FieldPolicy<any> | FieldReadFunction<any>,
	used?: FieldPolicy<any> | FieldReadFunction<any>,
	startDate?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	applyOncePerOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	applyOncePerCustomer?: FieldPolicy<any> | FieldReadFunction<any>,
	onlyForStaff?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValueType?: FieldPolicy<any> | FieldReadFunction<any>,
	minCheckoutItemsQuantity?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	categories?: FieldPolicy<any> | FieldReadFunction<any>,
	collections?: FieldPolicy<any> | FieldReadFunction<any>,
	products?: FieldPolicy<any> | FieldReadFunction<any>,
	countries?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	minSpent?: FieldPolicy<any> | FieldReadFunction<any>,
	channelListings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherAddCataloguesKeySpecifier = ('voucher' | 'discountErrors' | 'errors' | VoucherAddCataloguesKeySpecifier)[];
export type VoucherAddCataloguesFieldPolicy = {
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherBulkDeleteKeySpecifier = ('count' | 'discountErrors' | 'errors' | VoucherBulkDeleteKeySpecifier)[];
export type VoucherBulkDeleteFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherChannelListingKeySpecifier = ('id' | 'channel' | 'discountValue' | 'currency' | 'minSpent' | VoucherChannelListingKeySpecifier)[];
export type VoucherChannelListingFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	channel?: FieldPolicy<any> | FieldReadFunction<any>,
	discountValue?: FieldPolicy<any> | FieldReadFunction<any>,
	currency?: FieldPolicy<any> | FieldReadFunction<any>,
	minSpent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherChannelListingUpdateKeySpecifier = ('voucher' | 'discountErrors' | 'errors' | VoucherChannelListingUpdateKeySpecifier)[];
export type VoucherChannelListingUpdateFieldPolicy = {
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | VoucherCountableConnectionKeySpecifier)[];
export type VoucherCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherCountableEdgeKeySpecifier = ('node' | 'cursor' | VoucherCountableEdgeKeySpecifier)[];
export type VoucherCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
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
export type VoucherRemoveCataloguesKeySpecifier = ('voucher' | 'discountErrors' | 'errors' | VoucherRemoveCataloguesKeySpecifier)[];
export type VoucherRemoveCataloguesFieldPolicy = {
	voucher?: FieldPolicy<any> | FieldReadFunction<any>,
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslatableContentKeySpecifier = ('id' | 'name' | 'translation' | 'voucher' | VoucherTranslatableContentKeySpecifier)[];
export type VoucherTranslatableContentFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	translation?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslateKeySpecifier = ('translationErrors' | 'errors' | 'voucher' | VoucherTranslateKeySpecifier)[];
export type VoucherTranslateFieldPolicy = {
	translationErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherTranslationKeySpecifier = ('id' | 'name' | 'language' | VoucherTranslationKeySpecifier)[];
export type VoucherTranslationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VoucherUpdateKeySpecifier = ('discountErrors' | 'errors' | 'voucher' | VoucherUpdateKeySpecifier)[];
export type VoucherUpdateFieldPolicy = {
	discountErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	voucher?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseKeySpecifier = ('id' | 'name' | 'slug' | 'shippingZones' | 'address' | 'email' | 'privateMetadata' | 'metadata' | 'companyName' | WarehouseKeySpecifier)[];
export type WarehouseFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	shippingZones?: FieldPolicy<any> | FieldReadFunction<any>,
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	privateMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	metadata?: FieldPolicy<any> | FieldReadFunction<any>,
	companyName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCountableConnectionKeySpecifier = ('pageInfo' | 'edges' | 'totalCount' | WarehouseCountableConnectionKeySpecifier)[];
export type WarehouseCountableConnectionFieldPolicy = {
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCountableEdgeKeySpecifier = ('node' | 'cursor' | WarehouseCountableEdgeKeySpecifier)[];
export type WarehouseCountableEdgeFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	cursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseCreateKeySpecifier = ('warehouseErrors' | 'errors' | 'warehouse' | WarehouseCreateKeySpecifier)[];
export type WarehouseCreateFieldPolicy = {
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseDeleteKeySpecifier = ('warehouseErrors' | 'errors' | 'warehouse' | WarehouseDeleteKeySpecifier)[];
export type WarehouseDeleteFieldPolicy = {
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseErrorKeySpecifier = ('field' | 'message' | 'code' | WarehouseErrorKeySpecifier)[];
export type WarehouseErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseShippingZoneAssignKeySpecifier = ('warehouseErrors' | 'errors' | 'warehouse' | WarehouseShippingZoneAssignKeySpecifier)[];
export type WarehouseShippingZoneAssignFieldPolicy = {
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseShippingZoneUnassignKeySpecifier = ('warehouseErrors' | 'errors' | 'warehouse' | WarehouseShippingZoneUnassignKeySpecifier)[];
export type WarehouseShippingZoneUnassignFieldPolicy = {
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WarehouseUpdateKeySpecifier = ('warehouseErrors' | 'errors' | 'warehouse' | WarehouseUpdateKeySpecifier)[];
export type WarehouseUpdateFieldPolicy = {
	warehouseErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	warehouse?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookKeySpecifier = ('name' | 'targetUrl' | 'isActive' | 'secretKey' | 'id' | 'events' | 'app' | WebhookKeySpecifier)[];
export type WebhookFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	targetUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	isActive?: FieldPolicy<any> | FieldReadFunction<any>,
	secretKey?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	app?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookCreateKeySpecifier = ('webhookErrors' | 'errors' | 'webhook' | WebhookCreateKeySpecifier)[];
export type WebhookCreateFieldPolicy = {
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookDeleteKeySpecifier = ('webhookErrors' | 'errors' | 'webhook' | WebhookDeleteKeySpecifier)[];
export type WebhookDeleteFieldPolicy = {
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookErrorKeySpecifier = ('field' | 'message' | 'code' | WebhookErrorKeySpecifier)[];
export type WebhookErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	code?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookEventKeySpecifier = ('eventType' | 'name' | WebhookEventKeySpecifier)[];
export type WebhookEventFieldPolicy = {
	eventType?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WebhookUpdateKeySpecifier = ('webhookErrors' | 'errors' | 'webhook' | WebhookUpdateKeySpecifier)[];
export type WebhookUpdateFieldPolicy = {
	webhookErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	webhook?: FieldPolicy<any> | FieldReadFunction<any>
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