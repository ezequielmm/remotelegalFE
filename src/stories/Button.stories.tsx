import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import Button from "../components/Button";

export default {
    title: "Button",
    component: Button,
    argTypes: {
        type: {
            control: {
                type: "select",
                options: ["default", "primary", "secondary", "ghost", "dashed", "link", "text"],
            },
        },
        disabled: { control: "boolean" },
        children: { control: "text" },
    },
} as Meta;

const Template: Story = (args) => <Button {...args}>{args.children}</Button>;

export const PRButton = Template.bind({});
PRButton.args = {
    type: "primary",
    disabled: false,
    children: "Button",
};
