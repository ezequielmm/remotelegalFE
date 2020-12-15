import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import RecordPill from "../components/RecordPill";
import { IRecordPillProps } from "../components/RecordPill/RecordPill";

export default {
    title: "Record pill",
    component: RecordPill,
    argTypes: {
        on: {
            control: { control: "boolean" },
        },
    },
} as Meta;

const Template: Story = (args: IRecordPillProps) => <RecordPill {...args} />;

export const RLRecordPill = Template.bind({});
RLRecordPill.args = {
    on: false,
};
