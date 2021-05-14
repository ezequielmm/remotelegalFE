import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { UserOutlined } from "@ant-design/icons";
import Alert from "../components/Alert";
import { IAlertProps } from "../components/Alert/Alert";
import Button from "../components/Button";
import useFloatingAlertContext from "../hooks/useFloatingAlertContext";

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

const FloatAlertTemplate: Story = (args: IAlertProps) => {
    const addFloatingAlert = useFloatingAlertContext();
    const newAlert = () => {
        addFloatingAlert(args);
    };
    return <Button onClick={newAlert}>New Alert</Button>;
};

export const AntAlert = Template.bind({});
AntAlert.args = {
    message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in mauris imperdiet, posuere mauris sit amet, posuere est. Etiam nec sapien varius nunc scelerisque cursus ac id neque.",
    type: "success",
};

export const AntAlertIcon = Template.bind({});
AntAlertIcon.args = {
    message: "Anne  Stewart joined the breakroom",
    type: "info",
    icon: <UserOutlined />,
};

export const FloatAlert = FloatAlertTemplate.bind({});
FloatAlert.args = {
    message: "This is a floating Alert",
    type: "success",
    icon: <UserOutlined />,
    closable: true,
};
