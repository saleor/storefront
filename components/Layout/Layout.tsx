import { Navbar } from "../Navbar";

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow">
        {children}
      </div>
    </>
  );
};

export default Layout;
