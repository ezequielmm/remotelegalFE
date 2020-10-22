import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { UserOutlined } from "@ant-design/icons";
import { ContainerSmall } from "./Decorators";

import Input from "../components/Input";
import Text from "../components/Typography/Text";
import useInput from "../hooks/useInput";
import { InputWrapper } from "../components/Input/styles";
import isInvalidEMail from "../helpers/isInvalidEmail";

export default {
    title: "Input",
    component: Input,
    argTypes: {
        placeholder: { control: "text" },
        disabled: { control: "boolean" },
        invalid: { control: "boolean" },
    },
    decorators: [
        (Template) => (
            <ContainerSmall>
                <Template />
            </ContainerSmall>
        ),
    ],
} as Meta;

const Template: Story = (args) => <Input {...args} />;

export const PRInput = Template.bind({});
PRInput.args = {
    placeholder: "Test input",
    disabled: false,
    invalid: false,
};

export const PRInputIcon = Template.bind({});
PRInputIcon.args = {
    ...PRInput.args,
    suffix: <UserOutlined />,
};
PRInputIcon.argTypes = {
    suffix: { control: { disable: true } },
    prefix: { control: { disable: true } },
};

export const PRInputLabel: Story = (args) => {
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(
        "email",
        args.placeholder,
        undefined,
        isInvalidEMail,
        args.disabled
    );

    return (
        <InputWrapper>
            <Text uppercase>Label</Text>
            {emailInput}
            {emailInvalid && !emailValue.length && (
                <Text size="small" state="error">
                    {args.errorMessage}
                </Text>
            )}
        </InputWrapper>
    );
};
PRInputLabel.argTypes = {
    errorMessage: { control: "text" },
    invalid: { control: "disabled" },
};
PRInputLabel.args = {
    ...PRInput.args,
    errorMessage: "Complete this field, please",
};
