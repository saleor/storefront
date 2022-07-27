import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState, useEffect } from "react";

import { Switch } from "./Switch";

export default {
  title: "Components/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = ({ checked, ...args }) => {
  const [enabled, setEnabled] = useState(checked);

  useEffect(() => {
    setEnabled(checked);
  }, [checked]);

  return <Switch {...args} checked={enabled} onChange={setEnabled} />;
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

export const OnlyToogle = Template.bind({});
