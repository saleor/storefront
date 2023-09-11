import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CheckoutHeaderBar } from "./CheckoutHeaderBar";

export default {
  title: "Components/CheckoutHeaderBar",
  component: CheckoutHeaderBar,
} as ComponentMeta<typeof CheckoutHeaderBar>;

const Template: ComponentStory<typeof CheckoutHeaderBar> = (args) => (
  <CheckoutHeaderBar {...args} />
);

export const Base = Template.bind({});
