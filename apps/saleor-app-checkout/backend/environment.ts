import fs from "fs";
import { envVars, serverEnvVars, IS_TEST } from "../constants";
import { AppDocument, AppQuery, AppQueryVariables } from "../graphql";
import { getClient } from "./client";

const maskToken = (token: string) => "*".repeat(Math.max(token.length - 4, 0)) + token.slice(-4);

export const getAuthToken = () => {
  let token;
  if (serverEnvVars.appToken) {
    token = serverEnvVars.appToken;
  }

  if (!token && process.env.VERCEL !== "1" && fs.existsSync(".auth_token")) {
    token = fs.readFileSync(".auth_token", "utf-8");
  }

  if (IS_TEST) {
    // Allows to use real appToken to record requests in development
    token = "TEST";
  }

  if (!token) {
    if (process.env.VERCEL) {
      console.warn(
        "⚠️ Warning! Auth token is empty. Make sure SALEOR_APP_TOKEN env variable is set"
      );
    } else {
      console.warn(
        "⚠️ Warning! Auth token is not set. Make sure the app is installedd in Saleor or set SALEOR_APP_TOKEN environment variable"
      );
    }
    token = "";
  }

  console.log("Using authToken: ", maskToken(token));
  return token;
};

export const setAuthToken = (token: string) => {
  if (process.env.VERCEL === "1") {
    console.warn(
      "App was installed in Saleor, please update SALEOR_APP_TOKEN environment variables in Vercel"
    );
  } else {
    console.log("Setting authToken: ", maskToken(token));
    fs.writeFileSync(".auth_token", token);
  }
};

export const getAppId = async () => {
  const { data, error } = await getClient()
    .query<AppQuery, AppQueryVariables>(AppDocument)
    .toPromise();
  if (error) {
    throw new Error("Couldn't fetch app id", { cause: error });
  }
  const id = data?.app?.id;

  if (!id) {
    throw new Error("App id is empty");
  }

  return id;
};

export const getAppDomain = () => {
  const url = new URL(envVars.apiUrl);
  return url.host;
};
