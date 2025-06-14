import { Dimensions } from "react-native";

export const NAV_THEME = {
  light: {
    background: "hsl(220 20% 98%)", // soft light gray background
    border: "hsl(220 14% 89%)", // light border
    card: "hsl(0 0% 100%)", // white card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
    iron: "#c0c4c9",
    shuttleGray: "#6A6D70",
  },
  dark: {
    background: "hsl(220 15% 10%)", // deep navy background
    border: "hsl(220 12% 20%)", // dark border
    card: "hsl(220 15% 12%)", // dark card background
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(220 10% 90%)", // slightly blueish off-white
    text: "hsl(220 10% 90%)", // slightly blueish off-white
    iron: "#c0c4c9",
    shuttleGray: "#6A6D70",
  },
};

export const COLOR_PALETTE = [
  "#FF6B6B", // red
  "#FFB347", // orange
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4D96FF", // blue
  "#9D4ECC", // purple (fixed lowercase issue)
  "#FF85A1", // pink
  "#00C2A8", // teal
  "#FFC75F", // gold
  "#C34A36", // brown
  "#6C5DD3", // indigo
  "#3D405B", // dark blue

  "#F67280", // coral
  "#2A9D8F", // jade green
  "#8D99AE", // dusty blue
  "#E76F51", // burnt orange
  "#A8DADC", // pale cyan
  "#F4A261", // sandy orange
  "#B5838D", // mauve
  "#3A0CA3", // royal blue
];

export const iconsRecord: Record<string, string> = {
  pc: "Laptop",
  car: "Car",
  card: "CreditCard",
  clothes: "Shirt",
  dollar: "DollarSign",
  handCoins: "HandCoins",
  health: "Activity",
  house: "House",
  food: "Utensils",
  education: "Book",
  phone: "Smartphone",
  entertainment: "Gamepad2",
  piggy: "PiggyBank",
  money: "Banknote",
  transportation: "BusFront",
  rental: "Landmark",
  grant: "Gift",
  sale: "Receipt",
  shopping: "ShoppingCart",
  sport: "Dumbbell",
  tag: "Tag",
  travel: "Plane",
  wallet: "Wallet",
  other: "CircleHelp",
};

