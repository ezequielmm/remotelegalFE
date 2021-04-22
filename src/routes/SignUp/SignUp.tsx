import React, { useState } from "react";
import { Checkbox, Col, Form, Row } from "antd";
import { Redirect, Link } from "react-router-dom";
import useInput from "../../hooks/useInput";
import Space from "../../components/Space";
import Container from "../../components/Container";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import * as ERRORS from "../../constants/signUp";
import { useAuthentication, useSignUp, useVerifyEmail } from "../../hooks/auth";
import isInputEmpty from "../../helpers/isInputEmpty";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import isPasswordInvalid from "../../helpers/isPasswordInvalid";
import isPhoneInvalid from "../../helpers/isPhoneInvalid";
import CodeSent from "../CodeSent/CodeSent";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import { InputWrapper } from "../../components/Input/styles";
import ColorStatus from "../../types/ColorStatus";
import ENV from "../../constants/env";

const SignUp = ({ location }) => {
    const { isAuthenticated } = useAuthentication();
    const [checked, setChecked] = useState(false);
    const { inputValue: nameValue, input: nameInput, invalid: nameInvalid } = useInput(isInputEmpty, {
        name: "firstname",
        placeholder: "Enter your name",
        maxLength: 50,
    });
    const { inputValue: lastNameValue, input: lastNameInput, invalid: lastNameInvalid } = useInput(isInputEmpty, {
        name: "lastname",
        placeholder: "Enter last name",
        maxLength: 50,
    });
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid, setValue: setEmailValue } = useInput(
        isInvalidEMail,
        {
            name: "email",
            placeholder: "Enter your email",
        }
    );
    const { input: companyNameInput, invalid: companyNameInvalid, inputValue: companyNameValue } = useInput(
        isInputEmpty,
        {
            name: "companyname",
            placeholder: "Enter your company name",
            maxLength: 50,
        }
    );
    const { input: companyAddressInput, invalid: companyAddressInvalid, inputValue: companyAddressValue } = useInput(
        isInputEmpty,
        {
            name: "companyaddress",
            placeholder: "Enter your company address",
            maxLength: 150,
        }
    );
    const { input: phoneInput, invalid: phoneInvalid, inputValue: phoneValue } = useInput(isPhoneInvalid, {
        name: "phone",
        placeholder: "Enter your company phone number",
        type: "tel",
    });

    const { inputValue: passwordValue, input: passwordInput, invalid: passwordInvalid } = useInput(isPasswordInvalid, {
        name: "password",
        placeholder: "Enter your password",
        type: "password",
    });
    const { error: errorVerify, loading: loadingVerify, verifyEmail } = useVerifyEmail(emailValue);

    const {
        inputValue: confirmPasswordValue,
        input: confirmPasswordInput,
        invalid: confirmPasswordInvalid,
        setInvalid: setConfirmPasswordInvalid,
        touched: confirmPasswordTouched,
    } = useInput((value: string) => value !== passwordValue, {
        name: "confirm-password",
        placeholder: "Confirm your password",
        type: "password",
    });

    React.useEffect(() => {
        const passwordsMatch = passwordValue === confirmPasswordValue;
        if (confirmPasswordTouched && passwordsMatch) {
            setConfirmPasswordInvalid(false);
        } else if (confirmPasswordTouched && !passwordsMatch) {
            setConfirmPasswordInvalid(true);
        }
    }, [confirmPasswordTouched, passwordValue, confirmPasswordValue, setConfirmPasswordInvalid]);

    React.useEffect(() => {
        setEmailValue(location?.state?.email || "");
    }, [location, setEmailValue]);

    const { error, data, loading, signUp } = useSignUp({
        firstName: nameValue,
        lastName: lastNameValue,
        phoneNumber: phoneValue,
        password: passwordValue,
        emailAddress: emailValue.trim(),
        companyName: companyNameValue,
        companyAddress: companyAddressValue,
    });

    const emailErrorMessage =
        emailInvalid && !emailValue.length ? ERRORS.EMPTY_EMAIL_ERROR : emailInvalid && ERRORS.INVALID_EMAIL_ERROR;
    const passwordErrorMessage = passwordInvalid && ERRORS.PASSWORD_ERROR;
    const nameErrorMessage = nameInvalid && ERRORS.FIRST_NAME_ERROR;
    const lastNameErrorMessage = lastNameInvalid && ERRORS.LAST_NAME_ERROR;
    const phoneErrorMessage =
        phoneInvalid && !phoneValue.length ? ERRORS.EMPTY_PHONE_ERROR : phoneInvalid && ERRORS.PHONE_ERROR;
    const confirmPasswordErrorMessage = confirmPasswordInvalid && ERRORS.CONFIRM_PASSWORD_ERROR;
    const networkError = error && error !== 409 && ERRORS.NETWORK_ERROR;
    const SignUpErrorMessage = error === 409 && ERRORS.WAITING_FOR_CODE;
    const companyNameErrorMessage = companyNameInvalid && ERRORS.COMPANY_NAME_ERROR;
    const companyAddressErrorMessage = companyAddressInvalid && ERRORS.COMPANY_ADDRESS_ERROR;

    const disabledButton =
        loading ||
        isInvalidEMail(emailValue) ||
        isPasswordInvalid(passwordValue) ||
        isInputEmpty(nameValue) ||
        isInputEmpty(lastNameValue) ||
        isInputEmpty(companyNameValue) ||
        isInputEmpty(companyAddressValue) ||
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
                        <Space direction="vertical" size="large" fullWidth>
                            {data ? (
                                <CodeSent
                                    error={errorVerify}
                                    loading={loadingVerify}
                                    linkFetch={verifyEmail}
                                    email={emailValue}
                                />
                            ) : (
                                <>
                                    <Space.Item fullWidth>
                                        <Title level={3} weight="light" noMargin>
                                            Welcome
                                        </Title>
                                        <Text size="large">Create your account</Text>
                                    </Space.Item>
                                    {(networkError || SignUpErrorMessage) && (
                                        <Alert
                                            data-testid={networkError || SignUpErrorMessage}
                                            message={networkError || SignUpErrorMessage}
                                            type="error"
                                        />
                                    )}
                                    <Space.Item fullWidth>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item label="First name" htmlFor="firstname">
                                                    <InputWrapper>
                                                        {nameInput}
                                                        {nameErrorMessage && (
                                                            <Text
                                                                dataTestId={nameErrorMessage}
                                                                size="small"
                                                                state={ColorStatus.error}
                                                            >
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
                                                            <Text
                                                                dataTestId={lastNameErrorMessage}
                                                                size="small"
                                                                state={ColorStatus.error}
                                                            >
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
                                        <Form.Item label="Company name" htmlFor="companyname">
                                            <InputWrapper>
                                                {companyNameInput}
                                                {companyNameErrorMessage && (
                                                    <Text
                                                        dataTestId={companyNameErrorMessage}
                                                        size="small"
                                                        state={ColorStatus.error}
                                                    >
                                                        {companyNameErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Company address" htmlFor="companyaddress">
                                            <InputWrapper>
                                                {companyAddressInput}
                                                {companyAddressErrorMessage && (
                                                    <Text
                                                        dataTestId={companyAddressErrorMessage}
                                                        size="small"
                                                        state={ColorStatus.error}
                                                    >
                                                        {companyAddressErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Company phone number" htmlFor="phone">
                                            <InputWrapper>
                                                {phoneInput}
                                                {phoneErrorMessage && (
                                                    <Text
                                                        dataTestId={phoneErrorMessage}
                                                        size="small"
                                                        state={ColorStatus.error}
                                                    >
                                                        {phoneErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Password" htmlFor="password">
                                            <InputWrapper>
                                                {passwordInput}
                                                {passwordErrorMessage && (
                                                    <Text
                                                        dataTestId={passwordErrorMessage}
                                                        size="small"
                                                        state={ColorStatus.error}
                                                    >
                                                        {passwordErrorMessage}
                                                    </Text>
                                                )}
                                                <div>
                                                    <Text
                                                        size="small"
                                                        block
                                                        ellipsis={false}
                                                        state={ColorStatus.disabled}
                                                    >
                                                        8 digits minimum, combining numbers and letters
                                                    </Text>
                                                    <Text
                                                        size="small"
                                                        block
                                                        ellipsis={false}
                                                        state={ColorStatus.disabled}
                                                    >
                                                        At least one uppercase and one lowercase
                                                    </Text>
                                                </div>
                                            </InputWrapper>
                                        </Form.Item>
                                        <Form.Item label="Confirm password" htmlFor="confirm-password">
                                            <InputWrapper>
                                                {confirmPasswordInput}
                                                {confirmPasswordErrorMessage && (
                                                    <Text
                                                        dataTestId={confirmPasswordErrorMessage}
                                                        size="small"
                                                        state={ColorStatus.error}
                                                    >
                                                        {confirmPasswordErrorMessage}
                                                    </Text>
                                                )}
                                            </InputWrapper>
                                        </Form.Item>
                                        <Checkbox
                                            data-testid="sign_up_terms_checkbox"
                                            checked={checked}
                                            onChange={() => setChecked(!checked)}
                                        >
                                            I agree to Remote Legal{" "}
                                            <Button href={`${ENV.API.URL}/terms.html`} type="link">
                                                Terms of Use and Privacy Policy
                                            </Button>
                                        </Checkbox>
                                    </Space.Item>
                                    <Button
                                        data-testid="sign_up_create_account"
                                        type="primary"
                                        block
                                        disabled={disabledButton}
                                        onClick={() => signUp()}
                                        htmlType="submit"
                                    >
                                        Create account
                                    </Button>
                                    <Space fullWidth align="center">
                                        <Text>Have an account?</Text>
                                        <Link tabIndex={-1} to="/">
                                            <Button data-testid="sign_up_login_link" type="link">
                                                Log in
                                            </Button>
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
