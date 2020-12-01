import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Select, Option } from "../components/Select";
import { ISelectProps } from "../components/Select/Select";
import { ContainerSmall } from "./Decorators";

export default {
    title: "Select",
    argTypes: {
        placeholder: { control: "text" },
        invalid: { control: "boolean" },
        disabled: { control: "boolean" },
        allowClear: { control: "boolean" },
    },
    decorators: [
        (Template) => (
            <ContainerSmall>
                <Template />
            </ContainerSmall>
        ),
    ],
} as Meta;

const Template: Story = (args: ISelectProps) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Select {...args}>
        <Option value="1">Anderson v. Geller | #000454</Option>
        <Option value="2">Gideon v. Wainwright | #000455</Option>
        <Option value="3">Korematsu v. United States | #000456</Option>
    </Select>
);

export const PRSelect = Template.bind({});
PRSelect.args = {
    placeholder: "Select an option",
    invalid: false,
    allowClear: false,
    disabled: false,
};
