// Call this route to disable caching in browser https://nextjs.org/docs/pages/building-your-application/configuring/preview-mode#specify-the-preview-mode-duration
// It is safe to remove this route if you do not want to use preview mode

import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
	res.setPreviewData({});
	res.end("Preview mode enabled");
}
