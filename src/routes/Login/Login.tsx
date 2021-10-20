import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Col, Row, Form } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Alert from "@rl/prp-components-library/src/components/Alert";
import Input from "@rl/prp-components-library/src/components/Input";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import { InputWrapper } from "@rl/prp-components-library/src/components/Input/styles";
import Container from "../../components/Container";
import * as CONSTANTS from "../../constants/login";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import { useSignIn, useVerifyToken } from "../../hooks/auth";
import ColorStatus from "../../types/ColorStatus";

interface LoginProps {
    location?: {
        state: any;
    };
}

const Login = ({ location }: LoginProps) => {
    const [emailInput, setEmailInput] = useState({ value: "", pristine: false });

    const [passwordInput, setPasswordInput] = useState({ value: "", pristine: false });

    const { onSubmit, loading, submitError } = useSignIn(location, emailInput.value, passwordInput.value);

    const { isAuthenticated, verificationHash, data, error } = useVerifyToken();

    const emailErrorMessage =
        (emailInput.pristine && !emailInput.value.length && CONSTANTS.EMPTY_EMAIL_ERROR) ||
        (emailInput.pristine && isInvalidEMail(emailInput.value) && CONSTANTS.INVALID_EMAIL_ERROR);

    const passwordErrorMessage =
        !passwordInput.value.length && passwordInput.pristine && CONSTANTS.EMPTY_PASSWORD_ERROR;

    const handleSubmit = () => {
        setPasswordInput({ ...passwordInput, pristine: true });
        setEmailInput({ ...emailInput, pristine: true });
        if (!isInvalidEMail(emailInput.value) && passwordInput.value) {
            return onSubmit();
        }
        return null;
    };

    return isAuthenticated && !verificationHash ? (
        <Redirect to="/depositions" />
    ) : (
        <Container>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} lg={14} xxl={12}>
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Space direction="vertical" size="large" fullWidth>
                            <Space.Item fullWidth>
                                <Title dataTestId="welcome_title" level={3} weight="light" noMargin>
                                    Welcome
                                </Title>
                                <Text dataTestId="log_in_message" size="large">
                                    Log in into your account
                                </Text>
                            </Space.Item>
                            {data?.success && (
                                <Alert
                                    data-testid="successful_verification_message"
                                    message={CONSTANTS.EMAIL_VERIFIED}
                                    type="success"
                                />
                            )}
                            {location?.state?.changedPassword && (
                                <Alert
                                    data-testid="successful_password_message"
                                    message={CONSTANTS.PASSWORD_CHANGED}
                                    type="success"
                                />
                            )}
                            {(error && error !== 409) ||
                                (typeof location?.state === "object" && location.state.changedPassword === false && (
                                    <Alert
                                        data-testid={
                                            error ? CONSTANTS.NETWORK_ERROR : CONSTANTS.PASSWORD_CHANGE_INVALID_HASH
                                        }
                                        message={
                                            error ? CONSTANTS.NETWORK_ERROR : CONSTANTS.PASSWORD_CHANGE_INVALID_HASH
                                        }
                                        type="error"
                                    />
                                ))}
                            {data?.success === false && (
                                <Alert
                                    data-testid={CONSTANTS.INVALID_CODE_ERROR}
                                    message={CONSTANTS.INVALID_CODE_ERROR}
                                    type="error"
                                />
                            )}
                            {submitError && <Alert data-testid={submitError} message={submitError} type="error" />}
                            <Space.Item fullWidth>
                                <Form.Item label="Email" htmlFor="email">
                                    <InputWrapper>
                                        <Input
                                            onChange={(e) => {
                                                setEmailInput({ value: e.target.value, pristine: false });
                                            }}
                                            invalid={emailErrorMessage.length > 0}
                                            value={emailInput.value}
                                            placeholder="Enter your email"
                                            name="email"
                                        />
                                        {emailErrorMessage && (
                                            <Text size="small" dataTestId={emailErrorMessage} state={ColorStatus.error}>
                                                {emailErrorMessage}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <>
                                            <Text size="small" uppercase>
                                                Password
                                            </Text>
                                            <Link
                                                tabIndex={-1}
                                                to="/password-recovery"
                                                style={{ textTransform: "initial" }}
                                            >
                                                <Button tabIndex={1} type="link">
                                                    Forgot password?
                                                </Button>
                                            </Link>
                                        </>
                                    }
                                    htmlFor="password"
                                >
                                    <InputWrapper>
                                        <Input
                                            onChange={(e) => {
                                                setPasswordInput({ value: e.target.value, pristine: false });
                                            }}
                                            invalid={passwordErrorMessage.length > 0}
                                            name="password"
                                            value={passwordInput.value}
                                            placeholder="Enter your password"
                                            type="password"
                                        />
                                        {passwordErrorMessage && (
                                            <Text
                                                size="small"
                                                dataTestId={passwordErrorMessage}
                                                state={ColorStatus.error}
                                            >
                                                {passwordErrorMessage}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                                <Button disabled={loading} type="primary" block htmlType="submit">
                                    Log In
                                </Button>
                            </Space.Item>
                            <Space align="center" fullWidth>
                                <Text>New user? </Text>
                                <Link tabIndex={-1} to="/sign-up">
                                    <Button tabIndex={1} type="link">
                                        Create an account
                                    </Button>
                                </Link>
                            </Space>
                        </Space>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
