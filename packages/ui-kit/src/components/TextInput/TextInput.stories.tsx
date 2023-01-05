import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TextInput } from "./TextInput";
import { useStateWithOnChangeHandler } from "../../lib/utils";

export default {
  title: "Components/TextInput",
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = ({ value: _value, ...args }) => {
  const [inputValue, setInputValue] = useStateWithOnChangeHandler();

  return <TextInput {...args} value={inputValue} onChange={setInputValue} />;
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
  error: { message: "This is an error mesage for this specific field" },
  required: true,
};

export const WithoutLabel = Template.bind({});

WithoutLabel.args = {
  value: "Filled value",
  placeholder: "Placeholder",
  required: true,
};
