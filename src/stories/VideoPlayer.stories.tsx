import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";

import VideoPlayer from "../components/VideoPlayer";

export default {
    title: "Video Player",
    component: VideoPlayer,
} as Meta;

const Template: Story = ({ ...args }) => {
    return (
        <VideoPlayer
            width="100%"
            height="auto"
            url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
        />
    );
};

export const PRVideoPlayer = Template.bind({});
