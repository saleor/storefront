import { AVAILABLE_CHANNELS } from "@/lib/const";
import { useApolloClient } from "@apollo/client";
import { ChannelContext } from "pages/_app";
import { useContext } from "react";

export const Footer: React.VFC = () => {
  const { channel: chosenChannel, setChannel } = useContext(ChannelContext);

  return (
    <div className="mb-16">
      <footer className="text-gray-600 body-font bg-gray-700">
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-bold text-white tracking-widest text-md mb-3">
                Read more
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-white hover:text-red-300" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="text-white hover:text-red-300" href="#">
                    Policy
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-bold text-white tracking-widest text-md mb-3">
                Region
              </h2>
              <nav className="list-none mb-10">
                {AVAILABLE_CHANNELS.map((channel, i) => (
                  <li key={i}>
                    <a
                      className="text-white hover:text-red-300"
                      href="#"
                      onClick={() => setChannel(channel.slug)}
                    >
                      {channel.name}{" "}
                      {channel.slug === chosenChannel && <>Its me!</>}
                    </a>
                  </li>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-gray-900">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-white text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Saleor Commerce
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
