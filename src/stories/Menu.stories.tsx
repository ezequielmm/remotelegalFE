import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Menu from "prp-components-library/src/components/Menu";
import { ContainerCentered } from "./Decorators";

export default {
    title: "Menu",
    component: Menu,
    decorators: [
        (Template) => (
            <ContainerCentered>
                <Template />
            </ContainerCentered>
        ),
    ],
} as Meta;

const Template: Story = () => {
    return (
        <Menu>
            <Menu.Item>1st menu item</Menu.Item>
            <Menu.Divider />
            <Menu.Item>2nd menu item</Menu.Item>
            <Menu.Divider />
            <Menu.Item>3rd menu item</Menu.Item>
        </Menu>
    );
};

export const PRMenu = Template.bind({});
