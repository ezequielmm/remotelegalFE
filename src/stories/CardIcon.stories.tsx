import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import CardIcon from "prp-components-library/src/components/CardIcon";
import { ICardIconProps } from "prp-components-library/src/components/CardIcon/CardIcon";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import { ReactComponent as CasesIcon } from "../assets/layout/Cases.svg";
import ColorStatus from "../types/ColorStatus";

import { ContainerSmall } from "./Decorators";

export default {
    title: "CardIcon",
    component: CardIcon,
    argTypes: {
        icon: {
            control: null,
        },
        onClick: {
            control: null,
        },
        to: {
            control: null,
        },
        hasShaddow: {
            control: "boolean",
        },
        bg: {
            control: {
                type: "select",
                options: ColorStatus,
            },
        },
        hasBorder: {
            control: "boolean",
        },
        fullWidth: {
            control: "boolean",
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

const Template: Story = (args: ICardIconProps) => {
    return (
        <CardIcon {...args}>
            <Text state={ColorStatus.disabled} uppercase>
                My cases
            </Text>
            <Title level={5} noMargin>
                7
            </Title>
        </CardIcon>
    );
};

export const CardIconBase = Template.bind({});
CardIconBase.args = {
    icon: CasesIcon,
};

export const CardIconWithAction = Template.bind({});
CardIconWithAction.args = {
    // eslint-disable-next-line no-alert
    onClick: () => alert("You clicked me!"),
    icon: CasesIcon,
};
