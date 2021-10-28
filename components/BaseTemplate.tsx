import { Navbar, Spinner } from ".";

export interface BaseTemplateProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: boolean;
}

export const BaseTemplate = ({ children, isLoading }: BaseTemplateProps) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 align-middle flex flex-col flex-grow">
        {isLoading ? <Spinner /> : children}
      </div>
    </>
  );
};

export default BaseTemplate;
