import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import Text from "../components/Typography/Text";

export default {
    title: "Text",
    component: Text,
    argTypes: {
        size: {
            control: {
                type: "select",
                options: ["small", "default", "large"],
            },
        },
        weight: {
            control: {
                type: "select",
                options: ["light", "regular", "bold"],
            },
        },
        state: {
            control: {
                type: "select",
                options: ["error", "warning", "success", "info", "primary", "secondary", undefined],
            },
        },
        uppercase: { control: "boolean" },
        ellipsis: { control: "boolean" },
        children: { control: "text" },
    },
} as Meta;

const Template: Story = (args) => <Text {...args}>{args.children}</Text>;

export const PRText = Template.bind({});
PRText.args = {
    size: "default",
    weight: "regular",
    state: undefined,
    uppercase: false,
    ellipsis: true,
    children: "Lato example text",
};
