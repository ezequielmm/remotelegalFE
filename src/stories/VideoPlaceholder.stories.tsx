import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";

import VideoPlaceholder from "../components/VideoPlaceholder";
import { ReactComponent as VideoAlertIcon } from "../assets/icons/Video-alert.svg";
import Icon from "../components/Icon";
import { getREM } from "../constants/styles/utils";

export default {
    title: "Video Placeholder",
    component: VideoPlaceholder,
} as Meta;

const Template: Story = ({ ...args }) => {
    return (
        <VideoPlaceholder
            padding={`${getREM(5)} 0`}
            icon={<Icon icon={VideoAlertIcon} />}
            title="The recording will be ready soon"
            subTitle="Once the recording is uploaded, you will see it here."
        />
    );
};

export const PRVideoPlaceholder = Template.bind({});
