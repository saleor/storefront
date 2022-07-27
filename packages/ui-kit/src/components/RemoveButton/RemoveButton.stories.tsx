import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { RemoveButton } from "./RemoveButton";

export default {
  title: "Components/RemoveButton",
  component: RemoveButton,
} as ComponentMeta<typeof RemoveButton>;

const Template: ComponentStory<typeof RemoveButton> = (args) => (
  <RemoveButton {...args} />
);

export const Basic = Template.bind({});

Basic.args = {
  onClick: action("onClick"),
};
