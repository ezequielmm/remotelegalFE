// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { TimePickerProps } from "prp-components-library/src/components/GenerateDatePicker/interfaces/interfaces";
import TimePicker from "prp-components-library/src/components/TimePicker";
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
