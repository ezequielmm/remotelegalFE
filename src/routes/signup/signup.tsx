import React, { useState } from "react";
import { Checkbox, Col, Form, Row, Space, Alert } from "antd";
import { Redirect, Link } from "react-router-dom";
import useInput from "../../hooks/useInput";
import useFetch from "../../hooks/useFetch";
import Container from "../../components/container/container";
import Button from "../../components/Button";
import * as ERRORS from "./constants/errors";
import useAuthentication from "../../hooks/useAuthentication";
import isInputEmpty from "../../helpers/isInputEmpty";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import isPasswordInvalid from "../../helpers/isPasswordInvalid";
import isPhoneInvalid from "../../helpers/isPhoneInvalid";
import buildRequestOptions from "../../helpers/buildRequestOptions";
import CodeSent from "./components/code-sent";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import { InputWrapper } from "../../components/Input/styles";

const SignUp = () => {
    const { isAuthenticated } = useAuthentication();
    const [checked, setChecked] = useState(false);
    const { inputValue: nameValue, input: nameInput, invalid: nameInvalid } = useInput(
        "firstname",
        "Enter your name",
        undefined,
        isInputEmpty,
        undefined,
        50
    );
    const { inputValue: lastNameValue, input: lastNameInput, invalid: lastNameInvalid } = useInput(
        "lastname",
        "Enter last name",
        undefined,
        isInputEmpty,
        undefined,
        50
    );
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(
        "email",
        "Enter your email",
        undefined,
        isInvalidEMail
    );
    const { input: phoneInput, invalid: phoneInvalid, inputValue: phoneValue } = useInput(
        "phone",
        "Enter your mobile phone number",
        "tel",
        isPhoneInvalid
    );

    const { inputValue: passwordValue, input: passwordInput, invalid: passwordInvalid } = useInput(
        "password",
        "Enter your password",
        "password",
        isPasswordInvalid
    );

    const {
        inputValue: confirmPasswordValue,
        input: confirmPasswordInput,
        invalid: confirmPasswordInvalid,
        setInvalid: setConfirmPasswordInvalid,
        touched: confirmPasswordTouched,
    } = useInput("confirm-password", "confirm your password", "password", (value: string) => value !== passwordValue);

    React.useEffect(() => {
        const passwordsMatch = passwordValue === confirmPasswordValue;
        if (confirmPasswordTouched && passwordsMatch) {
            setConfirmPasswordInvalid(false);
        } else if (confirmPasswordTouched && !passwordsMatch) {
            setConfirmPasswordInvalid(true);
        }
    }, [confirmPasswordTouched, passwordValue, confirmPasswordValue, setConfirmPasswordInvalid]);

    const requestObj = buildRequestOptions("POST", {
        firstName: nameValue,
        lastName: lastNameValue,
        phoneNumber: phoneValue,
        password: passwordValue,
        emailAddress: emailValue,
    });

    const { error, data, loading, fetchAPI } = useFetch(`${process.env.REACT_APP_BASE_BE_URL}/api/Users`, requestObj);

    const emailErrorMessage =
        emailInvalid && !emailValue.length ? ERRORS.EMPTY_EMAIL_ERROR : emailInvalid && ERRORS.INVALID_EMAIL_ERROR;
    const passwordErrorMessage = passwordInvalid && ERRORS.PASSWORD_ERROR;
    const nameErrorMessage = nameInvalid && ERRORS.FIRST_NAME_ERROR;
    const lastNameErrorMessage = lastNameInvalid && ERRORS.LAST_NAME_ERROR;
    const phoneErrorMessage = phoneInvalid && ERRORS.PHONE_ERROR;
    const confirmPasswordErrorMessage = confirmPasswordInvalid && ERRORS.CONFIRM_PASSWORD_ERROR;
    const networkError = error && error !== 409 && ERRORS.NETWORK_ERROR;
    const SignUpErrorMessage = error === 409 && ERRORS.WAITING_FOR_CODE;

    const disabledButton =
        loading ||
        isInvalidEMail(emailValue) ||
        isPasswordInvalid(passwordValue) ||
        isInputEmpty(nameValue) ||
        isInputEmpty(lastNameValue) ||
        isPhoneInvalid(phoneValue) ||
        confirmPasswordValue !== passwordValue ||
        !checked;

    return isAuthenticated ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} lg={14} xxl={12}>
                    <Form layout="vertical">
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            {data ? (
                                <CodeSent email={emailValue} />
                            ) : (
                                <>
                                    <div>
                                        <Title level={3} weight="light" noMargin>
                                            Welcome
                                        </Title>
                                        <Text size="large">Create your account</Text>
                                    </div>
                                    {(networkError || SignUpErrorMessage) && (
                                        <Alert message={networkError || SignUpErrorMessage} type="error" showIcon />
                                    )}
                                    <div>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item label="First name" htmlFor="firstname">
                                                    <InputWrapper>
                                                        {nameInput}
                                                        {nameErrorMessage && (
                                                            <Text size="small" state="error">
                                                                {nameErrorMessage}
                                                            </Text>
                                                        )}
                                                    </InputWrapper>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Last name" htmlFor="lastname">
                                                    <InputWrapper>
                                                        {lastNameInput}
                                                        {lastNameErrorMessage && (
                                                            <Text size="small" state="error">
                                                                {lastNameErrorMessage}
                                                            </Text>
                                                        )}
                                                    </InputWrapper>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item label="Email address" htmlFor="email">
                                            <InputWrapper>
                                                {emailInput}
                                                {emailErrorMessage && (
                                                    <Text size="small" state="error">
                                                        {emailErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Mobile phone number (optional)" htmlFor="phone">
                                            <InputWrapper>
                                                {phoneInput}
                                                {phoneErrorMessage && (
                                                    <Text size="small" state="error">
                                                        {phoneErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Password" htmlFor="password">
                                            <InputWrapper>
                                                {passwordInput}
                                                {passwordErrorMessage && (
                                                    <Text size="small" state="error">
                                                        {passwordErrorMessage}
                                                    </Text>
                                                )}
                                                <div>
                                                    <Text size="small" block ellipsis={false} state="disabled">
                                                        8 digits minimum, combining numbers and letters
                                                    </Text>
                                                    <Text size="small" block ellipsis={false} state="disabled">
                                                        At least one uppercase and one lowercase
                                                    </Text>
                                                </div>
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Confirm password" htmlFor="confirm-password">
                                            <InputWrapper>
                                                {confirmPasswordInput}
                                                {confirmPasswordErrorMessage && (
                                                    <Text size="small" state="error">
                                                        {confirmPasswordErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
                                            I agree to Remote Legal Terms of Use
                                        </Checkbox>
                                    </div>
                                    <Button
                                        type="primary"
                                        block
                                        disabled={disabledButton}
                                        onClick={fetchAPI}
                                        htmlType="submit"
                                    >
                                        Create account
                                    </Button>
                                    <Space size="small" style={{ width: "100%" }}>
                                        <Text>Have an account?</Text>
                                        <Link to="/">
                                            <Button type="link">Log in</Button>
                                        </Link>
                                    </Space>
                                </>
                            )}
                        </Space>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUp;
