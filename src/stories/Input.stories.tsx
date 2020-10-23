import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { UserOutlined } from "@ant-design/icons";
import { ContainerSmall } from "./Decorators";

import Input from "../components/Input";
import Text from "../components/Typography/Text";
import Label from "../components/Label";
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

export const PRInputValidation: Story = (args) => {
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(
        "email",
        args.placeholder,
        undefined,
        isInvalidEMail,
        args.disabled
    );

    return (
        <InputWrapper>
            <Label htmlFor="email">Email</Label>
            {emailInput}
            {emailInvalid && !emailValue.length && (
                <Text size="small" state="error">
                    {args.errorMessage}
                </Text>
            )}
        </InputWrapper>
    );
};
PRInputValidation.argTypes = {
    errorMessage: { control: "text" },
    invalid: { control: "disabled" },
};
PRInputValidation.args = {
    ...PRInput.args,
    errorMessage: "Complete this field, please",
};
