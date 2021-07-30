import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Confirm from "prp-components-library/src/components/Confirm";
import * as CONSTANTS from "../constants/otherParticipants";

export default {
    title: "Confirm",
    component: Confirm,
    argTypes: {
        visible: {
            control: {
                type: "boolean",
            },
        },
    },
} as Meta;

const Template: Story = (args) => (
    <Confirm
        title={CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_TITLE}
        subTitle={CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_SUBTITLE}
        positiveLabel={CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_LABEL}
        negativeLabel={CONSTANTS.OTHER_PARTICIPANTS_MODAL_CLOSE_LABEL}
        {...args}
    />
);
export const AntConfirm = Template.bind({});
AntConfirm.args = {
    visible: true,
};
