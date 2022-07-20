import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ReactNode, useState } from "react";

import { Radio } from "./Radio";

export default {
  title: "Components/Radio",
  component: Radio,
} as ComponentMeta<typeof Radio>;

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

const Template = ({
  customOptions = [],
}: {
  customOptions: Array<{
    value: string;
    label: ReactNode;
    classNames: Record<string, string>;
  }>;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const radioOptions = [...options, ...customOptions];

  return (
    <div role="radiogroup" aria-label="radios" className="radio-box-group">
      {radioOptions.map((option) => (
        <Radio
          {...option}
          key={option.value}
          checked={option.value === selected}
          onChange={(event) => {
            console.log(event.target);
            setSelected(event.target.value);
          }}
        />
      ))}
    </div>
  );
};

export const CustomLook: ComponentStory<typeof Template> = Template.bind({});

CustomLook.args = {
  customOptions: [
    {
      classNames: {
        container:
          "flex !flex-col px-[15px] py-[21px] border hover:border-border-active",
        radio: "!border-sky-500",
      },
      value: "extended",
      label: (
        <>
          <span>Extended label</span>
          <br />
          <span className="text-text-secondary">very extended description</span>
        </>
      ),
    },
  ],
};
