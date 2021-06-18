import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";

import TestVideo from "../components/TestVideo/TestVideo";

export default {
    title: "Test Video",
    component: TestVideo,
} as Meta;

const Template: Story = ({ ...args }) => {
    return <TestVideo {...args} />;
};

export const PRTestVideo = Template.bind({});
PRTestVideo.args = {
    isMuted: false,
    isVideoOn: true,
    hasError: true,
    errorTitle: "Camera blocked",
    errorText:
        "We are not able to access to your camera. You can still join the deposition, but no one else will see you until you enable your camera.",
};
