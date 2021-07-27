import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import TestVolume from "../components/TestVolume";

export default {
    title: "Test Volume",
    component: TestVolume,
    argTypes: {
        stream: {
            control: {
                type: "MediaStream",
            },
        },
    },
} as Meta;

const Template: Story = ({ ...args }) => <TestVolume stream={args.stream} {...args} />;

export const PRTestVolume = Template.bind({});
PRTestVolume.args = {
    stream: null,
};
