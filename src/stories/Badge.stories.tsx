import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { ThemeProvider } from "styled-components";

import Badge from "../components/Badge";
import { theme } from "../constants/styles/theme";
import { ContainerSmall } from "./Decorators";

const inDepoTheme = { ...theme, mode: "inDepo" };
const defaultTheme = { ...theme, mode: "default" };

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
            <ThemeProvider theme={theme}>
                <ContainerSmall>
                    <Template />
                </ContainerSmall>
            </ThemeProvider>
        ),
    ],
} as Meta;

const Template: Story = (args) => <Badge {...args} />;
export const PRBadge = Template.bind({});
PRBadge.args = {
    size: "default",
    count: 5,
    theme: defaultTheme,
};
export const PRBadgeInDepo = Template.bind({});
PRBadgeInDepo.args = {
    size: "default",
    count: 5,
    theme: inDepoTheme,
};
PRBadgeInDepo.parameters = {
    backgrounds: { default: "inDepo" },
};
