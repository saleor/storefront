import { NextApiRequest, NextApiResponse } from "next";

import { saleorDomainHeader } from "../../constants";

const handler = (
  request: NextApiRequest,
  response: NextApiResponse
): undefined => {
  console.log(request); // for deployment debug pusposes

  const saleor_domain = request.headers[saleorDomainHeader];
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
