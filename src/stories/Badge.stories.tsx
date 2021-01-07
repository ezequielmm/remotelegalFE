import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import Badge from "../components/Badge";
import { ContainerSmall } from "./Decorators";

export default {
    title: "Badge",
    component: Badge,
    argTypes: {
        size: {
            control: {
                type: "select",
                options: ["small", "default", "large"],
            },
        },
        count: { control: "number" },
    },
    decorators: [
        (Template) => (
            <ContainerSmall>
                <Template />
            </ContainerSmall>
        ),
    ],
} as Meta;

const Template: Story = (args) => <Badge {...args} />;
export const PRBadge = Template.bind({});
PRBadge.args = {
    size: "default",
    count: 5,
};
