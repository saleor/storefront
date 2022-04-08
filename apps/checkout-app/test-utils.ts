import { createMocks, RequestMethod } from "node-mocks-http";

export const mockRequest = (method: RequestMethod = "GET") => {
  const { req, res } = createMocks({ method });
  req.headers = {
    "Content-Type": "application/json",
  };

  return { req, res };
};
