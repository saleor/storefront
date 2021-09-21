import { ProductCollection, Navbar } from "@/components";
import BaseSeo from "@/components/seo/BaseSeo";

const Home: React.VFC = () => {
  return (
    <>
      <BaseSeo />
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="py-10">
          <header className="mb-4">
            <div className="max-w-7xl mx-auto px-8"></div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-8">
              <ProductCollection />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
