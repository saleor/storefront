import { NextApiRequest, NextApiResponse } from "next";

import { SALEOR_DOMAIN_HEADER } from "../../constants";

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<undefined> => {
  console.log(request); // for deployment debug pusposes

  const saleor_domain = request.headers[SALEOR_DOMAIN_HEADER];
  if (!saleor_domain) {
    response
      .status(400)
      .json({ success: false, message: "Missing saleor domain token." });
    return;
  }

  const auth_token = request.body?.auth_token as string;
  if (!auth_token) {
    response
      .status(400)
      .json({ success: false, message: "Missing auth token." });
    return;
  }

  response.status(200).json({ success: true });
};

export default handler;
