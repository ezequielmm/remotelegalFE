import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { Menu } from "antd";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { ContainerCentered } from "./Decorators";

const menu = {
    component: Menu,
    props: {
        children: (
            <>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://picsum.photos/900/900">
                        1st menu item
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://picsum.photos/900/900">
                        2nd menu item
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://picsum.photos/900/900">
                        3rd menu item
                    </a>
                </Menu.Item>
            </>
        ),
    },
};

export default {
    title: "Dropdown",
    component: Dropdown,
    argTypes: {
        placement: {
            control: {
                type: "select",
                options: ["bottomLeft", "bottomCenter", "bottomRight", "topLeft", "topCenter", "topRight"],
            },
        },
        trigger: {
            control: {
                type: "select",
                options: [["click"], ["hover"]],
            },
        },
        disabled: { control: "boolean" },
        visible: { control: "boolean" },
    },
    decorators: [
        (Template) => (
            <ContainerCentered>
                <Template />
            </ContainerCentered>
        ),
    ],
} as Meta;

const Template: Story = (args) => {
    return (
        <Dropdown overlay={menu} {...args}>
            <Button type="link">Hover me</Button>
        </Dropdown>
    );
};

export const PRDropdown = Template.bind({});
PRDropdown.argTypes = {
    placement: "bottomLeft",
};
