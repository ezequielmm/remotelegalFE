// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Select from "@rl/prp-components-library/src/components/Select";
import { ISelectProps } from "@rl/prp-components-library/src/components/Select/Select";
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
        <Select.Option value="1">Anderson v. Geller | #000454</Select.Option>
        <Select.Option value="2">Gideon v. Wainwright | #000455</Select.Option>
        <Select.Option value="3">Korematsu v. United States | #000456</Select.Option>
    </Select>
);

export const PRSelect = Template.bind({});
PRSelect.args = {
    placeholder: "Select an option",
    invalid: false,
    allowClear: false,
    disabled: false,
};
