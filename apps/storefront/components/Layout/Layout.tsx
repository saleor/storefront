import { STOREFRONT_NAME } from "@/lib/const";
import { Footer } from "../Footer";
import { InfoBanner } from "../InfoBanner/InfoBanner";
import { Navbar } from "../Navbar";

export interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {STOREFRONT_NAME === "FASHION4YOU" && <InfoBanner />}
      <div className="flex flex-col mx-auto w-full max-w-screen-2xl lg:px-8">
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