export const currencies: Record<string, string> = {
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  DZD: "Algerian Dinar",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AMD: "Armenian Dram",
  AUD: "Australian Dollar",
  AZN: "Azerbaijani Manat",
  BSD: "Bahamian Dollar",
  BHD: "Bahraini Dinar",
  BDT: "Bangladeshi Taka",
  BBD: "Barbadian Dollar",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  XOF: "West African CFA Franc",
  BMD: "Bermudian Dollar",
  BTN: "Bhutanese Ngultrum",
  BOB: "Bolivian Boliviano",
  BAM: "Bosnia-Herzegovina Convertible Mark",
  BWP: "Botswanan Pula",
  BRL: "Brazilian Real",
  BND: "Brunei Dollar",
  BGN: "Bulgarian Lev",
  BIF: "Burundian Franc",
  KHR: "Cambodian Riel",
  CAD: "Canadian Dollar",
  CVE: "Cape Verdean Escudo",
  KYD: "Cayman Islands Dollar",
  XAF: "Central African CFA Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  COP: "Colombian Peso",
  KMF: "Comorian Franc",
  CDF: "Congolese Franc",
  CRC: "Costa Rican Colón",
  HRK: "Croatian Kuna",
  CUP: "Cuban Peso",
  CZK: "Czech Republic Koruna",
  DKK: "Danish Krone",
  DJF: "Djiboutian Franc",
  DOP: "Dominican Peso",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  GMD: "Gambian Dalasi",
  GEL: "Georgian Lari",
  GHS: "Ghanaian Cedi",
  GTQ: "Guatemalan Quetzal",
  GNF: "Guinean Franc",
  GYD: "Guyanaese Dollar",
  HTG: "Haitian Gourde",
  HNL: "Honduran Lempira",
  HKD: "Hong Kong Dollar",
  HUF: "Hungarian Forint",
  ISK: "Icelandic Króna",
  INR: "Indian Rupee",
  IDR: "Indonesian Rupiah",
  IRR: "Iranian Rial",
  IQD: "Iraqi Dinar",
  JMD: "Jamaican Dollar",
  JPY: "Japanese Yen",
  JOD: "Jordanian Dinar",
  KZT: "Kazakhstani Tenge",
  KES: "Kenyan Shilling",
  KWD: "Kuwaiti Dinar",
  KGS: "Kyrgystani Som",
  LAK: "Laotian Kip",
  LBP: "Lebanese Pound",
  LSL: "Lesotho Loti",
  LRD: "Liberian Dollar",
  LYD: "Libyan Dinar",
  MOP: "Macanese Pataca",
  MKD: "Macedonian Denar",
  MGA: "Malagasy Ariary",
  MWK: "Malawian Kwacha",
  MYR: "Malaysian Ringgit",
  MVR: "Maldivian Rufiyaa",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MXN: "Mexican Peso",
  MDL: "Moldovan Leu",
  MNT: "Mongolian Tugrik",
  MAD: "Moroccan Dirham",
  MZN: "Mozambican Metical",
  MMK: "Myanmar Kyat",
  NAD: "Namibian Dollar",
  NPR: "Nepalese Rupee",
  ANG: "Netherlands Antillean Guilder",
  TWD: "New Taiwan Dollar",
  NZD: "New Zealand Dollar",
  NIO: "Nicaraguan Córdoba",
  NGN: "Nigerian Naira",
  KPW: "North Korean Won",
  NOK: "Norwegian Krone",
  OMR: "Omani Rial",
  PKR: "Pakistani Rupee",
  PAB: "Panamanian Balboa",
  PGK: "Papua New Guinean Kina",
  PYG: "Paraguayan Guarani",
  PEN: "Peruvian Nuevo Sol",
  PHP: "Philippine Peso",
  PLN: "Polish Zloty",
  QAR: "Qatari Rial",
  RON: "Romanian Leu",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SHP: "Saint Helena Pound",
  WST: "Samoan Tala",
  SAR: "Saudi Riyal",
  RSD: "Serbian Dinar",
  SCR: "Seychellois Rupee",
  SLL: "Sierra Leonean Leone",
  SGD: "Singapore Dollar",
  SBD: "Solomon Islands Dollar",
  SOS: "Somali Shilling",
  ZAR: "South African Rand",
  KRW: "South Korean Won",
  SSP: "South Sudanese Pound",
  LKR: "Sri Lankan Rupee",
  SDG: "Sudanese Pound",
  SRD: "Surinamese Dollar",
  SZL: "Swazi Lilangeni",
  SEK: "Swedish Krona",
  CHF: "Swiss Franc",
  SYP: "Syrian Pound",
  TJS: "Tajikistani Somoni",
  TZS: "Tanzanian Shilling",
  THB: "Thai Baht",
  TOP: "Tongan Paʻanga",
  TTD: "Trinidad and Tobago Dollar",
  TND: "Tunisian Dinar",
  TRY: "Turkish Lira",
  TMT: "Turkmenistani Manat",
  UGX: "Ugandan Shilling",
  UAH: "Ukrainian Hryvnia",
  AED: "United Arab Emirates Dirham",
  GBP: "British Pound Sterling",
  USD: "United States Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistan Som",
  VUV: "Vanuatu Vatu",
  VES: "Venezuelan Bolívar Soberano",
  VND: "Vietnamese Dong",
  YER: "Yemeni Rial",
  ZMW: "Zambian Kwacha",
  ZWL: "Zimbabwean Dollar",
};

export const SCREEN_WIDTH = Dimensions.get("window").width;
