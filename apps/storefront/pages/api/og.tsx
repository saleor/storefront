import { STOREFRONT_NAME, VERCEL_URL } from "@/lib/const";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

type StorefrontImage = {
  url: string;
  width: number;
  height: number;
};

type StorefrontOGImages = {
  [key: string]: StorefrontImage;
};

const storefrontOGImage: StorefrontOGImages = {
  FASHION4YOU: {
    url: `${VERCEL_URL}/f4u_logo.png`,
    width: 512,
    height: 256,
  },
  CLOTHES4U: {
    url: `${VERCEL_URL}/c4u_logo.png`,
    width: 420,
    height: 230,
  },
};

export default async function handler() {
  const storefrontData = storefrontOGImage[STOREFRONT_NAME];

  if (!storefrontData) {
    console.error("No matching storefront data found for the storefront:", STOREFRONT_NAME);
    return new Response("No matching storefront data found", { status: 404 });
  }

  const { url, width, height } = storefrontData;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const imageData = await response.arrayBuffer();

    const base64Image = Buffer.from(imageData).toString("base64");

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            background: "#f6f6f6",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            width={width}
            height={height}
            src={`data:image/png;base64,${base64Image}`}
            alt="Storefront"
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Fetch error:", error instanceof Error ? error.message : error);
    return new Response("Image fetch error", { status: 500 });
  }
}
