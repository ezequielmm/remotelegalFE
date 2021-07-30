import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { UserOutlined } from "@ant-design/icons";
import Input from "prp-components-library/src/components/Input";
import Text from "prp-components-library/src/components/Text";
import { InputWrapper } from "prp-components-library/src/components/Input/styles";
import { Form } from "antd";
import { ContainerSmall } from "./Decorators";
import useInput from "../hooks/useInput";
import isInvalidEMail from "../helpers/isInvalidEmail";

import ColorStatus from "../types/ColorStatus";

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

export const PRInputForm: Story = (args) => {
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(isInvalidEMail, args);

    return (
        <Form layout="vertical">
            <Form.Item label="Email" htmlFor="email">
                <InputWrapper>
                    {emailInput}
                    {emailInvalid && !emailValue.length && (
                        <Text size="small" state={ColorStatus.error}>
                            {args.errorMessage}
                        </Text>
                    )}
                </InputWrapper>
            </Form.Item>
        </Form>
    );
};
PRInputForm.argTypes = {
    errorMessage: { control: "text" },
    invalid: { control: "disabled" },
};
PRInputForm.args = {
    ...PRInput.args,
    errorMessage: "Complete this field, please",
};
