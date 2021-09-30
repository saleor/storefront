export const CHECKOUT_TOKEN = "checkoutToken";
export const API_URI = process.env.NEXT_PUBLIC_API_URI || "";
export const DEFAULT_CHANNEL = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "";

export type Channel = {
  slug: string;
  name: string;
};

export const AVAILABLE_CHANNELS: Channel[] = [
  { name: "USA", slug: "default-channel" },
  { name: "Poland", slug: "channel-pln" },
];
