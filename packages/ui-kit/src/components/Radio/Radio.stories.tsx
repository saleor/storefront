import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Radio } from "./Radio";

export default {
  title: "Components/Radio",
  component: Radio,
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args) => <Radio {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  label: "Selector Label",
};

export const Checked = Template.bind({});

Checked.args = {
  label: "Selector Label",
  checked: true,
};

export const WithoutLabel = Template.bind({});

WithoutLabel.args = {
  checked: true,
};

export const CustomLook = Template.bind({});

CustomLook.args = {
  checked: true,
  label: (
    <>
      <span>DPD express shipping - $23.25</span>
      <br />
      <span className='text-text-secondary'>3-4 business days</span>
    </>
  ),
  classNames: {
    container: "px-[15px] py-[21px] border hover:border-border-active",
    radio: "!border-sky-500",
  },
};
