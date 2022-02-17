import { NextApiRequest, NextApiResponse } from "next";

import { pagesPath } from "@/lib/$path";
import { REVALIDATION_SECRET } from "@/lib/const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Disable revalidation if not configured
  if (!REVALIDATION_SECRET) {
    return res.status(404);
  }
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const path = pagesPath.revalidation.ondemand.$url().pathname || "/"
    await res.unstable_revalidate(path);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
