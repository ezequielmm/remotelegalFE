import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Col, Row, Form, Space } from "antd";
import { InputWrapper } from "../../components/Input/styles";
import Container from "../../components/Container";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import * as ERRORS from "../../constants/login";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import { useSignIn, useVerifyToken } from "../../hooks/auth";
import Input from "../../components/Input";
import ColorStatus from "../../types/ColorStatus";

interface LoginProps {
    location?: {
        state: string;
    };
}

const Login = ({ location }: LoginProps) => {
    const [emailInput, setEmailInput] = useState({ value: "", pristine: false });

    const [passwordInput, setPasswordInput] = useState({ value: "", pristine: false });

    const { onSubmit, loading, submitError } = useSignIn(location, emailInput.value, passwordInput.value);

    const { isAuthenticated, verificationHash, data, error } = useVerifyToken();

    const emailErrorMessage =
        (emailInput.pristine && !emailInput.value.length && ERRORS.EMPTY_EMAIL_ERROR) ||
        (emailInput.pristine && isInvalidEMail(emailInput.value) && ERRORS.INVALID_EMAIL_ERROR);

    const passwordErrorMessage = !passwordInput.value.length && passwordInput.pristine && ERRORS.EMPTY_PASSWORD_ERROR;

    const handleSubmit = () => {
        setPasswordInput({ ...passwordInput, pristine: true });
        setEmailInput({ ...emailInput, pristine: true });
        if (!isInvalidEMail(emailInput.value) && passwordInput.value) {
            return onSubmit();
        }
        return null;
    };

    return isAuthenticated && !verificationHash ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} lg={14} xxl={12}>
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div>
                                <Title level={3} weight="light" noMargin>
                                    Welcome
                                </Title>
                                <Text size="large">Log in into your account</Text>
                            </div>
                            {data && <Alert message="Your email has been verified successfully" type="success" />}
                            {error && error !== 409 && <Alert message={ERRORS.NETWORK_ERROR} type="error" />}
                            {error === 409 && <Alert message={ERRORS.INVALID_CODE_ERROR} type="error" />}
                            {submitError && <Alert message={submitError} type="error" />}
                            <div>
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
                                            <Text size="small" state={ColorStatus.error}>
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
                                            <Text size="small" state={ColorStatus.error}>
                                                {passwordErrorMessage}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                                <Button disabled={loading} type="primary" block htmlType="submit">
                                    Log In
                                </Button>
                            </div>
                            <Space size="small" style={{ width: "100%" }}>
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
