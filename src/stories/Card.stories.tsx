import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Card from "../components/Card";

export default {
    title: "Card",
    component: Card,
} as Meta;

const Template: Story = () => {
    return (
        <>
            <div style={{ backgroundColor: "lightgray", padding: "32px" }}>
                <Card title="Select or add a case">
                    <p>To select or add a case please complete the information below.</p>
                </Card>
            </div>
            <div style={{ backgroundColor: "lightgray", padding: "32px" }}>
                <Card title="Select or add a case" bordered>
                    <p>To select or add a case please complete the information below.</p>
                </Card>
            </div>
        </>
    );
};

export const StyledCard = Template.bind({});
