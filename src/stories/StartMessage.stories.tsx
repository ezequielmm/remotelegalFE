import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";

import StartMessage from "../components/StartMessage";
import { ReactComponent as CalendarIcon } from "../assets/icons/calendar.svg";

export default {
    title: "Start Message",
    component: StartMessage,
} as Meta;

const Template: Story = ({ ...args }) => {
    return <StartMessage {...args} />;
};

export const PRStartMessage = Template.bind({});
PRStartMessage.args = {
    icon: CalendarIcon,
    title: "The Deposition is scheduled for Thu, April 1, 2021, 10:00 AM",
    description:
        "Welcome to the Pre-Deposition Lobby. You can upload Exhibits in preparation for the Deposition here. Invited participants will be automatically redirected to the Deposition once the Court Reporter joins. Guests who joined from a shared link will first need to be reviewed by the Court Reporter before entering the Deposition. ",
};
