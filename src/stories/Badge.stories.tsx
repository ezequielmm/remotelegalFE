import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import Badge from "@rl/prp-components-library/src/components/Badge";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ContainerSmall } from "./Decorators";
import ColorStatus from "../types/ColorStatus";
import { ReactComponent as CalendarIcon } from "../assets/icons/calendar.svg";

export default {
    title: "Badge",
    component: Badge,
    argTypes: {
        size: {
            control: {
                type: "select",
                options: ["small", "default"],
            },
        },
        count: { control: "number" },
        rounded: { control: "boolean" },
        dot: { control: "boolean" },
        color: {
            control: {
                type: "select",
                options: ColorStatus,
            },
        },
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
    dot: true,
};

export const PRBadgeCount = Template.bind({});
PRBadgeCount.args = {
    size: "default",
    count: 5,
};

export const PRBadgeWithIcon = Template.bind({});
PRBadgeWithIcon.args = {
    size: "small",
    count: 5,
    rounded: true,
    children: <Icon icon={CalendarIcon} size={9} />,
};
