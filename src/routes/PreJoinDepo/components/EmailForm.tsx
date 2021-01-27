import { Button, Form } from "antd";
import React, { useState } from "react";
import { InputWrapper } from "../../../components/Input/styles";
import isInvalidEmail from "../../../helpers/isInvalidEmail";
import Input from "../../../components/Input";
import ColorStatus from "../../../types/ColorStatus";
import Text from "../../../components/Typography/Text";
import Wizard from "../../../components/Wizard";
import * as CONSTANTS from "../../../constants/preJoinDepo";

interface IEmailForm {
    loading: boolean;
    onSubmit: (email: string) => void;
    defaultEmailValue?: string;
}

const EmailForm = ({ loading, onSubmit, defaultEmailValue }: IEmailForm) => {
    const [invalid, setInvalid] = useState(false);
    const [emailValue, setEmailValue] = useState("" || defaultEmailValue);
    const invalidEmailErrorMessage = !emailValue.length
        ? CONSTANTS.EMPTY_EMAIL_MESSAGE
        : CONSTANTS.INVALID_EMAIL_MESSAGE;

    const handleSubmit = () => {
        const isEmailInvalid = isInvalidEmail(emailValue);
        if (isEmailInvalid) {
            return setInvalid(true);
        }
        return onSubmit(emailValue);
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Email" htmlFor="email">
                <InputWrapper>
                    <Input
                        onChange={(e) => {
                            if (invalid) {
                                setInvalid(false);
                            }
                            setEmailValue(e.target.value);
                        }}
                        invalid={invalid}
                        value={emailValue}
                        name="email"
                        placeholder={CONSTANTS.EMAIL_PLACEHOLDER}
                        data-testid={CONSTANTS.EMAIL_INPUT_ID}
                    />
                </InputWrapper>
                {invalid && (
                    <Text size="small" state={ColorStatus.error}>
                        {invalidEmailErrorMessage}
                    </Text>
                )}
            </Form.Item>
            <Wizard.Actions>
                <Button
                    loading={loading}
                    data-testid={CONSTANTS.STEP_1_BUTTON_ID}
                    onClick={handleSubmit}
                    disabled={loading}
                    type="primary"
                    htmlType="submit"
                >
                    Next
                </Button>
            </Wizard.Actions>
        </Form>
    );
};

export default EmailForm;
