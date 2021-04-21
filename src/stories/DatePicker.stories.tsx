import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { RangePickerProps } from "antd/lib/date-picker";
import moment from "moment-timezone";
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

export const PRRangePicker: Story = (args: RangePickerProps) => {
    const { RangePicker } = DatePicker;
    return <RangePicker {...args} />;
};

PRRangePicker.args = {
    placeholder: ["MM/YY/DD", "MM/YY/DD"],
    disabledDate: (date) => {
        return date.isBefore(moment().subtract(1, "year"));
    },
    ranges: {
        Today: [moment(), moment()],
        "This Week": [moment().startOf("week"), moment().endOf("week")],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
    },
};
