import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import TimePicker from "../components/TimePicker";
import { TimePickerProps } from "../components/GenerateDatePicker/interfaces/interfaces";
import { ContainerSmall } from "./Decorators";

export default {
    title: "TimePicker",
    argTypes: {
        placeholder: { control: "text" },
        invalid: { control: "boolean" },
        disabled: { control: "boolean" },
        showNow: { control: "boolean" },
    },
    decorators: [
        (Template) => (
            <ContainerSmall>
                <Template />
            </ContainerSmall>
        ),
    ],
} as Meta;

const Template: Story = (args: TimePickerProps) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <TimePicker {...args} />;
};

export const PRTimePicker = Template.bind({});
PRTimePicker.args = {
    placeholder: "hh:mm A",
    invalid: false,
    showNow: true,
    disabled: false,
};
