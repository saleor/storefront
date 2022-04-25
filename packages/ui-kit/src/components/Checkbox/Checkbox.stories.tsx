import { useState, useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Checkbox } from "./Checkbox";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = ({ checked, ...args }) => {
  const [enabled, setEnabled] = useState(checked);

  useEffect(() => {
    setEnabled(checked);
  }, [checked]);

  return (
    <Checkbox
      {...args}
      checked={enabled}
      onChange={(e) => setEnabled(e.currentTarget.checked)}
    />
  );
};

export const Basic = Template.bind({});

Basic.args = {
  label: "Selector Label",
};

export const Checked = Template.bind({});

Checked.args = {
  label: "Selector Label",
  checked: true,
};

const TemplateWithoutLabel: ComponentStory<typeof Checkbox> = ({
  checked,
  ...args
}) => {
  const [enabled, setEnabled] = useState(checked);

  useEffect(() => {
    setEnabled(checked);
  }, [checked]);

  return (
    <label>
      <Checkbox
        {...args}
        checked={enabled}
        onChange={(e) => setEnabled(e.currentTarget.checked)}
      />
    </label>
  );
};

export const WithoutLabel = TemplateWithoutLabel.bind({});

WithoutLabel.args = {
  checked: true,
};
