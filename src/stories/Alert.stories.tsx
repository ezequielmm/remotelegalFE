import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Alert } from "antd";

export default {
    title: "Alert (Message)",
    component: Alert,
    argTypes: {
        type: {
            control: {
                type: "select",
                options: ["success", "warning", "error", "info"],
            },
        },
    },
} as Meta;

const Template: Story = (args) => <Alert message="Alert text" showIcon {...args} />;

export const AntAlert = Template.bind({});
AntAlert.args = {
    type: "success",
};
