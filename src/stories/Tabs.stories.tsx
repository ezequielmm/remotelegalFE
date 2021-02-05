import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";

import Tabs from "../components/Tabs";

export default {
    title: "Tabs",
    component: Tabs,
} as Meta;

const Template: Story = ({ ...args }) => {
    return (
        <Tabs {...args}>
            <Tabs.TabPane tab="SUMMARY" key="1">
                Content of Tab Pane 1
            </Tabs.TabPane>
            <Tabs.TabPane tab="TRANSCRIPT" key="2">
                Content of Tab Pane 2
            </Tabs.TabPane>
            <Tabs.TabPane tab="LOREM" key="3">
                Content of Tab Pane 3
            </Tabs.TabPane>
        </Tabs>
    );
};

export const PRTabs = Template.bind({});
