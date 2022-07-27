import { ComponentStory, ComponentMeta } from "@storybook/react";

import { InfoTip } from "./InfoTip";

export default {
  title: "Components/InfoTip",
  component: InfoTip,
} as ComponentMeta<typeof InfoTip>;

const Template: ComponentStory<typeof InfoTip> = (args) => <InfoTip {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  content: "Lorem Ipsum dolor sit amet consectetur",
};

export const IndicatorOnRight = Template.bind({});

IndicatorOnRight.args = {
  content: "Lorem Ipsum dolor sit amet consectetur",
  alignment: "right",
};
