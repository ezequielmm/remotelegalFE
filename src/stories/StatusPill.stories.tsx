import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import StatusPill from "../components/StatusPill";
import { ThemeMode } from "../types/ThemeType";
import { theme } from "../constants/styles/theme";

const darkTheme = { ...theme, mode: ThemeMode.inDepo };
const lightTheme = { ...theme, mode: ThemeMode.default };

export default {
    title: "Status Pill",
    component: StatusPill,
    argTypes: {
        status: {
            control: {
                type: "select",
                options: ["Completed", "Pending", "Canceled", "Confirmed"],
            },
        },
        theme: {
            control: {
                type: "select",
                options: ["Dark", "Light"],
            },
        },
    },
} as Meta;

const Template: Story = ({ ...args }) => {
    const selectedTheme = args.theme === "Dark" ? darkTheme : lightTheme;
    return <StatusPill {...args} status={args.status} theme={selectedTheme} />;
};

export const PRStatusPill = Template.bind({});
PRStatusPill.args = {
    status: "Completed",
};
