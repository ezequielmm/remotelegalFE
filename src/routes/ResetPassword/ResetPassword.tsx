import { Redirect } from "react-router-dom";
import { Col, Row, Form } from "antd";
import Alert from "@rl/prp-components-library/src/components/Alert";
import Button from "@rl/prp-components-library/src/components/Button";
import { InputWrapper } from "@rl/prp-components-library/src/components/Input/styles";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import Container from "../../components/Container";
import * as CONSTANTS from "../../constants/resetPassword";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import { useAuthentication, useResetPassword } from "../../hooks/auth";
import ColorStatus from "../../types/ColorStatus";
import CodeSent from "../CodeSent/CodeSent";
import useInput from "../../hooks/useInput";

const ResetPassword = () => {
    const {
        inputValue: emailValue,
        input: emailInput,
        invalid: emailInvalid,
    } = useInput(isInvalidEMail, {
        name: "email",
        placeholder: "Enter your email",
    });

    const emailErrorMessage =
        emailInvalid && !emailValue.length
            ? CONSTANTS.EMPTY_EMAIL_ERROR
            : emailInvalid && CONSTANTS.INVALID_EMAIL_ERROR;

    const [onSubmit, loading, submitError, response] = useResetPassword();

    const { isAuthenticated } = useAuthentication();

    const handleSubmit = () => !isInvalidEMail(emailValue) && onSubmit(emailValue);

    return isAuthenticated ? (
        <Redirect to="/depositions" />
    ) : (
        <Container>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} lg={14} xxl={12}>
                    <Form onFinish={handleSubmit} layout="vertical" data-testid="reset_pass_form">
                        <Space direction="vertical" size="large" fullWidth>
                            {response ? (
                                <CodeSent
                                    error={submitError}
                                    loading={loading}
                                    linkFetch={() => onSubmit(emailValue)}
                                    email={emailValue}
                                />
                            ) : (
                                <>
                                    <Space.Item fullWidth>
                                        <Title dataTestId="welcome_title" level={3} weight="light" noMargin>
                                            {CONSTANTS.RESET_PASSWORD_TITLE}
                                        </Title>
                                        <Text dataTestId="log_in_message" size="large">
                                            {CONSTANTS.RESET_PASSWORD_SUBTITLE}
                                        </Text>
                                    </Space.Item>
                                    {submitError !== undefined && (
                                        <Alert
                                            data-testid="reset_password_error"
                                            message={CONSTANTS.NETWORK_ERROR}
                                            type="error"
                                        />
                                    )}
                                    <Space.Item fullWidth>
                                        <Form.Item label="Email" htmlFor="email">
                                            <InputWrapper>
                                                {emailInput}
                                                {emailErrorMessage && (
                                                    <Text
                                                        dataTestId={emailErrorMessage}
                                                        size="small"
                                                        state={ColorStatus.error}
                                                    >
                                                        {emailErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Button
                                            disabled={loading || isInvalidEMail(emailValue)}
                                            type="primary"
                                            block
                                            htmlType="submit"
                                        >
                                            {CONSTANTS.RESET_PASSWORD}
                                        </Button>
                                    </Space.Item>
                                </>
                            )}
                        </Space>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
