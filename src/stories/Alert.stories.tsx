import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { UserOutlined } from "@ant-design/icons";
import Alert from "../components/Alert";
import { IAlertProps } from "../components/Alert/Alert";

export default {
    title: "Alert (Message)",
    component: Alert,
    argTypes: {
        message: {
            control: "text",
        },
        description: {
            control: "text",
        },
        type: {
            control: {
                type: "select",
                options: ["success", "warning", "error", "info"],
            },
        },
        float: {
            control: { type: "boolean" },
        },
        icon: {
            table: {
                disable: true,
            },
        },
    },
} as Meta;

const Template: Story = (args: IAlertProps) => <Alert closable {...args} />;

export const AntAlert = Template.bind({});
AntAlert.args = {
    message: "Alert text",
    type: "success",
};

export const AntAlertIcon = Template.bind({});
AntAlertIcon.args = {
    message: "Anne  Stewart joined the breakroom",
    type: "info",
    icon: <UserOutlined />,
};
