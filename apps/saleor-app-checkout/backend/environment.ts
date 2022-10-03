import fs from "fs";
import { serverEnvVars } from "../constants";

export const getAuthToken = () => {
  let token;

  if (serverEnvVars.appToken) {
    token = serverEnvVars.appToken;
  }

  if (!token && process.env.VERCEL !== "1" && fs.existsSync(".auth_token")) {
    token = fs.readFileSync(".auth_token", "utf-8").trim();
  }

  if (!token) {
    if (process.env.VERCEL) {
      console.warn(
        "⚠️ Warning! Auth token is empty. Make sure SALEOR_APP_TOKEN env variable is set"
      );
    } else {
      console.warn(
        "⚠️ Warning! Auth token is not set. Make sure the app is installed in Saleor or set SALEOR_APP_TOKEN environment variable"
      );
    }
    token = "";
  }

  return token;
};
