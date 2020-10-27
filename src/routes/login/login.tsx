import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, useHistory, Link } from "react-router-dom";
import { Col, Row, Form, Space } from "antd";
import useInput from "../../hooks/useInput";
import { InputWrapper } from "../../components/Input/styles";
import * as Components from "./components/components";
import Container from "../../components/container/container";
import Label from "../../components/Label";
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

    React.useEffect(() => {
        if (verificationHash) {
            fetchAPI();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verificationHash]);

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
    return isAuthenticated ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Components.StyledFormContainer>
                <Row justify="center" align="middle">
                    <Col xs={20} sm={16} lg={14} xxl={12}>
                        <Form onFinish={onSubmit}>
                            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                <div>
                                    <Title level={3} weight="light" noMargin>
                                        Welcome
                                    </Title>
                                    <Text size="large">Log into your account</Text>
                                </div>
                                {data && (
                                    <div
                                        style={{
                                            padding: "1rem",
                                            marginBottom: "1rem",
                                            background: "#D9D8C3",
                                            border: "2px solid #8A9A0E",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        Your email has been verified successfully
                                    </div>
                                )}
                                {error && <p>{ERRORS.NETWORK_ERROR}</p>}
                                <InputWrapper>
                                    <Label htmlFor="email">Email</Label>
                                    {emailInput}
                                    {emailErrorMessage && (
                                        <Text size="small" state="error">
                                            {emailErrorMessage}
                                        </Text>
                                    )}
                                </InputWrapper>
                                <InputWrapper>
                                    <Components.StyledLabelContainer>
                                        <Label htmlFor="password">Password</Label>
                                        {/*  <Link to="/password-recovery">Forgot password?</Link> */}
                                    </Components.StyledLabelContainer>
                                    {passwordInput}
                                    {passwordErrorMessage && (
                                        <Text size="small" state="error">
                                            {passwordErrorMessage}
                                        </Text>
                                    )}
                                </InputWrapper>
                                <Button type="primary" block disabled={disabledButton} htmlType="submit">
                                    Login
                                </Button>
                                {submitError && <Text state="error">{submitError}</Text>}
                                <Space size="small" style={{ width: "100%" }}>
                                    <Text>New user? </Text>
                                    <Link to="/sign-up">
                                        <Button type="link">Create an account</Button>
                                    </Link>
                                </Space>
                            </Space>
                        </Form>
                    </Col>
                </Row>
            </Components.StyledFormContainer>
        </Container>
    );
};

export default Login;
