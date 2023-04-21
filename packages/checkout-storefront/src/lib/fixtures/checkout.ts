import { CheckoutFragment } from "@/checkout-storefront/graphql";

export const checkout: CheckoutFragment = {
  authorizeStatus: "NONE",
  chargeStatus: "NONE",
  id: "Q2hlY2tvdXQ6OTJmOGRkMWItNGY5OC00Y2Y0LWI0MzgtNDE2MjIwYmRlYjMw",
  email: null,
  discount: {
    currency: "USD",
    amount: 0,
    __typename: "Money",
  },
  voucherCode: null,
  discountName: null,
  translatedDiscountName: null,
  giftCards: [],
  channel: {
    id: "Q2hhbm5lbDoyMjQz",
    slug: "default-channel",
    __typename: "Channel",
  },
  shippingAddress: {
    id: "QWRkcmVzczoxMzQ1OA==",
    city: "WROCŁAW",
    phone: "",
    postalCode: "51-676",
    companyName: "",
    cityArea: "",
    streetAddress1: "Kasprzaka 22/4",
    streetAddress2: "",
    countryArea: "",
    country: {
      country: "Poland",
      code: "PL",
      __typename: "CountryDisplay",
    },
    firstName: "Magdalena",
    lastName: "Markusik",
    __typename: "Address",
  },
  billingAddress: {
    id: "QWRkcmVzczoxMzQ1OQ==",
    city: "WROCŁAW",
    phone: "",
    postalCode: "51-676",
    companyName: "",
    cityArea: "",
    streetAddress1: "Kasprzaka 22/4",
    streetAddress2: "",
    countryArea: "",
    country: {
      country: "Poland",
      code: "PL",
      __typename: "CountryDisplay",
    },
    firstName: "Magdalena",
    lastName: "Markusik",
    __typename: "Address",
  },
  isShippingRequired: true,
  user: null,
  availablePaymentGateways: [
    {
      id: "mirumee.payments.dummy",
      currencies: ["EUR"],
      config: [],
      name: "Dummy",
      __typename: "PaymentGateway",
    },
    {
      id: "mirumee.payments.stripe",
      name: "Stripe (Deprecated)",
      __typename: "PaymentGateway",
      currencies: ["EUR"],
      config: [],
    },
    {
      id: "saleor.payments.stripe",
      name: "Stripe",
      __typename: "PaymentGateway",
      currencies: ["EUR"],
      config: [],
    },
    {
      id: "mirumee.payments.adyen",
      name: "Adyen",
      __typename: "PaymentGateway",
      currencies: ["EUR"],
      config: [],
    },
  ],
  deliveryMethod: {
    id: "U2hpcHBpbmdNZXRob2Q6MjIyNQ==",
    __typename: "ShippingMethod",
  },
  shippingMethods: [
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIyNQ==",
      name: "CyCreateVariants-2322",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjE5Mg==",
      name: "CyCreateVariants-88437",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjE2NQ==",
      name: "CyFilterProducts-29395",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjE2Nw==",
      name: "UpdateProductsSku95944",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIxNg==",
      name: "CyOrders-22998",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjE3Mg==",
      name: "CyAvailForPurchase-98109",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIwNA==",
      name: "CyCreateVariants-38383",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIwNQ==",
      name: "CyCreateVariants-90162",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIwNg==",
      name: "CyCreateVariants-67294",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIwNw==",
      name: "CyCreateVariants-85232",
      price: {
        currency: "USD",
        amount: 1,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIwMg==",
      name: "as price base rate",
      price: {
        currency: "USD",
        amount: 9,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: 99,
      minimumDeliveryDays: 0,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIwMw==",
      name: "weight rate AS",
      price: {
        currency: "USD",
        amount: 15,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: 14,
      minimumDeliveryDays: 1,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjE5NA==",
      name: "GiftCardsCheckout180",
      price: {
        currency: "USD",
        amount: 50,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
    {
      id: "U2hpcHBpbmdNZXRob2Q6MjIyMA==",
      name: "SalesProd-6325",
      price: {
        currency: "USD",
        amount: 100,
        __typename: "Money",
      },
      __typename: "ShippingMethod",
      maximumDeliveryDays: null,
      minimumDeliveryDays: null,
    },
  ],
  totalPrice: {
    gross: {
      amount: 11.5,
      __typename: "Money",
      currency: "USD",
    },
    __typename: "TaxedMoney",
    tax: {
      currency: "USD",
      amount: 1.96,
      __typename: "Money",
    },
  },
  shippingPrice: {
    gross: {
      currency: "USD",
      amount: 1,
      __typename: "Money",
    },
    __typename: "TaxedMoney",
  },
  subtotalPrice: {
    gross: {
      currency: "USD",
      amount: 10.5,
      __typename: "Money",
    },
    __typename: "TaxedMoney",
  },
  lines: [
    {
      id: "Q2hlY2tvdXRMaW5lOmU3YmE5OThlLWQ5ZjgtNDI1Yi05OTllLTgzYjdjNjg5NGEzMA==",
      quantity: 1,
      totalPrice: {
        gross: {
          currency: "USD",
          amount: 3.5,
          __typename: "Money",
        },
        __typename: "TaxedMoney",
      },
      unitPrice: {
        gross: {
          currency: "USD",
          amount: 3.5,
          __typename: "Money",
        },
        __typename: "TaxedMoney",
      },
      undiscountedUnitPrice: {
        currency: "USD",
        amount: 5,
        __typename: "Money",
      },
      variant: {
        attributes: [
          {
            values: [
              {
                name: "White",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
          {
            values: [
              {
                name: "45cm x 45cm",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
          {
            values: [],
            __typename: "SelectedAttribute",
          },
          {
            values: [
              {
                name: "aaaa",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
          {
            values: [
              {
                name: "1",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
          {
            values: [
              {
                name: "700ml",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
          {
            values: [
              {
                name: "XS",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
        ],
        id: "UHJvZHVjdFZhcmlhbnQ6MzAx",
        name: "15744278",
        product: {
          name: "Blue Hoodie",
          media: [
            {
              alt: "",
              type: "IMAGE",
              url: "https://master.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_cl_bogo02_1_thumbnail_64.png",
              __typename: "ProductMedia",
            },
            {
              alt: "",
              type: "IMAGE",
              url: "https://master.staging.saleor.cloud/thumbnail/UHJvZHVjdE1lZGlhOjI4Mw==/64/",
              __typename: "ProductMedia",
            },
          ],
          __typename: "Product",
        },
        media: [
          {
            alt: "",
            type: "IMAGE",
            url: "https://master.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_cl_bogo02_1_thumbnail_64.png",
            __typename: "ProductMedia",
          },
        ],
        __typename: "ProductVariant",
      },
      __typename: "CheckoutLine",
    },
    {
      id: "Q2hlY2tvdXRMaW5lOjJhNGNiYjhmLTA4OWQtNDhkMi05YjE1LTYxMzE5NTFlMzRjZA==",
      quantity: 1,
      totalPrice: {
        gross: {
          currency: "USD",
          amount: 7,
          __typename: "Money",
        },
        __typename: "TaxedMoney",
      },
      unitPrice: {
        gross: {
          currency: "USD",
          amount: 7,
          __typename: "Money",
        },
        __typename: "TaxedMoney",
      },
      undiscountedUnitPrice: {
        currency: "USD",
        amount: 7,
        __typename: "Money",
      },
      variant: {
        attributes: [
          {
            values: [
              {
                name: "2l",
                __typename: "AttributeValue",
              },
            ],
            __typename: "SelectedAttribute",
          },
        ],
        id: "UHJvZHVjdFZhcmlhbnQ6MjA3",
        name: "2l",
        product: {
          name: "Carrot Juice",
          media: [
            {
              alt: "",
              type: "IMAGE",
              url: "https://master.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_fd_juice_05_thumbnail_64.png",
              __typename: "ProductMedia",
            },
          ],
          __typename: "Product",
        },
        media: [
          {
            alt: "",
            type: "IMAGE",
            url: "https://master.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_fd_juice_05_thumbnail_64.png",
            __typename: "ProductMedia",
          },
        ],
        __typename: "ProductVariant",
      },
      __typename: "CheckoutLine",
    },
  ],
  __typename: "Checkout",
};
