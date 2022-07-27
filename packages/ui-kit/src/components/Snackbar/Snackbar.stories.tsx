import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Snackbar } from "./Snackbar";

export default {
  title: "Components/Snackbar",
  component: Snackbar,
} as ComponentMeta<typeof Snackbar>;

const Template: ComponentStory<typeof Snackbar> = (args) => <Snackbar {...args} />;

export const Success = Template.bind({});

Success.args = {
  content: "Lorem Ipsum dolor sit amet consectetur",
  variant: "success",
};

export const Error = Template.bind({});

Error.args = {
  content: "Lorem Ipsum dolor sit amet consectetur",
  variant: "error",
};
