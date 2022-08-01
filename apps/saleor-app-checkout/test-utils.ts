import { NextApiRequest, NextApiResponse } from "next";
import { PollyConfig, PollyServer } from "@pollyjs/core";
import omitDeep from "omit-deep-lodash";
import path from "path";
import { setupPolly } from "setup-polly-jest";
import { createMocks, RequestMethod } from "node-mocks-http";
import { handlers } from "./mocks/handlers";
import { Headers } from "headers-polyfill";
import { MockedRequest } from "msw";

declare module "next" {
  type NextApiResponse = {
    _getJSONData: <T extends Object>() => T;
  } & NextApiResponse;
}

export const mockRequest = (method: RequestMethod = "GET") => {
  const { req, res } = createMocks({ method });
  req.headers = {
    "Content-Type": "application/json",
  };

  return {
    req: req as unknown as NextApiRequest,
    res: res as unknown as NextApiResponse,
  };
};

const HEADERS_BLACKLIST = new Set([
  "authorization-bearer",
  "authorization",
  "set-cookie",
  "saleor-signature",
]);

const VARIABLES_BLACKLIST = [
  "email",
  "password",
  "redirectUrl",
  "newPassword",
  "oldPassword",
  "newEmail",
  "token",
  "refreshToken",
  "csrfToken",
];

export const removeBlacklistedVariables = (
  obj: {} | undefined | string
): {} | undefined | string => {
  if (!obj || typeof obj === "string") return obj;

  return omitDeep(obj, ...VARIABLES_BLACKLIST);
};

const tryParse = (text: string | undefined) => {
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

export const setupPollyMiddleware = (server: PollyServer) => {
  // Hide sensitive data in headers or in body
  server.any().on("beforePersist", (_, recording, event) => {
    console.log(recording.request.postData);
    const requestJson = tryParse(recording.request.postData?.text);
    const requestHeaders = recording.request.headers.filter(
      (el: Record<string, string>) => !HEADERS_BLACKLIST.has(el.name)
    );

    const responseJson = tryParse(recording.response.content?.text);
    const responseHeaders = recording.response.headers.filter(
      (el: Record<string, string>) => !HEADERS_BLACKLIST.has(el.name)
    );

    const filteredRequestJson = removeBlacklistedVariables(requestJson);
    const filteredResponseJson = removeBlacklistedVariables(responseJson);

    if (filteredRequestJson) {
      recording.request.postData.text = JSON.stringify(filteredRequestJson);
    }
    if (filteredResponseJson) {
      recording.response.content.text = JSON.stringify(filteredResponseJson);
    }
    recording.request.headers = requestHeaders;
    recording.response.cookies = [];
    recording.response.headers = responseHeaders;
  });

  // Check if request is handled by msw
  server
    .any()
    .filter((req) => {
      const { url, method, headers, body, id } = req;

      let reqBody: any;
      if (typeof body === "string") {
        try {
          reqBody = JSON.parse(body);
        } catch (e) {
          reqBody = body ?? "";
        }
      } else {
        reqBody = body ?? "";
      }

      const fakeReq: MockedRequest = {
        id: id ?? "",
        url: new URL(url),
        body: reqBody,
        mode: "cors",
        cache: "default",
        method,
        cookies: {},
        headers: new Headers(headers),
        redirect: "manual",
        bodyUsed: false,
        referrerPolicy: "no-referrer",
        destination: "document",
        credentials: "same-origin",
        referrer: "",
        integrity: "",
        keepalive: false,
        passthrough: () => ({
          passthrough: false,
          headers: new Headers(),
          body: reqBody,
          once: false,
          status: 200,
          statusText: "",
          delay: 0,
        }),
      };

      const isHandledByMsw = handlers.some((handler) => handler.test(fakeReq));

      if (isHandledByMsw) {
        console.debug("(from Polly.js) Passing request to msw\n", fakeReq);
      }

      return isHandledByMsw;
    })
    .passthrough();
};

export const setupRecording = () => {
  // use replay mode by default, override if POLLY_MODE env variable is passed
  let mode: PollyConfig["mode"] = "replay";
  let recordIfMissing = false;
  let recordFailedRequests = false;

  switch (process.env.POLLY_MODE) {
    case "record":
      mode = "record";
      recordIfMissing = true;
      recordFailedRequests = true;
      break;
    case "replay":
      mode = "replay";
      break;
  }

  if (process.env.CI) {
    mode = "replay";
    recordIfMissing = false;
  }

  return setupPolly({
    // Fix for Jest runtime issues (inline require)
    // https://github.com/gribnoysup/setup-polly-jest/issues/23#issuecomment-890494186
    adapters: [require("@pollyjs/adapter-fetch")],
    persister: require("@pollyjs/persister-fs"),
    mode,
    recordIfMissing,
    flushRequestsOnStop: true,
    recordFailedRequests,
    adapterOptions: {
      fetch: {
        context: globalThis,
      },
    },
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve("./recordings"),
      },
    },
    matchRequestsBy: {
      url: {
        protocol: true,
        username: true,
        password: true,
        hostname: true,
        port: true,
        pathname: true,
        query: true,
        hash: false,
      },
      body: true,
      order: true,
      method: true,
      headers: false,
    },
  });
};
