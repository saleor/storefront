import { defineMessages } from "react-intl";

export const messages = defineMessages({
  more: {
    id: "app.home.greeting",
    description: "Link to proceed to the product collection view.",
    defaultMessage: "More →",
  },
  loginWelcomeMessage: {
    id: "app.login.greeting",
    description: "Welcome message on home screen",
    defaultMessage: "Welcome back",
  },
  loginHeader: {
    id: "app.login.header",
    description: "Login form header",
    defaultMessage: "Login to your account",
  },
  loginEmailFieldLabel: {
    id: "app.login.emailField",
    description: "Email field label",
    defaultMessage: "Email",
  },
  loginPasswordFieldLabel: {
    id: "app.login.passwordField",
    description: "Password field label",
    defaultMessage: "Password",
  },
  loginRemindPasswordButtonLabel: {
    id: "app.login.remindPassword",
    description: "Button for reminding the password to the users",
    defaultMessage: "Forgot password?",
  },
  createAccount: {
    id: "app.login.createAccount",
    description: "Link to create account view",
    defaultMessage: "Register a new account",
  },
  registerHeader: {
    id: "app.register.header",
    description: "Register form header",
    defaultMessage: "Create a new account",
  },
  registerEmailFieldLabel: {
    id: "app.register.emailField",
    description: "Email field label",
    defaultMessage: "Email",
  },
  registerPasswordFieldLabel: {
    id: "app.register.passwordField",
    description: "Password field label",
    defaultMessage: "Password",
  },
  registerButton: {
    id: "app.register.registerButton",
    description: "Register account button label",
    defaultMessage: "Register",
  },
  backToLogin: {
    id: "app.register.backToLogin",
    description: "Link to go to the login page",
    defaultMessage: "Log in to existing account",
  },
  logIn: {
    id: "app.navigation.login",
    description: "Link to login view",
    defaultMessage: "Log in",
  },
  menuAccountPreferences: {
    id: "app.navigation.accountPreferences",
    description: "Link to account preferences view",
    defaultMessage: "Account preferences",
  },
  menuAccountAddressBook: {
    id: "app.navigation.addressBook",
    description: "Link to address book view",
    defaultMessage: "Address book",
  },
  menuAccountOrders: {
    id: "app.navigation.orders",
    description: "Link to orders view",
    defaultMessage: "Orders",
  },

  logOut: {
    id: "app.navigation.logout",
    description: "Log out link",
    defaultMessage: "Log out",
  },
  regionModalHeader: {
    id: "app.region.modalHeader",
    description: "Header of the region selection modal.",
    defaultMessage: "Choose your region",
  },
  channelFieldLabel: {
    id: "app.region.channelField",
    description: "Label of channel selection field.",
    defaultMessage: "Channel",
  },
  languageFieldLabel: {
    id: "app.region.languageField",
    description: "Label of language selection field.",
    defaultMessage: "Language",
  },
  addToCart: {
    id: "app.product.addToCart",
    description: "Add to cart button label.",
    defaultMessage: "Add to cart",
  },
  variantNotChosen: {
    id: "app.product.variantNotChosen",
    description: "Warning message when variant is not chosen.",
    defaultMessage: "Please chose the variant",
  },
  soldOut: {
    id: "app.product.soldOut",
    description: "Warning message when variant is sold out.",
    defaultMessage: "Sold out!",
  },
  addToWishlist: {
    id: "app.product.addToWishlist",
    description: "Button to add product to user's wishlist",
    defaultMessage: "Add to wishlist,",
  },
  productInStock: {
    id: "app.product.productInStock",
    description: "Informs whether product is in stock or not",
    defaultMessage: "In stock",
  },
  paymentOptions: {
    id: "app.product.paymentOptions",
    description: "Lists possible payment options",
    defaultMessage: "Payment options",
  },
  shippingOptions: {
    id: "app.product.shippingOptions",
    description: "Lists possible shipping option",
    defaultMessage: "Shipping options",
  },
  cashOnDelivery: {
    id: "app.product.shipping.cashOnDelivery",
    description: "cash on delivery label",
    defaultMessage: "Cash on delivery",
  },
  inpostParcelLocker: {
    id: "app.product.shipping.inpostParcelLocker",
    description: "inpost label",
    defaultMessage: "Inpost Parcel Locker 24/7",
  },
  courier: {
    id: "app.product.shipping.courier",
    description: "courier label",
    defaultMessage: "Courier",
  },
  attributes: {
    id: "app.product.attributes",
    description: "Attributes table header.",
    defaultMessage: "Attributes",
  },
  adding: {
    id: "app.product.adding",
    description: "Message displayed during adding product to the cart.",
    defaultMessage: "Adding...",
  },
  checkoutButton: {
    id: "app.checkout.checkoutButton",
    description: "Go to checkout button label.",
    defaultMessage: "Checkout",
  },
  cartPageHeader: {
    id: "app.checkout.pageHeader",
    description: "Header of the cart page.",
    defaultMessage: "Your Cart",
  },
  discountCodeFieldLabel: {
    id: "app.checkout.discountCode",
    description: "Name of the discount code field.",
    defaultMessage: "Discount code",
  },
  discount: {
    id: "app.checkout.discount",
    description: "Discount code table header at the checkout summary.",
    defaultMessage: "Discount",
  },
  subtotal: {
    id: "app.checkout.subtotal",
    description: "Subtotal table header at the checkout summary.",
    defaultMessage: "Subtotal",
  },
  total: {
    id: "app.checkout.total",
    description: "Total table header at the checkout summary.",
    defaultMessage: "Total",
  },
  shipping: {
    id: "app.checkout.shipping",
    description: "Shipping table header at the checkout summary.",
    defaultMessage: "Shipping",
  },
  tax: {
    id: "app.checkout.tax",
    description: "Tax table header at the checkout summary.",
    defaultMessage: "Tax",
  },
  emailAddressCardHeader: {
    id: "app.checkout.emailAddressCardHeader",
    description: "Header of the email section.",
    defaultMessage: "Email Address",
  },
  billingMethodCardHeader: {
    id: "app.checkout.billingMethodCardHeader",
    description: "Header of the billing method section.",
    defaultMessage: "Billing Method",
  },
  billingAddressCardHeader: {
    id: "app.checkout.billingAddressCardHeader",
    description: "Header of the billing address section.",
    defaultMessage: "Billing Address",
  },
  shippingAddressCardHeader: {
    id: "app.checkout.shippingAddressCardHeader",
    description: "Header of the shipping address section.",
    defaultMessage: "Shipping Address",
  },
  shippingMethodCardHeader: {
    id: "app.checkout.shippingMethodCardHeader",
    description: "Header of the shipping method section.",
    defaultMessage: "Shipping Method",
  },
  paymentCardHeader: {
    id: "app.checkout.paymentCardHeader",
    description: "Header of the payment section.",
    defaultMessage: "Payment",
  },
  paymentInstruction: {
    id: "app.checkout.paymentInstruction",
    description: "User instructions at payment section.",
    defaultMessage: "Choose payment method",
  },
  phoneField: {
    id: "app.checkout.phoneField",
    description: "Phone number field label.",
    defaultMessage: "Phone",
  },
  firstNameField: {
    id: "app.checkout.firstNameField",
    description: "First name field label.",
    defaultMessage: "First name",
  },
  lastNameField: {
    id: "app.checkout.lastNameField",
    description: "Last name field label.",
    defaultMessage: "Last name",
  },
  addressField: {
    id: "app.checkout.addressField",
    description: "Address field label.",
    defaultMessage: "Address",
  },
  cityField: {
    id: "app.checkout.cityField",
    description: "City field label.",
    defaultMessage: "City",
  },
  postalCodeField: {
    id: "app.checkout.postalCodeField",
    description: "Postal code field label.",
    defaultMessage: "Postal code",
  },

  cardNumberField: {
    id: "app.checkout.cardNumberField",
    description: "Card number field label.",
    defaultMessage: "Card number",
  },
  expDateField: {
    id: "app.checkout.expDateField",
    description: "Expiration date field label.",
    defaultMessage: "Expiration date",
  },
  cvcField: {
    id: "app.checkout.cvcField",
    description: "CVC code field label.",
    defaultMessage: "CVC",
  },
  paymentButton: {
    id: "app.checkout.paymentButton",
    description: "Payment button label.",
    defaultMessage: "Pay {total}",
  },
  sameAsBillingButton: {
    id: "app.checkout.sameAsBillingButton",
    description: "Use same address as billing button label.",
    defaultMessage: "Use the same address as billing",
  },
  orderSummary: {
    id: "app.checkout.orderSummary",
    description: "Header of the order summary section.",
    defaultMessage: "Order summary",
  },
  browseProducts: {
    id: "app.ui.browseProducts",
    description: "Label for the link to the product browsing.",
    defaultMessage: "Browse products",
  },
  loadMoreButton: {
    id: "app.ui.loadMoreButton",
    description: "Display more products button label.",
    defaultMessage: "Load more",
  },
  noProducts: {
    id: "app.ui.noProductsInfo",
    description: "Displayed when list has no products.",
    defaultMessage: "Search query didn't return any viable results",
  },
  removeButton: {
    id: "app.ui.removeButton",
    description: "Remove item button label.",
    defaultMessage: "Remove",
  },
  activateButton: {
    id: "app.ui.activateButton",
    description: "Activate button label.",
    defaultMessage: "Activate",
  },
  changeButton: {
    id: "app.ui.changeButton",
    description: "Change button label.",
    defaultMessage: "Change",
  },
  saveButton: {
    id: "app.ui.saveButton",
    description: "Save button label.",
    defaultMessage: "Save",
  },
  backButton: {
    id: "app.ui.backButton",
    description: "back button label.",
    defaultMessage: "Back",
  },
  paginationProductCounter: {
    id: "app.ui.productCounter",
    description: "Message with number of displayed products.",
    defaultMessage: "{currentItemsCount} out of {totalItemsCount}",
  },
  searchHeader: {
    id: "app.search.searchHeader",
    description: "Header of the search page.",
    defaultMessage: "Search",
  },
  searchFieldPlaceholder: {
    id: "app.search.searchFieldPlaceholder",
    description: "Placeholder displayed in the search field.",
    defaultMessage: "What are you looking for?",
  },
  changeEmailHeader: {
    id: "app.preferences.changeEmail.header",
    description: "Header for email change section",
    defaultMessage: "Change email",
  },
  changePasswordHeader: {
    id: "app.preferences.changePassword.header",
    description: "Header for password change section",
    defaultMessage: "Change password",
  },
  oldPasswordFieldLabel: {
    id: "app.preferences.changePassword.oldPasswordFieldLabel",
    description: "Old password field label",
    defaultMessage: "Old password",
  },
  newPasswordFieldLabel: {
    id: "app.preferences.changePassword.newPasswordFieldLabel",
    description: "New password field label",
    defaultMessage: "New password",
  },
  newPasswordRepeatedFieldLabel: {
    id: "app.preferences.changePassword.header",
    description: "Repeated new password field label",
    defaultMessage: "Repeat new password",
  },
  noAddressDataMessage: {
    id: "app.preferences.addressbook.noData",
    description: "Message displayed when user has no address saved",
    defaultMessage: "No addresses information for this user",
  },
  defaultBillingAndShipping: {
    id: "app.preferences.addressbook.defaultBillingShipping",
    description: "Message displayed when address is both billing and shipping default",
    defaultMessage: "Default billing and shipping address",
  },
  defaultBilling: {
    id: "app.preferences.addressbook.defaultBilling",
    description: "Message displayed when address is billing default",
    defaultMessage: "Default billing address",
  },
  defaultShipping: {
    id: "app.preferences.addressbook.defaultShipping",
    description: "Message displayed when address is shipping default",
    defaultMessage: "Default shipping address",
  },
  setDefaultShipping: {
    id: "app.preferences.addressbook.setDefaultShipping",
    description: "Set shipping default button label",
    defaultMessage: "Set as shipping default",
  },
  setDefaultBilling: {
    id: "app.preferences.addressbook.setDefaultBilling",
    description: "Set billing default button label",
    defaultMessage: "Set as billing default",
  },
  categories: {
    id: "app.pages.channel.locale.index.categories",
    description: "Message displayed on homepage for categories section",
    defaultMessage: "Looking for specific products? Our categories will make your task easier!",
  },
  categoriesText: {
    id: "app.pages.channel.locale.index.categoriesText",
    description: "Message displayed on homepage for categories section",
    defaultMessage:
      "Not sure where to look for your favorite products? Use our clear categories and easily find what you're looking for.",
  },
  latestArticles: {
    id: "app.pages.channel.locale.index.latestArticles",
    description: "Message displayed on homepage for latest articles section",
    defaultMessage: "New articles and latest news",
  },
  latestArticlesText: {
    id: "app.pages.channel.locale.index.latestArticlesText",
    description: "Message displayed on homepage for latest articles section",
    defaultMessage: "Explore the world of fashion and style with our latest content and updates",
  },
  collections: {
    id: "app.pages.channel.locale.index.collections",
    description: "Message displayed on homepage for collections section",
    defaultMessage: "Explore the world of fashion and style with our latest content and updates",
  },
  collectionsText: {
    id: "app.pages.channel.locale.index.collectionsText",
    description: "Message displayed on homepage for collections section",
    defaultMessage:
      "Check out our bestsellers and follow the trends! Our latest trends are sure to inspire you and help you find your unique style.",
  },
  shop: {
    id: "app.pages.channel.locale.index.shop",
    description: "Shop name",
    defaultMessage: "Shop",
  },
  news: {
    id: "app.pages.channel.locale.index.news",
    description: "News name",
    defaultMessage: "News",
  },
  sales: {
    id: "app.pages.channel.locale.index.sales",
    description: "Sales name",
    defaultMessage: "Current sales",
  },
  advantages: {
    id: "app.components.advantagesblock.advantagesblock.advantages",
    description: "Advantages heading",
    defaultMessage: "We provide the best customer service",
  },
  advantagesText: {
    id: "app.components.advantagesblock.advantagesblock.advantagesText",
    description: "Advantages text",
    defaultMessage:
      "Our experienced specialists are always ready to answer your questions, solve your problems and help you with your purchases.",
  },
  advantagesShippingHeading: {
    id: "app.components.advantagesblock.advantagesblock.advantagesShippingHeading",
    description: "Advantages shipping heading",
    defaultMessage: "Fast delivery",
  },
  advantagesShippingText: {
    id: "app.components.advantagesblock.advantagesblock.advantagesShippingText",
    description: "Advantages shipping text",
    defaultMessage: "We offer fast and efficient shipping",
  },
  advantagesPaymentsHeading: {
    id: "app.components.advantagesblock.advantagesblock.advantagesPaymentsHeading",
    description: "Advantages Payments heading",
    defaultMessage: "Secure payments",
  },
  advantagesPaymentsText: {
    id: "app.components.advantagesblock.advantagesblock.advantagesPaymentsText",
    description: "Advantages Payments text",
    defaultMessage: "We accept payments with the popular PayU",
  },
  advantagesReturnsHeading: {
    id: "app.components.advantagesblock.advantagesblock.advantagesReturnsHeading",
    description: "Advantages Returns heading",
    defaultMessage: "Returns",
  },
  advantagesReturnsText: {
    id: "app.components.advantagesblock.advantagesblock.advantagesReturnsText",
    description: "Advantages Returns text",
    defaultMessage: "You have 14 days to change your mind",
  },
  shopDescription: {
    id: "app.pages.channel.locale.index.shopDescription",
    description: "Shop description text",
    defaultMessage:
      "Online store for cheap used clothing for women, men and children. We carry used and outlet clothing in our online lumberyard. Hundreds of brands and lots of unique style.",
  },
  marketingFirstText: {
    id: "app.components.infobanner.infobanner.marketingFirstText",
    description: "Infobanner text",
    defaultMessage: "USE OUR CODE",
  },
  marketingSecondText: {
    id: "app.components.infobanner.infobanner.marketingSecondText",
    description: "Infobanner text",
    defaultMessage: "TO GET FREE DELIVERY FOR ORDERS OVER 200ZL",
  },
  featuredProducts: {
    id: "app.pages.channel.locale.index.featuredProducts",
    description: "Message displayed on homepage for featured products section",
    defaultMessage: "Here are our recommended products!",
  },
  featuredProductsText: {
    id: "app.pages.channel.locale.index.featuredProductsText",
    description: "Message displayed on homepage for featured products section",
    defaultMessage:
      "Don't have time to browse through hundreds of products? Are you looking for the best suggestions that will save you time and money? Our recommended products are a guarantee of success!",
  },
  processingPayment: {
    id: "app.components.checkout.completeCheckoutButton.processingPayment",
    description: "Message displayed on homepage for featured products section",
    defaultMessage: "Processing...",
  },
  searchedProducts: {
    id: "app.search.searchedProducts",
    description: "Products found in search or category",
    defaultMessage: "items",
  },
  sortBy: {
    id: "app.search.sortBy",
    description: "Label for sort by option",
    defaultMessage: "Sort by",
  },
  popularity: {
    id: "app.search.sortBy.popularity",
    description: "Label for sort by popularity",
    defaultMessage: "Popularity",
  },
  nameAscending: {
    id: "app.search.sortBy.nameAscending",
    description: "Label for sort by nameAscending",
    defaultMessage: "Name ascending",
  },
  nameDescending: {
    id: "app.search.sortBy.nameDescending",
    description: "Label for sort by nameDescending",
    defaultMessage: "Name descending",
  },
  newProduct: {
    id: "app.product.newProduct",
    description: "Label for new product",
    defaultMessage: "New product!",
  },
  updatedAscending: {
    id: "app.search.sortBy.updatedAscending",
    description: "Label for sort by updated date ascending",
    defaultMessage: "Update date ascending",
  },
  updatedDescending: {
    id: "app.search.sortBy.updatedDescending",
    description: "Label for sort by updated date descending",
    defaultMessage: "Update date descending",
  },
  priceMinMax: {
    id: "app.search.sortBy.priceMinMax",
    description: "Label for sort by price min-max",
    defaultMessage: "Price min-max",
  },
  priceMaxMin: {
    id: "app.search.sortBy.priceMaxMin",
    description: "Label for sort by price max-min",
    defaultMessage: "Price max-min",
  },
});

export default messages;
