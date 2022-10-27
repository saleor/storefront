import { NextPage } from "next";
import { ThemeProvider as MacawUIThemeProvider } from "@saleor/macaw-ui";
import { AppBridge, AppBridgeProvider, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Theme } from "@material-ui/core/styles";
import React, { PropsWithChildren } from "react";
import { Card, Typography, Box } from "@material-ui/core";
import { ConfigForm } from "../../saleor-app/components/ConfigForm/ConfigForm";

const themeOverrides: Partial<Theme> = {
  // @ts-ignore deep partial required
  palette: { background: { default: "#EFF5F8", paper: "#f6f8fa" } },
  /**
   * You can override MacawUI theme here
   */
};

/**
 * Ensure instance is a singleton.
 * TODO: This is React 18 issue, consider hiding this workaround inside app-sdk
 */
const appBridgeInstance = typeof window !== "undefined" ? new AppBridge() : undefined;

/**
 * That's a hack required by Macaw-UI incompatibility with React@18
 */
const ThemeProvider = MacawUIThemeProvider as React.FC<
  PropsWithChildren<{ overrides?: Partial<Theme>; ssr: boolean }>
>;

const DashboardPage: NextPage = () => {
  return (
    <AppBridgeProvider appBridgeInstance={appBridgeInstance}>
      <ThemeProvider overrides={themeOverrides} ssr>
        <Typography variant="h1">Saleor Storefront (React)</Typography>
        <Card className="mt-4">
          <div className="px-4 py-4">
            <h2 className="mb-4 block">Configuration</h2>
            <ConfigForm />
          </div>
        </Card>
      </ThemeProvider>
    </AppBridgeProvider>
  );
};

export default DashboardPage;
