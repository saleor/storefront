import { useState, useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Select } from "./Select";

export default {
  title: "Components/Select",
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = ({ selected, ...args }) => {
  const [selectedOption, setSelectedOption] = useState(selected);

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  return (
    <div className='w-[440px]'>
      <Select
        {...args}
        selected={selectedOption}
        onChange={setSelectedOption}
      />
    </div>
  );
};

const users = [
  { label: "Durward Reynolds", value: "Durward Reynolds", id: "1" },
  { label: "Kenton Towne", value: "Kenton Towne", id: "2" },
  { label: "Therese Wunsch", value: "Therese Wunsch", id: "3" },
  { label: "Benedict Kessler", value: "Benedict Kessler", id: "4" },
  { label: "Katelyn Rohan", value: "Katelyn Rohan", id: "5" },
];

const commonArgs = {
  selected: users[0],
  options: users,
};

export const Basic = Template.bind({});

Basic.args = commonArgs;

export const Error = Template.bind({});

Error.args = {
  ...commonArgs,
  error: true,
};

export const Disabled = Template.bind({});

Disabled.args = {
  ...commonArgs,
  disabled: true,
};

export const Countries = Template.bind({});

const countries = [
  { label: "Polska", value: "Polska", icon: "🇵🇱", id: "1" },
  { label: "Niemcy", value: "Niemcy", icon: "🇩🇪", id: "2" },
  { label: "USA", value: "USA", icon: "🇺🇸", id: "3" },
  { label: "Francja", value: "Francja", icon: "🇫🇷", id: "4" },
  { label: "Bangladesz", value: "Bangladesz", icon: "🇧🇩", id: "5" },
];

Countries.args = {
  selected: countries[0],
  options: countries,
};
