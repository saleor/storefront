import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Navbar />
    <div className="align-middle flex flex-col flex-grow">{children}</div>
    <Footer />
  </>
);

export default Layout;
