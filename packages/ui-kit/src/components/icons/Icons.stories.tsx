import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Text } from "../Text";
import { DiscountIcon } from "./DiscountIcon";
import * as exportedIcons from ".";

export default {
  title: "Components/Icons",
} as ComponentMeta<any>;

const icons = Object.entries(exportedIcons);

const IconWrapper = (props: JSX.IntrinsicElements["div"]) => (
  <div className="flex items-center	justify-center flex-col p-8 bg-[#ffffff]" {...props} />
);

const Template: ComponentStory<typeof DiscountIcon> = (args) => <DiscountIcon {...args} />;

export const Basic = Template.bind({});

export const Colored = Template.bind({});

Colored.args = {
  color: "magenta",
};

const ListTemplate = () => (
  <div className="grid grid-cols-4 gap-4 p-4 bg-button-tertiary">
    {icons.map(([key, icon]) => {
      const Icon = icon;

      return (
        <IconWrapper key={key}>
          <div className="mb-4">
            <Icon />
          </div>
          <Text size="sm" weight="semibold">
            {`<${key} />`}
          </Text>
        </IconWrapper>
      );
    })}
  </div>
);

export const ListOfIcons = ListTemplate.bind({});
