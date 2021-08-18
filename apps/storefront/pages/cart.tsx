import React from 'react';

import { Navbar } from '../components/Navbar';

const Cart: React.VFC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8">
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            This is cart content
          </div>
        </main>
      </div>
    </div>
  )
}

export default Cart;







