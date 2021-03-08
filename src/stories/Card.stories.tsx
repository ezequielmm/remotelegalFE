import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import CardComponent from "../components/Card";
import ColorStatus from "../types/ColorStatus";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import Title from "../components/Typography/Title";
import Text from "../components/Typography/Text";

export default {
    title: "Card",
    component: CardComponent,
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
        <CardComponent {...args}>
            <Title level={5}>Card Title</Title>
            <Text>To select or add a case please complete the information below.</Text>
        </CardComponent>
    );
};

export const Card = Template.bind({});

export const CardWithAction = Template.bind({});
CardWithAction.args = {
    extra: (
        <Button icon={<Icon icon={EditIcon} />} type="link">
            EDIT
        </Button>
    ),
};
