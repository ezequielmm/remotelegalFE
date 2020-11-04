import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, useHistory, Link } from "react-router-dom";
import { Col, Row, Form, Space, Alert } from "antd";
import useInput from "../../hooks/useInput";
import { InputWrapper } from "../../components/Input/styles";
import Container from "../../components/container/container";
import Button from "../../components/Button";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import * as ERRORS from "./constants/errors";
import useAuthentication from "../../hooks/useAuthentication";
import isInputEmpty from "../../helpers/isInputEmpty";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import buildRequestOptions from "../../helpers/buildRequestOptions";
import useFetch from "../../hooks/useFetch";

interface LoginProps {
    location?: {
        state: string;
    };
}

const Login = ({ location }: LoginProps) => {
    const queryParams = window.location.search;
    const verificationHash = new URLSearchParams(queryParams).get("verificationHash");

    const requestObj = buildRequestOptions("POST", {
        verificationHash,
    });

    const { error, data, fetchAPI } = useFetch(`${process.env.REACT_APP_BASE_BE_URL}/api/Users/verifyUser`, requestObj);

    const params = location?.state;
    const history = useHistory();
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuthentication();
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(
        "email",
        "Enter your email",
        undefined,
        isInvalidEMail
    );

    const { inputValue: passwordValue, input: passwordInput, invalid: passwordInvalid } = useInput(
        "password",
        "Enter your password",
        "password",
        isInputEmpty
    );
    const onSubmit = async () => {
        if (submitError) {
            setSubmitError("");
        }
        setLoading(true);
        try {
            await Auth.signIn(emailValue.trim(), passwordValue);
            return history.push(params || "/dashboard");
        } catch (e) {
            setLoading(false);
            return setSubmitError(ERRORS.AWS_ERRORS[e.message] || ERRORS.NETWORK_ERROR);
        }
    };
    const emailErrorMessage =
        (emailInvalid && !emailValue.length && ERRORS.EMPTY_EMAIL_ERROR) ||
        (emailInvalid && ERRORS.INVALID_EMAIL_ERROR);

    const passwordErrorMessage = passwordInvalid && ERRORS.EMPTY_PASSWORD_ERROR;

    const disabledButton = isInvalidEMail(emailValue) || loading || isInputEmpty(passwordValue);

    React.useEffect(() => {
        const handleVerifyToken = async () => {
            if (verificationHash && isAuthenticated) {
                await Auth.signOut();
                return fetchAPI();
            }
            if (verificationHash && isAuthenticated === false) {
                fetchAPI();
            }
            return null;
        };
        handleVerifyToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verificationHash, isAuthenticated]);

    return isAuthenticated && !verificationHash ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} lg={14} xxl={12}>
                    <Form onFinish={onSubmit} layout="vertical">
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <div>
                                <Title level={3} weight="light" noMargin>
                                    Welcome
                                </Title>
                                <Text size="large">Log in into your account</Text>
                            </div>
                            {data && (
                                <Alert message="Your email has been verified successfully" type="success" showIcon />
                            )}
                            {error && error !== 409 && <Alert message={ERRORS.NETWORK_ERROR} type="error" showIcon />}
                            {error === 409 && <Alert message={ERRORS.INVALID_CODE_ERROR} type="error" showIcon />}
                            {submitError && <Alert message={submitError} type="error" showIcon />}
                            <div>
                                <Form.Item label="Email" htmlFor="email">
                                    <InputWrapper>
                                        {emailInput}
                                        {emailErrorMessage && (
                                            <Text size="small" state="error">
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
                                        {passwordInput}
                                        {passwordErrorMessage && (
                                            <Text size="small" state="error">
                                                {passwordErrorMessage}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                                <Button type="primary" block disabled={disabledButton} htmlType="submit">
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
