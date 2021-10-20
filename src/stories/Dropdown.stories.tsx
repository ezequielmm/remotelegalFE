import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Button from "@rl/prp-components-library/src/components/Button";
import Dropdown from "@rl/prp-components-library/src/components/Dropdown";
import { IDropdownProps } from "@rl/prp-components-library/src/components/Dropdown/Dropdown";
import Menu from "@rl/prp-components-library/src/components/Menu";
import Space from "@rl/prp-components-library/src/components/Space";
import { ContainerCentered } from "./Decorators";

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://picsum.photos/900/900">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://picsum.photos/900/900">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://picsum.photos/900/900">
                3rd menu item
            </a>
        </Menu.Item>
    </Menu>
);

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
        arrow: { control: "boolean" },
        styled: { control: "boolean" },
        trigger: {
            control: {
                type: "select",
                options: [["click"], ["hover"]],
            },
        },
        disabled: { control: "boolean" },
        visible: { control: "boolean" },
        overlay: {
            control: null,
        },
    },
    decorators: [
        (Template) => (
            <ContainerCentered>
                <Template />
            </ContainerCentered>
        ),
    ],
} as Meta;

const Template: Story = (args: IDropdownProps) => {
    return (
        <Dropdown {...args}>
            <Button type="link">Hover me</Button>
        </Dropdown>
    );
};
export const PRDropdown = Template.bind({});
PRDropdown.args = {
    overlay: (
        <Space p={6}>
            <span>Overlay</span>
        </Space>
    ),
};
export const PRDropdownMenu = Template.bind({});
PRDropdownMenu.args = {
    overlay: menu,
    styled: true,
    arrow: true,
};
