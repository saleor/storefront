import { useMainMenuQuery } from "@/saleor/api";
import Link from "next/link";

export const MainMenu = () => {
  const { loading, error, data } = useMainMenuQuery();

  if (loading)
    return (
      <div className="md:px-8 mt-20 absolute max-w-screen-md flex group p-2 flex-col dropdown">
        <button
          className="-mt-16 flex-shrink-0 h-6 w-6 mt-4 cursor-pointer"
          aria-haspopup="true"
          aria-expanded="true"
          aria-controls="main-menu-dropdown"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    );

  if (error) return <p>Error : {error.message}</p>;

  let menu = data?.menu?.items || [];

  return (
    <div className="md:px-8 mt-20 absolute max-w-screen-md flex group p-2 flex-col dropdown">
      <button
        className="-mt-16 flex-shrink-0 h-6 w-6 mt-4 cursor-pointer"
        aria-haspopup="true"
        aria-expanded="true"
        aria-controls="main-menu-dropdown"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="w-full mt-5 opacity-0 invisible dropdown-menu origin-top-right transition-all duration-300 transform -translate-y-2 scale-95">
        <div
          id="main-menu-dropdown"
          role="menu"
          className="h-screen w-screen md:ml-0 md:max-w-screen-md md:h-56 bg-white border origin-top-right border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-40"
        >
          <div className="flex flex-col md:flex-row cursor-default md:divide-x md:divide-gray-200">
            {menu.map((item) => {
              return (
                <div key={item?.name} className="md:pl-10 ml-5 md:ml-16 mt-10">
                  <h2 className="font-semibold text-md">{item?.name}</h2>
                  <ul className="mt-3">
                    {item?.children?.map((child) => {
                      return (
                        <li key={child?.name}>
                          <Link href={"/category/" + child?.category?.slug}>
                            <a className="ml-3 text-black hover:font-semibold hover:text-black">
                              {child?.name}
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
