import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Chip } from "./Chip";
import { DiscountIcon } from "../icons";

export default {
  title: "Components/Chip",
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  label: "SAVE10",
  onClick: action("onCloseClick"),
};

export const WithIcon = Template.bind({});

WithIcon.args = {
  icon: <DiscountIcon />,
  label: "SAVE10",
  onClick: action("onCloseClick"),
};
