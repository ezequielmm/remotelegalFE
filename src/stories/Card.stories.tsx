import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Card from "../components/Card";
import ColorStatus from "../types/ColorStatus";

export default {
    title: "Card",
    component: Card,
    argTypes: {
        bg: {
            control: {
                type: "select",
                options: ColorStatus,
            },
        },
    },
} as Meta;

const Template: Story = (args) => {
    return (
        <Card {...args}>
            <p>To select or add a case please complete the information below.</p>
        </Card>
    );
};

export const StyledCard = Template.bind({});
StyledCard.args = {
    title: "Select or add a case",
};
