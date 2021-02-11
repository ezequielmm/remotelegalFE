import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import StatusPill from "../components/StatusPill";

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
    },
} as Meta;

const Template: Story = ({ ...args }) => {
    return <StatusPill {...args} status={args.status} />;
};

export const PRStatusPill = Template.bind({});
PRStatusPill.args = {
    status: "Completed",
};
