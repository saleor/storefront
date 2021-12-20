module.exports = {
  defaultLocale: "en-US",
  locales: ["fr-fr", "pl-pl"],
  defaultChannel: {
    slug: "default-channel",
    name: "United States Dollar",
    currencyCode: "USD",
  },
  channels: [
    {
      slug: "channel-pln",
      name: "Polski Złoty",
      currencyCode: "PLN",
    },
    {
      slug: "channel-gbp",
      name: "British Pound Sterling",
      currencyCode: "GBP",
    },
  ],
};
