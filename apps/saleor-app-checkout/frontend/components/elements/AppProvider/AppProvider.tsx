import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ClientAppBridgeProvider = dynamic(
  () => import("./ClientAppBridgeProvider").then((m) => m.ClientAppBridgeProvider),
  { ssr: false }
);

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ClientAppBridgeProvider>{children}</ClientAppBridgeProvider>;
};
export default AppProvider;
