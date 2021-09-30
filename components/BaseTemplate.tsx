import { Navbar } from ".";
import Footer from "./Footer";
import Spinner from "./Spinner";

export interface BaseTemplateProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: boolean;
}

export const BaseTemplate: React.VFC<BaseTemplateProps> = ({
  children,
  isLoading,
}) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow">
        {isLoading ? <Spinner /> : children}
      </div>
      <Footer />
    </>
  );
};

export default BaseTemplate;
