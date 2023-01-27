const getDecimalsForAdyen = (currency: string) => {
  if (currency.length !== 3) {
    throw new Error(`currency needs to be a 3-letter code`);
  }
  const adyenCurrency = adyenCurrencies[currency.toUpperCase() as keyof typeof adyenCurrencies];
  const decimals = adyenCurrency ? adyenCurrency.decimals : 2;
  return decimals;
};

// Some payment methods expect the amount to be in cents (integers)
// Saleor provides and expects the amount to be in dollars (decimal format / floats)
export const getAdyenIntegerAmountFromSaleor = (major: number, currency: string) => {
  const decimals = getDecimalsForAdyen(currency);
  const multiplier = 10 ** decimals;
  return Number.parseInt((major * multiplier).toFixed(0), 10);
};

// Some payment methods expect the amount to be in cents (integers)
// Saleor provides and expects the amount to be in dollars (decimal format / floats)
export const getSaleorAmountFromAdyenInteger = (minor: number, currency: string) => {
  const decimals = getDecimalsForAdyen(currency);
  const multiplier = 10 ** decimals;
  return Number.parseFloat((minor / multiplier).toFixed(decimals));
};

// https://docs.adyen.com/development-resources/currency-codes
const adyenCurrencies = {
  AED: {
    countryName: "UAE Dirham",
    decimals: 2,
  },
  ALL: {
    countryName: "Albanian Lek",
    decimals: 2,
  },
  AMD: {
    countryName: "Armenian Dram",
    decimals: 2,
  },
  ANG: {
    countryName: "Antillian Guilder",
    decimals: 2,
  },
  AOA: {
    countryName: "Angolan Kwanza",
    decimals: 2,
  },
  ARS: {
    countryName: "Nuevo Argentine Peso",
    decimals: 2,
  },
  AUD: {
    countryName: "Australian Dollar",
    decimals: 2,
  },
  AWG: {
    countryName: "Aruban Guilder",
    decimals: 2,
  },
  AZN: {
    countryName: "Azerbaijani manat",
    decimals: 2,
  },
  BAM: {
    countryName: "Bosnia and Herzegovina Convertible Marks",
    decimals: 2,
  },
  BBD: {
    countryName: "Barbados Dollar",
    decimals: 2,
  },
  BDT: {
    countryName: "Bangladesh Taka",
    decimals: 2,
  },
  BGN: {
    countryName: "New Bulgarian Lev",
    decimals: 2,
  },
  BHD: {
    countryName: "Bahraini Dinar",
    decimals: 3,
  },
  BMD: {
    countryName: "Bermudian Dollar",
    decimals: 2,
  },
  BND: {
    countryName: "Brunei Dollar",
    decimals: 2,
  },
  BOB: {
    countryName: "Bolivia Boliviano",
    decimals: 2,
  },
  BRL: {
    countryName: "Brazilian Real",
    decimals: 2,
  },
  BSD: {
    countryName: "Bahamian Dollar",
    decimals: 2,
  },
  BWP: {
    countryName: "Botswana Pula",
    decimals: 2,
  },
  BYN: {
    countryName: "New Belarusian Ruble",
    decimals: 2,
  },
  BZD: {
    countryName: "Belize Dollar",
    decimals: 2,
  },
  CAD: {
    countryName: "Canadian Dollar",
    decimals: 2,
  },
  CHF: {
    countryName: "Swiss Franc",
    decimals: 2,
  },
  CLP: {
    countryName: "Chilean Peso",
    decimals: 2,
  },
  CNY: {
    countryName: "Yuan Renminbi",
    decimals: 2,
  },
  COP: {
    countryName: "Colombian Peso",
    decimals: 2,
  },
  CRC: {
    countryName: "Costa Rican Colon",
    decimals: 2,
  },
  CUP: {
    countryName: "Cuban Peso",
    decimals: 2,
  },
  CVE: {
    countryName: "Cape Verdi Escudo",
    decimals: 0,
  },
  CZK: {
    countryName: "Czech Koruna",
    decimals: 2,
  },
  DJF: {
    countryName: "Djibouti Franc",
    decimals: 0,
  },
  DKK: {
    countryName: "Danish Krone",
    decimals: 2,
  },
  DOP: {
    countryName: "Dominican Republic Peso",
    decimals: 2,
  },
  DZD: {
    countryName: "Algerian Dinar",
    decimals: 2,
  },
  EGP: {
    countryName: "Egyptian Pound",
    decimals: 2,
  },
  ETB: {
    countryName: "Ethiopian Birr",
    decimals: 2,
  },
  EUR: {
    countryName: "Euro",
    decimals: 2,
  },
  FJD: {
    countryName: "Fiji Dollar",
    decimals: 2,
  },
  FKP: {
    countryName: "Falkland Islands Pound",
    decimals: 2,
  },
  GBP: {
    countryName: "Pound Sterling",
    decimals: 2,
  },
  GEL: {
    countryName: "Georgian Lari",
    decimals: 2,
  },
  GHS: {
    countryName: "Ghanaian Cedi (3rd)",
    decimals: 2,
  },
  GIP: {
    countryName: "Gibraltar Pound",
    decimals: 2,
  },
  GMD: {
    countryName: "Gambia Delasi",
    decimals: 2,
  },
  GNF: {
    countryName: "Guinea Franc",
    decimals: 0,
  },
  GTQ: {
    countryName: "Guatemala Quetzal",
    decimals: 2,
  },
  GYD: {
    countryName: "Guyanese Dollar",
    decimals: 2,
  },
  HKD: {
    countryName: "Hong Kong Dollar",
    decimals: 2,
  },
  HNL: {
    countryName: "Honduras Lempira",
    decimals: 2,
  },
  HTG: {
    countryName: "Haitian Gourde",
    decimals: 2,
  },
  HUF: {
    countryName: "Hungarian Forint",
    decimals: 2,
  },
  IDR: {
    countryName: "Indonesian Rupiah",
    decimals: 0,
  },
  ILS: {
    countryName: "New Israeli Scheqel",
    decimals: 2,
  },
  INR: {
    countryName: "Indian Rupee",
    decimals: 2,
  },
  IQD: {
    countryName: "Iraqi Dinar",
    decimals: 3,
  },
  ISK: {
    countryName: "Iceland Krona",
    decimals: 2,
  },
  JMD: {
    countryName: "Jamaican Dollar",
    decimals: 2,
  },
  JOD: {
    countryName: "Jordanian Dinar",
    decimals: 3,
  },
  JPY: {
    countryName: "Japanese Yen",
    decimals: 0,
  },
  KES: {
    countryName: "Kenyan Shilling",
    decimals: 2,
  },
  KGS: {
    countryName: "Kyrgyzstan Som",
    decimals: 2,
  },
  KHR: {
    countryName: "Cambodia Riel",
    decimals: 2,
  },
  KMF: {
    countryName: "Comoro Franc",
    decimals: 0,
  },
  KRW: {
    countryName: "South-Korean Won",
    decimals: 0,
  },
  KWD: {
    countryName: "Kuwaiti Dinar",
    decimals: 3,
  },
  KYD: {
    countryName: "Cayman Islands Dollar",
    decimals: 2,
  },
  KZT: {
    countryName: "Kazakhstani Tenge",
    decimals: 2,
  },
  LAK: {
    countryName: "Laos Kip",
    decimals: 2,
  },
  LBP: {
    countryName: "Lebanese Pound",
    decimals: 2,
  },
  LKR: {
    countryName: "Sri Lanka Rupee",
    decimals: 2,
  },
  LYD: {
    countryName: "Libyan Dinar",
    decimals: 3,
  },
  MAD: {
    countryName: "Moroccan Dirham",
    decimals: 2,
  },
  MDL: {
    countryName: "Moldovia Leu",
    decimals: 2,
  },
  MKD: {
    countryName: "Macedonian Denar",
    decimals: 2,
  },
  MMK: {
    countryName: "Myanmar Kyat",
    decimals: 2,
  },
  MNT: {
    countryName: "Mongolia Tugrik",
    decimals: 2,
  },
  MOP: {
    countryName: "Macau Pataca",
    decimals: 2,
  },
  MRU: {
    countryName: "Mauritania Ouguiya",
    decimals: 2,
  },
  MUR: {
    countryName: "Mauritius Rupee",
    decimals: 2,
  },
  MVR: {
    countryName: "Maldives Rufiyaa",
    decimals: 2,
  },
  MWK: {
    countryName: "Malawi Kwacha",
    decimals: 2,
  },
  MXN: {
    countryName: "Mexican Peso",
    decimals: 2,
  },
  MYR: {
    countryName: "Malaysian Ringgit",
    decimals: 2,
  },
  MZN: {
    countryName: "Mozambican Metical",
    decimals: 2,
  },
  NAD: {
    countryName: "Namibian Dollar",
    decimals: 2,
  },
  NGN: {
    countryName: "Nigerian Naira",
    decimals: 2,
  },
  NIO: {
    countryName: "Nicaragua Cordoba Oro",
    decimals: 2,
  },
  NOK: {
    countryName: "Norwegian Krone",
    decimals: 2,
  },
  NPR: {
    countryName: "Nepalese Rupee",
    decimals: 2,
  },
  NZD: {
    countryName: "New Zealand Dollar",
    decimals: 2,
  },
  OMR: {
    countryName: "Rial Omani",
    decimals: 3,
  },
  PAB: {
    countryName: "Panamanian Balboa",
    decimals: 2,
  },
  PEN: {
    countryName: "Peruvian Nuevo Sol",
    decimals: 2,
  },
  PGK: {
    countryName: "New Guinea Kina",
    decimals: 2,
  },
  PHP: {
    countryName: "Philippine Peso",
    decimals: 2,
  },
  PKR: {
    countryName: "Pakistan Rupee",
    decimals: 2,
  },
  PLN: {
    countryName: "New Polish Zloty",
    decimals: 2,
  },
  PYG: {
    countryName: "Paraguay Guarani",
    decimals: 0,
  },
  QAR: {
    countryName: "Qatari Rial",
    decimals: 2,
  },
  RON: {
    countryName: "New Romanian Lei",
    decimals: 2,
  },
  RSD: {
    countryName: "Serbian Dinar",
    decimals: 2,
  },
  RUB: {
    countryName: "Russian Ruble",
    decimals: 2,
  },
  RWF: {
    countryName: "Rwanda Franc",
    decimals: 0,
  },
  SAR: {
    countryName: "Saudi Riyal",
    decimals: 2,
  },
  SBD: {
    countryName: "Solomon Island Dollar",
    decimals: 2,
  },
  SCR: {
    countryName: "Seychelles Rupee",
    decimals: 2,
  },
  SEK: {
    countryName: "Swedish Krone",
    decimals: 2,
  },
  SGD: {
    countryName: "Singapore Dollar",
    decimals: 2,
  },
  SHP: {
    countryName: "St. Helena Pound",
    decimals: 2,
  },
  SLE: {
    countryName: "Sierra Leone Leone",
    decimals: 2,
  },
  SOS: {
    countryName: "Somalia Shilling",
    decimals: 2,
  },
  SRD: {
    countryName: "Surinamese dollar",
    decimals: 2,
  },
  STN: {
    countryName: "Sao Tome & Principe Dobra",
    decimals: 2,
  },
  SVC: {
    countryName: "El Salvador Colón",
    decimals: 2,
  },
  SZL: {
    countryName: "Swaziland Lilangeni",
    decimals: 2,
  },
  THB: {
    countryName: "Thai Baht",
    decimals: 2,
  },
  TND: {
    countryName: "Tunisian Dinar",
    decimals: 3,
  },
  TOP: {
    countryName: "Tonga Pa'anga",
    decimals: 2,
  },
  TRY: {
    countryName: "New Turkish Lira",
    decimals: 2,
  },
  TTD: {
    countryName: "Trinidad & Tobago Dollar",
    decimals: 2,
  },
  TWD: {
    countryName: "New Taiwan Dollar",
    decimals: 2,
  },
  TZS: {
    countryName: "Tanzanian Shilling",
    decimals: 2,
  },
  UAH: {
    countryName: "Ukraine Hryvnia",
    decimals: 2,
  },
  UGX: {
    countryName: "Uganda Shilling",
    decimals: 0,
  },
  USD: {
    countryName: "US Dollars",
    decimals: 2,
  },
  UYU: {
    countryName: "Peso Uruguayo",
    decimals: 2,
  },
  UZS: {
    countryName: "Uzbekistani Som",
    decimals: 2,
  },
  VEF: {
    countryName: "Venezuelan Bolívar",
    decimals: 2,
  },
  VND: {
    countryName: "Vietnamese New Dong",
    decimals: 0,
  },
  VUV: {
    countryName: "Vanuatu Vatu",
    decimals: 0,
  },
  WST: {
    countryName: "Samoan Tala",
    decimals: 2,
  },
  XAF: {
    countryName: "CFA Franc BEAC",
    decimals: 0,
  },
  XCD: {
    countryName: "East Caribbean Dollar",
    decimals: 2,
  },
  XOF: {
    countryName: "CFA Franc BCEAO",
    decimals: 0,
  },
  XPF: {
    countryName: "CFP Franc",
    decimals: 0,
  },
  YER: {
    countryName: "Yemeni Rial",
    decimals: 2,
  },
  ZAR: {
    countryName: "South African Rand",
    decimals: 2,
  },
  ZMW: {
    countryName: "Zambian Kwacha",
    decimals: 2,
  },
};
