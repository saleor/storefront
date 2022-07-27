import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: "Button",
  variant: "primary",
};

export const Secondary = Template.bind({});

Secondary.args = {
  label: "Button",
  variant: "secondary",
};

export const Tertiary = Template.bind({});

Tertiary.args = {
  label: "Button",
  variant: "tertiary",
};
