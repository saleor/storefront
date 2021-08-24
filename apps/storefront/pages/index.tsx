import React from "react";
import Products from "../components/ProductCollection";
import { Navbar } from "../components/Navbar";

const Home: React.VFC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8"></div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            <Products />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
