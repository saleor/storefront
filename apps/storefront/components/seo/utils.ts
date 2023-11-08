import { VERCEL_URL } from "@/lib/const";
import urlJoin from "url-join";

const baseUrl = VERCEL_URL || "";

export const ogImageUrl = urlJoin(baseUrl, "/api/og");
