import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ChipButton } from "./ChipButton";

export default {
  title: "Components/ChipButton",
  component: ChipButton,
} as ComponentMeta<typeof ChipButton>;

const Template: ComponentStory<typeof ChipButton> = (args) => <ChipButton {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  label: "English",
};

export const Active = Template.bind({});

Active.args = {
  label: "English",
  active: true,
};
