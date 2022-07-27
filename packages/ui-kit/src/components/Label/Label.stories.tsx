import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Label } from "./Label";

export default {
  title: "Components/Label",
  component: Label,
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  children: "Label*",
};
