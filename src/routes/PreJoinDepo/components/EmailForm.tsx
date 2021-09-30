import { Form } from "antd";
import { useState } from "react";
import Button from "prp-components-library/src/components/Button";
import Input from "prp-components-library/src/components/Input";
import Text from "prp-components-library/src/components/Text";
import { InputWrapper } from "prp-components-library/src/components/Input/styles";
import Wizard from "prp-components-library/src/components/Wizard";
import isInvalidEmail from "../../../helpers/isInvalidEmail";
import ColorStatus from "../../../types/ColorStatus";
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
        <Form layout="vertical">
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
                        autoFocus
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
                    {CONSTANTS.STEP_1_BUTTON_TEXT}
                </Button>
            </Wizard.Actions>
        </Form>
    );
};

export default EmailForm;
