import { STOREFRONT_NAME } from "@/lib/const";
import { Footer } from "../Footer";
import { InfoBanner } from "../InfoBanner/InfoBanner";
import { Navbar } from "../Navbar";

export interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      {STOREFRONT_NAME === "FASHION4YOU" && <InfoBanner />}
      <Navbar />
      <div className="align-middle flex flex-col flex-grow">{children}</div>
      <Footer />
    </>
  );
}

export default Layout;
