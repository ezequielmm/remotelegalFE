import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import DatePicker from "../components/DatePicker";
import { IDatePickerProps } from "../components/DatePicker/DatePicker";
import { ContainerSmall } from "./Decorators";

export default {
    title: "DatePicker",
    argTypes: {
        placeholder: { control: "text" },
        invalid: { control: "boolean" },
        disabled: { control: "boolean" },
        showToday: { control: "boolean" },
    },
    decorators: [
        (Template) => (
            <ContainerSmall>
                <Template />
            </ContainerSmall>
        ),
    ],
} as Meta;

const Template: Story = (args: IDatePickerProps) => {
    return <DatePicker {...args} />;
};

export const PRDatePicker = Template.bind({});
PRDatePicker.args = {
    placeholder: "MM/YY/DD",
    invalid: false,
    showToday: true,
    disabled: false,
};
