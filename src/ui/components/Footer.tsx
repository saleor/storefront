const footer = {
  home: [
    { name: "Home", href: "/" },
    { name: "Login", href: "/login" },
  ],
  categories: [
    { name: "All", href: "#" },
    { name: "T-shirts", href: "#" },
    { name: "Hoodies", href: "#" },
    { name: "Accessories", href: "#" },
  ],
};
export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="py-16 grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Home</h3>
            <ul className="mt-4 space-y-4">
              {footer.home.map((item) => (
                <li key={item.name} className="text-sm">
                  <a href={item.href} className="text-gray-500 hover:text-gray-600">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Category</h3>
            <ul className="mt-4 space-y-4">
              {footer.categories.map((item) => (
                <li key={item.name} className="text-sm">
                  <a href={item.href} className="text-gray-500 hover:text-gray-600">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-16 md:mt-16 xl:mt-0">
            <h3 className="text-sm font-medium text-gray-900">Check it out</h3>
          </div>
        </div>

        <div className="border-t border-gray-200 py-10 flex justify-between">
          <p className="text-sm text-gray-500">Copyright &copy; 2023 Your Store, Inc.</p>
          <p className="text-sm text-gray-500">Created by Saleor, Inc</p>
        </div>
      </div>
    </footer>
  );
}