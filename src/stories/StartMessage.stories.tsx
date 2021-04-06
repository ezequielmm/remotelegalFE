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
    description: "The deposition will start when the Court Reporter joins the room.",
};
