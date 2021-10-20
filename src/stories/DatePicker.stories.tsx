import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import DatePicker from "@rl/prp-components-library/src/components/DatePicker";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import {
    DatePickerProps,
    RangePickerProps,
} from "@rl/prp-components-library/src/components/GenerateDatePicker/interfaces/interfaces";
import { ContainerSmall } from "./Decorators";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);

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

const Template: Story = (args: DatePickerProps) => {
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
        return date.isBefore(dayjs().subtract(1, "year"));
    },
    ranges: {
        Today: [dayjs(), dayjs()],
        "This Week": [dayjs().startOf("week"), dayjs().endOf("week")],
        "This Month": [dayjs().startOf("month"), dayjs().endOf("month")],
    },
};
