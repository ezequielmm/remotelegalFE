import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import TestVolume from "../components/TestVolume";

export default {
    title: "Test Volume",
    component: TestVolume,
    argTypes: {
        percent: {
            control: {
                type: "text",
            },
        },
    },
} as Meta;

const Template: Story = ({ ...args }) => <TestVolume percent={args.percent} {...args} />;

export const PRTestVolume = Template.bind({});
PRTestVolume.args = {
    percent: 30,
};
