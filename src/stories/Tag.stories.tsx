import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";
import Tag from "../components/Tag";
import { theme } from "../constants/styles/theme";

const inDepoTheme = { ...theme, mode: "inDepo" };
const defaultTheme = { ...theme, mode: "default" };

export default {
    title: "Tag",
    component: Tag,
    argTypes: {
        text: {
            control: {
                type: "text",
            },
        },
        pill: {
            control: {
                type: "boolean",
            },
        },
        color: {
            control: {
                type: "text",
            },
        },
    },
} as Meta;

const Template: Story = ({ text, ...args }) => <Tag {...args}>{text}</Tag>;

export const PRTag = Template.bind({});
PRTag.args = {
    text: "Tag Text",
    pill: false,
    theme: defaultTheme,
};

export const PRTagInDepo = Template.bind({});
PRTagInDepo.args = {
    text: "Tag Text",
    pill: false,
    theme: inDepoTheme,
};

PRTagInDepo.parameters = {
    backgrounds: { default: "inDepo" },
};
