import { useState } from "react";
import { AttributeDetails } from "../product/AttributeDetails";
import RichText from "../RichText";
import { translate } from "@/lib/translations";

export const Tabs = ({ product, selectedVariant }) => {
  const description = translate(product, "description");

  const tabs = [
    { name: "DESCRIPTION", content: <RichText jsonStringData={description} /> },
    {
      name: "ATTRIBUTES",
      content: <AttributeDetails product={product} selectedVariant={selectedVariant} />,
    },
  ];
  const [openTab, setOpenTab] = useState("DESCRIPTION");

  return (
    <>
      <div className="mb-4 border-gray-200 border-b">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center whitespace-nowrap sm:whitespace-normal"
          role="tablist"
        >
          {tabs.map((tab) => {
            return (
              <li className="mr-2 text-3xl font-bold" role="presentation" key={tab.name}>
                <button
                  className={`inline-block p-4 rounded-t-lg transition-colors duration-200 border-b ${
                    openTab === tab.name ? "border-green-500" : "border-gray-200"
                  } relative z-10`}
                  type="button"
                  role="tab"
                  aria-selected={openTab === tab.name}
                  onClick={() => setOpenTab(tab.name)}
                >
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 w-full break-words">
        {tabs.map((tab) => (
          <div key={tab.name} className={tab.name === openTab ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};
