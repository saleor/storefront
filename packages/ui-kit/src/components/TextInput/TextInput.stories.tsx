import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { useState, useEffect } from "react";

import { TextInput } from "./TextInput";

export default {
  title: "Components/TextInput",
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = ({ value, ...args }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <TextInput
      {...args}
      value={inputValue}
      onChange={(e) => setInputValue(e.currentTarget?.value || "")}
    />
  );
};

export const Basic = Template.bind({});

Basic.args = {
  label: "Label",
  value: "",
  required: true,
};

export const Filled = Template.bind({});

Filled.args = {
  label: "Label",
  value: "Filled value",
  required: true,
};

export const Errored = Template.bind({});

Errored.args = {
  label: "Label",
  value: "Filled value",
  error: "This is an error mesage for this specific field",
  required: true,
};

export const WithoutLabel = Template.bind({});

WithoutLabel.args = {
  value: "Filled value",
  placeholder: "Placeholder",
  required: true,
};
